// Headless Edge test harness over CDP (no dependencies, Node 22+ WebSocket).
//   node tools/cdp.mjs <test.mjs> [url]
// The test module default-exports async (page) => {...} and can use:
//   await page.eval(jsExpressionString)   -> value (awaits promises)
//   await page.shot('name')                -> tools/out/name.png
//   await page.wait(ms)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 9333;
const testFile = process.argv[2];
const url = process.argv[3] || 'http://localhost:3508/';
const W = +(process.env.W || 1280), H = +(process.env.H || 720);

const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cl-edge-'));
const edge = spawn(EDGE, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDir}`,
  ...(process.env.GPU ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']),
  `--window-size=${W},${H}`, '--autoplay-policy=no-user-gesture-required', '--mute-audio',
  '--no-first-run', '--no-default-browser-check', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function json(p, method = 'GET') { const r = await fetch(`http://127.0.0.1:${PORT}${p}`, { method }); return r.json(); }

let ws, nextId = 1, pausedFrames = null;
const pending = new Map();
const logs = [];
function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
}

async function main() {
  let ver;
  for (let i = 0; i < 60; i++) { try { ver = await json('/json/version'); break; } catch { await sleep(250); } }
  if (!ver) throw new Error('edge did not start');
  const t = await json('/json/new?' + encodeURIComponent(url), 'PUT');
  ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
    else if (m.method === 'Runtime.consoleAPICalled') { const s = m.params.args.map((a) => a.value ?? a.description ?? '').join(' '); logs.push(`[${m.params.type}] ${s}`); if (m.params.type === 'error' || m.params.type === 'warning') console.log(`  console.${m.params.type}:`, s.slice(0, 400)); }
    else if (m.method === 'Debugger.paused') { pausedFrames = m.params.callFrames; }
    else if (m.method === 'Runtime.exceptionThrown') { const d = m.params.exceptionDetails; const s = (d.exception && d.exception.description) || d.text; logs.push('[exception] ' + s); console.log('  EXCEPTION:', s.slice(0, 600)); }
  });
  await send('Runtime.enable'); await send('Page.enable'); await send('Debugger.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: !!process.env.MOBILE }); if (process.env.DARK || process.env.LIGHT) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: process.env.LIGHT ? 'light' : 'dark' }] });
  const page = {
    async eval(expr, timeout = +(process.env.EVAL_TIMEOUT || 60000)) {
      const r = await Promise.race([send('Runtime.evaluate', { expression: `(async () => { ${expr.includes('return') ? expr : 'return (' + expr + ')'} })()`, awaitPromise: true, returnByValue: true }), sleep(timeout).then(() => ({ timeout: true }))]);
      if (r.timeout) {
        // find out where it is stuck
        send('Debugger.pause');
        for (let i = 0; i < 40 && !pausedFrames; i++) await sleep(100);
        if (pausedFrames) console.log('  STUCK AT:', pausedFrames.slice(0, 12).map((f) => `${f.functionName || '(anon)'} ${f.url.split('/').slice(-2).join('/')}:${f.location.lineNumber + 1}`).join('  <-  '));
        throw new Error('eval timeout: ' + expr.slice(0, 80));
      }
      if (r.exceptionDetails) throw new Error('eval error: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
      return r.result.value;
    },
    async shot(name) {
      const r = await send('Page.captureScreenshot', { format: 'png' });
      const out = path.join(here, 'out', name + '.png');
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, Buffer.from(r.data, 'base64'));
      console.log('  shot ->', path.relative(process.cwd(), out));
      return out;
    },
    wait: sleep,
    logs,
    async key(code, type = 'down') {
      const KC = { KeyW: 87, KeyA: 65, KeyS: 83, KeyD: 68, KeyE: 69, KeyF: 70, KeyR: 82, KeyZ: 90, KeyX: 88, KeyC: 67, KeyV: 86, KeyQ: 81, Space: 32, ShiftLeft: 16, Digit1: 49, Digit2: 50, Tab: 9, Escape: 27, KeyM: 77 };
      const key = code === 'Space' ? ' ' : code.startsWith('Key') ? code.slice(3).toLowerCase() : code.startsWith('Digit') ? code.slice(5) : code;
      await send('Input.dispatchKeyEvent', { type: type === 'down' ? 'keyDown' : 'keyUp', code, key, windowsVirtualKeyCode: KC[code] || 0 });
    },
    async hold(code, ms) { await this.key(code, 'down'); await sleep(ms); await this.key(code, 'up'); },
    async click(x = W / 2, y = H / 2, button = 'left') {
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button, clickCount: 1 });
      await sleep(40);
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button, clickCount: 1 });
    },
  };
  const mod = await import(pathToFileURL(path.resolve(testFile)).href);
  await mod.default(page);
}

main().then(() => { console.log('done'); }, (e) => { console.error('FAILED:', e.message); process.exitCode = 1; }).finally(() => {
  try { ws && ws.close(); } catch { /* ignore */ }
  edge.kill();
  setTimeout(() => { try { fs.rmSync(userDir, { recursive: true, force: true }); } catch { /* locked */ } process.exit(); }, 600);
});

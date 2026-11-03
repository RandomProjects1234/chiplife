// Builds a signed Android APK of ChipLife without Gradle: aapt2 + javac + d8 + zipalign + apksigner.
//   node tools/build-apk.mjs            -> dist/ChipLife.apk
// Needs: Android SDK (build-tools 34, platforms/android-34) and a JDK. Override with ANDROID_SDK / JAVA_HOME.
// The release keystore is created on first run in android/signing/ — back it up, updates must be signed with it.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const VERSION_CODE = 1;
const VERSION_NAME = '1.0';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SDK = process.env.ANDROID_SDK || 'D:/Android/Sdk';
const BT = path.join(SDK, 'build-tools', '34.0.0');
const JAR = path.join(SDK, 'platforms', 'android-34', 'android.jar');
const JDK = process.env.JAVA_HOME || 'C:/Program Files/Eclipse Adoptium/jdk-25.0.1.8-hotspot';
const exe = (dir, name) => path.join(dir, process.platform === 'win32' ? name + '.exe' : name);
const JAVA = exe(path.join(JDK, 'bin'), 'java');
const JAVAC = exe(path.join(JDK, 'bin'), 'javac');
const KEYTOOL = exe(path.join(JDK, 'bin'), 'keytool');
const AAPT2 = exe(BT, 'aapt2');
const AAPT = exe(BT, 'aapt');
const ZIPALIGN = exe(BT, 'zipalign');

const A = path.join(root, 'android');
const B = path.join(A, 'build');
const OUT = path.join(root, 'dist', 'ChipLife.apk');

for (const [what, p] of [['build-tools 34', BT], ['android-34 platform', JAR], ['JDK', JAVA]]) {
  if (!fs.existsSync(p)) { console.error(`Missing ${what}: ${p}`); process.exit(1); }
}
const run = (cmd, args, opts = {}) => {
  try {
    return execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', ...opts });
  } catch (e) {
    console.error(`\n✗ ${path.basename(cmd)} failed:\n${e.stdout || ''}${e.stderr || ''}`);
    process.exit(1);
  }
};
const step = (s) => console.log('• ' + s);
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));

// ---------------------------------------------------------------- 1. web assets
step('Copying the game into the APK assets');
fs.mkdirSync(B, { recursive: true });
for (const f of fs.readdirSync(B)) fs.rmSync(path.join(B, f), { recursive: true, force: true }); // keep the folder (Windows locks it if a shell sits inside)
const www = path.join(B, 'assets', 'www');
fs.mkdirSync(www, { recursive: true });
for (const d of ['css', 'js', 'fonts']) fs.cpSync(path.join(root, d), path.join(www, d), { recursive: true });
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/^.*fonts\.(googleapis|gstatic)\.com.*\n/gm, ''); // offline: use the bundled font only
fs.writeFileSync(path.join(www, 'index.html'), html);

// ---------------------------------------------------------------- 2. resources + manifest
step('Compiling resources (aapt2)');
const resZip = path.join(B, 'res.zip');
run(AAPT2, ['compile', '--dir', path.join(A, 'res'), '-o', resZip]);
const gen = path.join(B, 'gen');
fs.mkdirSync(gen, { recursive: true });
const base = path.join(B, 'base.apk');
run(AAPT2, ['link', '-o', base, '-I', JAR, '--manifest', path.join(A, 'AndroidManifest.xml'), '-R', resZip,
  '--java', gen, '--min-sdk-version', '24', '--target-sdk-version', '34',
  '--version-code', String(VERSION_CODE), '--version-name', VERSION_NAME, '--auto-add-overlay']);
// Assets go in with `aapt add` and forward-slash names: aapt2 -A on Windows writes "assets/www\css\..."
// entries, which Android can't find. aapt add also leaves resources.arsc stored uncompressed.
const assetNames = walk(path.join(B, 'assets')).map((f) => path.relative(B, f).split(path.sep).join('/'));
run(AAPT, ['add', base, ...assetNames], { cwd: B });

// ---------------------------------------------------------------- 3. java -> dex
step('Compiling Java (javac) and dexing (d8)');
const classes = path.join(B, 'classes');
fs.mkdirSync(classes, { recursive: true });
const sources = [...walk(path.join(A, 'src')), ...walk(gen)].filter((f) => f.endsWith('.java'));
run(JAVAC, ['--release', '11', '-encoding', 'UTF-8', '-nowarn', '-cp', JAR, '-d', classes, ...sources]);
const dexDir = path.join(B, 'dex');
fs.mkdirSync(dexDir, { recursive: true });
const classFiles = walk(classes).filter((f) => f.endsWith('.class'));
run(JAVA, ['-cp', path.join(BT, 'lib', 'd8.jar'), 'com.android.tools.r8.D8', '--release', '--min-api', '24', '--lib', JAR, '--output', dexDir, ...classFiles]);
run(AAPT, ['add', base, 'classes.dex'], { cwd: dexDir });

// ---------------------------------------------------------------- 4. align + sign
step('Aligning and signing');
const aligned = path.join(B, 'aligned.apk');
run(ZIPALIGN, ['-p', '-f', '4', base, aligned]);
const signDir = path.join(A, 'signing');
const ks = path.join(signDir, 'chiplife-release.jks');
const propsFile = path.join(signDir, 'keystore.properties');
if (!fs.existsSync(ks)) {
  fs.mkdirSync(signDir, { recursive: true });
  const pass = crypto.randomBytes(18).toString('base64url');
  run(KEYTOOL, ['-genkeypair', '-keystore', ks, '-storetype', 'PKCS12', '-alias', 'chiplife', '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000',
    '-storepass', pass, '-keypass', pass, '-dname', 'CN=ChipLife, O=RandomProjects1234']);
  fs.writeFileSync(propsFile, `# ChipLife release signing key. BACK THIS FOLDER UP - app updates must be signed with the same key.\nstoreFile=chiplife-release.jks\nalias=chiplife\npassword=${pass}\n`);
  step('Created a new release keystore in android/signing/ (back it up!)');
}
const pass = /password=(.+)/.exec(fs.readFileSync(propsFile, 'utf8'))[1].trim();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const APKSIGNER = ['-jar', path.join(BT, 'lib', 'apksigner.jar')];
run(JAVA, [...APKSIGNER, 'sign', '--ks', ks, '--ks-key-alias', 'chiplife', '--ks-pass', `pass:${pass}`, '--key-pass', `pass:${pass}`, '--out', OUT, aligned]);
const verify = run(JAVA, [...APKSIGNER, 'verify', '--verbose', OUT]);
if (!/Verifies/.test(verify)) { console.error(verify); process.exit(1); }
fs.rmSync(OUT + '.idsig', { force: true });
// Sanity checks that would otherwise only show up on a phone.
const listing = run(AAPT, ['list', '-v', OUT]);
if (/\\/.test(listing.split('\n').filter((l) => /assets\//.test(l)).join('\n'))) { console.error('✗ asset paths contain backslashes'); process.exit(1); }
if (!/^\s*\d+\s+Stored.*resources\.arsc\s*$/m.test(listing)) { console.error('✗ resources.arsc must be stored uncompressed (Android 11+ refuses to install otherwise)'); process.exit(1); }
if (!/assets\/www\/index\.html/.test(listing) || !/classes\.dex/.test(listing)) { console.error('✗ index.html or classes.dex missing from the APK'); process.exit(1); }

const badging = run(AAPT, ['dump', 'badging', OUT]).split('\n').filter((l) => /^(package|sdkVersion|targetSdkVersion|application-label|launchable)/.test(l)).join('\n  ');
console.log(`\n✓ ${path.relative(root, OUT)}  (${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB, v${VERSION_NAME})\n  ${badging}`);

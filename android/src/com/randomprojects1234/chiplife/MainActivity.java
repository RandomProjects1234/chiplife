package com.randomprojects1234.chiplife;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

/**
 * ChipLife is a web game; this activity hosts it in a full-screen WebView loaded from the APK's assets.
 * Note: no inner/anonymous classes here — JDK 21+ javac writes an unnamed "mandated" constructor
 * parameter for them, which crashes d8 from build-tools 34. Helpers live in their own files.
 */
public class MainActivity extends Activity {
    private static final String START_URL = "file:///android_asset/www/index.html";
    private WebView web;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // saves live in localStorage
        s.setTextZoom(100);                    // keep the layout stable with big system fonts
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);           // assets still load; nothing else on the device does
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        web.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        web.setWebViewClient(new GameWebClient(this));
        setContentView(web);
        web.loadUrl(START_URL);
    }

    @Override
    public void onBackPressed() {
        // Let the game close sheets/dialogs first; only leave when it says it is on the title or end screen.
        web.evaluateJavascript("(window.__back && window.__back()) ? 'y' : 'n'", new BackHandler(this));
    }

    /** Called by BackHandler when the game did not use the back press. */
    void leave() {
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        web.evaluateJavascript("window.__save && window.__save()", null);
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    @Override
    protected void onDestroy() {
        if (web != null) web.destroy();
        super.onDestroy();
    }
}

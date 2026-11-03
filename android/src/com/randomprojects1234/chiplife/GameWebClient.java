package com.randomprojects1234.chiplife;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Keeps the game's own pages inside the app and sends any outside link to the browser. */
final class GameWebClient extends WebViewClient {
    private final Activity activity;

    GameWebClient(Activity activity) {
        this.activity = activity;
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        Uri uri = request.getUrl();
        if ("file".equals(uri.getScheme())) return false;
        try {
            activity.startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (Exception ignored) {
            // no browser installed - just stay in the game
        }
        return true;
    }
}

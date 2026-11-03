package com.randomprojects1234.chiplife;

import android.webkit.ValueCallback;

/**
 * Receives the game's answer to a back press: "y" means the game handled it.
 * Raw ValueCallback on purpose: the generic version makes javac add a bridge method whose
 * unnamed synthetic parameter crashes d8 from build-tools 34.
 */
@SuppressWarnings({ "rawtypes", "unchecked" })
final class BackHandler implements ValueCallback {
    private final MainActivity activity;

    BackHandler(MainActivity activity) {
        this.activity = activity;
    }

    @Override
    public void onReceiveValue(Object value) {
        if (value == null || !value.toString().contains("y")) activity.leave();
    }
}

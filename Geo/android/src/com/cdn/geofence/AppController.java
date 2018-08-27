package com.cdn.geofence;

/**
 * Created by arpitjoshi on 7/9/15.
 */

import android.app.Application;

public class AppController extends Application {

    public static final String TAG = AppController.class
            .getSimpleName();

    private static AppController mInstance;

    @Override
    public void onCreate() {
        super.onCreate();
        mInstance = this;
    }

    public static synchronized AppController getInstance() {
        return mInstance;
    }







}
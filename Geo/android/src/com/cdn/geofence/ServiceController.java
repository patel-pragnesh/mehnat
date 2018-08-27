package com.cdn.geofence;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.location.Location;
import android.os.Bundle;
import android.os.IBinder;
import android.os.PersistableBundle;


/**
 * Created by arpitjoshi on 5/3/16.
 */

/*
*
* use for continious check of user latlng point
* and that willbe update in each 1 min
* and response pass into mainacitity using interface
*
* */
public class ServiceController extends Activity implements GPSTracker.LocationChangeLitener {
    private final String TAG = this.getClass().getSimpleName();
    protected GPSTracker mTrackService;
    protected boolean mBound = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
   /* getActionBar().hide();*/

    }

    public void bindService() {
        Intent intent = new Intent(this, GPSTracker.class);
        bindService(intent, mConnection, Context.BIND_AUTO_CREATE);
    }

    @Override
    public void onCreate(Bundle savedInstanceState, PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (mBound) {
            unbindService(mConnection);
            mBound = false;
        }
    }


    @Override
    public void startActivityForResult(Intent intent, int requestCode) {
        super.startActivityForResult(intent, requestCode);
    }

    @Override
    protected void onStart() {
        super.onStart();

    }

    @Override
    protected void onResume() {
        super.onResume();

    }

    /**
     * Defines callbacks for service binding, passed to bindService()
     */
    private ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className,
                                       IBinder service) {
            // We've bound to LocalService, cast the IBinder and get LocalService instance
            GPSTracker.LocalBinder binder = (GPSTracker.LocalBinder) service;
            mTrackService = binder.getService();
            mBound = true;

            mTrackService.setLocationChangeListener(ServiceController.this);
            onTrackServiceConnected();
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            mBound = false;
        }
    };

    @Override
    public void onLocationChanged(Location location) {

    }

    public void onTrackServiceConnected() {


    }
}
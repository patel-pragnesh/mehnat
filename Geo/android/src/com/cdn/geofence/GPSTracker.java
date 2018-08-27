package com.cdn.geofence;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Binder;
import android.os.Bundle;
import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;

import java.util.ArrayList;

public class GPSTracker extends Service implements LocationListener, CallbackListener {
    // flag for GPS status
    boolean isGPSEnabled = false;
    // flag for network status
    boolean isNetworkEnabled = false;
    int latLongEnterExitValue;
    // flag for GPS status
    ArrayList<LatLongData> latLngArrayList;
    public int value = -1;

    public static boolean canGetLocation = false;
    Location location; // location
    public double latitude; // latitude
    public double longitude; // longitude
    // The minimum distance to change Updates in meters
    public static double LATITUDE = 0;
    Context context;
    public static double LONGITUDE = 0;
    private static final float MIN_DISTANCE_CHANGE_FOR_UPDATES = 1; // 1 meters
    // The minimum time between updates in milliseconds
    private static final long MIN_TIME_BW_UPDATES = 3000 * 1; // 30 second
    // Declaring a Location Manager
    protected LocationManager locationManager;
    LocationChangeLitener mLocationChangeListener;
    /*
    * bind service
    * */

    public ArrayList<LatLongData> getLatLngArrayList() {
        return latLngArrayList;
    }

    public void setLatLngArrayList(ArrayList<LatLongData> latLngArrayList) {
        this.latLngArrayList = latLngArrayList;
    }


    public GPSTracker() {
        getLocation();
    }

    private final IBinder mBinder = new LocalBinder();

    public class LocalBinder extends Binder {
        public GPSTracker getService() {
            // Return this instance of LocalService so clients can call public methods
            return GPSTracker.this;
        }
    }

    public void setLocationChangeListener(LocationChangeLitener locationChangeListener) {
        mLocationChangeListener = locationChangeListener;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // TODO Auto-generated method stub
        Log.d("in onstart command ", "onstart command call");


        //
      /*  if (intent != null) {
            if (intent.getAction().equals("IN_BACKGROUND")) {

                Log.d("arpit", "arpit");
                return Service.START_STICKY;
            }
            else if (intent.getAction().equals(AppConstant.ACTION_RUNIN_BACKGOURND)) {
                Log.d("arpit", "ashish");
                return Service.START_STICKY;
            }

        }*/

        return Service.START_STICKY;
    }

    public Location getLocation() {
        try {
            locationManager = (LocationManager)
                    AppController.getInstance().getApplicationContext().getSystemService(LOCATION_SERVICE);
            // getting GPS status
            isGPSEnabled = locationManager
                    .isProviderEnabled(LocationManager.GPS_PROVIDER);
            // getting network status
            isNetworkEnabled = locationManager
                    .isProviderEnabled(LocationManager.NETWORK_PROVIDER);
            if (!isGPSEnabled && !isNetworkEnabled) {
                // no network provider is enabled
            } else {
                canGetLocation = true;
                // First get location from Network Provider
                if (isNetworkEnabled) {
                    locationManager.requestLocationUpdates(
                            LocationManager.NETWORK_PROVIDER,
                            MIN_TIME_BW_UPDATES,
                            MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                    Log.d("Network", "Network");
                    if (locationManager != null) {
                        location = locationManager
                                .getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                        if (location != null) {
                            latitude = location.getLatitude();
                            longitude = location.getLongitude();
                        }
                    }
                }
                // if GPS Enabled get lat/long using GPS Services
                if (isGPSEnabled) {
                    if (location == null) {
                        locationManager.requestLocationUpdates(
                                LocationManager.GPS_PROVIDER,
                                MIN_TIME_BW_UPDATES,
                                MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                        Log.d("GPS Enabled", "GPS Enabled");
                        if (locationManager != null) {
                            location = locationManager
                                    .getLastKnownLocation(LocationManager.GPS_PROVIDER);
                            if (location != null) {
                                latitude = location.getLatitude();
                                longitude = location.getLongitude();
                                location.getSpeed();
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return location;
    }

    /**
     * Stop using GPS listener Calling this function will stop using GPS in your
     * app
     */
    public void stopUsingGPS() {
        if (locationManager != null) {
            locationManager.removeUpdates(GPSTracker.this);
        }
    }

    /**
     * Function to get latitude
     */
    public double getLatitude() {
        if (location != null) {
            latitude = location.getLatitude();
        }
        // return latitude
        return latitude;
    }

    /**
     * Function to get longitude
     */
    public double getLongitude() {
        if (location != null) {
            longitude = location.getLongitude();
        }
        // return longitude
        return longitude;
    }

    /**
     * Function to check GPS/wifi enabled
     *
     * @return boolean
     */
    public boolean canGetLocation() {
        return canGetLocation;
    }

    @Override
    public void onLocationChanged(Location location) {
        if (mLocationChangeListener != null) {
/**/
            mLocationChangeListener.onLocationChanged(location);


        }


        startMonitoring(location.getSpeed(), 5, this);
        boolean contain = false;
        if (getLatLngArrayList() != null) {
            for (int i = 0; i < getLatLngArrayList().size(); i++) {

          /*      contain = PolyUtil.containsLocation(new LatLng(location.getLatitude(), location.getLongitude()), getLatLngArrayList().get(i).getLatLngs(), true);
          */
                if (contain)
                    break;
                Log.d("long", "" + location.getLongitude());
            }

            latLongEnterExitValue = AppSharedPref.getInstance(getApplicationContext()).readPrefsInt(getApplicationContext(), AppSharedPref.ENTEREXIT_VALUE);

            if (latLongEnterExitValue == 1 && contain == true) {

            /*sendNotification(MainActivity.this, "Enter", AppConstant.GEOFENCE_TITLE);*/
                AppSharedPref.getInstance(AppController.getInstance().getApplicationContext()).writePrefsInt(AppController.getInstance().getApplicationContext(), "ENTEREXIT", 2);

                startMonitoring(location.getSpeed(), 2, this);
            } else if (latLongEnterExitValue == 2 && contain == false) {

            /*sendNotification(MainActivity.this, "Exit", AppConstant.GEOFENCE_TITLE);*/

                AppSharedPref.getInstance(AppController.getInstance().getApplicationContext()).writePrefsInt(AppController.getInstance().getApplicationContext(), "ENTEREXIT", 1);
                startMonitoring(location.getSpeed(), 1, this);

            } else if (latLongEnterExitValue == -1 && getLatLngArrayList().size() > 0) {

                if (contain == true) {

                    AppSharedPref.getInstance(this).writePrefsInt(this, "ENTEREXIT", 2);
                    startMonitoring(location.getSpeed(), 2, this);
                } else {
                    AppSharedPref.getInstance(this).writePrefsInt(AppController.getInstance().getApplicationContext(), "ENTEREXIT", 1);
                    startMonitoring(location.getSpeed(), 1, this);
                }
            }
        }
    }

    @Override
    public void onEnter(int taskType, Object aj, Object o) {

    }

    @Override
    public void onExit(int taskType,Object b) {

    }


    @Override
    public void userSpeedinRegion(float speed) {

    }


    @Override

    public void onProviderDisabled(String provider) {
    }

    @Override

    public void onProviderEnabled(String provider) {
    }

    @Override

    public void onStatusChanged(String provider, int status, Bundle extras) {
    }

    @Override
    public IBinder onBind(Intent arg0) {
        getLocation();
        return mBinder;
    }

    public interface LocationChangeLitener {


        /*
        * this is use to pass data into our class
        * */
        void onLocationChanged(Location location);
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);
        Intent restartServiceIntent = new Intent(AppController.getInstance().getApplicationContext(), this.getClass());
        restartServiceIntent.setAction("IN_BACKGROUND");
        restartServiceIntent.setPackage(getPackageName());

        PendingIntent restartServicePendingIntent = PendingIntent.getService(AppController.getInstance().getApplicationContext(), 1, restartServiceIntent, PendingIntent.FLAG_ONE_SHOT);
        AlarmManager alarmService = (AlarmManager) AppController.getInstance().getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        alarmService.set(
                AlarmManager.ELAPSED_REALTIME,
                SystemClock.elapsedRealtime() + 1000,
                restartServicePendingIntent);
    }


    public void startMonitoring(float speedLimit, int type, CallbackListener object) {
        if (type == AppConstant.ENTERIN_REAGION) {
            /*object.onEnter(AppConstant.ENTERIN_REAGION);*/
        } else if (type == AppConstant.EXITFROM_REAGION) {
            object.onExit(AppConstant.EXITFROM_REAGION,"");
        } else if (type == 5) {

            object.userSpeedinRegion(speedLimit);

        }

    }


}

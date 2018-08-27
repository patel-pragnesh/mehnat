package com.cdn.geofence;
/**
 * Created by arpitjoshi on 19/3/16.
 */
import android.content.Context;
import android.content.SharedPreferences;
import java.util.Set;
public class AppSharedPref {
    private static final String PREFS_NAME = "GEO_FENCE";
    public static final String  ENTEREXIT_VALUE= "ENTEREXIT";
    public static final String PREFS_LAT = "GEO_LAT";
    public static final String PREFS_LON = "GEO_LON";
    public static final String LOCATION_REGOIN_NAME= "locationdetail";
    static SharedPreferences sp;
    static SharedPreferences.Editor prefEditor = null;
    public void setNotificationOn(String key, boolean value) {
        prefEditor.putBoolean(key, value);
        prefEditor.commit();
    }
    public boolean getNotificationOn(String key) {
        return sp.getBoolean(key, true);
    }
    public final static String PREFS_SERVER_TIME = "server_time";
    private static Context mContext = null;
    public static AppSharedPref instance = null;
    public static AppSharedPref getInstance(Context context) {
        mContext = context;
        if (instance == null) {
            instance = new AppSharedPref();
        }
        sp = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefEditor = sp.edit();
        return instance;
    }
    public String readPrefs(Context context, String key) {
        String value = sp.getString(key, "");
        return value;
    }
    public void writePrefs(Context context, String key, String value) {
        prefEditor.putString(key, value);
        prefEditor.commit();
    }
    public int readPrefsInt(Context context, String key) {
        int  value = sp.getInt(key, -1);
        return value;
    }
    public void writePrefsInt(Context context, String key, int value) {
        prefEditor.putInt(key, value);
        prefEditor.commit();
    }
    /*
    *
    * store array in pref
    * */
    public Set<String> readarryPref(Context context, String key) {
        Set<String> value = sp.getStringSet(key, null);
        return value;
    }
    public void writearrayPref(Context context, String key, Set<String> value) {
        prefEditor.putStringSet(key, value);
        prefEditor.commit();
    }
}
package com.cdn.geofence;

/**
 * Created by arpitjoshi on 10/3/16.
 */
public interface CallbackListener {
    public void onEnter(int taskType, Object object, Object obh);
    public void onExit(int taskType,Object region);
public  void userSpeedinRegion(float speed);
}

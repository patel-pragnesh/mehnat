package com.cdn.geofence;

import java.util.ArrayList;

/**
 * Created by arpitjoshi on 18/3/16.
 */
public class LatLongData {
    ArrayList<LatLngList> latLngs = new ArrayList<LatLngList>();

    public String location;
    public  String speedLimit;
    public  String polygonId;
    public  String areaRange;
    public String getPolygonId() {
        return polygonId;
    }

    public void setPolygonId(String polygonId) {
        this.polygonId = polygonId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSpeedLimit() {
        return speedLimit;
    }

    public void setSpeedLimit(String speedLimit) {
        this.speedLimit = speedLimit;
    }

    public String getAreaRange() {
        return areaRange;
    }

    public void setAreaRange(String areaRange) {
        this.areaRange = areaRange;
    }

    public ArrayList<LatLngList> getLatLngs() {
        return latLngs;
    }

    public void setLatLngs(ArrayList<LatLngList> latLngs) {
        this.latLngs = latLngs;
    }
}

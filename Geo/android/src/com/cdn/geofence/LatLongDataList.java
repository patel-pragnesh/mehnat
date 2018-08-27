package com.cdn.geofence;

import com.google.android.gms.maps.model.LatLng;

import java.util.ArrayList;

/**
 * Created by arpitjoshi on 23/3/16.
 */
public class LatLongDataList {
	 ArrayList<LatLng>latLngArrayList=new ArrayList<LatLng>();
	 public  String location ;
	     public  String speed;
	     public  String polgoinId;


	     public String getPolgoinId() {
	         return polgoinId;
	     }

	     public void setPolgoinId(String polgoinId) {
	         this.polgoinId = polgoinId;
	     }

	     public String getSpeed() {
	         return speed;
	     }

	     public void setSpeed(String speed) {
	         this.speed = speed;
	     }

	     public String getLocation() {
	         return location;
	     }

	     public void setLocation(String location) {
	         this.location = location;
	     }

	     public ArrayList<LatLng> getLatLngArrayList() {
	         return latLngArrayList;
	     }

	     public void setLatLngArrayList(ArrayList<LatLng> latLngArrayList) {
	         this.latLngArrayList = latLngArrayList;
	     }
}

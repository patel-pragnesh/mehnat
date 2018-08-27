package com.cdn.geofence;

import com.j256.ormlite.field.DatabaseField;

import java.io.Serializable;

/**
 * Created by arpitjoshi on 23/3/16.
 */
public class GeoFenceModelBean implements Serializable {

	@DatabaseField(columnName = "speed_limit")
	String speedLimit;

	@DatabaseField(columnName = "area_range")
	String areaRange;

	@DatabaseField(columnName = "location")
	String location;

	@DatabaseField(columnName = "latitude")
	String lat;

	@DatabaseField(columnName = "longitude")
	String lon;

	@DatabaseField(columnName = "polygonId")
	String polygonID;

	@DatabaseField(columnName = "polygonPointNo")
	String polygon_point_no;

	@DatabaseField(columnName = "polygonSequenceNo")
	int polygon_sequence_no;

	public String getPolygon_point_no() {
		return polygon_point_no;
	}

	public void setPolygon_point_no(String polygon_point_no) {
		this.polygon_point_no = polygon_point_no;
	}

	public int getPolygon_sequence_no() {
		return polygon_sequence_no;
	}

	public void setPolygon_sequence_no(int polygon_sequence_no) {
		this.polygon_sequence_no = polygon_sequence_no;
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

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getLat() {
		return lat;
	}

	public void setLat(String lat) {
		this.lat = lat;
	}

	public String getLon() {
		return lon;
	}

	public void setLon(String lon) {
		this.lon = lon;
	}

	public String getPolygonID() {
		return polygonID;
	}

	public void setPolygonID(String polygonID) {
		this.polygonID = polygonID;
	}
}

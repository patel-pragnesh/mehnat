/**
 * This file was auto-generated by the Titanium Module SDK helper for Android
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */
package com.cdn.geofence;

import java.util.HashMap;

import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.kroll.common.Log;
import org.appcelerator.kroll.common.TiConfig;

import com.cdn.geofence.GeofencebycdnModule;
import com.cdn.geofence.MainActivity;

import android.content.Context;

@Kroll.module(name = "Geofencebycdn", id = "com.cdn.geofence")
public class GeofencebycdnModule extends KrollModule {

	// Standard Debugging variables
	private static final String LCAT = "GeofencebycdnModule";
	private static final boolean DBG = TiConfig.LOGD;
	MainActivity vw;
	static GeofencebycdnModule proxy;

	// You can define constants with @Kroll.constant, for example:
	// @Kroll.constant public static final String EXTERNAL_NAME = value;

	public GeofencebycdnModule() {
		super();
		
		proxy = this;
		vw = new MainActivity();
	}

	@Kroll.onAppCreate
	public static void onAppCreate(TiApplication app) {
		Log.d(LCAT, "inside onAppCreate");
		// put module init code that needs to run when the application is
		// created
	}

	// Methods
	@Kroll.method
	public String example() {
		Log.d(LCAT, "example called");
		return "hello world";
	}

	// Properties
	@Kroll.getProperty
	public String getExampleProp() {
		Log.d(LCAT, "get example property");
		return "hello world";
	}

	@Kroll.method
	public void drawPolygon(String str) {
		System.out.println("drawPolygon " + str);
		vw.drawPolygon(str);
	}

	@Kroll.method
	public void checkEnterOrExitFencing(String lat, String lon) {
		System.out.println("lat " + lat + "long : " + lon);
		vw.checkEnterOrExitFencing(lat, lon);

	}

	@Kroll.setProperty
	public void setExampleProp(String value) {
		Log.d(LCAT, "set example property: " + value);
	}
	
	public void fireEvent(HashMap<String, Object> event, String string) {
		// TODO Auto-generated method stub
		System.out.print("Call");

	}
}
package com.cdn.geofence;

import android.app.Activity;
import android.content.Context;
import android.location.Location;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.util.Log;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.PolyUtil;

import com.cdn.geofence.GeofencebycdnModule;

import org.appcelerator.titanium.TiApplication;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

public class MainActivity extends Activity implements CallbackListener {
	/**
	 * Google Map object
	 */
	public MainActivity activity;
	Location lastLocation;
	// GPSTracker class
	int latLongEnterExitValue;
	private static MainActivity mInstance;
	private GoogleMap mMap;
	byte requestType;
	Handler handler = new Handler();
	public static MainActivity instance;
	/**
	 * Geofence Data
	 */
	Timer timer;
	TimerTask timerTask;
	static ArrayList<LatLongDataList> latLngArrayList = new ArrayList<LatLongDataList>();

	public static MainActivity getInstance() {
		return instance;
	}

	public static void setInstance(MainActivity instance) {
		MainActivity.instance = instance;
	}

	/**
	 * Geofence Store
	 */
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		/* setContentView(R.layout.activity_main); */
		// Initializing variables
		/*
		 * String s = String.valueOf(createJson()); drawPolygon(s); timer = new
		 * Timer(); initializeTimerTask(); timer.schedule(timerTask, 5000,
		 * 10000);
		 *//* //* *//*
					 * //*
					 * 
					 * 
					 * }
					 * 
					 * public void initializeTimerTask() { timerTask = new
					 * TimerTask() {
					 * 
					 * @Override public void run() { handler.post(new Runnable()
					 * {
					 * 
					 * @Override public void run() {
					 * checkEnterOrExitFencing(-0.922080, 15.552979); } }); } };
					 */
	}

	@Override
	protected void onStart() {
		super.onStart();
	}

	@Override
	protected void onStop() {
		// mGeofenceStore.disconnect();
		super.onStop();
	}

	@Override
	protected void onDestroy() {
		/*
		 * stopService(new Intent(MainActivity.this, GPSTracker.class));
		 */
		super.onDestroy();
	}

	@Override
	protected void onResume() {
		super.onResume();
	}

	/*
	 * use to check enter or exit in polygon
	 */

	public void checkEnterOrExitFencing(String lat, String lon) {

		System.out.println("LAT : " + lat);
		System.out.println("LON : " + lon);
		String stringValue = "Given point for check" + lat + " " + lon + "\n";
		generateNoteOnSD(stringValue);
		new CheckForLocation(Double.parseDouble(lat), Double.parseDouble(lon),
				this).execute();
		/*
		 * if(latLngArrayList.size()==0) { latLngArrayList =
		 * getLatLngArrayList(); } else {
		 * 
		 * 
		 * }
		 *//*
			 * 
			 * used to get data every time from db and check exit or enter
			 *//*
				 * boolean contain = false; if (latLngArrayList != null) {
				 * String region= ""; int j = 0; for (int i = 0; i <
				 * latLngArrayList.size(); i++) { contain =
				 * PolyUtil.containsLocation(new LatLng(lat, lon),
				 * latLngArrayList.get(i).getLatLngArrayList(), true); region =
				 * latLngArrayList.get(i).getLocation(); Log.d("region",
				 * region); Log.d("count", ""+j); j++; if (contain) break; }
				 * 
				 * latLongEnterExitValue =
				 * AppSharedPref.getInstance(getApplicationContext
				 * ()).readPrefsInt(getApplicationContext(),
				 * AppSharedPref.ENTEREXIT_VALUE); if (latLongEnterExitValue ==
				 * 1 && contain == true) {
				 * AppSharedPref.getInstance(con).writePrefsInt(con,
				 * "ENTEREXIT", 2); startMonitoring("", 2, this);
				 * 
				 * } else if (latLongEnterExitValue == 2 && contain == true) {
				 * AppSharedPref.getInstance(con).writePrefsInt(con,
				 * "ENTEREXIT", 2); startMonitoring(region, 2, this);
				 * 
				 * } else if (latLongEnterExitValue == 1 && contain == false) {
				 * AppSharedPref.getInstance(con).writePrefsInt(con,
				 * "ENTEREXIT", 1); startMonitoring("", 1, this);
				 * 
				 * }
				 * 
				 * else if (latLongEnterExitValue == 2 && contain == false) {
				 * AppSharedPref.getInstance(con).writePrefsInt(con,
				 * "ENTEREXIT", 1); startMonitoring("", 1, this);
				 * 
				 * } else if (latLongEnterExitValue == -1 &&
				 * latLngArrayList.size() > 0) {
				 * 
				 * if (contain == true) {
				 * AppSharedPref.getInstance(this).writePrefsInt(this,
				 * "ENTEREXIT", 2); startMonitoring(region,2, this);
				 * 
				 * } else { AppSharedPref.getInstance(this).writePrefsInt(con,
				 * "ENTEREXIT", 1); startMonitoring("",1, this);
				 * 
				 * } } }
				 */
	}

	/*
	 * get list of lat long
	 */
	// public ArrayList<LatLongDataList> getLatLngArrayList() {
	// // ArrayList<LatLng> arrayList=null;
	// LatLongDataList latLongDataList = null;
	// Context con = TiApplication.getInstance().getApplicationContext();
	// ArrayList<GeoFenceModelBean> latLongDataBeans = DbHelper.getInstance(
	// con).getLatLongListDataSize(con);
	// latLngArrayList = new ArrayList<LatLongDataList>();
	// if (latLngArrayList != null && latLngArrayList.size() > 0) {
	// latLngArrayList.clear();
	// }
	// for (int i = 0; i < latLongDataBeans.size(); i++) {
	//
	// ArrayList<LatLng> arrayList = new ArrayList<LatLng>();
	// ArrayList<GeoFenceModelBean> latLongList = DbHelper
	// .getInstance(con).getLatLongListData(con,
	// latLongDataBeans.get(i).getPolygon_point_no());
	// String location = "";
	// String speed = "";
	// for (int j = 0; j < latLongList.size(); j++) {
	// LatLng latlong = new LatLng(Double.parseDouble(latLongList.get(
	// j).getLat()), Double.parseDouble(latLongList.get(j)
	// .getLon()));
	// arrayList.add(latlong);
	// location = latLongList.get(j).getLocation();
	// speed = latLongList.get(j).getSpeedLimit();
	// }
	// latLongDataList = new LatLongDataList();
	// latLongDataList.setLocation(location);
	// latLongDataList.setSpeed(speed);
	// latLongDataList.setLatLngArrayList(arrayList);
	// latLngArrayList.add(latLongDataList);
	// }
	//
	// return latLngArrayList;
	// }

	/*
	 * user speed calculation
	 */
	// private static double calculateDistance(double lat1, double lng1,
	// double lat2, double lng2) {
	// Location one = new Location("First");
	// one.setLatitude(lat1);
	// one.setLongitude(lng1);
	// Location two = new Location("two");
	// two.setLatitude(lat1);
	// two.setLongitude(lng1);
	// return one.distanceTo(two);
	//
	// }

	private static double calculateDistance(double lat1, double lng1,
			double lat2, double lng2) {
		double dLat = Math.toRadians(lat2 - lat1);
		double dLon = Math.toRadians(lng2 - lng1);
		double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
				+ Math.cos(Math.toRadians(lat1))
				* Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2)
				* Math.sin(dLon / 2);
		double c = 2 * Math.asin(Math.sqrt(a));
		long distanceInMeters = Math.round(6371000 * c);
		return distanceInMeters;

	}

	@Override
	public void onEnter(int taskType, Object object, Object speed) {
		String stringValue = "user enter in " + object.toString() + "\n";
		generateNoteOnSD(stringValue);
		Log.d("Tag", "user enter");
		Log.d("Tag", (String) object);
		System.out.println("Aa gaya bhai" + object);
		System.out.println("Speed" + speed);
		Log.d("Tag", "" + (String) speed);
		HashMap<String, Object> event = new HashMap<String, Object>();
		event.put("Speed", speed);
		event.put("region", object);
		GeofencebycdnModule.proxy.fireEvent("onEnter", event);

	}

	@Override
	public void onExit(int taskType, Object region) {
		String stringValue = "userExit from " + region.toString() + "\n";
		generateNoteOnSD(stringValue);
		System.out.println("Bye Bye bhai");
		Log.d("Tag", "user exit");
		HashMap<String, Object> event = new HashMap<String, Object>();
		event.put("region", region);

		GeofencebycdnModule.proxy.fireEvent("onExit", event);
	}

	@Override
	public void userSpeedinRegion(float speed) {

	}

	public void drawPolygon(String stringValue) {
		try {
			generateNoteOnSD(stringValue);

			JSONObject jsonObject = new JSONObject(stringValue);
			Context con = TiApplication.getInstance().getApplicationContext();

			latLngArrayList = new ArrayList<LatLongDataList>();
			if (latLngArrayList != null && latLngArrayList.size() > 0) {
				latLngArrayList.clear();
			}

			DbHelper.getInstance(con).clearTable();
			if (jsonObject.getString("action_success").equals("true")) {
				LatLongDataBean latLongDataBean = null;
				JSONArray dataArray = jsonObject.getJSONArray("data");
				ArrayList<LatLongData> latLongDatas = new ArrayList<LatLongData>();
				for (int j = 0; j < dataArray.length(); j++) {
					ArrayList<LatLngList> polygonPoint = new ArrayList<LatLngList>();
					latLongDataBean = new LatLongDataBean();
					JSONObject dataObj = dataArray.getJSONObject(j);
					JSONArray array = dataObj.getJSONArray("facing");
					for (int i = 0; i < array.length(); i++) {
						JSONObject latlong = array.getJSONObject(i);
						LatLngList latLng = new LatLngList();
						latLng.setLat(latlong.getString("lat"));
						latLng.setLon(latlong.getString("lon"));
						polygonPoint.add(latLng);
					}
					LatLongData latLongData = new LatLongData();
					latLongData.setLocation(dataObj.getString("location"));
					latLongData.setSpeedLimit(dataObj.getString("speedLimit"));
					latLongData.setAreaRange(dataObj.getString("arearange"));
					latLongData.setPolygonId(UUID.randomUUID().toString());
					latLongData.setLatLngs(polygonPoint);
					latLongDatas.add(latLongData);
					latLongDataBean.setData(latLongDatas);
				}
				DbHelper.getInstance(con)
						.insertLatLngData(latLongDataBean, con);

				/* bindService(); */
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void startMonitoring(String region, int type, String speed,
			CallbackListener object) {
		if (type == AppConstant.ENTERIN_REAGION) {
			System.out.println("Enter : ");
			object.onEnter(AppConstant.ENTERIN_REAGION, region, speed);
		} else if (type == AppConstant.EXITFROM_REAGION) {
			System.out.println("Exit : ");
			object.onExit(AppConstant.EXITFROM_REAGION, region);
		} else if (type == 5) {

		}

	}

	public class CheckForLocation extends AsyncTask<Void, Void, Boolean> {
		Double lat;
		Double lon;
		CallbackListener listener;
		Context mContext;
		String region = "";
		String polygonId;
		String Speed = "";
		String lastPolyId = "";
		Location curruntLocation;

		public CheckForLocation(Double lat, Double lon,
				CallbackListener listener) {
			this.lat = lat;
			this.lon = lon;

			this.listener = listener;
			System.out.println("1");
			mContext = TiApplication.getInstance().getApplicationContext();
			lastPolyId = AppSharedPref.getInstance(mContext).readPrefs(
					mContext, "polygoinId");
			System.out.println("2");
			curruntLocation = new Location("");
			System.out.println("3" + lat + " " + lon);
			curruntLocation.setLatitude(lat);
			curruntLocation.setLongitude(lon);
			System.out.println("4");
			if (lastLocation == null) {
				lastLocation = new Location("");
				lastLocation.setLatitude(0);
				lastLocation.setLongitude(0);
			}
			System.out.println("5");
		}

		@Override
		protected Boolean doInBackground(Void... objects) {
			try {
				if (latLngArrayList.size() == 0
						|| (calculateDistance(lat, lon,
								lastLocation.getLatitude(),
								lastLocation.getLongitude()) > 4000)) {
					/** 4000 m =4km **/
					/** 4000 m =4km **/
					latLngArrayList = getLatLngArrayList("" + lat, "" + lon);
					generateNoteOnSD("Refresh List Call \n "
							+ latLngArrayList.size() + "");
				} else {
					generateNoteOnSD("Work on Old List \n "
							+ latLngArrayList.size() + "");
					/*
					 * used to get data every time from db and check exit or
					 * enter
					 */
				}
				System.out.println("SUBSET " + latLngArrayList.size());
				boolean contain = false;
				if (!lastPolyId.trim().isEmpty()) {
					ArrayList<LatLongDataList> list = getLastpolygonDetailLatlong(lastPolyId);
					if (list != null && list.size() > 0) {
						contain = PolyUtil.containsLocation(
								new LatLng(lat, lon), list.get(0)
										.getLatLngArrayList(), true);
						if (contain) {
							return contain;
						}
					}

				}

				if (latLngArrayList != null) {
					int j = 0;
					for (int i = 0; i < latLngArrayList.size(); i++) {
						contain = PolyUtil.containsLocation(
								new LatLng(lat, lon), latLngArrayList.get(i)
										.getLatLngArrayList(), true);
						System.out.println("Region"
								+ latLngArrayList.get(i).getLocation() + "\n");
						for (int x = 0; x < latLngArrayList.get(i)
								.getLatLngArrayList().size(); x++) {
							System.out
									.println(" Cordinate "
											+ i
											+ " LAt"
											+ latLngArrayList.get(i)
													.getLatLngArrayList()
													.get(x).latitude
											+ " Lon"
											+ latLngArrayList.get(i)
													.getLatLngArrayList()
													.get(x).longitude
											+ "\n\n\n");
						}

						System.out.println(" Lat lang");

						System.out.println("Container : " + contain);
						latLngArrayList.get(i).getPolgoinId();
						Log.d("region", region);
						Log.d("count", "" + j);
						j++;
						if (contain) {
							region = latLngArrayList.get(i).getLocation();
							Speed = latLngArrayList.get(i).getSpeed();
							break;
						}
					}
				}
				return contain;
			} catch (Exception e) {

			}
			return false;
		}

		@Override
		protected void onPostExecute(Boolean contain) {
			try {
				Context mContex = TiApplication.getInstance()
						.getApplicationContext();
				latLongEnterExitValue = AppSharedPref.getInstance(mContext)
						.readPrefsInt(mContext, AppSharedPref.ENTEREXIT_VALUE);
				if (latLongEnterExitValue == 1 && contain == true) {
					AppSharedPref.getInstance(mContext).writePrefsInt(mContext,
							"ENTEREXIT", 2);
					AppSharedPref.getInstance(mContext).writePrefs(mContex,
							"locationdetail", region);
					AppSharedPref.getInstance(mContext).writePrefs(mContex,
							"polygoinId", polygonId);
					startMonitoring(region, 2, Speed, listener);

				} else if (latLongEnterExitValue == 2 && contain == true) {
					AppSharedPref.getInstance(mContex).writePrefsInt(mContex,
							"ENTEREXIT", 2);
					AppSharedPref.getInstance(mContext).writePrefs(mContex,
							"locationdetail", region);
					AppSharedPref.getInstance(mContext).writePrefs(mContex,
							"polygoinId", polygonId);
					startMonitoring(region, 2, Speed, listener);
				}

				/*
				 * else if (latLongEnterExitValue == 1 && contain == false) {
				 * AppSharedPref.getInstance(mContex).writePrefsInt(mContex,
				 * "ENTEREXIT", 1); startMonitoring("", 1,"", listener);
				 * 
				 * }
				 */

				else if (latLongEnterExitValue == 2 && contain == false) {
					AppSharedPref.getInstance(mContex).writePrefsInt(mContex,
							"ENTEREXIT", 1);
					String location = AppSharedPref.getInstance(mContex)
							.readPrefs(mContex,
									AppSharedPref.LOCATION_REGOIN_NAME);

					startMonitoring(location, 1, "", listener);
				} else if (latLongEnterExitValue == -1
						&& latLngArrayList.size() > 0) {
					if (contain == true) {
						AppSharedPref.getInstance(mContext).writePrefsInt(
								mContext, "ENTEREXIT", 2);
						AppSharedPref.getInstance(mContext).writePrefs(mContex,
								"locationdetail", region);
						AppSharedPref.getInstance(mContext).writePrefs(mContex,
								"polygoinId", polygonId);
						startMonitoring(region, 2, Speed, listener);
					} else {
						AppSharedPref.getInstance(mContext).writePrefsInt(
								mContex, "ENTEREXIT", 1);
						AppSharedPref.getInstance(mContext).writePrefs(mContex,
								"locationdetail", "");
						AppSharedPref.getInstance(mContext).writePrefs(mContex,
								"polygoinId", "");

						startMonitoring(" ", 1, "", listener);
					}
				}

			} catch (Exception e) {

			}

		}
	}

	static void generateNoteOnSD(String msg) {
		try {
			String formatDateTime = "yyyy-MM-dd HH:mm:ss";
			String formatDate = "yyyy-MM-dd";
			final SimpleDateFormat sdfDateTime = new SimpleDateFormat(
					formatDateTime);
			final SimpleDateFormat sdfDate = new SimpleDateFormat(formatDate);
			sdfDateTime.setTimeZone(TimeZone.getTimeZone("UTC"));
			sdfDate.setTimeZone(TimeZone.getTimeZone("UTC"));
			String utcDateTime = sdfDateTime.format(new Date());
			String utcDate = sdfDate.format(new Date());
			msg = "\n" + utcDateTime + " : " + msg;

			// get the path to sdcard
			File sdcard = Environment.getExternalStorageDirectory();
			// to this path add a new directory path
			File dir = new File(sdcard.getAbsolutePath() + "/geofence/data");

			// create this directory if not already created
			dir.mkdirs();

			// create the file in which we will write the contents
			File file = new File(dir, "datacheker.txt");
			FileOutputStream os = new FileOutputStream(file, true);

			os.write(msg.getBytes());
			os.close();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public ArrayList<LatLongDataList> getLastpolygonDetailLatlong(String polyId) {
		// ArrayList<LatLng> arrayList=null;
		Context mContex = TiApplication.getInstance().getApplicationContext();
		LatLongDataList latLongDataList = null;
		ArrayList<GeoFenceModelBean> latLongDataBeans = DbHelper.getInstance(
				mContex).getLastPolgonDetail(mContex, polyId);
		ArrayList<LatLongDataList> lastDetail = new ArrayList<LatLongDataList>();

		for (int i = 0; i < latLongDataBeans.size(); i++) {
			ArrayList<LatLng> arrayList = new ArrayList<LatLng>();
			ArrayList<GeoFenceModelBean> latLongList = DbHelper.getInstance(
					mContex).getLatLongListData(mContex,
					latLongDataBeans.get(i).getPolygon_point_no());
			String location = "";
			String speed = "";
			String polygoinId = "";
			for (int j = 0; j < latLongList.size(); j++) {
				LatLng latlong = new LatLng(Double.parseDouble(latLongList.get(
						j).getLat()), Double.parseDouble(latLongList.get(j)
						.getLon()));
				arrayList.add(latlong);
				location = latLongList.get(j).getLocation();
				speed = latLongList.get(j).getSpeedLimit();
				polygoinId = latLongList.get(j).getPolygonID();

			}
			latLongDataList = new LatLongDataList();
			latLongDataList.setLocation(location);
			latLongDataList.setSpeed(speed);
			latLongDataList.setPolgoinId(polygoinId);
			latLongDataList.setLatLngArrayList(arrayList);
			lastDetail.add(latLongDataList);
		}
		return lastDetail;
	}

	public ArrayList<LatLongDataList> getLatLngArrayList(String latitute,
			String longitute) {
		// ArrayList<LatLng> arrayList=null;
		if (latitute == null || latitute.trim().isEmpty()) {
			latitute = "0";
		}
		if (longitute == null || longitute.trim().isEmpty()) {
			longitute = "0";
		}

		LatLongDataList latLongDataList = null;
		Context con = TiApplication.getInstance().getApplicationContext();
		ArrayList<GeoFenceModelBean> latLongDataBeans = DbHelper.getInstance(
				con).getLatLongListDataSize(con, latitute, longitute);
		
		latLngArrayList = new ArrayList<LatLongDataList>();
		if (latLngArrayList != null && latLngArrayList.size() > 0) {
			latLngArrayList.clear();
		}
		for (int i = 0; i < latLongDataBeans.size(); i++) {
			ArrayList<LatLng> arrayList = new ArrayList<LatLng>();
			ArrayList<GeoFenceModelBean> latLongList = DbHelper
					.getInstance(con).getLatLongListData(con,
							latLongDataBeans.get(i).getPolygon_point_no());
			String location = "";
			String speed = "";
			String polygoinId = "";
			double shortDistance = 6001;
			double lastDistance = 0;
			for (int j = 0; j < latLongList.size(); j++) {
				LatLng latlong = new LatLng(Double.parseDouble(latLongList.get(
						j).getLat()), Double.parseDouble(latLongList.get(j)
						.getLon()));
				arrayList.add(latlong);
				location = latLongList.get(j).getLocation();
				speed = latLongList.get(j).getSpeedLimit();
				polygoinId = latLongList.get(j).getPolygonID();

				lastDistance = calculateDistance(
						Double.parseDouble(latLongList.get(j).getLat()),
						Double.parseDouble(latLongList.get(j).getLon()),
						Double.parseDouble(latitute),
						Double.parseDouble(longitute));
				if (j != 0 && lastDistance < shortDistance) {
					shortDistance = lastDistance;
				}

			}
			latLongDataList = new LatLongDataList();
			latLongDataList.setLocation(location);
			latLongDataList.setSpeed(speed);
			latLongDataList.setPolgoinId(polygoinId);
			latLongDataList.setLatLngArrayList(arrayList);
			if (shortDistance < 6000) {
				latLngArrayList.add(latLongDataList);
			}
		}
		generateNoteOnSD("Sub Set List Size " + latLngArrayList.size() + "");
		lastLocation = new Location("lastLocation");
		lastLocation.setLatitude(Double.parseDouble(latitute));
		lastLocation.setLongitude(Double.parseDouble(longitute));
		return latLngArrayList;
	}
}

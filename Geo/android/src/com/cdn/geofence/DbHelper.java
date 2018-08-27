package com.cdn.geofence;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.j256.ormlite.android.apptools.OrmLiteSqliteOpenHelper;
import com.j256.ormlite.dao.Dao;
import com.j256.ormlite.dao.GenericRawResults;
import com.j256.ormlite.dao.RawRowMapper;
import com.j256.ormlite.support.ConnectionSource;
import com.j256.ormlite.table.TableUtils;

import java.util.ArrayList;
import java.util.concurrent.Callable;

/**
 * Created by arpitjoshi on 23/3/16.
 */
public class DbHelper extends OrmLiteSqliteOpenHelper {
	public static DbHelper instance = null;
	private Dao<GeoFenceModelBean, Integer> geoFenceModelBeanIntegerDao = null;

	public DbHelper(Context context) {
		super(context, AppConstant.DATABASE_NAME, null,
				AppConstant.DATABASE_VERSION);
	}

	public synchronized static DbHelper getInstance(Context context) {
		if (instance == null) {
			instance = new DbHelper(context);
		}
		return instance;
	}

	public void setInstance(DbHelper instance) {
		this.instance = instance;
	}

	@Override
	public void onCreate(SQLiteDatabase arg0, ConnectionSource arg1) {
		try {
			TableUtils.createTable(arg1, GeoFenceModelBean.class);
		} catch (Exception e) {

		}
	}

	public void saveGeofenaceLatLng(GeoFenceModelBean message) {
		try {
			if (geoFenceModelBeanIntegerDao == null) {
				geoFenceModelBeanIntegerDao = this
						.getDao(GeoFenceModelBean.class);
			}
			geoFenceModelBeanIntegerDao.create(message);
			Log.d("save message", "save messages in databse successfully");
		} catch (Exception e) {

		}
	}

	public void insertLatLngData(final LatLongDataBean latLongData,
			Context context) {
		try {
			if (geoFenceModelBeanIntegerDao == null) {
				geoFenceModelBeanIntegerDao = getDao(GeoFenceModelBean.class);
			}
			geoFenceModelBeanIntegerDao
					.callBatchTasks(new Callable<GeoFenceModelBean>() {
						@Override
						public GeoFenceModelBean call() throws Exception {

							int k = 0;

							for (int i = 0; i < latLongData.getData().size(); i++) {
								LatLongData latLongData1 = latLongData
										.getData().get(i);
								int l = 0;
								for (int j = 0; j < latLongData1.getLatLngs()
										.size(); j++) {
									GeoFenceModelBean geoFenceModelBean = new GeoFenceModelBean();
									geoFenceModelBean.setLat(latLongData1
											.getLatLngs().get(j).getLat());
									geoFenceModelBean.setLon(latLongData1
											.getLatLngs().get(j).getLon());
									geoFenceModelBean
											.setSpeedLimit(latLongData1
													.getSpeedLimit());
									geoFenceModelBean.setAreaRange(latLongData1
											.getAreaRange());
									geoFenceModelBean.setLocation(latLongData1
											.getLocation());
									geoFenceModelBean.setPolygonID(latLongData1
											.getPolygonId());
									geoFenceModelBean
											.setPolygon_point_no(String
													.valueOf(k));
									geoFenceModelBean.setPolygon_sequence_no(l);
									saveGeofenaceLatLng(geoFenceModelBean);
									l++;

								}
								k++;
							}

							return null;

						}
					});
		} catch (Exception e)

		{

		}
	}

	public void clearTable() {
		try {
			if (geoFenceModelBeanIntegerDao == null) {
				geoFenceModelBeanIntegerDao = this
						.getDao(GeoFenceModelBean.class);
			}
			TableUtils.clearTable(connectionSource, GeoFenceModelBean.class);

		} catch (Exception e) {
		}

	}

	public ArrayList getLatLongListData(Context context, String point) {
		ArrayList<GeoFenceModelBean> list = null;
		try {
			if (geoFenceModelBeanIntegerDao == null) {
				geoFenceModelBeanIntegerDao = this
						.getDao(GeoFenceModelBean.class);
			}
			list = (ArrayList) geoFenceModelBeanIntegerDao.queryBuilder()
					.orderBy("polygonSequenceNo", true).where()
					.eq("polygonPointNo", point).query();

			/*
			 * newList = reverse(list);
			 */
			Log.d("list size", "" + list.size());
		} catch (Exception e) {
		}
		return list;
	}

	public ArrayList getLatLongListDataSize(Context context, String latitute,
			String longitute) {
		ArrayList<GeoFenceModelBean> list = null;
		try {
			if (geoFenceModelBeanIntegerDao == null) {
				geoFenceModelBeanIntegerDao = this
						.getDao(GeoFenceModelBean.class);
			}
			list = (ArrayList) geoFenceModelBeanIntegerDao.queryBuilder()
					.distinct().selectColumns("polygonPointNo").query();

			/*
			 * newList = reverse(list);
			 */
			Log.d("list size", "" + list.size());
		} catch (Exception e) {
		}
		return list;
	}

	// public ArrayList getLatLongListDataSize(Context context, String latitute,
	// String longitute) {
	// ArrayList<GeoFenceModelBean> list = new ArrayList<GeoFenceModelBean>();
	// try {
	// if (geoFenceModelBeanIntegerDao == null) {
	// geoFenceModelBeanIntegerDao = this
	// .getDao(GeoFenceModelBean.class);
	//
	// }
	//
	// String query = "select *  from geofencemodelbean  where ((Latitude - "
	// + latitute
	// + ")*(Latitude - "
	// + latitute
	// + ") + (Longitude -"
	// + longitute
	// + ")* (Longitude -"
	// + longitute + ")) <4";
	// GenericRawResults<GeoFenceModelBean> rawResults =
	// geoFenceModelBeanIntegerDao
	// .queryRaw(query, new RawRowMapper<GeoFenceModelBean>() {
	// public GeoFenceModelBean mapRow(String[] columnNames,
	// String[] resultColumns) { // assuming 0th field
	// // is the * and 1st
	// // field is
	// // remaining
	//
	// return getGeoFenceModelBean(columnNames,
	// resultColumns);
	// }
	//
	// });
	// for (GeoFenceModelBean foo : rawResults) {
	// boolean flag = true;
	// for (int i = 0; i < list.size(); i++) {
	// if (foo.getPolygon_sequence_no() == list.get(i)
	// .getPolygon_sequence_no()) {
	// flag = false;
	// break;
	// }
	// }
	// if (flag) {
	// list.add(foo);
	// }
	// }
	// // list =
	// //
	// // (ArrayList) geoFenceModelBeanIntegerDao
	// // .queryBuilder()
	// // .where()
	// //
	// .eq("((Latitude - 19.783245)*(Latitude - 19.783245) + (Longitude -74.552307)* (Longitude -74.552307))",
	// // 15).query();
	// // list = (ArrayList)
	// //
	// //
	// geoFenceModelBeanIntegerDao.queryBuilder().distinct().selectColumns("polygonPointNo").query();
	// /*
	// * newList = reverse(list);
	// */
	// // Log.d("list size", "" + list.size());
	// } catch (Exception e) {
	// e.getMessage();
	// }
	// return list;
	// }

	private GeoFenceModelBean getGeoFenceModelBean(String[] columnNames,
			String[] resultColumns) {
		GeoFenceModelBean bean = new GeoFenceModelBean();
		for (int i = 0; i < columnNames.length; i++) {
			if (columnNames[i].equals("speed_limit")) {
				bean.setSpeedLimit(resultColumns[i]);
			}
			if (columnNames[i].equals("area_range")) {
				bean.setAreaRange(resultColumns[i]);
			}
			if (columnNames[i].equals("location")) {
				bean.setLocation(resultColumns[i]);
			}

			if (columnNames[i].equals("latitude")) {
				bean.setLat(resultColumns[i]);
			}
			if (columnNames[i].equals("longitude")) {
				bean.setLon(resultColumns[i]);
			}
			if (columnNames[i].equals("polygonId")) {
				bean.setPolygonID(resultColumns[i]);
			}

			if (columnNames[i].equals("polygonPointNo")) {
				bean.setPolygon_point_no(resultColumns[i]);
			}
			try {
				if (columnNames[i].equals("polygonSequenceNo")) {
					bean.setPolygon_sequence_no(Integer
							.parseInt(resultColumns[i]));
				}
			} catch (Exception e) {
				bean.setPolygon_sequence_no(0);
			}

		}
		return bean;
	}

	public ArrayList getLastPolgonDetail(Context context, String polygonID) {
		ArrayList<GeoFenceModelBean> list = null;
		try {
			if (geoFenceModelBeanIntegerDao == null) {
				geoFenceModelBeanIntegerDao = this
						.getDao(GeoFenceModelBean.class);
			}
			list = (ArrayList) geoFenceModelBeanIntegerDao.queryBuilder()
					.where().eq("polygonId", polygonID).query();
			Log.d("list size", "" + list.size());
		} catch (Exception e) {
		}
		return list;
	}

	@Override
	public void onUpgrade(SQLiteDatabase sqLiteDatabase,
			ConnectionSource connectionSource, int i, int i1) {

	}
}

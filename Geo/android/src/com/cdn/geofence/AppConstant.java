package com.cdn.geofence;


/**
 * Created by arpitjoshi on 4/3/16.
 */
public class AppConstant {
    public  static  final  String UPDATE_UI="update_ui";
    public  static  final  String LONGATUDE="longitude";
    public  static  final  String LATITUDE="latitude";
    public  static  final  String ACTION_RUNIN_BACKGOURND="BackGround";
    public static final byte LATLNGREQUEST= 1;

    public static final String GEOFENCE_TITLE= "POLYGON GEOFENCE";
    public static final String DATABASE_NAME= "GeofenceDb";
    public static final int DATABASE_VERSION= 1;


  /*  public static final byte  IS_POST = Request.Method.POST;

    public static final byte IS_GET = Request.Method.GET;


  */  public  static    boolean INSIDEPOLYGON=false;


    byte requestType;
    public static final byte EXITFROM_REAGION = 1;
    public static final  byte ENTERIN_REAGION = 2;
    public static final  byte DEFAULTREAGION_REAGION = -1;
    public static final String URL_LATLNG= "http://www.cdnsolutionsgroup.com/roadsafety/webservices/index.php?action=users&actionMethod=getLocationspeed";
}

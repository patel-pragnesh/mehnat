package com.cdn.geofence;

import android.location.Location;

import java.util.ArrayList;
/**
 * Created by devendrasahu on 4/3/16.
 */


/*
*
* use for test ..,user inside or outside of polygon
*
* but  because of PoluUtil library , this class not in use
* check method  onLocationChanged MainActivity class which use polyutil libaray for polygon testing
* */
public class PolygonTest {

    ArrayList<com.google.android.gms.maps.model.LatLng>path1;
    com.google.android.gms.maps.model.LatLng latLng;
    public boolean test(Location location, ArrayList<com.google.android.gms.maps.model.LatLng>path)
    {
        return pointIsInRegion(location.getLatitude(), location.getLatitude(),path);
        //return pointIsInRegion(24.634393,77.279361,path);
        //return pointIsInRegion(24.103998,77.485355,path);
    }
    public class LatLng
    {
        double Latitude;
        double Longitude;
        public LatLng(double lat, double lon)
        {
            Latitude = lat;
            Longitude = lon;
        }
    }
    public boolean pointIsInRegion(double x, double y, ArrayList<com.google.android.gms.maps.model.LatLng> thePath)
    {
        int crossings = 0;
        com.google.android.gms.maps.model.LatLng point = new com.google.android.gms.maps.model.LatLng (x, y);
        int count = thePath.size();
                     // for each edge
        for (int i=0; i < count; i++)
        {
            com.google.android.gms.maps.model.LatLng a = thePath.get(i);
            int j = i + 1;
            if (j >= count)
            {
            j = 0;
            }
            com.google.android.gms.maps.model.LatLng b = thePath.get(j);
            if (RayCrossesSegment(point, a, b))
            {

            crossings++;

            }
        }
        // odd number of crossings?
        return (crossings % 2 == 1);
    }
    boolean RayCrossesSegment(com.google.android.gms.maps.model.LatLng point, com.google.android.gms.maps.model.LatLng a, com.google.android.gms.maps.model.LatLng b)
    {
        double px = point.longitude;
        double py = point.latitude;
        double ax = a.longitude;
        double ay = a.latitude;
        double bx = b.longitude;
        double by = b.latitude;
        if (ay > by)
        {
            ax = b.longitude;
            ay = b.latitude;
            bx = a.longitude;
            by = a.latitude;
        }

        // alter longitude to cater for 180 degree crossings
        if (px < 0) { px += 360; };
        if (ax < 0) { ax += 360; };
        if (bx < 0) { bx += 360; };
        if (py == ay || py == by) py += 0.00000001;
        if ((py > by || py < ay) || (px > Math.max(ax, bx))) return false;
        if (px < Math.min(ax, bx)) return true;
        double red = (ax != bx) ? ((by - ay) / (bx - ax)) : Float.MAX_VALUE;
        double blue = (ax != px) ? ((py - ay) / (px - ax)) : Float.MAX_VALUE;
        return (blue >= red);
    }
}
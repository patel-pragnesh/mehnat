// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.Communicator = require('Communicator');
Alloy.Globals.Constants = require('Constants');
Alloy.Globals.Measurement = require('alloy/measurement');
Alloy.Globals.DbManager = require('./DbManager');

Alloy.Globals.Map = require('ti.map');
    
if (OS_IOS) {
	Alloy.Globals.LoadingScreen = Alloy.createWidget('Loader').getView();
} else {
	Alloy.Globals.LoadingScreen = Alloy.createWidget('Loader');
	Alloy.Globals.androidgeofence = require('com.cdn.geofence');
	Alloy.Globals.textToSpeech = require('bencoding.utterance');
	Alloy.Globals.platformTools = require('bencoding.android.tools').createPlatform();
}

Alloy.Globals.ImageFactory = require("ti.imagefactory");
var dialog = Ti.UI.createAlertDialog({
	ok : 'Ok',
	title : "Road Safety",
});

Alloy.Globals.Alert = function(message) {
	dialog.message = message;
	dialog.show();

};
if (OS_ANDROID) {
	Alloy.Globals.getImageSizeWithAspectRatio = function(imageView, targetWidth, targetHeight) {
		var size = {
			//width: "100%",
			//height: "100%"
		};
		var imageWidth = Alloy.Globals.Measurement.pxToDP(imageView.toBlob().width);
		var imageHeight = Alloy.Globals.Measurement.pxToDP(imageView.toBlob().height);
		var imageAR = imageWidth / imageHeight;

		Ti.API.info("Width = " + imageWidth);
		Ti.API.info("Height = " + imageHeight);
		Ti.API.info("Target Width = " + targetWidth);
		Ti.API.info("Target Height = " + targetHeight);

		size.width = targetWidth;
		size.height = targetWidth / imageAR;

		return size;
	};
}

Alloy.Globals.handleServerError = function(response) {
	if (response.indexOf("<pre>") > -1) {
		var res = response.split("<pre>");
		Ti.API.info("AFTER CORRECTION  : " + res[0]);
		var res = JSON.parse(res[0]);
	} else {
		var res = JSON.parse(response);
	}
	return res;
};

/*
 * 29 July Changes
 * 1. Change the facebook module version due to not working with latest version
 * 2. Comment the alert("Network is down, Please try again");
 * 3. Replace Please check your internet connection
 * 4. Replace Network is down(ALloy.Globals.Alert)
 * 5. Add isLocationOn = false; on the above Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled."); 
 */
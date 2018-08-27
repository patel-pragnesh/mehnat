var args = arguments[0] || {};

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var id = Ti.App.Properties.getString("id");

//categoryArray variable for the hold entire data of getCategroy service
var categoryArray = args;
var services = categoryArray.services;

//XML device back press button
function closeWindowFun(e) {
	$.TrakingScreen.close();
}

//XML device back press button function
function openPanic(e) {
	if (Alloy.Globals.isContact == 1) {
		if ($.panicBtn.focusable == false) {
			return;
		}
		$.panicBtn.focusable = false;
		if (OS_IOS) {
			var panicScreen = Alloy.createController("PanicScreen").getView();
			Alloy.Globals.navWindow.openWindow(panicScreen);
		} else {
			var panicScreen = Alloy.createController("PanicScreen").getView();
			panicScreen.open();
		}
		panicScreen.oldWin = $.TrakingScreen;
		Alloy.Globals.currentWindow = panicScreen;
		setTimeout(function(e) {
			$.panicBtn.focusable = true;
		}, 2000);
	} else {
		Alloy.Globals.Alert("Please add emergency contact first");
	}
}

function openNotification(e) {
	if ($.notificationBtn.focusable == false) {
		return;
	}
	$.notificationBtn.focusable = false;
	var notificationWin = Alloy.createController("NotificationScreen").getView();
	if (OS_IOS) {
		Alloy.Globals.navWindow.openWindow(notificationWin, {
			animated : true
		});
	} else {
		notificationWin.open();
	}
	notificationWin.oldWin = $.TrakingScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
}

function openPinWindowFun(e) {
	if ($.pinBtn.focusable == false) {
		return;
	}
	$.pinBtn.focusable = false;
	var pinWin = Alloy.createController("PinScreen");
	Alloy.Globals.pinObj = pinWin;
	pinWin = pinWin.getView();
	if (OS_IOS) {
		Alloy.Globals.navWindow.openWindow(pinWin, {
			animated : true
		});
	} else {
		pinWin.open();
	}
	pinWin.oldWin = $.TrakingScreen;
	Alloy.Globals.currentWindow = pinWin;
	setTimeout(function(e) {
		$.pinBtn.focusable = true;
	}, 2000);
}

// MAP section present here

//var Map = require('ti.map');
//Ti.API.info(JSON.stringify(args));

var mapview = Alloy.Globals.Map.createView({
	mapType : Alloy.Globals.Map.NORMAL_TYPE,
	userLocation : true,
	height : '100%',
	width : '100%',
	animate : true,
	regionFit : true,
	region : {
		latitude : Alloy.Globals.latitude,
		longitude : Alloy.Globals.longitude,
		latitudeDelta : 0.1,
		longitudeDelta : 0.1
	}
});
$.mapcontainer.add(mapview);

var annoArray = [];
function getAnnotation(data) {

	// var image1 = Ti.UI.createImageView({
	// image : "/images/pin_img.png"
	// });
	annoArray = [];

	for (var i = 0; i < data.length; i++) {

		var anno1 = Alloy.Globals.Map.createAnnotation({
			latitude : data[i].latitude,
			//image : image1,
			longitude : data[i].longitude,
			title : data[i].pin_name,
			myid : 1,
			font : {
				fontSize : 10.0928,
				fontFamily : "Roboto-Light",
				FontStyle : "Light",
				fontType : "Smooth"
			},

		});
		annoArray.push(anno1);

	}
	mapview.annotations = annoArray;
}

function getMapPinService() {

	var SERVICE_GET_PIN_TRACKING = Alloy.Globals.Constants.SERVICE_GET_PIN_TRACKING;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_PIN_TRACKING + PARAMS, getMapPinServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_PIN_TRACKING + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

exports.getMapPinService = function() {

	var SERVICE_GET_PIN_TRACKING = Alloy.Globals.Constants.SERVICE_GET_PIN_TRACKING;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_PIN_TRACKING + PARAMS, getMapPinServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_PIN_TRACKING + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};

function getMapPinServiceCallback(e) {
	Ti.API.info("getMapPinService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					getAnnotation(response.data);
				} else {
					Alloy.Globals.Alert(response.response_message);
					if (response.data == null) {

						mapview.removeAllAnnotations();

					}

				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error getPinService :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();

}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

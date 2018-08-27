var args = arguments[0] || {};
var id = Ti.App.Properties.getString("id");
Ti.API.info("DETAIL : " + JSON.stringify(args));
//categoryArray variable for the hold entire data of getCategroy service
var categoryArray = args;
var services = categoryArray.services;

//XML device back press button
function closeWindowFun(e) {
	$.LocationMarker.close();
}

//XML device back press button function
function openPanic(e) {
	if (Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) {
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
			panicScreen.oldWin = $.LocationMarker;
			Alloy.Globals.currentWindow = panicScreen;
			setTimeout(function(e) {
				$.panicBtn.focusable = true;
			}, 2000);
		} else {
			Alloy.Globals.Alert("Please add emergency contact first");
		}
	} else {
		Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
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
	notificationWin.oldWin = $.LocationMarker;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
}

// MAP section present here



var mapview = Alloy.Globals.Map.createView({
	mapType : Alloy.Globals.Map.NORMAL_TYPE,
	userLocation : true,
	height : '100%',
	width : '100%',
	animate : true,
	regionFit : true,

	
});
if (Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) {
	mapview.region = {
		latitude : Alloy.Globals.latitude,
		longitude : Alloy.Globals.longitude,
		latitudeDelta : 0.1,
		longitudeDelta : 0.1
	};
}else{
	mapview.region = {
		latitude :args.latitude,
		longitude : args.longitude,
		latitudeDelta : 0.1,
		longitudeDelta : 0.1
	};
}

$.mapcontainer.add(mapview);

var anno1 = Alloy.Globals.Map.createAnnotation({
	latitude : args.latitude,
	//customview : image1,
	longitude : args.longitude,
	title : args.location_name,
	myid : 1,
	font : {
		fontSize : 10.0928,
		fontFamily : "Roboto-Light",
		FontStyle : "Light",
		fontType : "Smooth"
	},

});
mapview.annotations = [anno1];

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

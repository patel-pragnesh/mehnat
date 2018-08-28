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

// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block

Alloy.Globals.Communicator = require('Communicator');
Alloy.Globals.PaxCommunicator = require('PAXCommunicator');
//var zipcodes = require('./zipcode');
var BLE = require('ti.bluetooth');
var bonjour = require('com.cdnsol.bonjour');
var bonjourBrowser = bonjour.createBrowser();
var centralManager = BLE.createCentralManager();
var epos = require('com.cdnsol.epos');
Alloy.Globals.Constants = require('Constants');
Alloy.Globals.DbManager = require('DBManager');
Alloy.Globals.DateTimeUtils = require('DateTimeUtils');
Alloy.Globals.PrintReceipt = require('PrintReceipt');
Alloy.Globals.PrintLabel = require('PrintLabel');
Alloy.Globals.printer = require('Printer');
Alloy.Globals.ImageFactory = require("ti.imagefactory");
Alloy.Globals.DiscoverBluetoothDevices = require("DiscoverBluetoothDevices");
var role_permission = [],
    CurrentWindow;
(function() {
	var ACS = require('ti.cloud'),
	    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
	    username = Ti.App.Properties.getString('acs-username-' + env),
	    password = Ti.App.Properties.getString('acs-password-' + env);

	// if not configured, just return
	if (!env || !username || !password) {
		return;
	}
	/**
	 * Appcelerator Cloud (ACS) Admin User Login Logic
	 *
	 * fires login.success with the user as argument on success
	 * fires login.failed with the result as argument on error
	 */
	ACS.Users.login({
		login : username,
		password : password,
	}, function(result) {
		if (env === 'development') {
			Ti.API.info('ACS Login Results for environment `' + env + '`:');
			Ti.API.info(result);
		}
		if (result && result.success && result.users && result.users.length) {
			Ti.App.fireEvent('login.success', result.users[0], env);
		} else {
			Ti.App.fireEvent('login.failed', result, env);
		}
	});

})();

var defaultHeight = (Ti.Platform.osname === 'ipad') ? 768 : 320;
//the base size of standard handset iphone (that apps were designed for)

var deviceHeight = Titanium.Platform.displayCaps.platformHeight;
var scaleFactor = deviceHeight / defaultHeight;
Ti.API.info("*scaleFactor** " + scaleFactor);
Alloy.Globals.Alert = function(message) {
	var dialog = Ti.UI.createAlertDialog({
		//ok : alertok,
		title : "Gongcha",
	});
	dialog.ok = "ok";
	dialog.message = message;
	dialog.show();

};

Alloy.Globals.LoadingScreen = Alloy.createWidget('Loader').getView();

Alloy.Globals.Notifier = Alloy.createWidget('ti.notifications', {
	message : 'Notification Test', // the message to display.
	duration : 3500, // time after go away. Valid for iOS7+ and Android
	//icon: '/images/logo.png', // icon to display on the left
	style : 'notification', // 'info', 'success', 'error', 'warn',  notification background blue, green, red or amber.
	elasticity : 0, // iOS7+ only
	pushForce : 30, // iOS7+ only
	usePhysicsEngine : true, // disable if you don't want on iOS7+
	animationDuration : 200, // animation sliding duration
});
// Check if the device is running iOS 8 or later, before registering for local notifications
if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
	Ti.App.iOS.registerUserNotificationSettings({
		types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
	});
}
/*******
 *  Convert UTC DateTime into Locale DateTime
 *******/
Alloy.Globals.convertToLocalDate = function(date, returnType) {
	Ti.API.info('date---- ' + date);
	var offset = date.getTimezoneOffset();
	Ti.API.info('offset ' + offset);

	date = date.setMinutes(date.getMinutes() - offset);

	date = new Date(date);
	Ti.API.info('date ' + date);
	var time = date.getTime();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var date1 = date.getDate();
	var month = date.getUTCMonth() + 1;
	var year = date.getFullYear();

	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	// the hour '0' should be '12'
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;

	date1 = date1 < 10 ? '0' + date1 : date1;
	month = month < 10 ? '0' + month : month;

	if (returnType == null) {
		var dateTime = date1 + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ' ' + ampm;
		return dateTime;
	}

	if (returnType == "date") {
		var dateTime = date.getUTCFullYear() + '-' + month + '-' + date1;
		return dateTime;
	}

	if (returnType == "time") {
		var dateTime = hours + ':' + minutes + ' ' + ampm;
		return dateTime;
	}

	if (returnType == "milliseconds") {
		return time;
	}
};
var loyaltyObj = {
	customLoyaltyID : "",
	loyaltyID : "",
	loyaltyVW : "",
	userPoints : 0,
	userRemainingPoints : -1,
	loyaltyValue : 0,
	loyaltyPoints : 0,
	loyaltyQty : 0,
	loyaltyArray : [],
	selectedDrink : -1
};

/**
 * Google Analytics module Initialized
 */

var ga = require('ti.ga');
Ti.API.info("module is => " + ga);

ga.setOptOut(false);
ga.setDebug(true);

var tracker = ga.createTracker({
	trackingId : "UA-118658242-2",
	useSecure : true,
	debug : true
});

Ti.API.info("tracker is => " + JSON.stringify(tracker));

var Flurry = require('ti.flurry');

Flurry.debugLogEnabled = true;
Flurry.eventLoggingEnabled = true;
Flurry.initializeWithCrashReporting('CFFC8MMRGHZZ38SQNZJJ');
Flurry.reportOnClose = true;
Flurry.sessionReportsOnPauseEnabled = true;

/*
 * Function For Validating Email
 */

function checkemail(emailvalue) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailvalue)) {
		return (true);
	}
	return (false);
}

//Function for trim num at decimal two places
function toFixed(num) {
	try {
		var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
		//return parseFloat(Number(num).toFixed(2));
		return parseFloat(Number(with2Decimals).toFixed(2));

	} catch(e) {
		Ti.API.info('Error toFixed ' + e.message);
		return parseFloat(Number(num).toFixed(2));
	}
}

//Ipad Licensing related code
var TouchID = require('ti.touchid');
// -- IMPORTANT --
// This prefix is required for device and production builds
// and will be ignored for simulator builds. It is the Team-ID
// of your provisioning profile.
//var appIdentifierPrefix = '<YOU-APP-IDENTIFIER-PREFIX>';
var appIdentifierPrefix = 'V22QHC3GKL';

var keychainItem = TouchID.createKeychainItem({
	identifier : 'uniqueDeviceId',
	accessGroup : appIdentifierPrefix + '.' + Ti.App.getId()
});

keychainItem.addEventListener('save', function(e) {
	if (!e.success) {
		Ti.API.error('Error: ' + e.error);
		return;
	}

	Ti.API.info('Successfully saved!');
	Ti.API.info(e);
});

keychainItem.addEventListener('read', function(e) {
	if (!e.success) {

		Ti.API.error('Error: ' + e.error);
		return;
	}

	Ti.API.info('Successfully read!');
	Ti.App.Properties.setString("uniqueDeviceId", e.value);
	Ti.API.info('deviceObj ' + e.value);
});

keychainItem.fetchExistence(function(e) {
	Ti.API.info("Exists? " + e.exists);
	if (e.exists) {
		keychainItem.read();
	} else {
		keychainItem.save(Ti.Platform.id);
		Ti.App.Properties.setString("uniqueDeviceId", Ti.Platform.id);
	}
});

//PAX communication related message
function checkTransactionErrorMsg(code, msg) {
	switch(code) {
	case "000100":
		Alloy.Globals.Notifier.show(L('pax_declined'));
		break;
	case "100001":
		Alloy.Globals.Notifier.show(L('pax_timeout'));
		break;
	case "100002":
		Alloy.Globals.Notifier.show(L('pax_aborted'));
		break;
	case "100003":
		Alloy.Globals.Notifier.show(L('trans_invalid'));
		break;
	case "100004":
		Alloy.Globals.Notifier.show(L('untrans_invalid'));
		break;
	case "100007":
		Alloy.Globals.Notifier.show(L('connect_host_error'));
		break;
	case "100008":
		Alloy.Globals.Notifier.show(L('send_msg_error'));
		break;
	case "100009":
		Alloy.Globals.Notifier.show(L('receive_msg_error'));
		break;
	case "100010":
		Alloy.Globals.Notifier.show(L('commu_error'));
		break;
	case "100018":
		Alloy.Globals.Notifier.show(L('swipe_only'));
		break;
	case "100019":
		Alloy.Globals.Notifier.show(L('track_invalid'));
		break;
	case "100011":
		Alloy.Globals.Notifier.show(L('dup_transaction'));
		break;
	case "100013":
		Alloy.Globals.Notifier.show(L('invalid_var_val'));
		break;
	case "100014":
		Alloy.Globals.Notifier.show(L('invalid_data_entry'));
		break;
	case "100021":

		Alloy.Globals.Notifier.show("Transaction alredy completed");

		break;
	default:
		Alloy.Globals.Notifier.show(L('pax_wrong'));

	}
}

bonjourBrowser.addEventListener('updatedservices', function(e) {
	Ti.API.info('updatedservices \n' + JSON.stringify(e));

	Alloy.Globals.cfdServicesArr = e.services;
	if (CurrentWindow == "setting") {
		Alloy.Globals.renderServicesListFromSetting();
	} else {
		renderServicesList();
	}
});
bonjourBrowser.addEventListener('connectionestablished', function(e) {
	Ti.API.info('connectionestablished' + JSON.stringify(e));

	/*
	 if (CurrentWindow == "setting") {
	 //$.devicesTableView.touchEnabled = true;
	 Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnected = true;
	 Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnecting = false;
	 Alloy.Globals.renderServicesListFromSetting();
	 clearTimeout(Alloy.Globals.connectTimeoutHandle);
	 } else {
	 //renderServicesList();
	 }*/

});
bonjourBrowser.addEventListener('connectionfailed', function(e) {
	Ti.API.info('connectionfailed');
	try {

		Ti.App.Properties.setBool("Store_check", false);
		Ti.App.Properties.setString("cfdID", null);
		Ti.App.Properties.setString("cfdName", null);
		Ti.App.Properties.setInt("cfdIndex", null);
		// if(Alloy.Globals.connectedDeviceLbl != null && Alloy.Globals.connectedDeviceLbl != undefined){
			// Alloy.Globals.connectedDeviceLbl.visible = false;
		// }
		if (CurrentWindow == "setting") {
			//$.devicesTableView.touchEnabled = true;
			Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnected = true;
			Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnecting = false;
			clearTimeout(Alloy.Globals.connectTimeoutHandle);
			Alloy.Globals.renderServicesListFromSetting();
		} else {
			//renderServicesList();
		}

	} catch(e) {
		Ti.API.info('connectionfailed ' + JSON.stringify(e));
	}

});
bonjourBrowser.addEventListener('connectionterminated', function(e) {
	Ti.API.info('connectionterminated');
	try {
		Ti.App.Properties.setBool("Store_check", false);
		Ti.App.Properties.setString("cfdID", null);
		Ti.App.Properties.setString("cfdName", null);
		Ti.App.Properties.setInt("cfdIndex", null);
		// if(Alloy.Globals.connectedDeviceLbl != null && Alloy.Globals.connectedDeviceLbl != undefined){
			// Alloy.Globals.connectedDeviceLbl.visible = false;
		// }
		if (CurrentWindow == "setting") {
			//$.devicesTableView.touchEnabled = true;
			Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnected = true;
			Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnecting = false;
			clearTimeout(Alloy.Globals.connectTimeoutHandle);
			Alloy.Globals.renderServicesListFromSetting();
		} else {
			//renderServicesList();
		}
		// Alloy.Globals.initializeCFDCentral();
		bonjourBrowser.startSearch();
	} catch(e) {
		Ti.API.info('connectionterminated ' + JSON.stringify(e));
	}

});
bonjourBrowser.addEventListener('receiveddata', function(e) {
	Ti.API.info('receiveddata = ' + JSON.stringify(e.data));
	Ti.API.info('Ti.App.Properties.getString("store_id") = ' + Ti.App.Properties.getString("store_id"));
	try {
		if (Ti.App.Properties.getBool("Store_check") == false) {
			if (e.data == Ti.App.Properties.getString("store_id")) {
				bonjourBrowser.clearBuffer();
				bonjourBrowser.sendData(Ti.App.Properties.getString("store_id"));
				Ti.App.Properties.setBool("Store_check", true);
				Ti.API.info("CurrentWindow****** " + CurrentWindow);
				if (CurrentWindow == "setting") {
					//$.devicesTableView.touchEnabled = true;
					Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnected = true;
					Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnecting = false;
					Ti.App.Properties.setString("cfdID", Alloy.Globals.cfdId);
					Ti.App.Properties.setString("cfdName", Alloy.Globals.cfdName);
					Ti.App.Properties.setInt("cfdIndex", Alloy.Globals.connectingServiceIndex);
					Ti.API.info("**********################****************** " + Ti.App.Properties.getString("cfdName"));
					Alloy.Globals.renderServicesListFromSetting();
					clearTimeout(Alloy.Globals.connectTimeoutHandle);
					if (Ti.App.Properties.getString("cfdName")) {
						Alloy.Globals.connectedDeviceLbl.text = "Selected Device: " + Ti.App.Properties.getString("cfdName");
					} else {
						Alloy.Globals.connectedDeviceLbl.text = "Selected Device: N/A";
					}
					if (Alloy.Globals.updateCFD != undefined && Alloy.Globals.updateCFD != null) {
						Alloy.Globals.updateCFD();
					}
				} else {
					//renderServicesList();
					if (Alloy.Globals.updateCFD != undefined && Alloy.Globals.updateCFD != null) {
						Alloy.Globals.updateCFD();
					}
				}
			} else {
				Alloy.Globals.cfdId = null;
				Alloy.Globals.cfdName = null;
				Ti.App.Properties.setString("cfdID", null);
				Ti.App.Properties.setString("cfdName", null);
				Ti.App.Properties.setInt("cfdIndex", null);

				// Alloy.Globals.initializeCFDCentral("setting");
				bonjourBrowser.startSearch();

				alert("Connection needs to be terminated different store login detected.");
			}
		}
	} catch(e) {
		Ti.API.info('receiveddata ' + JSON.stringify(e));
	}

});

function renderServicesList() {
	for (var i = 0; i < Alloy.Globals.cfdServicesArr.length; i++) {
		var service = Alloy.Globals.cfdServicesArr[i];
		if (Ti.App.Properties.getString("cfdID") == Alloy.Globals.cfdServicesArr[i].id) {
			connectWithService(i);
			bonjourBrowser.stopSearch();
		}

	}
}

function connectWithService(selectedIndex) {
	try {
		Alloy.Globals.connectingServiceIndex = selectedIndex;
		bonjourBrowser.connectToServiceAtIndex(Alloy.Globals.connectingServiceIndex);
	} catch(e) {
		Ti.API.info("In catch message= " + e.message);
	}
}

Ti.App.addEventListener('paused', function(e) {

	Ti.API.info('PAUSED EVENT');
	Ti.App.Properties.setBool("Store_check", false);

});

Ti.App.addEventListener('resumed', function(e) {

	Ti.API.info('RESUMED EVENT');

	if (Ti.App.Properties.getInt("cfdIndex") != undefined && Ti.App.Properties.getInt("cfdIndex") != null) {
		Ti.API.info("Ti.App.Properties.getInt(cfdIndex) ; " + Ti.App.Properties.getInt("cfdIndex"));
		bonjourBrowser.connectToServiceAtIndex(Ti.App.Properties.getInt("cfdIndex"));
	}

	bonjourBrowser.startSearch();

	if (CurrentWindow == "newOrderScreen") {
		if (Alloy.Globals.renderNewOrderList != undefined && Alloy.Globals.renderNewOrderList != null) {
			Alloy.Globals.renderNewOrderList();
		}
	}

});

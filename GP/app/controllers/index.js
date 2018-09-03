var deviceToken = null;
var dialog = null;
Ti.App.Properties.setObject("reverseSyncDate", new Date().getTime());
Alloy.Globals.registerPushNotification = function(pushCallback) {

	if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1) {

		if (pushCallback) {
			pushCallback(null);
			return;
		}
	}
	// Check if the device is running iOS 8 or later
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
		// Wait for user settings to be registered before registering for push notifications
		Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {

			// Remove event listener once registered for push notifications
			Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

			Ti.Network.registerForPushNotifications({
				success : deviceTokenSuccess,
				error : deviceTokenError,
				callback : receivePush
			});
		});

		// Register notification types to use
		Ti.App.iOS.registerUserNotificationSettings({
			types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
		});
	} else {
		Ti.Network.registerForPushNotifications({
			// Specifies which notifications to receive
			types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
			success : deviceTokenSuccess,
			error : deviceTokenError,
			callback : receivePush
		});
	}
	// Process incoming push notifications
	function receivePush(e) {

		Titanium.UI.iOS.setAppBadge(0);
		Ti.API.info('push title ' + JSON.stringify(e));
		if (e.inBackground) {
			if (Alloy.Globals.isLogin) {
				if (e.data.notification_type == "viewNotifcation") {
					var redeemScreen = Alloy.createController("ViewNotification");
					Alloy.Globals.drawer.centerWindow = redeemScreen.viewNotification;
					Alloy.Globals.currentWindow = redeemScreen;
				} else if (e.data.notification_type == "reverseSync") {
					Ti.API.info('wrong1');
					Alloy.Globals.processSync("notification");
				} else {
					Ti.API.info('wrong2');
					Alloy.Globals.processSync("notification");
				}
				resetBadgeAPI();
			}
		} else {
			if (Alloy.Globals.isLogin) {
				if (e.data.notification_type == "reverseSync") {
					Ti.API.info('wrong3');
					Alloy.Globals.processSync("");
				} else if (e.data.notification_type == "viewNotifcation") {

					dialog = Ti.UI.createAlertDialog({
						cancel : 1,
						buttonNames : ["Show", "Cancel"],
						message : e.data.alert,
						title : e.data.title
					});
					dialog.addEventListener('click', function(k) {
						if (k.index === k.source.cancel) {
							Ti.API.info('The cancel button was clicked');

						} else {
							var redeemScreen = Alloy.createController("ViewNotification");
							Alloy.Globals.drawer.centerWindow = redeemScreen.viewNotification;
							Alloy.Globals.currentWindow = redeemScreen;
							try {
								if (Alloy.Globals.popover) {
									Alloy.Globals.popover.hide();
								}
							} catch(k) {
								Ti.API.info('Error popover on push notification : ' + k.message);
							}
						}

					});
					dialog.show();
				} else {
					Titanium.UI.iOS.setAppBadge(0);

					dialog = Ti.UI.createAlertDialog({
						cancel : 1,
						buttonNames : ["Show", "Cancel"],
						message : e.data.alert,
						title : "Gongcha POS"
					});
					dialog.addEventListener('click', function(k) {
						if (k.index === k.source.cancel) {
							Ti.API.info('The cancel button was clicked');
							Ti.API.info('wrong4');
							Alloy.Globals.processSync("");

						} else {
							Ti.API.info('e.data.order_type = ' + e.data.order_type);

							if (e.data.order_type == "app") {
								if (Alloy.Globals.isLogin) {
									Alloy.Globals.newOrderTab.badge = e.data.badge;
								}
								Ti.API.info('right1');
								Alloy.Globals.processSync("notification", "orderFromApp");
							} else {
								if (Alloy.Globals.isLogin) {
									Alloy.Globals.orderHistoryTab.badge = e.data.badge;
								}
								Ti.API.info('right2');
								Alloy.Globals.processSync("notification", "orderFromKiosk");
							}
							try {
								if (Alloy.Globals.popover) {
									Alloy.Globals.popover.hide();
								}
							} catch(k) {
								Ti.API.info('Error popover on push notification : ' + k.message);
							}
						}

					});
					dialog.show();
				}
				resetBadgeAPI();
			} else {
				Ti.API.info('wrong');
				//Alloy.Globals.processSync("notification");
			}

		}

	}

	// Save the device token for subsequent API calls
	function deviceTokenSuccess(e) {
		Alloy.Globals.deviceToken = e.deviceToken;
		Ti.API.info("deviceToken " + Alloy.Globals.deviceToken);
		if (pushCallback) {
			pushCallback(e.deviceToken);
			return;
		}
	}

	function deviceTokenError(e) {
		Ti.API.info('Failed to register for push notifications! ' + e.error);
		if (pushCallback) {
			pushCallback(null);
			return;
		}
	}

};

//Call function for getting the device Token
Alloy.Globals.registerPushNotification(function(e) {
	Ti.API.info("PUSH :: " + e);
	Ti.App.Properties.setString("token", e);
	Alloy.Globals.deviceToken = e;

});
Titanium.UI.iOS.setAppBadge(0);

var slidermenuWin = Ti.UI.createWindow({
	backgroundColor : "white",
	height : Ti.UI.FILL
});

Alloy.Globals.openHome = function(response) {
	var NappSlideMenu = require('dk.napp.slidemenu');

	ledge = Ti.Platform.displayCaps.platformWidth / 1.5;
	Alloy.Globals.homedrawerWidth = Ti.Platform.displayCaps.platformWidth - ledge;
	Ti.API.info("123456" + Alloy.Globals.homedrawerWidth);
	Alloy.Globals.ledge = ledge;
	Titanium.API.info("Ti.Platform.locale   " + Titanium.App.Properties.getString('locale'));
	var lang = Titanium.App.Properties.getString('locale');

	var sliderScreen = Alloy.createController("SliderMenu");
	var homeScreen = Alloy.createController("TabGroup");
	Alloy.Globals.homeObj = homeScreen;
	Alloy.Globals.drawer = NappSlideMenu.createSlideMenuWindow({
		centerWindow : homeScreen.tabgroup,
		leftWindow : sliderScreen.slidermenu,
		leftLedge : ledge,
		backgroundColor : "#2B3541",
		zIndex : 0
	});

	Alloy.Globals.drawer.addEventListener("open", function(e) {
		Alloy.Globals.drawer.setPanningMode("NoPanning");
		Alloy.Globals.drawer.setCenterhiddenInteractivity("TouchDisabledWithTapToClose");
	});

	Alloy.Globals.openLeft = function() {

		Alloy.Globals.drawer.setCenterhiddenInteractivity("TouchDisabledWithTapToClose");
		Alloy.Globals.drawer.toggleLeftView();
	};
	Alloy.Globals.drawer.open();

};

function openDashboardViaAutoLogin(response) {
	Alloy.Globals.employee_id = response.result[0].employee_id;
	Alloy.Globals.store_id = response.result[0].store_id;
	Ti.App.Properties.setString("store_id", response.result[0].store_id);
	Ti.App.Properties.setObject("loginResponse", response);
	Alloy.Globals.fullname = response.result[0].fullname;
	Alloy.Globals.userimage = response.result[0].profile_pic;
	Alloy.Globals.store_name = response.result[0].store_name;
	Ti.App.Properties.setObject("profileData", response.result[0]);
	Alloy.Globals.openHome();

}

//Condition for auto login if loginResponse avaliable, open home screen
if (Ti.App.Properties.getObject("loginResponse")) {
	openDashboardViaAutoLogin(Ti.App.Properties.getObject("loginResponse"));
} else if (Ti.App.Properties.getObject("storeManagerLoginResponse")) {
	var clockIn = Alloy.createController("ClockInOutScreen").getView();
	clockIn.open();
} else {
	var loginObj = Alloy.createController("LoginScreen").getView();
	loginObj.open();
}

// Stops app from going into sleep mode
Titanium.App.idleTimerDisabled = true;

//Web Service for reset badge counter
function resetBadgeAPI() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var SERVICE_RESET_BADGE = Alloy.Globals.Constants.SERVICE_RESET_BADGE;
	if (Ti.Network.online) {
		//Alloy.Globals.LoadingScreen.open();
		var obj = {};
		obj.customer_id = Alloy.Globals.employee_id;
		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_RESET_BADGE, resetBadgeAPICallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_RESET_BADGE);
	} else {
		//Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

};

/*
 * Getting response of resetBadgeAPICallback in the callback function
 */

function resetBadgeAPICallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response  ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {
				if (response.response_code == '1') {
					Ti.API.info('Badge has reset successfully');
				}
			}
		} catch(e) {
			Ti.API.info('Error resetBadgeAPICallback service : ' + e.message);
			tracker.addException({
				description : "Index.js Reset badge: " + e.message,
				fatal : false
			});
		}
	} else {
		//Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	//Alloy.Globals.LoadingScreen.close();

}

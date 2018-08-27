//Alloy.Globals.deviceToken = Ti.App.Properties.getString("token");
Alloy.Globals.isHome=0;
Alloy.Globals.isNotification = false;
Alloy.Globals.notifyVW = null;
Alloy.Globals.notifyLbl = null;
Alloy.Globals.pushCount = "1";
Alloy.Globals.fb = null;
Alloy.Globals.google = null;
Alloy.Globals.loginScreen = null;
var loginWindow = Alloy.createController("LoginScreen").getView();

// if (OS_IOS) {
// loginWindow.open({
// transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
// });
// } else {

loginWindow.open();

// };

// if (OS_IOS) {
//
// var deviceToken = null;
// // Check if the device is running iOS 8 or later
// if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
//
// // Wait for user settings to be registered before registering for push notifications
// Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
//
// // Remove event listener once registered for push notifications
// Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
//
// Ti.Network.registerForPushNotifications({
// success : deviceTokenSuccess,
// error : deviceTokenError,
// callback : receivePush
// });
// });
//
// // Register notification types to use
// Ti.App.iOS.registerUserNotificationSettings({
// types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
// });
// }
//
// // For iOS 7 and earlier
// else {
// Ti.Network.registerForPushNotifications({
// // Specifies which notifications to receive
// types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
// success : deviceTokenSuccess,
// error : deviceTokenError,
// callback : receivePush
// });
// }
// // Process incoming push notifications
// function receivePush(e) {
// Ti.API.info('Push Received : ' + JSON.stringify(e));
// Titanium.UI.iPhone.appBadge = 0;
// Titanium.UI.iPhone.setAppBadge(0);
//
// if (e.inBackground) {
// if (Alloy.Globals.isLogin == false) {
// if (Alloy.Globals.isNotification) {
// Alloy.Globals.notificationObj.getNotificationService();
// } else {
// var notificationWin = Alloy.createController("NotificationScreen");
// Alloy.Globals.notificationObj = notificationWin;
// notificationWin = notificationWin.getView();
//
// Alloy.Globals.navWindow.openWindow(notificationWin, {
// animated : true
// });
//
// Alloy.Globals.currentWindow = notificationWin;
// }
//
// }
// } else {
// if (Alloy.Globals.isLogin == false) {
// Ti.API.info('Alloy.Globals.isNotification ' + Alloy.Globals.isNotification);
// if (Alloy.Globals.notifyVW) {
// Alloy.Globals.notifyVW.visible = true;
// Alloy.Globals.notifyLbl.text = e.data.aps.badge;
// }
//
// var dialog = Ti.UI.createAlertDialog({
// cancel : 1,
// buttonNames : ['Show', 'Cancel'],
// message : e.data.alert,
// title : e.data.title.capitalize()
// });
// dialog.addEventListener('click', function(k) {
// if (k.index === 0) {
// if (Alloy.Globals.isNotification) {
// Alloy.Globals.notificationObj.getNotificationService();
// } else {
// var notificationWin = Alloy.createController("NotificationScreen");
// Alloy.Globals.notificationObj = notificationWin;
// notificationWin = notificationWin.getView();
//
// Alloy.Globals.navWindow.openWindow(notificationWin, {
// animated : true
// });
//
// Alloy.Globals.currentWindow = notificationWin;
// dialog.hide();
// }
//
// }
// });
// dialog.show();
// }
//
// }
//
// }
//
// // Save the device token for subsequent API calls
// function deviceTokenSuccess(e) {
// Alloy.Globals.deviceToken = e.deviceToken;
// Ti.API.info("deviceToken " + Alloy.Globals.deviceToken);
// //checkDeviceToken();
// }
//
// function deviceTokenError(e) {
// Ti.API.info('Failed to register for push notifications! ' + e.error);
// //checkDeviceToken();
// }
//
// } else {

Alloy.Globals.registerPushNotification = function(pushCallback) {
	var gcm = require('net.iamyellow.gcmjs');
	if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1) {
		if (pushCallback) {
			pushCallback(null);
			return;
		}
	}

	var pendingData = gcm.data;
	Ti.API.info("pendingData : " + pendingData);
	if (pendingData && pendingData !== null) {
		Ti.API.info('******* data (started) ' + JSON.stringify(pendingData));
	}

	gcm.registerForPushNotifications({

		success : function(ev) {
			// on successful registration

			Alloy.Globals.deviceToken = ev.deviceToken;
			Ti.App.Properties.setString("token", Alloy.Globals.deviceToken);
			if (pushCallback) {
				pushCallback(ev.deviceToken);
			}

			Ti.API.info("Alloy.Globals.deviceToken " + JSON.stringify(ev));
			//checkDeviceToken();

		},

		error : function(ev) {
			// when an error occurs
			Ti.API.info('******* error, ' + ev.error);
			if (pushCallback) {
				pushCallback(null);
			}
			Ti.App.Properties.setString("token", null);
			//checkDeviceToken();
		},

		// Android k liye..
		callback : function(e) {
			Ti.API.info("PUSH Recieved  " + JSON.stringify(e));

			try {
				var k = e.message;

				var msg = k.split("message=");
				Ti.API.info("msg1 :: " + JSON.stringify(msg[1]));
				msg = msg[1].split(",");
				Ti.API.info("msg1 :: " + JSON.stringify(msg[0]));
				var title = k.split("title=");
				Ti.API.info("title1 :: " + JSON.stringify(title[1]));
				title = title[1].split(",");
				Ti.API.info("title1 :: " + JSON.stringify(title[0]));
				var count = k.split("count=");
				Ti.API.info("count1 :: " + JSON.stringify(title[1]));
				count = count[1].split(",");
				Ti.API.info("count2 :: " + JSON.stringify(count[0]));

				if (Alloy.Globals.isLogin == false) {
					Ti.API.info('Alloy.Globals.isNotification ' + Alloy.Globals.isNotification);
					if (Alloy.Globals.notifyVW) {
						Alloy.Globals.notifyVW.visible = true;
						Alloy.Globals.notifyLbl.text = count[0];
					}

					var dialog = Ti.UI.createAlertDialog({
						cancel : 1,
						buttonNames : ['Show', 'Cancel'],
						message : msg[0],
						title : title[0]
					});
					dialog.addEventListener('click', function(k) {
						if (k.index === 0) {
							if (Alloy.Globals.isNotification) {
								Alloy.Globals.notificationObj.getNotificationService();
							} else {
								var notificationWin = Alloy.createController("NotificationScreen");
								Alloy.Globals.notificationObj = notificationWin;
								notificationWin = notificationWin.getView();

								notificationWin.open();

								Alloy.Globals.currentWindow = notificationWin;
								dialog.hide();
							}

						}
					});
					dialog.show();
				}
			} catch(e) {
				Ti.API.info('Error PUSH : ' + e.error);
			}
		},
		unregister : function(ev) {
			// on unregister
			Ti.API.info('******* unregister, ' + ev.deviceToken);
			Ti.App.Properties.setString("token", null);

		},
		data : function(data) {
			Ti.API.info('From background' + JSON.stringify(data));
			if (Alloy.Globals.isLogin == false) {
				if (Alloy.Globals.isNotification) {
					Alloy.Globals.notificationObj.getNotificationService();
				} else {
					var notificationWin = Alloy.createController("NotificationScreen");
					Alloy.Globals.notificationObj = notificationWin;
					notificationWin = notificationWin.getView();

					notificationWin.open();

					Alloy.Globals.currentWindow = notificationWin;
				}

			}
		}
	});

};

// }
//if (Alloy.Globals.deviceToken == null || Alloy.Globals.deviceToken == undefined) {
	Alloy.Globals.registerPushNotification(function(e) {
		Ti.API.info("PUSH :: "+e);
		Ti.App.Properties.setString("token", e);
		Alloy.Globals.deviceToken =e;
	});

//}

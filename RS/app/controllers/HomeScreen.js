var args = arguments[0] || {};
Alloy.Globals.isHome = 1;
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var id = Ti.App.Properties.getString("id");
var isLocationOn = false;
Alloy.Globals.navWindow = $.navWindow;
Alloy.Globals.notifyVW = $.notifyVW;
Alloy.Globals.notifyLbl = $.notifyLbl;
Alloy.Globals.isLogin = false;
Alloy.Globals.advertiseWin = null;
Alloy.Globals.speed = " ";
Alloy.Globals.latitude = null;
Alloy.Globals.longitude = null;
var preLat = null;
var preLong = null;
var isRegion = "";
var flag = false;
if (OS_ANDROID) {
	Alloy.Globals.currentWindow = null;
	var textToSpeech = Alloy.Globals.textToSpeech.createSpeech({
		rate : 0.6
	});
	if (Ti.Platform.displayCaps.platformWidth == 480) {
	}

} else {
	Alloy.Globals.currentWindow = $.HomeScreen;
	if (Ti.Platform.displayCaps.platformHeight == 480) {
		$.logoImg.top = "13%";
		$.btnContainer.bottom = 5;
		$.logoImg.image = "/images/logoSmall@2x.png";

	}
}
function openLeftMenu() {
	if (OS_ANDROID) {
		Alloy.Globals.drawer.toggleLeftWindow();
	} else {
		Alloy.Globals.openLeft();
	}

}

function openNotification(e) {
	if (Ti.Network.online) {
		$.panicView.focusable = false;
		$.locationView.focusable = false;
		$.trackingView.focusable = false;
		$.roadView.focusable = false;
		$.safetyView.focusable = false;
		$.activityView.focusable = false;
		$.emergencyView.focusable = false;
		if ($.notifyVW.focusable == false) {
			return;
		}
		$.notifyVW.focusable = false;
		var notificationWin = Alloy.createController("NotificationScreen");
		Alloy.Globals.notificationObj = notificationWin;
		notificationWin = notificationWin.getView();
		if (OS_IOS) {
			Alloy.Globals.navWindow.openWindow(notificationWin, {
				animated : true
			});
		} else {
			notificationWin.open();
		}

		Alloy.Globals.currentWindow = notificationWin;
		setTimeout(function(e) {
			$.notifyVW.focusable = true;
			$.panicView.focusable = true;
			$.locationView.focusable = true;
			$.trackingView.focusable = true;
			$.roadView.focusable = true;
			$.safetyView.focusable = true;
			$.activityView.focusable = true;
			$.emergencyView.focusable = true;

		}, 1000);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function openPanic(e) {
	if (Ti.Network.online) {
		if (Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) {
			$.notifyVW.focusable = false;
			$.locationView.focusable = false;
			$.trackingView.focusable = false;
			$.roadView.focusable = false;
			$.safetyView.focusable = false;
			$.activityView.focusable = false;
			$.emergencyView.focusable = false;
			if (Alloy.Globals.isContact == 1) {
				if ($.panicView.focusable == false) {
					return;
				}
				$.panicView.focusable = false;
				if (OS_IOS) {
					var panicScreen = Alloy.createController("PanicScreen").getView();

					$.navWindow.openWindow(panicScreen);
				} else {
					var panicScreen = Alloy.createController("PanicScreen").getView();
					panicScreen.open();
				}

				Alloy.Globals.currentWindow = panicScreen;
			} else {
				Alloy.Globals.Alert("Please add emergency contact first");
			}
			setTimeout(function(e) {
				$.notifyVW.focusable = true;
				$.panicView.focusable = true;
				$.locationView.focusable = true;
				$.trackingView.focusable = true;
				$.roadView.focusable = true;
				$.safetyView.focusable = true;
				$.activityView.focusable = true;
				$.emergencyView.focusable = true;

			}, 1000);
		} else {
			isLocationOn = false;
			Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
		}
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function openEmergency(e) {
	if (Ti.Network.online) {
		if (Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) {

			$.panicView.focusable = false;
			$.notifyVW.focusable = false;
			$.locationView.focusable = false;
			$.trackingView.focusable = false;
			$.roadView.focusable = false;
			$.safetyView.focusable = false;
			$.activityView.focusable = false;

			if ($.emergencyView.focusable == false) {
				return;
			}
			$.emergencyView.focusable = false;
			e.source.image = '/images/Emergency_ico.png';

			if (OS_IOS) {
				var emergencyScreen = Alloy.createController("EmergencyScreen").getView();

				$.navWindow.openWindow(emergencyScreen);
			} else {
				var emergencyScreen = Alloy.createController("EmergencyScreen").getView();
				emergencyScreen.open();
			}
			Alloy.Globals.currentWindow = emergencyScreen;

			setTimeout(function(e) {
				$.locationView.focusable = true;
				$.emergencyView.focusable = true;
				$.trackingView.focusable = true;
				$.roadView.focusable = true;
				$.safetyView.focusable = true;
				$.activityView.focusable = true;
				$.panicView.focusable = true;
				$.notifyVW.focusable = true;
			}, 2000);
		} else {
			isLocationOn = false;
			Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
		}
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function openLoactionMarkerScreen(e) {
	if (Ti.Network.online) {
		$.notifyVW.focusable = false;
		$.emergencyView.focusable = false;
		$.panicView.focusable = false;
		$.trackingView.focusable = false;
		$.roadView.focusable = false;
		$.safetyView.focusable = false;
		$.activityView.focusable = false;
		if ($.locationView.focusable == false) {
			return;
		}
		$.locationView.focusable = false;
		e.source.image = '/images/location_marker.png';
		//	Ti.API.info("Alloy.Globals.islocationMarker " + Alloy.Globals.islocationMarker);
		if (Alloy.Globals.islocationMarker == "1") {
			openSecondTimeDialog();
		} else {
			openFirstTimeDialog();
		}

		setTimeout(function(e) {
			$.locationView.focusable = true;
			$.emergencyView.focusable = true;
			$.trackingView.focusable = true;
			$.roadView.focusable = true;
			$.safetyView.focusable = true;
			$.activityView.focusable = true;
			$.panicView.focusable = true;
			$.notifyVW.focusable = true;
		}, 1000);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function openFirstTimeDialog() {
	var opts = {
		cancel : 2,
		options : ['New', 'Share', 'Cancel'],
		//selectedIndex : 2,
		destructive : 0,
		title : 'Road Safety'
	};
	var dialog = Ti.UI.createOptionDialog(opts);

	dialog.addEventListener("click", function(e) {
		if (e.index == 0) {

			openAddAnnotationWin();
		} else if (e.index == 1) {

			openAddContactWin();
		} else if (e.index == 2) {

			dialog.hide();
		}
	});
	dialog.show();
}

function fun() {
	$.advertiseView.visible = true;
}

function openSecondTimeDialog() {
	var opts = {
		cancel : 3,
		options : ['View', 'New', 'Share', 'Cancel'],
		//selectedIndex : 2,
		destructive : 0,
		title : 'Road Safety'
	};
	var dialog1 = Ti.UI.createOptionDialog(opts);

	dialog1.addEventListener("click", function(e) {
		if (e.index == 0) {

			lastLocationService();
		} else if (e.index == 1) {

			openAddAnnotationWin();
		} else if (e.index == 2) {

			openAddContactWin();
		} else {
			dialog1.hide();
		}
	});
	dialog1.show();
}

function openTrackingScreen(e) {
	if (Ti.Network.online) {
		if (Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) {
			$.notifyVW.focusable = false;
			$.panicView.focusable = false;
			$.emergencyView.focusable = false;
			$.locationView.focusable = false;
			$.roadView.focusable = false;
			$.safetyView.focusable = false;
			$.activityView.focusable = false;
			if ($.trackingView.focusable == false) {
				return;
			}
			$.trackingView.focusable = false;
			var trackingScreen = Alloy.createController("TrakingScreen");
			Alloy.Globals.trackingObj = trackingScreen;
			trackingScreen = trackingScreen.getView();
			if (OS_IOS) {

				$.navWindow.openWindow(trackingScreen);
			} else {

				trackingScreen.open();
			}
			Alloy.Globals.currentWindow = trackingScreen;
			setTimeout(function(e) {
				$.notifyVW.focusable = true;
				$.panicView.focusable = true;
				$.locationView.focusable = true;
				$.emergencyView.focusable = true;
				$.trackingView.focusable = true;
				$.roadView.focusable = true;
				$.safetyView.focusable = true;
				$.activityView.focusable = true;
			}, 2000);
		} else {
			isLocationOn = false;
			Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
		}
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function openRoadAssistance(e) {
	if (Ti.Network.online) {
		if (Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) {

			$.notifyVW.focusable = false;
			$.panicView.focusable = false;
			$.emergencyView.focusable = false;
			$.locationView.focusable = false;
			$.trackingView.focusable = false;
			$.safetyView.focusable = false;
			$.activityView.focusable = false;
			if ($.roadView.focusable == false) {
				return;
			}
			$.roadView.focusable = false;
			if (OS_IOS) {
				var driveModeScreen = Alloy.createController("RoadAssistanceScreen").getView();

				$.navWindow.openWindow(driveModeScreen);
			} else {
				var driveModeScreen = Alloy.createController("RoadAssistanceScreen").getView();
				driveModeScreen.open();
			}

			Alloy.Globals.currentWindow = driveModeScreen;

			setTimeout(function(e) {
				$.panicView.focusable = true;
				$.locationView.focusable = true;
				$.emergencyView.focusable = true;
				$.trackingView.focusable = true;
				$.roadView.focusable = true;
				$.safetyView.focusable = true;
				$.activityView.focusable = true;
				$.notifyVW.focusable = true;
			}, 2000);
		} else {
			isLocationOn = false;
			Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
		}
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function openSafetyRule(e) {
	if (Ti.Network.online) {
		$.notifyVW.focusable = false;
		$.panicView.focusable = false;
		$.emergencyView.focusable = false;
		$.locationView.focusable = false;
		$.trackingView.focusable = false;
		$.roadView.focusable = false;
		$.activityView.focusable = false;
		if ($.safetyView.focusable == false) {
			return;
		}
		$.safetyView.focusable = false;

		if (OS_IOS) {
			var safetyRuleScreen = Alloy.createController("SafetyRuleScreen").getView();
			$.navWindow.openWindow(safetyRuleScreen);
		} else {
			var safetyRuleScreen = Alloy.createController("SafetyRuleScreen").getView();
			safetyRuleScreen.open();
		}
		Alloy.Globals.currentWindow = safetyRuleScreen;
		setTimeout(function(e) {
			$.locationView.focusable = true;
			$.emergencyView.focusable = true;
			$.trackingView.focusable = true;
			$.roadView.focusable = true;
			$.safetyView.focusable = true;
			$.activityView.focusable = true;
			$.panicView.focusable = true;
			$.notifyVW.focusable = true;
		}, 2000);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function openActivityLog(e) {
	if (Ti.Network.online) {
		$.notifyVW.focusable = false;
		$.panicView.focusable = false;
		$.emergencyView.focusable = false;
		$.locationView.focusable = false;
		$.trackingView.focusable = false;
		$.roadView.focusable = false;
		$.safetyView.focusable = false;
		if ($.activityView.focusable == false) {
			return;
		}
		$.activityView.focusable = false;
		var activityScreen = Alloy.createController("MyActivityScreen");
		Alloy.Globals.myActivity = activityScreen;
		if (OS_IOS) {

			$.navWindow.openWindow(activityScreen.getView());
		} else {
			activityScreen.getView().open();
		}
		Alloy.Globals.currentWindow = activityScreen.getView();
		setTimeout(function(e) {
			$.locationView.focusable = true;
			$.emergencyView.focusable = true;
			$.trackingView.focusable = true;
			$.roadView.focusable = true;
			$.safetyView.focusable = true;
			$.activityView.focusable = true;
			$.panicView.focusable = true;
			$.notifyVW.focusable = true;

		}, 2000);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

/*
 function menuTouchStrt(e){
 e.source.image = '/images/menu_icon-hover.png';
 }
 function menuTouchEnd(e){
 e.source.image = '/images/menu_ico.png';
 // Alloy.Globals.drawer.toggleLeftWindow();

 }*/

function panicTouchStrt(e) {
	e.source.image = '/images/panic_ico_hover.png';
}

function panicTouchEnd(e) {
	e.source.image = '/images/panic_ico.png';
}

function locationMarkerTouchStrt(e) {
	e.source.image = '/images/location_marker_hover.png';
}

function locationMarkerTouchEnd(e) {
	e.source.image = '/images/location_marker.png';
}

function emergencyTouchStrt(e) {
	e.source.image = '/images/emergency_ico_hover.png';
}

function emergencyTouchEnd(e) {
	e.source.image = '/images/Emergency_ico.png';
}

function trackingTouchStrt(e) {
	e.source.image = '/images/tracing_ico_hover.png';
}

function trackingTouchEnd(e) {
	e.source.image = '/images/tracing_ico.png';
}

function roadAssistanceTouchStrt(e) {
	e.source.image = '/images/Roadside_ico_hover.png';
}

function roadAssistanceTouchEnd(e) {
	e.source.image = '/images/Roadside_ico.png';
}

function safetyTouchStrt(e) {
	e.source.image = '/images/safety_ico_hover.png';
}

function safetyTouchEnd(e) {
	e.source.image = '/images/safety_ico.png';
}

function activityTouchStrt(e) {
	e.source.image = '/images/Activity_ico_hover.png';
}

function activityTouchEnd(e) {
	e.source.image = '/images/activity_ico.png';
}

function logoutFun(e) {
	if (Ti.Network.online) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', 'No'],
			message : 'Are you sure want to logout?',
			title : 'Road Safety'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {

			} else {
				logoutService();

			}

		});
		dialog.show();
	} else {

		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function leftMenuOptionSelected(e) {
	if (Ti.Network.online) {
		switch(e.index) {
		case 0:
			//if (Alloy.Globals.currentWindow == null ) {
			goToHome(Alloy.Globals.currentWindow);
			Alloy.Globals.profileObj = Alloy.createController("ProfileScreen");

			if (OS_IOS) {
				$.navWindow.openWindow(Alloy.Globals.profileObj.getView(), {
					animated : false
				});
			} else {
				Alloy.Globals.profileObj.getView().open();
			}
			Alloy.Globals.currentWindow = Alloy.Globals.profileObj.getView();
			//}
			break;
		case 1:
			//if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "emergencyContacts") {
			goToHome(Alloy.Globals.currentWindow);

			var emergencyContactsList = Alloy.createController("EmergencyContactScreen").getView();
			if (OS_IOS) {
				$.navWindow.openWindow(emergencyContactsList, {
					animated : false
				});
			} else {
				emergencyContactsList.open();
			}

			Alloy.Globals.currentWindow = emergencyContactsList;
			//}
			break;
		case 2:
			//if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "safetyRule") {
			goToHome(Alloy.Globals.currentWindow);

			var safetyRule = Alloy.createController("SafetyRuleScreen").getView();
			if (OS_IOS) {
				$.navWindow.openWindow(safetyRule, {
					animated : false
				});
			} else {
				safetyRule.open();
			}

			Alloy.Globals.currentWindow = safetyRule;
			//}
			break;

		// case 3:
		// if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "driveMode") {
		// goToHome(Alloy.Globals.currentWindow);
		//
		// var driveMode = Alloy.createController("DriveModeScreen").getView();
		// if (OS_IOS) {
		// $.navWindow.openWindow(driveMode, {
		// animated : false
		// });
		// } else {
		// driveMode.open();
		// }
		// Alloy.Globals.currentWindow = driveMode;
		// }
		// break;

		case 3:
			//	if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "help") {
			goToHome(Alloy.Globals.currentWindow);

			var help = Alloy.createController("HelpScreen").getView();
			if (OS_IOS) {
				$.navWindow.openWindow(help, {
					animated : false
				});
			} else {
				help.open();
			}
			Alloy.Globals.currentWindow = help;
			//	}
			break;
		case 4:
			//if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "disclaimer") {
			goToHome(Alloy.Globals.currentWindow);

			var disclaimer = Alloy.createController("DisclaimerScreen").getView();
			if (OS_IOS) {
				$.navWindow.openWindow(disclaimer, {
					animated : false
				});
			} else {
				disclaimer.open();
			}
			Alloy.Globals.currentWindow = disclaimer;
			//	}
			break;

		}
		if (e.index != 5) {

			Alloy.Globals.drawer.toggleLeftView();

		}
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};

function leftMenuOptionAndroidSelected(e) {
	if (Ti.Network.online) {
		if ($.rightTable.focusable == false) {
			return;
		}
		$.rightTable.focusable = false;

		switch(e.index) {
		case 0:
			//if (Alloy.Globals.currentWindow == null ) {
			//goToHome(Alloy.Globals.currentWindow);
			Alloy.Globals.profileObj = Alloy.createController("ProfileScreen");

			if (OS_IOS) {
				$.navWindow.openWindow(Alloy.Globals.profileObj.getView(), {
					animated : false
				});
			} else {
				Alloy.Globals.profileObj.getView().open();
			}
			Alloy.Globals.currentWindow = Alloy.Globals.profileObj.getView();
			//}
			break;
		case 1:
			//if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "emergencyContacts") {
			//goToHome(Alloy.Globals.currentWindow);

			var emergencyContactsList = Alloy.createController("EmergencyContactScreen").getView();
			if (OS_IOS) {
				$.navWindow.openWindow(emergencyContactsList, {
					animated : false
				});
			} else {
				emergencyContactsList.open();
			}

			Alloy.Globals.currentWindow = emergencyContactsList;
			//}
			break;
		case 2:
			//if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "safetyRule") {
			//goToHome(Alloy.Globals.currentWindow);

			var safetyRule = Alloy.createController("SafetyRuleScreen").getView();
			if (OS_IOS) {
				$.navWindow.openWindow(safetyRule, {
					animated : false
				});
			} else {
				safetyRule.open();
			}

			Alloy.Globals.currentWindow = safetyRule;
			//}
			break;

		case 3:
			//	if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "help") {
			//goToHome(Alloy.Globals.currentWindow);

			var help = Alloy.createController("HelpScreen").getView();
			if (OS_IOS) {
				$.navWindow.openWindow(help, {
					animated : false
				});
			} else {
				help.open();
			}
			Alloy.Globals.currentWindow = help;
			//	}
			break;
		case 4:
			//if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "disclaimer") {
			//goToHome(Alloy.Globals.currentWindow);

			var disclaimer = Alloy.createController("DisclaimerScreen").getView();
			if (OS_IOS) {
				$.navWindow.openWindow(disclaimer, {
					animated : false
				});
			} else {
				disclaimer.open();
			}
			Alloy.Globals.currentWindow = disclaimer;
			//	}
			break;

		case 5:
			Ti.API.info("$.fenceVW1.visible " + $.fenceVW1.visible);
			//if ($.fenceVW1.visible == true) {
			geofenceServiceone();
			//} else {
			//Alloy.Globals.Alert("Fence is already updated");
			//	var toast = Ti.UI.createNotification({
			//		message :"Fence is already updated",
			//		duration : Ti.UI.NOTIFICATION_DURATION_LONG
			//	});
			//	toast.show();
			//}

			break;

		}
		if (e.index != 6) {
			if (OS_IOS) {
				Alloy.Globals.drawer.toggleLeftView();
			} else {
				Alloy.Globals.drawer.toggleLeftWindow();
			}
		}

		setTimeout(function(e) {
			$.rightTable.focusable = true;
		}, 2000);

	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}

};
function goToHome(win) {
	if (win == null) {
		return;
	}
	if (win.oldWin != null) {
		goToHome(win.oldWin);
	}
	win.close({
		animated : false
	});
}

function logoutService() {
	var data = {};
	data.id = id;
	var SERVICE_LOGOUT = Alloy.Globals.Constants.SERVICE_LOGOUT;
	var PARAMS = "&id=" + Ti.App.Properties.getString("id");
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_LOGOUT, logoutCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_LOGOUT + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function logoutCallback(e) {
	Ti.API.info("logout response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				Ti.API.info('response.action_success = ' + response.action_success);
				if (response.action_success == 'true') {
					Alloy.Globals.isHome = 0;
					if (Alloy.Globals.google) {
						Ti.Network.createHTTPClient().clearCookies('https://mail.google.com/mail/u/0/?logout&hl=en');
						Alloy.Globals.google.logout();
					}
					if (Alloy.Globals.fb) {
						var client = Titanium.Network.createHTTPClient().clearCookies('https://login.facebook.com');
						Alloy.Globals.fb.logout();
					}

					Alloy.Globals.fb = null;
					Alloy.Globals.google = null;

					var loginWindow = Alloy.createController("LoginScreen").getView();
					loginWindow.open();

					Alloy.Globals.drawer.close();
					Alloy.Globals.drawer = null;
					if (OS_ANDROID) {
						Titanium.Network.removeAllSystemCookies();
					}
					if (intervalHold2 != null) {
						clearInterval(intervalHold2);
						intervalHold2 = null;
					}
					if (advertiseInterval != null) {
						clearInterval(advertiseInterval);
						advertiseInterval = null;
					}
					// if (finalDistanceInterval != null) {
					// clearInterval(finalDistanceInterval);
					// finalDistanceInterval = null;
					// }
					if (backgroundService != null) {
						clearInterval(backgroundService);
						backgroundService = null;
					}
					if (Alloy.Globals.advertiseWin != null) {
						Alloy.Globals.advertiseWin.close();
						Alloy.Globals.advertiseWin = null;
					}
					Alloy.Globals.isFbLogin = false;
					Ti.Geolocation.Android.removeLocationProvider(providerGps);
					Ti.App.Properties.setString("email", null);
					Ti.App.Properties.setString('password', null);
					Ti.App.Properties.setString('autoFB', 0);
					Ti.App.Properties.setString('autoGoogle', 0);
					Alloy.Globals.androidgeofence.removeEventListener("onEnter", enterFun);
					Alloy.Globals.androidgeofence.removeEventListener("onExit", exitFun);
					isRegion = "";
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error signup List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();

}

Ti.App.addEventListener('pause', function(e) {

	Ti.API.info("pause......");
	if (advertiseInterval != null) {
		clearInterval(advertiseInterval);
		advertiseInterval = null;
	}

});
Ti.App.addEventListener('resumed', function(e) {

	if (advertiseInterval != null) {
		clearInterval(advertiseInterval);
		advertiseInterval = null;
	}

	Ti.API.info("Resume......");
	if (advertiseInterval) {
		advertiseInterval = setInterval(function() {
			getAdvertiseService();
		}, 300000);
	}

	Titanium.UI.iPhone.appBadge = 0;
	Titanium.UI.iPhone.setAppBadge(0);

});

//Function for call the service to notify the backend about current location

function currentLocationService(lat, longitude) {

	var data = {};
	data.id = id;
	var SERVICE_SAVE_LAT_LONG = Alloy.Globals.Constants.SERVICE_SAVE_LAT_LONG;
	var PARAMS = "&id=" + id + "&latitude=" + lat + "&longitude=" + longitude;
	if (Ti.Network.online) {
		//Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_SAVE_LAT_LONG + PARAMS, currentLocationServiceCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_SAVE_LAT_LONG + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function currentLocationServiceCallback(e) {
	Ti.API.info("currentLocationService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				if (response.action_success == 'true') {

				} else {
					//	Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error currentLocationService List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	//Alloy.Globals.LoadingScreen.close();
}

var intervalHold2 = null;
var finalDistanceInterval = null;
var firstTime = true;
//Code for getting the current device latittude and longitude
var timestamp = 0;
var latlongArray = [];
var minDistance = 0.02;
var minAccuracy = 35;
var timeStamp = 0;
var isDrawPoly = false;

if (OS_ANDROID) {

	var f1 = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'select.txt');

	//var f2 = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'reject.txt');

	var providerGps = Ti.Geolocation.Android.createLocationProvider({
		name : Ti.Geolocation.PROVIDER_GPS,
		minUpdateDistance : 25,
		minUpdateTime : 10,
	});
	Ti.Geolocation.Android.addLocationProvider(providerGps);
	Ti.Geolocation.Android.manualMode = true;

} else {

	// var f1 = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'select.txt');
	// var f2 = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'reject.txt');

	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.purpose = 'Get Current Location';
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.distanceFilter = 10;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	}
}

var locationCallback = function(e) {
	if (!e.success || e.error) {
		Ti.API.info('error:' + JSON.stringify(e.error));
		Ti.API.info("Network is disabled3");
		isLocationOn = false;

	} else {
		isLocationOn = true;
		Ti.API.info('coords: ' + JSON.stringify(e.coords));
		//f1.write('coords: ' + JSON.stringify(e.coords) + "\n", true);

		Alloy.Globals.latitude = e.coords.latitude;
		Alloy.Globals.longitude = e.coords.longitude;
		Alloy.Globals.accuracy = e.coords.accuracy;
		var timestamp = e.coords.timestamp;

		if (firstTime) {
			currentLocationService(Alloy.Globals.latitude, Alloy.Globals.longitude);
			addlatlongActivityService(Alloy.Globals.latitude, Alloy.Globals.longitude);
			firstTime = false;
		}

		if (!isDrawPoly) {
			geofenceService();
		}

		Alloy.Globals.accuracy = parseInt(Alloy.Globals.accuracy);

		f1.write("Accuracy= " + Alloy.Globals.accuracy + "  Latitude : " + Alloy.Globals.latitude + "  Longitude : " + Alloy.Globals.longitude + "  Time : " + timestamp + "  \n\n", true);

		if (Alloy.Globals.accuracy <= minAccuracy) {

			// Service call for update the latest lat long.
			addlatlongActivityService(Alloy.Globals.latitude, Alloy.Globals.longitude);
			if (preLat != null) {

				//Code for getting the distance between accurate lat long.
				var distance1 = distance(preLat, preLong, Alloy.Globals.latitude, Alloy.Globals.longitude, timestamp, timeStamp, "K");

				f1.write("minDistance  :  " + minDistance + " Calculated Distance : " + distance1 + "\n\n", true);

				if (distance1 >= minDistance) {
					var obj = {};
					obj.latitude = Alloy.Globals.latitude;
					obj.longitude = Alloy.Globals.longitude;
					obj.time = timestamp;
					latlongArray.push(obj);

				}
			}

			preLat = Alloy.Globals.latitude;
			preLong = Alloy.Globals.longitude;
			timeStamp = timestamp;
			//f1.write("Final Selected Array   :  " + latlongArray.length + "   " + JSON.stringify(latlongArray) + " \n\n", true);
			/*
			 * 1. Below code excute when the 2 perfect lat long get and calculate the final speed.
			 */
			if (latlongArray.length > 1) {
				var finalSpeed = getSpeed(latlongArray[latlongArray.length - 1].latitude, latlongArray[latlongArray.length - 1].longitude, latlongArray[0].latitude, latlongArray[0].longitude, latlongArray[latlongArray.length - 1].time, latlongArray[0].time, "K");
				/*
				* Below code for check the geo-fence current lat logn exist in the region.
				*/
				//f1.write("Final Speed  :  " + finalSpeed + " \n\n\n", true);
				if (isDrawPoly) {
					f1.write("CHECK LAT LONG   :  " + Alloy.Globals.latitude + "  " + Alloy.Globals.longitude + "  " + Alloy.Globals.accuracy + "\n\n\n", true);
					Alloy.Globals.androidgeofence.checkEnterOrExitFencing(Alloy.Globals.latitude, Alloy.Globals.longitude);
				}
				latlongArray = [];

			}
		}

	}
};

Titanium.Geolocation.addEventListener('location', locationCallback);

intervalHold2 = setInterval(function() {
	// Alloy.Globals.speed = 100;
	//
	// Alloy.Globals.androidgeofence.checkEnterOrExitFencing("22.74974686428765", "75.89383363723755");

	findLocation();
	updateGeoFence();
}, 15000);

function findLocation() {

	if (Titanium.Geolocation.locationServicesEnabled && Titanium.Network.online) {

		Titanium.Geolocation.getCurrentPosition(function(locationResult) {

			if (locationResult.success && locationResult.coords != null) {

				if (!isLocationOn) {
					//if (locationResult.coords.accuracy < minAccuracy) {
					Ti.API.info("CORD1 : " + locationResult.coords);
					isLocationOn = true;
					Alloy.Globals.latitude = locationResult.coords.latitude;
					Alloy.Globals.longitude = locationResult.coords.longitude;
					addlatlongActivityService(locationResult.coords.latitude, locationResult.coords.longitude);
					//}
				}

			} else {
				//alert(locationResult.error);
				Ti.API.info("Network is disabled1");
				isLocationOn = false;
			}
		});
	} else {
		Ti.API.info("Network is disabled2");
		isLocationOn = false;
	}
}

//Function for call the service to notify the backend about current location

function addlatlongActivityService(lat, longt) {
	var data = {};
	data.id = id;
	var SERVICE_ADD_LAT_LONG_ACTIVITY = Alloy.Globals.Constants.SERVICE_ADD_LAT_LONG_ACTIVITY;

	var PARAMS = "&id=" + id + "&latitude=" + lat + "&longitude=" + longt;
	if (Ti.Network.online) {

		Communicator.post(DOMAIN_URL + SERVICE_ADD_LAT_LONG_ACTIVITY + PARAMS, addlatlongActivityServiceCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_ADD_LAT_LONG_ACTIVITY + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function addlatlongActivityServiceCallback(e) {
	//Ti.API.info("addlatlongActivityServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {

				if (response.action_success == 'true') {

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error addlatlongActivityServiceCallback List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
}

function geofenceService() {

	var SERVICE_GET_LOCATION_SPEED = Alloy.Globals.Constants.SERVICE_GET_LOCATION_SPEED;

	if (Ti.Network.online) {

		Alloy.Globals.Communicator.get(Alloy.Globals.Constants.DOMAIN_URL + SERVICE_GET_LOCATION_SPEED, geofenceServiceCallback);
		Ti.API.info("URL : " + Alloy.Globals.Constants.DOMAIN_URL + SERVICE_GET_LOCATION_SPEED);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function geofenceServiceCallback(e) {
	//Ti.API.info("geofenceServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				if (response.action_success == 'true') {

					if (Ti.Platform.name == "android") {
						// Add keys to the hashmap

						Alloy.Globals.androidgeofence.drawPolygon(JSON.stringify(response));
						isDrawPoly = true;

						$.fenceVW1.visible = false;
						$.fenceVW.visible = false;

					}

				} else {
					Alloy.Globals.Alert("Fence not updated successfully. Please try again.");
				}
			} else {
				Alloy.Globals.Alert("Fence not updated successfully. Please try again.");
			}
		} catch(e) {

		}
	} else {
		Alloy.Globals.Alert("Fence not updated successfully. Please try again.");
	}

}

if (OS_ANDROID) {
	var enterFun = function(e) {
		//Ti.API.info("APP ENTER : flag " + flag + "\nRegion Speed " + JSON.stringify(e.region));
		//f1.write("flag : " + flag + "  e.Speed : " + e.Speed + "\n\n\n\n", true);

		if (isRegion != e.region) {
			if (!flag) {
				f1.write("APP ENTER :  :  " + Alloy.Globals.latitude + "  " + Alloy.Globals.longitude + "  " + Alloy.Globals.accuracy + "  REGION  " + e.region + "\n\n\n", true);
				f1.write("ENTER SPEED:  :  " + e.Speed + "\n\n\n", true);
				var enterMsg = "You have enter " + e.region + " region" + " and its speed limit is " + e.Speed + " kilometer per hours";
				isRegion = e.region;
				if (textToSpeech.isSpeaking()) {

					Ti.API.info("already speaking");
					return;
				}
				textToSpeech.startSpeaking({
					text : enterMsg
				});
				flag = true;
			}

		} else {
			if (flag) {
				if (Alloy.Globals.speed != "") {
					if (Alloy.Globals.speed > e.Speed) {
						//Ti.API.info("Sound Please");
						var speedLimitMsg = "You have crossed the speed limit. Please drive speed below " + e.Speed + " kilometer per hours";
						isRegion = e.region;
						if (textToSpeech.isSpeaking()) {

							Ti.API.info("already speaking");
							return;
						}
						textToSpeech.startSpeaking({
							text : speedLimitMsg
						});
						Alloy.Globals.speed = "";

					}

				}
			}

		}
		isRegion = e.region;

	};

	var exitFun = function(e) {
		//Ti.API.info("APP Exit : " + JSON.stringify(e));
		Ti.API.info("APP Exit FLAG : " + flag);

		if (flag) {
			if (isRegion != "") {
				isRegion = "";
				flag = false;
				Ti.API.info("APP Exit12345 : " + JSON.stringify(e));
				f1.write("APP Exit :  :  " + Alloy.Globals.latitude + "  " + Alloy.Globals.longitude + "  " + Alloy.Globals.accuracy + "\n\n\n", true);
				//f1.write("APP Exit11 :  :  " + JSON.stringify(e.region) + "\n\n\n", true);

				var str = "You have exited from the region. Now you can raise your speed";
				if (textToSpeech.isSpeaking()) {
					Ti.API.info("already speaking");
					return;
				}
				textToSpeech.startSpeaking({
					text : str,
				});

			}
		}
	};
	Alloy.Globals.androidgeofence.addEventListener("onEnter", enterFun);
	Alloy.Globals.androidgeofence.addEventListener("onExit", exitFun);
}

//Function for call the service to notify the backend about current location

function addlocationMarkerService(lat, longt, name) {

	var SERVICE_ADD_LOCATION_MARKER = Alloy.Globals.Constants.SERVICE_ADD_LOCATION_MARKER;
	var PARAMS = "&id=" + id + "&latitude=" + lat + "&longitude=" + longt + "&location_name=" + name;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_ADD_LOCATION_MARKER + PARAMS, addlocationMarkerServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_ADD_LOCATION_MARKER + PARAMS);

	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
		if (saveBtn) {
			saveBtn.focusable = true;
		}
	}
}

function addlocationMarkerServiceCallback(e) {
	//Ti.API.info("addlocationMarkerServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				//Ti.API.info('response.action_success = ' + response);
				if (response.action_success == 'true') {
					var locationMarkerWin = Alloy.createController("LocationMarker", response).getView();
					if (OS_IOS) {
						Alloy.Globals.navWindow.openWindow(locationMarkerWin, {
							animated : true
						});

					} else {
						locationMarkerWin.open();
					}

					Alloy.Globals.currentWindow = locationMarkerWin;
					Alloy.Globals.islocationMarker = "1";
					// if (win1) {
					// win1.close();
					// win1 = null;
					// }

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error addlocationMarkerServiceCallback List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();
	if (saveBtn) {
		saveBtn.focusable = true;
	}
}

//Function for call the service to share the user location current location

function shareLocationService(contact) {

	var SERVICE_SHARE_LOCATION = Alloy.Globals.Constants.SERVICE_SHARE_LOCATION;
	var PARAMS = "&id=" + id + "&contact=" + contact;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_SHARE_LOCATION + PARAMS, shareLocationServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_SHARE_LOCATION + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function shareLocationServiceCallback(e) {
	//	Ti.API.info("shareLocationCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				//Ti.API.info('response.action_success = ' + response);
				if (response.action_success == 'true') {

					Alloy.Globals.Alert(response.response_message);
					// if (win1) {
					// win1.close();
					// win1 = null;
					// }
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error addlocationMarkerServiceCallback List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();
	if (saveBtn) {
		saveBtn.focusable = true;
	}
}

//Function for call the service to notify the backend about current location

function lastLocationService() {

	var SERVICE_GET_LAST_LOCATION = Alloy.Globals.Constants.SERVICE_GET_LAST_LOCATION;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_LAST_LOCATION + PARAMS, lastLocationServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_LAST_LOCATION + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function lastLocationServiceCallback(e) {
	//Ti.API.info("lastLocationService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {

				if (response.action_success == 'true') {

					var locationMarkerWin = Alloy.createController("LocationMarker", response.data[0]).getView();
					if (OS_IOS) {
						Alloy.Globals.navWindow.openWindow(locationMarkerWin, {
							animated : true
						});
						Alloy.Globals.islocationMarker = "1";
					} else {
						locationMarkerWin.open();
					}

					Alloy.Globals.currentWindow = locationMarkerWin;

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error addlocationMarkerServiceCallback List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();
}

var advertiseInterval = null;
var backgroundService = null;
advertiseInterval = setInterval(function() {
	getAdvertiseService();
}, 1800000);
//Function for call the service to show the Advertisment

function getAdvertiseService() {

	var SERVICE_GET_ADVERTISE = Alloy.Globals.Constants.SERVICE_GET_ADVERTISE;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {

		Communicator.get(DOMAIN_URL + SERVICE_GET_ADVERTISE + PARAMS, getAdvertiseServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_ADVERTISE + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function getAdvertiseServiceCallback(e) {
	Ti.API.info("getAdvertiseService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				//Ti.API.info('response.action_success = ' + response);
				if (response.action_success == 'true') {
					if (Alloy.Globals.advertiseWin) {
						Alloy.Globals.advertiseWin.close();
						Alloy.Globals.advertiseWin = null;
					}
					if (Alloy.Globals.isLogin == false) {
						var win = Alloy.createController("AdvertisementScreen", response.data).getView();
						Alloy.Globals.advertiseWin = win;
						win.open();
					}

				} else {
					Ti.API.info(response.response_message);
				}
			} else {
				Ti.API.info("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error getAdvertiseServiceCallback List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		Ti.API.info(e.message);
	}
}

var win1 = null;
var saveBtn = null;
function openAddAnnotationWin() {

	/*
	 win1 = Ti.UI.createWindow({
	 backgroundColor : "transparent",
	 navBarHidden : true,
	 modal : (OS_IOS) ? false : true,
	 theme : "Theme.Titanium"

	 });
	 var scrollView = Ti.UI.createScrollView({
	 top : 0,
	 bottom : 0
	 });
	 win1.add(scrollView);
	 var customDialog = Ti.UI.createView({
	 height : 160,
	 width : "85%",
	 backgroundColor : "#fff",
	 borderRadius : 5
	 });
	 scrollView.add(customDialog);

	 var titleLabel = Ti.UI.createLabel({
	 top : 10,
	 text : "Road Safety",
	 color : "#000",
	 font : {
	 fontSize : 16,
	 //fontWeight : "bold"
	 }
	 });
	 customDialog.add(titleLabel);

	 var txtfld = Ti.UI.createTextField({
	 left : 10,
	 right : 10,
	 borderColor : "#ededed",
	 borderWidth : 1,
	 hintTextColor : "#565656",
	 height : 40,
	 font : {
	 fontSize : 15
	 },
	 paddingLeft : 10,
	 name : "tf",
	 hintText : "Marker Name",
	 color : "#565656",
	 returnKeyType : Titanium.UI.RETURNKEY_DONE
	 });
	 customDialog.add(txtfld);

	 var cancelBtn = Ti.UI.createButton({
	 bottom : 0,
	 left : 0,
	 width : "49%",
	 height : 40,
	 selectedColor : "gray",
	 backgroundImage : "none",
	 color : "#fff",
	 title : "Cancel",
	 color : "#000"
	 });
	 ;
	 customDialog.add(cancelBtn);

	 cancelBtn.addEventListener('click', function() {
	 win1.close();
	 win1 = null;
	 });
	 saveBtn = Ti.UI.createButton({
	 bottom : 0,
	 right : 0,
	 //backgroundColor:"#2941AE",
	 backgroundImage : "none",
	 selectedColor : "gray",
	 color : "#fff",
	 width : "49%",
	 height : 40,
	 title : "Save",
	 color : "#000"
	 });
	 customDialog.add(saveBtn);*/

	if (OS_IOS) {
		var addAnnotationDialog = Ti.UI.createAlertDialog({
			title : "Road Safety",
			style : Titanium.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames : ["Save", "Cancel"],
			cancel : 1,
			placeholder : "Marker Name",
			keyboardAppearance : Titanium.UI.KEYBOARD_APPEARANCE_DARK
		});
		addAnnotationDialog.addEventListener("click", function(e) {
			//	Ti.API.info("ETEXT " + e.text);
			if (e.index == 0) {
				if (e.text != '' && e.text.trim().length > 0) {

					if ((Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) && isLocationOn) {

						addlocationMarkerService(Alloy.Globals.latitude, Alloy.Globals.longitude, e.text);
					} else {
						isLocationOn = false;
						Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
					}
				} else {
					Alloy.Globals.Alert("Please enter marker name");
				}
			}
		});
		addAnnotationDialog.show();
	} else {
		var customDialog = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
		});

		var txtfld = Ti.UI.createTextField({
			top : 10,
			left : 15,
			right : 15,

			height : 40,
			font : {
				fontSize : 15
			},
			paddingLeft : 10,
			hintText : "Marker Name",
			hintTextColor : "#565656",
			color : "#565656",
			name : "tf",
			backgroundColor : "white",
			//keyboardType : Titanium.UI.KEYBOARD_PHONE_PAD,
			returnKeyType : Titanium.UI.RETURNKEY_DONE
		});
		customDialog.add(txtfld);

		var addAnnotationDialog = Ti.UI.createAlertDialog({
			title : "Road Safety",
			androidView : customDialog,
			buttonNames : ["Save", "Cancel"],
			cancel : 1,
		});
		addAnnotationDialog.addEventListener("click", function(e) {
			if (e.index == 0) {
				if (txtfld.value != '' && txtfld.value.trim().length > 0) {
					//Ti.API.info("isLocationOn " + isLocationOn);
					if ((Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) && isLocationOn) {
						addlocationMarkerService(Alloy.Globals.latitude, Alloy.Globals.longitude, txtfld.value);

					} else {
						isLocationOn = false;
						Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
					}

				} else {
					Alloy.Globals.Alert("Please enter marker name");

				}
			}

		});
		addAnnotationDialog.show();
	}

	/*
	 win1.addEventListener('click', function(e) {
	 if (e.source.name != "tf") {
	 txtfld.blur();
	 }
	 });
	 txtfld.addEventListener('return', function() {
	 saveBtn.fireEvent("click");
	 });
	 win1.open();*/

}

function openAddContactWin() {
	/*
	 win1 = Ti.UI.createWindow({
	 backgroundColor : "transparent",
	 navBarHidden : true,
	 modal : (OS_IOS) ? false : true,
	 theme : "Theme.Titanium"
	 });
	 var mainView = Ti.UI.createScrollView({
	 top : 0,
	 bottom : 0,

	 });
	 win1.add(mainView);
	 var customDialog = Ti.UI.createView({
	 height : 160,
	 width : "85%",
	 backgroundColor : "#fff",
	 borderRadius : 5
	 });
	 mainView.add(customDialog);

	 var titleLabel = Ti.UI.createLabel({
	 top : 10,
	 text : "Road Safety",
	 color : "#000",
	 font : {
	 fontSize : 16,
	 //fontWeight : "bold"
	 }
	 });
	 customDialog.add(titleLabel);

	 var txtfld = Ti.UI.createTextField({
	 left : 10,
	 right : 10,
	 borderColor : "#ededed",
	 borderWidth : 1,
	 height : 40,
	 font : {
	 fontSize : 15
	 },

	 paddingLeft : 10,
	 hintText : "Contact",
	 hintTextColor : "#565656",
	 color : "#565656",
	 name : "tf",
	 keyboardType : Titanium.UI.KEYBOARD_PHONE_PAD,
	 returnKeyType : Titanium.UI.RETURNKEY_DONE
	 });
	 customDialog.add(txtfld);

	 var cancelBtn = Ti.UI.createButton({
	 bottom : 0,
	 left : 0,
	 width : "49%",
	 height : 40,
	 selectedColor : "gray",
	 backgroundImage : "none",
	 title : "Cancel",
	 color : "#000"
	 });
	 ;
	 customDialog.add(cancelBtn);

	 cancelBtn.addEventListener('click', function() {
	 win1.close();
	 win1 = null;
	 });
	 var saveBtn = Ti.UI.createButton({
	 bottom : 0,
	 right : 0,
	 width : "49%",
	 height : 40,
	 selectedColor : "gray",
	 backgroundImage : "none",
	 title : "Share",
	 color : "#000",
	 focusable : true
	 });
	 customDialog.add(saveBtn);*/

	if (OS_IOS) {
		var shareContactDialog = Ti.UI.createAlertDialog({
			title : "Road Safety",
			style : Titanium.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames : ["Share", "Cancel"],
			cancel : 1,
			placeholder : "Contact",
			keyboardType : Titanium.UI.KEYBOARD_TYPE_NUMBER_PAD,
			keyboardAppearance : Titanium.UI.KEYBOARD_APPEARANCE_DARK
		});
		shareContactDialog.addEventListener("click", function(e) {
			if (e.index == 0) {
				if (e.text != '' && e.text.trim().length > 0) {
					if (e.text.trim().length >= 8 && e.text.trim().length <= 15) {
						if (e.text > 0) {
							shareLocationService(e.text);
						} else {
							Alloy.Globals.Alert("Please enter valid contact number");
						}
					} else {
						Alloy.Globals.Alert("Contact number can not less 8 characters and exceed 15 characters in length");
					}
				} else {
					Alloy.Globals.Alert("Please enter contact number");

				}
			}

		});
		shareContactDialog.show();
	} else {
		var customDialog = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
		});

		var txtfld = Ti.UI.createTextField({
			left : 15,
			top : 10,
			right : 15,

			height : 40,
			font : {
				fontSize : 15
			},
			paddingLeft : 10,
			hintText : "Contact",
			hintTextColor : "#565656",
			color : "#565656",
			name : "tf",
			backgroundColor : "white",
			keyboardType : Titanium.UI.KEYBOARD_PHONE_PAD,
			returnKeyType : Titanium.UI.RETURNKEY_DONE
		});
		customDialog.add(txtfld);
		var shareContactDialog = Ti.UI.createAlertDialog({
			title : "Road Safety",
			androidView : customDialog,
			buttonNames : ["Share", "Cancel"],
			cancel : 1,

		});
		shareContactDialog.addEventListener("click", function(e) {
			if (e.index == 0) {
				if (txtfld.value != '' && txtfld.value.trim().length > 0) {
					if (txtfld.value > 0) {

						if (txtfld.value.trim().length >= 8 && txtfld.value.trim().length <= 15) {

							shareLocationService(txtfld.value);

						} else {

							Alloy.Globals.Alert("Contact number can not less 8 characters and exceed 15 characters in length");
						}
					} else {
						Alloy.Globals.Alert("Please enter valid contact number");

					}
				} else {
					Alloy.Globals.Alert("Please enter contact number");

				}
			}

		});
		shareContactDialog.show();
	}

	/*
	 saveBtn.addEventListener("click", function() {
	 if (saveBtn.focusable == false) {
	 return;
	 }
	 saveBtn.focusable = false;
	 if (txtfld.value != '' && txtfld.value.trim().length > 0) {
	 if (txtfld.value.trim().length >= 8 && txtfld.value.trim().length <= 15) {
	 if (txtfld.value > 0) {

	 shareLocationService(txtfld.value);
	 saveBtn.focusable = true;

	 } else {
	 Alloy.Globals.Alert("Please enter valid contact number");

	 saveBtn.focusable = true;

	 }
	 } else {
	 Alloy.Globals.Alert("Contact number can not less 8 characters and exceed 15 characters in length");

	 saveBtn.focusable = true;

	 }
	 } else {
	 Alloy.Globals.Alert("Please enter contact number");
	 saveBtn.focusable = true;
	 }

	 });*/

	/*
	 win1.addEventListener('click', function(e) {
	 if (e.source.name != "tf") {
	 txtfld.blur();
	 }
	 });
	 txtfld.addEventListener('return', function() {
	 saveBtn.fireEvent("click");
	 });
	 win1.open();*/

}

/*
 var client = Titanium.Network.createHTTPClient().clearCookies("'https://login.facebook.com'");
 if (OS_ANDROID) {
 Titanium.Network.removeAllSystemCookies();
 Ti.Network.createHTTPClient().clearCookies('https://mail.google.com/mail/u/0/?logout&hl=en');
 if (OS_ANDROID) {
 Titanium.Network.removeAllSystemCookies();
 }
 }*/

if (OS_ANDROID) {
	function start() {
		//Ti.API.info("RESUME 2" + advertiseInterval);
		if (advertiseInterval == null) {
			advertiseInterval = setInterval(function() {
				getAdvertiseService();
			}, 1800000);
		}
		Titanium.Android.NotificationManager.cancelAll();
	}

	function stop() {
		Ti.API.info("PAUSE " + advertiseInterval);
		if (advertiseInterval != null) {
			clearInterval(advertiseInterval);
			advertiseInterval = null;
		}
	}

	wasInForeGround = true;
	//Ti.API.info("platformTools " + platformTools);
	backgroundService = setInterval(function() {
		var isInForeground = Alloy.Globals.platformTools.isInForeground();
		//fTi.API.info("isInForeground" + isInForeground + "   wasInForeGround " + wasInForeGround);
		if (wasInForeGround !== isInForeground) {
			if (isInForeground) {
				start();
			} else {
				stop();
			}
			//Ti.App.fireEvent( isInForeground ? 'start' : 'stop');

			wasInForeGround = isInForeground;
		}
		// if (Alloy.Globals.deviceToken == "" || Alloy.Globals.deviceToken == null) {
		// Ti.API.info("TRY TO GET DEVICE TOKEN");
		// Alloy.Globals.registerPushNotification(function(e) {
		// //Ti.API.info("deviceToken1 " + e);
		// Alloy.Globals.deviceToken = e;
		// updatedevicetokenService();
		// });
		// }
	}, 3000);
}

function distance(lat1, lon1, lat2, lon2, time1, time2, unit) {
	var radlat1 = Math.PI * lat1 / 180;
	var radlat2 = Math.PI * lat2 / 180;
	var theta = lon1 - lon2;
	var radtheta = Math.PI * theta / 180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;

	var differTime = time1 - time2;
	Ti.API.info('Differ Time : ' + differTime);

	differTime = ((differTime / 1000) / 3600);

	if (unit == "K") {
		dist = dist * 1.609344;
		var speed = dist / differTime;
		//f1.write("DISTANCE : " + dist + "    Time : " + differTime + "  Speed : " + speed + "\n\n\n", true);
		Ti.API.info("DISTANCE " + dist + " Speed " + speed);
		//Alloy.Globals.speed = speed;

	}
	if (unit == "N") {
		dist = dist * 0.8684;
	} else if (unit == "M") {
		dist = dist * 1000;
	}
	return dist;
}

function getSpeed(lat1, lon1, lat2, lon2, time1, time2, unit) {
	var radlat1 = Math.PI * lat1 / 180;
	var radlat2 = Math.PI * lat2 / 180;
	var theta = lon1 - lon2;
	var radtheta = Math.PI * theta / 180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;

	var differTime = time1 - time2;
	Ti.API.info('Differ Time : ' + differTime);

	differTime = ((differTime / 1000) / 3600);

	if (unit == "K") {
		dist = dist * 1.609344;
		var speed = dist / differTime;
		///f1.write("DISTANCE : " + dist + "    Time : " + differTime + "  Speed : " + speed + "\n\n\n", true);
		//Ti.API.info("DISTANCE " + dist + " Speed " + speed);
		Alloy.Globals.speed = speed;

	}
	if (unit == "N") {
		dist = dist * 0.8684;
	} else if (unit == "M") {
		dist = dist * 1000;
	}
	return speed;
}

setTimeout(function(e) {
	if (Ti.Geolocation.locationServicesEnabled) {
	} else {

		Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
	}
}, 2000);
//Function for udate device token

function updatedevicetokenService() {

	var SERVICE_UPDATE_DEVICETOKEN = Alloy.Globals.Constants.SERVICE_UPDATE_DEVICETOKEN;
	var PARAMS = "&id=" + id + "&device_id=" + Alloy.Globals.deviceToken;
	if (Ti.Network.online) {
		Communicator.get(DOMAIN_URL + SERVICE_UPDATE_DEVICETOKEN + PARAMS, updatedevicetokenCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_UPDATE_DEVICETOKEN + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function updatedevicetokenCallback(e) {
	Ti.API.info("SERVICE_UPDATE_DEVICETOKEN response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {

				if (response.action_success == 'true') {

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {
			Ti.API.info('Error addlocationMarkerServiceCallback List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
}

//Function for udate device token

function updateGeoFence() {

	var SERVICE_UPDATE_GEO_FENCE = Alloy.Globals.Constants.SERVICE_UPDATE_GEO_FENCE;
	//var PARAMS = "&id=" + id + "&device_id=" + Alloy.Globals.deviceToken;
	if (Ti.Network.online) {
		Communicator.get(DOMAIN_URL + SERVICE_UPDATE_GEO_FENCE, updateGeoFenceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_UPDATE_GEO_FENCE);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

var preDate = null;
function updateGeoFenceCallback(e) {
	//alert("updateGeoFenceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {

				if (response.action_success == 'true') {

					var n = response.last_modified_date;
					if (preDate) {
						var p = preDate;
						var newDate = new Date(n);
						newDate = newDate.getTime();
						var preDate1 = new Date(p);

						preDate1 = preDate1.getTime();
						if (newDate > preDate1) {
							$.fenceVW1.visible = true;
							$.fenceVW.visible = true;

						} else {
							//Ti.API.info('NHI gaya');
						}
					}
					preDate = response.last_modified_date;
					$.dateLbl.text = response.last2_modified_date + "  " + "Size: " + response.size;
				} else {
					Ti.API.info(response.response_message);
				}
			} else {
				Ti.API.info("No data received from server");
			}
		} catch(e) {
			Ti.API.info('Error updateGeoFenceCallback List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
}

geofenceService();
updateGeoFence();

function geofenceServiceone() {

	var SERVICE_GET_LOCATION_SPEED = Alloy.Globals.Constants.SERVICE_GET_LOCATION_SPEED;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Alloy.Globals.Communicator.get(Alloy.Globals.Constants.DOMAIN_URL + SERVICE_GET_LOCATION_SPEED, geofenceServiceoneCallback);
		Ti.API.info("URL : " + Alloy.Globals.Constants.DOMAIN_URL + SERVICE_GET_LOCATION_SPEED);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function geofenceServiceoneCallback(e) {
	//Ti.API.info("geofenceServiceoneCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				if (response.action_success == 'true') {

					// if (Ti.Platform.name == "android") {
					// Add keys to the hashmap

					Alloy.Globals.androidgeofence.drawPolygon(JSON.stringify(response));
					isDrawPoly = true;
					var toast = Ti.UI.createNotification({
						message : "Fence update successfully",
						duration : Ti.UI.NOTIFICATION_DURATION_LONG
					});
					toast.show();

					$.fenceVW1.visible = false;
					$.fenceVW.visible = false;

					// }

				} else {
					//Alloy.Globals.Alert(response.response_message);
					var toast = Ti.UI.createNotification({
						message : response.response_message,
						duration : Ti.UI.NOTIFICATION_DURATION_LONG
					});
					toast.show();
				}
			} else {
				Alloy.Globals.Alert("Fence not updated successfully. Please try again.");
			}
		} catch(e) {
			Ti.API.info("ERROR ::geofenceServiceoneCallback :: " + e.error);
		}
	} else {
		Alloy.Globals.Alert("Fence not updated successfully. Please try again.");
	}
	Alloy.Globals.LoadingScreen.close();

}
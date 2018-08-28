// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

Alloy.Globals.currentWindow = null;
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
Alloy.Globals.storeNameTxt = $.storeNameTxt;
$.storeNameTxt.text = Alloy.Globals.store_name;
Alloy.Globals.openRegisterLbl = $.opencloseRegister;
$.employname.text = Ti.App.Properties.getObject("loginResponse").result[0].fullname;

if (Ti.App.Properties.getObject("isRegisterOpened") == 1) {
	Alloy.Globals.openRegisterLbl.text = (L("close_register_txt"));
} else {
	Alloy.Globals.openRegisterLbl.text = (L("open_registertxt"));
}

function openFunc(e) {
	$.slidermenu.animate({
		duration : 200,
		opacity : 1,
	});

	$.versionLbl.text = L("VERSION") + Titanium.App.version;
}

Ti.API.info('Alloy.Globals.homedrawerWidth = ' + Alloy.Globals.homedrawerWidth);
$.headerVw.width = Alloy.Globals.homedrawerWidth;
/*
 * Function for opening windows from left drawer
 */
function leftMenuOptionSelected(e) {
	focus = false;
	if ($.sliderTable.focusable == false) {
		return;
	}
	$.sliderTable.focusable = false;

	if (Alloy.Globals.currentWindow != null) {
		try {
			Alloy.Globals.currentWindow.finalize();
		} catch(e) {
			Ti.API.info('In catch: ' + e.message);
		}
	}
	CurrentWindow = "fromTab";

	switch(e.index) {
	case 0:

		if (Ti.App.Properties.getObject("isRegisterOpened") == 1) {
			if (role_permission.indexOf("close_register") != -1) {
				if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "closeRegister") {
					var CloseRegisterWin = Alloy.createController("CloseRegisterScreen");
					Alloy.Globals.closeRegisterObj = CloseRegisterWin;
					Alloy.Globals.drawer.centerWindow = CloseRegisterWin.closeRegister;
					Alloy.Globals.currentWindow = CloseRegisterWin;
				}
			} else {
				Alloy.Globals.Notifier.show(L("validation_close_permission"));
			}
		} else {
			if (role_permission.indexOf("open_register") != -1) {
				if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "openRegister") {
					var openRegisterWin = Alloy.createController("OpenRegisterScreen");
					Alloy.Globals.openRegisterObj = openRegisterWin;
					Alloy.Globals.drawer.centerWindow = openRegisterWin.openRegister;
					Alloy.Globals.currentWindow = openRegisterWin;
				}
			} else {
				Alloy.Globals.Notifier.show(L("validation_open_permission"));
			}
		}
		break;
	case 1:

		Alloy.Globals.isFrom = 0;

		// if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "profileWindow") {
		// var clockinScreen = Alloy.createController("ClockInOutScreen");
		// Alloy.Globals.drawer.centerWindow = clockinScreen.navWindow;
		// Alloy.Globals.currentWindow = clockinScreen;
		// }

		var clockinDialogWin = Alloy.createController("ClockInOutDialogScreen", 1).getView();
		clockinDialogWin.open();

		break;
	case 2:

		Alloy.Globals.isFrom = 0;

		// if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "profileWindow") {
		// var clockinScreen = Alloy.createController("ClockInOutScreen");
		// Alloy.Globals.drawer.centerWindow = clockinScreen.navWindow;
		// Alloy.Globals.currentWindow = clockinScreen;
		// }

		var clockinDialogWin = Alloy.createController("ClockInOutDialogScreen", 2).getView();
		clockinDialogWin.open();

		break;
	case 3:

		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "tillManagemntWindow") {
			if (role_permission.indexOf("till_management") != -1) {
				var tillManagementScreen = Alloy.createController("TillManagementScreen");
				Alloy.Globals.drawer.centerWindow = tillManagementScreen.tillManagemntWindow;
				Alloy.Globals.currentWindow = tillManagementScreen;
			} else {
				Alloy.Globals.Notifier.show(L("validation_till_mgmt_permission"));
			}
		}
		break;
	case 4:

		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name == "tabgroup") {
			Alloy.Globals.openSelectedTabFromSlideMenu(1);
		} else {
			Alloy.Globals.drawer.centerWindow = Alloy.Globals.homeObj.tabgroup;
			Alloy.Globals.openSelectedTabFromSlideMenu(1);
			Alloy.Globals.currentWindow = Alloy.Globals.homeObj.tabgroup;
		}

		break;
	case 5:
		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "settingScreen") {
			var settingScreen = Alloy.createController("SettingScreen");
			Alloy.Globals.drawer.centerWindow = settingScreen.settingScreen;
			Alloy.Globals.currentWindow = settingScreen;
		}
		break;
	case 6:
		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "profileWindow") {
			var profileScreen = Alloy.createController("ProfileTabScreen");
			Alloy.Globals.drawer.centerWindow = profileScreen.profileWindow;
			Alloy.Globals.currentWindow = profileScreen;
		}
		break;
	case 7:
		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "GiftCardScreen") {
			var giftCardScreen = Alloy.createController("GiftCardScreen");
			Alloy.Globals.drawer.centerWindow = giftCardScreen.GiftCardScreen;
			Alloy.Globals.currentWindow = giftCardScreen;
		}
		break;
	case 8:
		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name == "tabgroup") {
			Alloy.Globals.openSelectedTabFromSlideMenu(3);
		} else {
			Alloy.Globals.drawer.centerWindow = Alloy.Globals.homeObj.tabgroup;
			Alloy.Globals.openSelectedTabFromSlideMenu(3);
			Alloy.Globals.currentWindow = Alloy.Globals.homeObj.tabgroup;
		}
		break;
	case 9:
		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name == "tabgroup") {
			Alloy.Globals.openSelectedTabFromSlideMenu(0);
		} else {
			Alloy.Globals.drawer.centerWindow = Alloy.Globals.homeObj.tabgroup;
			Alloy.Globals.openSelectedTabFromSlideMenu(0);
			Alloy.Globals.currentWindow = Alloy.Globals.homeObj.tabgroup;
		}
		break;
	case 10:
		CurrentWindow = "newOrderScreen";
		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name == "tabgroup") {
			Alloy.Globals.openSelectedTabFromSlideMenu(2);
		} else {
			Alloy.Globals.drawer.centerWindow = Alloy.Globals.homeObj.tabgroup;
			Alloy.Globals.openSelectedTabFromSlideMenu(2);
			Alloy.Globals.currentWindow = Alloy.Globals.homeObj.tabgroup;
		}
		break;
	case 11:

		if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name != "viewNotification") {
			var redeemScreen = Alloy.createController("ViewNotification");
			Alloy.Globals.drawer.centerWindow = redeemScreen.viewNotification;
			Alloy.Globals.currentWindow = redeemScreen;
		}
		break;

	case 12:
		//if (Alloy.Globals.currentWindow == null || Alloy.Globals.currentWindow.name == "RedeemLoyaltyScreen") {
		// var redeemScreen = Alloy.createController("RedeemLoyaltyScreen");
		// Alloy.Globals.drawer.centerWindow = redeemScreen.RedeemLoyaltyScreen;
		// Alloy.Globals.currentWindow = redeemScreen;
		//}
		Ti.Platform.openURL("https://www.cdnsolutionsgroup.com/gongcha/public");
		break;

	case 13:
		showLogOutDialog();
		break;

	}

	Alloy.Globals.openLeft();

	setTimeout(function(e) {
		$.sliderTable.focusable = true;
		focus = true;
	}, 500);
}

function showLogOutDialog() {
	dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : "Are you sure you want to logoff?",
		title : "Gongcha POS"
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			dialog.hide();
		} else {
			Alloy.Globals.logout();
			//Alloy.Globals.logoutService("manager");

		}
	});
	dialog.show();
}

// var a = "";
// Alloy.Globals.logoutService = function(type) {
// a = type;
// var data = {};
// if (type == "manager") {
// data.user_id = Ti.App.Properties.getString("manager_id");
// } else {
// data.user_id = Alloy.Globals.employee_id;
// }
//
// data.store_id = Alloy.Globals.store_id;
// Ti.API.info('DATA ' + JSON.stringify(data));
// var SERVICE_LOGOUT = Alloy.Globals.Constants.SERVICE_LOGOUT;
// if (Ti.Network.online) {
// Alloy.Globals.LoadingScreen.open();
// Communicator.post(DOMAIN_URL + SERVICE_LOGOUT, logoutServiceCallback, data);
// Ti.API.info('URL ' + DOMAIN_URL + SERVICE_LOGOUT);
//
// } else {
// Alloy.Globals.Notifier.show(L("internat_connection_message"));
// }
// };
//
// function logoutServiceCallback(e) {
// if (e.success) {
// try {
// Ti.API.info('response ' + e.response);
// var response = JSON.parse(e.response);
//
// if (response != null) {
//
// Ti.API.info('response.action_success = ' + response.response_code);
//
// if (response.response_code == '1') {
//
// Alloy.Globals.managerLogout();
//
//
// } else {
// Alloy.Globals.Notifier.show(response.responseMessage);
// }
// } else {
// Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
// }
// } catch(e) {
// Ti.API.info('Error Logout :: ' + e.message);
// tracker.addException({
// description : "Logout: " + e.message,
// fatal : false
// });
// }
// } else {
// Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
// }
// Alloy.Globals.LoadingScreen.close();
// }

Alloy.Globals.logout = function() {
	try {
		Alloy.Globals.drawer.close();
		Alloy.Globals.isCheckoutOpen = false;
		Ti.App.Properties.setObject("loginResponse", null);
		Alloy.Globals.currentWindow = null;

		if (Alloy.Globals.popover) {
			Alloy.Globals.popover.hide();
		}

		Alloy.Globals.employee_id = "";
		//Alloy.Globals.store_id = "";
		Alloy.Globals.fullname = "";
		Alloy.Globals.userimage = "";
		Alloy.Globals.store_name = "";
		if (Alloy.Globals.syncInterval) {
			clearInterval(Alloy.Globals.syncInterval);
			Alloy.Globals.syncInterval = null;
		}
		Ti.App.Properties.setObject("profileData", null);
		var loginObj = Alloy.createController("ClockInOutScreen").getView();
		loginObj.open();
		bonjourBrowser.clearBuffer();
		bonjourBrowser.sendData("deleteCart");
	} catch(e) {
		Ti.API.info('Error logout() ' + e.message);
	}
};

// Alloy.Globals.managerLogout = function() {
// try {
// Alloy.Globals.drawer.close();
// Alloy.Globals.isCheckoutOpen = false;
// Ti.App.Properties.setObject("loginResponse", null);
// Ti.App.Properties.setObject("profileData", null);
// Ti.App.Properties.setObject("storeManagerLoginResponse", null);
// Alloy.Globals.currentWindow = null;
// var loginObj = Alloy.createController("LoginScreen").getView();
// loginObj.open();
//
// if (Alloy.Globals.popover) {
// Alloy.Globals.popover.hide();
// }
//
// Alloy.Globals.employee_id = "";
// Alloy.Globals.store_id = "";
// Alloy.Globals.fullname = "";
// Alloy.Globals.userimage = "";
// Alloy.Globals.store_name = "";
// if (Alloy.Globals.syncInterval) {
// clearInterval(Alloy.Globals.syncInterval);
// Alloy.Globals.syncInterval = null;
// }
// } catch(e) {
// Ti.API.info('Error logout() ' + e.message);
// }
// };

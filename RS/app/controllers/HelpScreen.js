var args = arguments[0] || {};

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var id = Ti.App.Properties.getString("id");

// XML Define function for close the window on back press
function closeHelpFun(e) {
	$.HelpScreen.close();
}

// XML Define open notification function
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
	notificationWin.oldWin = $.HelpScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
}

// XML Define open Panic screen function
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
			panicScreen.oldWin = $.HelpScreen;
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

/*
 * Webservice function for getHelpDetail. Its define via XML.
 */
function getHelpService() {

	var SERVICE_GET_HELP_DETAIL = Alloy.Globals.Constants.SERVICE_GET_HELP_DETAIL;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_HELP_DETAIL, getHelpServiceServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_HELP_DETAIL);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};
function getHelpServiceServiceCallback(e) {
	Ti.API.info("getHelpServiceServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {

					Ti.API.info('HELP : ' + JSON.stringify(response.page_detail.pageContent));
					//$.webview.html = '<html><head><style type="text/css">@font-face{} body, div, *{text-align:justify;}</style><meta name="viewport" content="height=device-height, width=device-width, user-scalable=no"/></head><body">' + response.page_detail.pageContent + '</body></html>';
					$.webview.html = '<html><head><style type="text/css">@font-face{} body, div, *{font-family:Helvetica LT; text-align:justify;}</style><meta name="viewport" content="height=device-height, width=device-width, user-scalable=no"/></head><body style="overflow-y:hidden !important;">' + response.page_detail.pageContent + '</body></html>';
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error getHelpServiceServiceCallback :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();

}
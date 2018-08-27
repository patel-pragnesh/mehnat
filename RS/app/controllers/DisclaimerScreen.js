var args = arguments[0] || {};

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var id = Ti.App.Properties.getString("id");

//var str = '<div id="content-header" class="col col9"><h1>Privacy policy and disclaimer</h1></div><div id="content-main" class="col col5"><h2>Disclaimer</h2><p>Road Safety Scotland (RSS) seeks to ensure that the information published on its websites is up to date and accurate. However, the information on the websites does not constitute legal or professional advice and RSS cannot accept any liability for actions arising from its use. RSS cannot be held responsible for the contents of any pages referenced by an external link.</p><p>Any personal data collected through RSS websites will be treated as confidential in line with the principles of the Data Protection Act 1998.</p><h2>Cookies and website traffic analysis</h2><p>When users enter some RSS websites their computers will automatically be issued with ‘cookies’. Cookies are text files which identify users computers to RSS server. The website then creates ‘session’ cookies to store some of the preferences of users moving around the website, e.g. retaining a text-only preference. Cookies in themselves do not identify individual users but identify only the computer used and they are deleted on departure from the website.</p><p>Many websites do this to track traffic flows, whenever users visit those websites.</p><p>Some RSS websites use third-party cookies to measure use of the website, including number of visitors, how frequently pages are viewed, and the city and country of origin of users. This helps to determine what is popular and can influence future content and development. For this purpose, RSS uses Google Analytics, to measure and analyse usage of the website. The information collected by RSS will include IP Address, pages visited, browser type and operating system. <strong>The data will not be used to identify any user personally</strong>.</p><p>Users have the opportunity to set their computers to accept all cookies, to notify them when a cookie is issued, or not to receive cookies at any time. The last of these means that certain personalised services cannot then be provided to that user.</p><h2>Log files</h2><p>Log files stored on RSS’ web server allow the recording and analysis of users use of the website. Log files do not contain any personal information.</p><h2>Copyright</h2><p>The online material provided by RSS may be reproduced free of charge for educational non-commercial purposes provided that the source is acknowledged, and that it is reproduced accurately and not used in a misleading context.</p><p>This permission does not extend to any material on the RSS websites that is identified as being the copyright of a third party. You must obtain authorisation to reproduce such material from the copyright holders concerned.</p><p>Should you wish to re-publish (as opposed to photocopy) any of the RSS copyright material please contact <a href="mailto:enquiries@roadsafetyscotland.org.uk">enquiries@roadsafetyscotland.org.uk</a> to obtain permission.</p><h2></div>';

//$.webview.html = '<html><head><style type="text/css">@font-face{} body, div, *{font-family:Helvetica LT; text-align:justify;}</style><meta name="viewport" content="height=device-height, width=device-width, user-scalable=no"/></head><body style="overflow-y:hidden !important;">' + str + '</body></html>';

// XML Define function for close the window on back press
function closeDisclaimerFun(e) {
	$.DisclaimerScreen.close();
}

// XML Define function for close the window on back press
function openNotification(e) {
	if (Alloy.Globals.isContact == 1) {
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
		notificationWin.oldWin = $.DisclaimerScreen;
		Alloy.Globals.currentWindow = notificationWin;
		setTimeout(function(e) {
			$.notificationBtn.focusable = true;
		}, 2000);

	} else {
		Alloy.Globals.Alert("Please add emergency contact first");
	}
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
			panicScreen.oldWin = $.DisclaimerScreen;
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
function getDisclaimerService() {

	var SERVICE_GET_DISCLAIMER_POLICY = Alloy.Globals.Constants.SERVICE_GET_DISCLAIMER_POLICY;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_DISCLAIMER_POLICY, getDisclaimerServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_DISCLAIMER_POLICY);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};
function getDisclaimerServiceCallback(e) {
	Ti.API.info("getDisclaimerService response : " + JSON.stringify(e));
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

			Ti.API.info('Error getDisclaimerService :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();

}
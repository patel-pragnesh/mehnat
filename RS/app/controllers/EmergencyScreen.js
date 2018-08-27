var args = arguments[0] || {};
// GET THE USER ID
var id = Ti.App.Properties.getString("id");

//XML Define function for back press
function closeWindowFun(e) {
	$.EmergencyScreen.close();
}

//XML Define function for open notification screen
function openNotification(e) {
	var notificationWin = Alloy.createController("NotificationScreen").getView();
	if (OS_IOS) {
		Alloy.Globals.navWindow.openWindow(notificationWin, {
			animated : true
		});
	} else {
		notificationWin.open();
	}

	notificationWin.oldWin = $.EmergencyScreen;
	Alloy.Globals.currentWindow = notificationWin;
}

//XML Define function for open nearest screen
function emergencyTableClick(e) {
	var nearestScreen = Alloy.createController("NearestServiceScreen", e.row.detail).getView();
	if (OS_IOS) {
		Alloy.Globals.navWindow.openWindow(nearestScreen, {
			animated : true
		});
	} else {
		nearestScreen.open();
	}

	nearestScreen.oldWin = $.EmergencyScreen;
	Alloy.Globals.currentWindow = nearestScreen;
}

//XML Define function for open panic screen
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
		panicScreen.oldWin = $.EmergencyScreen;
		Alloy.Globals.currentWindow = panicScreen;
		setTimeout(function(e) {
			$.panicBtn.focusable = true;

		}, 2000);
	} else {
		Alloy.Globals.Alert("Please add emergency contact first");
	}

}

//Function for call the emergency category screen to notify the backend about current location
// getEmergencyCategoryService();
function getEmergencyCategoryService() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var SERVICE_GET_NEAREST_LOCATION = Alloy.Globals.Constants.SERVICE_GET_NEAREST_LOCATION;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_NEAREST_LOCATION + PARAMS, getEmergencyCategoryServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_NEAREST_LOCATION + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function getEmergencyCategoryServiceCallback(e) {
	Ti.API.info("getEmergencyCategoryService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				Ti.API.info('response = ' + JSON.stringify(response));
				if (response.action_success == 'true') {
					getDetailList(response.data);
				} else {
					$.separatorLine.visible = false;
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error getEmergencyCategoryServiceCallback List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();
}

var listArray = [];
function getDetailList(data) {
	listArray = [];
	for (var i = 0; i < data.length; i++) {

		var row = Ti.UI.createTableViewRow({

			className : "detail",
			touchEnabled : true,
			focusable : true,
			height : 60,

			rightImage : "/images/next.png",
			color : '#565656',
			selectedColor : "#565656",
			selectedBackgroundColor : "#F8F8F9",
			detail : data[i]
		});

		row.add(Ti.UI.createView({
			left : 10,
			touchEnabled : false,
			focusable : false,
			height : 46,
			width : 46,
			borderColor : "#2941AE",
			backgroundColor : "#2941AE",
			borderWidth : 1,
			borderRadius : 23

		}));
		row.getChildren()[0].add(Ti.UI.createImageView({
			image : data[i].cat_img,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
		}));

		row.add(Ti.UI.createLabel({
			color : '#565656',
			text : data[i].catName.capitalize(),
			touchEnabled : false,
			focusable : false,
			left : 65,
			right : 0,
			height : 30,
			font : {
				fontSize : 16
			},
			ellipsize : true,
			wordWrap : false,

		}));

		listArray.push(row);

	};
	if (data != null) {
		$.separatorLine.visible = true;
	} else {
		$.separatorLine.visible = false;
	}
	$.emergencyTable.setData(listArray);
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

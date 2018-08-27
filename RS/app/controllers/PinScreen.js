var args = arguments[0] || {};
var id = Ti.App.Properties.getString("id");

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var id = Ti.App.Properties.getString("id");

//XML device back press button
function closeWindowFun(e) {

	Alloy.Globals.trackingObj.getMapPinService();
	$.PinScreen.close();
}

function onWindowCloseFun(e) {

	Alloy.Globals.trackingObj.getMapPinService();

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
		panicScreen.oldWin = $.PinScreen;
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
	notificationWin.oldWin = $.PinScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
}

//XML device bottom toggle button function for Map/List
function openPinWinFun(e) {
	if ($.viewPinBtn.focusable == false) {
		return;
	}
	$.viewPinBtn.focusable = false;
	Alloy.Globals.addPin = true;
	if (OS_IOS) {
		var servicedetail = Alloy.createController("AddPinScreen").getView();
		Alloy.Globals.navWindow.openWindow(servicedetail);
	} else {
		var servicedetail = Alloy.createController("AddPinScreen").getView();
		servicedetail.open();
	}
	servicedetail.oldWin = $.PinScreen;

	Alloy.Globals.currentWindow = servicedetail;
	setTimeout(function(e) {
		$.viewPinBtn.focusable = true;
	}, 2000);
}

var index = 0;
function openCategoryDetail(e) {
	Ti.API.info('className : ' + JSON.stringify(e.source.id));

	if (e.source.id == "delete") {

		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', 'No'],
			message : 'Are you sure want to delete ' + e.row.detail.pin_name + ' pin?',
			title : 'Road Safety'
		});
		dialog.addEventListener('click', function(k) {
			if (k.index === 0) {
				index = e.index;
				deletePinService(e.row.detail.id);
			}

		});
		dialog.show();
	} else if (e.source.id == "edit") {
		Alloy.Globals.addPin = false;
		if (OS_IOS) {
			var servicedetail = Alloy.createController("AddPinScreen", e.row.detail).getView();
			Alloy.Globals.navWindow.openWindow(servicedetail);
		} else {
			var servicedetail = Alloy.createController("AddPinScreen", e.row.detail).getView();
			servicedetail.open();
		}
		servicedetail.oldWin = $.PinScreen;

		Alloy.Globals.currentWindow = servicedetail;
	}
}

var listArray = [];
function getList(data) {
	Ti.API.info("Data : " + JSON.stringify(data));
	listArray = [];

	for (var i = 0; i < data.length; i++) {

		var row = Ti.UI.createTableViewRow({

			className : "category",
			touchEnabled : true,
			focusable : true,
			height : 50,

			color : '#565656',
			selectedColor : "#565656",
			selectedBackgroundColor : "#F8F8F9",
			detail : data[i],

		});

		row.add(Ti.UI.createView({

			touchEnabled : false,
			focusable : false,
			height : Ti.UI.FILL,
			left : 0,
			right : 80,
			layout : "vertical"

		}));

		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#2941AE",
			selectedColor : "#565656",
			objName : 'label',
			text : data[i].pin_name,
			touchEnabled : false,
			focusable : false,
			left : 10,
			right : 0,
			top : 5,
			height : 25,
			font : {
				fontSize : 15
			},
			ellipsize : true,
			wordWrap : false,
		}));

		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#2941AE",
			selectedColor : "#565656",
			objName : 'label',
			text : "Pin : " + data[i].pin_number,
			touchEnabled : false,
			focusable : false,
			left : 10,
			right : 0,
			font : {
				fontSize : 13
			},
			ellipsize : true,
			wordWrap : false,
		}));

		row.add(Ti.UI.createButton({
			image : "/images/Edit_active.png",
			right : 40,
			backgroundImage : "none",
			height : Ti.UI.FILL,
			width : 40,
			id : "edit"
		}));
		row.add(Ti.UI.createButton({
			image : "/images/cancel_active.png",
			right : 0,
			backgroundImage : "none",
			height : Ti.UI.FILL,
			width : 40,
			id : "delete"
		}));

		listArray.push(row);

	};
	if (data != null) {
		$.separatorLine.visible = true;
	} else {
		$.separatorLine.visible = false;
	}
	$.listTable.setData(listArray);
}

function getPinService() {

	var SERVICE_GET_PIN = Alloy.Globals.Constants.SERVICE_GET_PIN;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_PIN + PARAMS, getPinServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_PIN + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

exports.getPinService = function() {

	var SERVICE_GET_PIN = Alloy.Globals.Constants.SERVICE_GET_PIN;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_PIN + PARAMS, getPinServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_PIN + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};
function getPinServiceCallback(e) {
	Ti.API.info("getPinService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					getList(response.data);
				} else {
					$.separatorLine.visible = false;
					Alloy.Globals.Alert(response.response_message);
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

function deletePinService(rowId) {

	var SERVICE_DELETE_PIN = Alloy.Globals.Constants.SERVICE_DELETE_PIN;
	var PARAMS = "&id=" + rowId;
	if (Ti.Network.online) {
		//Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_DELETE_PIN + PARAMS, deletePinServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_DELETE_PIN + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function deletePinServiceCallback(e) {
	Ti.API.info("deletePinServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					Ti.API.info('Index ' + index);
					$.listTable.deleteRow(index, {
						animated : true
					});
					getPinService();
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error deletePinServiceCallback :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	//Alloy.Globals.LoadingScreen.close();

}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

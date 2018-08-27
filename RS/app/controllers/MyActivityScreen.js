var args = arguments[0] || {};

// GET THE USER ID
var id = Ti.App.Properties.getString("id");
var listArray = [];
var activityArry;
function closeWindowFun(e) {
	$.MyActivityScreen.close();
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
	notificationWin.oldWin = $.MyActivityScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
}

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
			panicScreen.oldWin = $.MyActivityScreen;
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

function openAddActivityScreenFun(e) {
	if ($.addBtn.focusable == false) {
		return;
	}
	$.addBtn.focusable = false;

	if (OS_IOS) {
		var addActivity = Alloy.createController("AddActivityScreen").getView();

		Alloy.Globals.navWindow.openWindow(addActivity);
	} else {
		var addActivity = Alloy.createController("AddActivityScreen").getView();
		addActivity.open();
	}

	addActivity.oldWin = $.MyActivityScreen;
	Alloy.Globals.currentWindow = addActivity;
	setTimeout(function(e) {
		$.addBtn.focusable = true;
	}, 2000);
}

//Function for create table for the getting activity log and show in the table
var numberOfRows = 1;

Alloy.Globals.showRows = 10;
var rowNumer = 0;
var lastDistance = 0;
var updating = false;
function getActivityList(data, len) {
	updating = true;
	listArray = [];
	rowNumer = 0;
	//$.logTable.setData(listArray);
	for (var i = 0; i < len; i++) {
		rowNumer++;
		var row = Ti.UI.createTableViewRow({

			className : "detail",
			touchEnabled : true,
			focusable : true,
			height : 40,

		});
		row.add(Ti.UI.createView({
			top : 0,
			//backgroundColor : "#F0F0F0",
			height : Ti.UI.SIZE,
			layout : "horizontal"

		}));
		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#565656",
			width : "18%",
			text : data[i].datetime,
			touchEnabled : false,
			focusable : false,
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
			height : 26,

			font : {
				fontSize : 10
			},
			ellipsize : true,
			wordWrap : false,

		}));

		row.getChildren()[0].add(Ti.UI.createView({
			width : 1,
			backgroundColor : "#EDEDEE",
		}));

		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#565656",
			width : "17%",
			text : data[i].meter_reading,
			touchEnabled : false,
			focusable : false,
			height : 26,
			font : {
				fontSize : 10
			},
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
			ellipsize : true,
			wordWrap : false,

		}));

		row.getChildren()[0].add(Ti.UI.createView({
			width : 1,
			backgroundColor : "#EDEDEE",
		}));
		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#565656",
			width : "16%",
			text : data[i].fuel,
			touchEnabled : false,
			focusable : false,
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
			height : 26,

			font : {
				fontSize : 10
			},
			ellipsize : true,
			wordWrap : false,

		}));

		row.getChildren()[0].add(Ti.UI.createView({
			width : 1,
			backgroundColor : "#EDEDEE",
		}));

		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#565656",
			width : "15%",
			text : data[i].price,
			touchEnabled : false,
			focusable : false,
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
			height : 26,

			font : {
				fontSize : 10
			},
			ellipsize : true,
			wordWrap : false,

		}));
		row.getChildren()[0].add(Ti.UI.createView({
			width : 1,
			backgroundColor : "#EDEDEE",
		}));
		if (data[i].milage != false) {
			var text = data[i].milage;
		} else {
			var text = "NA";
		}
		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#565656",
			width : "16%",
			text : text,
			touchEnabled : false,
			focusable : false,
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
			height : 26,

			font : {
				fontSize : 10
			},
			ellipsize : true,
			wordWrap : false,

		}));

		row.getChildren()[0].add(Ti.UI.createView({
			width : 1,
			backgroundColor : "#EDEDEE",
		}));
		if (data[i].priceperkm != false) {
			var text1 = data[i].priceperkm;
		} else {
			var text1 = "NA";
		}
		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#565656",
			width : "15%",
			text : text1,
			touchEnabled : false,
			focusable : false,
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
			height : 26,

			font : {
				fontSize : 10
			},
			ellipsize : true,
			wordWrap : false,

		}));

		listArray.push(row);

	};

	Alloy.Globals.showRows = Alloy.Globals.showRows + 10;
	$.logTable.setData(listArray);

	//$.activityIndicator.hide();
}

function lazyload(e) {

	if (rowNumer != numberOfRows) {
		if (Ti.Platform.osname == 'iphone') {
			var offset = e.contentOffset.y;
			var height = e.size.height;
			var total = offset + height;
			var theEnd = e.contentSize.height;
			var distance = theEnd - total;

			// going down is the only time we dynamically load,
			// going up we can safely ignore -- note here that
			// the values will be negative so we do the opposite
			if (distance < lastDistance) {
				// adjust the % of rows scrolled before
				//we decide to start fetching

				var nearEnd = theEnd * .75;

				if (!updating && (total >= nearEnd)) {
					beginUpdate();
				}
			}
			lastDistance = distance;
		}
		if (Ti.Platform.osname == 'android') {
			if ((e.firstVisibleItem + e.visibleItemCount) == e.totalItemCount) {
				Ti.API.info("rowNumer " + rowNumer);
				Ti.API.info("numberOfRows  " + numberOfRows);
				Ti.API.info("showRow  " + Alloy.Globals.showRows);
				if (rowNumer == numberOfRows) {
					return;
				}
				$.activityIndicator.show();
				if (Alloy.Globals.showRows > numberOfRows) {
					Ti.API.info("COME !");
					getActivityList(activityArry, numberOfRows);
					rowNumer = numberOfRows;
				} else {
					Ti.API.info("COME 2");
					getActivityList(activityArry, Alloy.Globals.showRows);
				}

			}
		}
	}

}

function showMoreFun(e) {
	Ti.API.info("rowNumer " + rowNumer);
	Ti.API.info("numberOfRows  " + numberOfRows);
	Ti.API.info("showRow  " + Alloy.Globals.showRows);
	if (rowNumer == numberOfRows) {
		$.showBtn.visible = false;
		return;
	}
	//$.activityIndicator.show();
	if (Alloy.Globals.showRows >= numberOfRows) {
		Ti.API.info("COME !");
		getActivityList(activityArry, numberOfRows);
		rowNumer = numberOfRows;
		$.showBtn.visible = false;
	} else {
		Ti.API.info("COME 2");
		getActivityList(activityArry, Alloy.Globals.showRows);
		$.showBtn.visible = true;
	}
}

exports.getActivityService = function() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var PRAMS = "&id=" + id;
	var SERVICE_GET_ACTIVITY = Alloy.Globals.Constants.SERVICE_GET_ACTIVITY;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_ACTIVITY + PRAMS, getActivityServiceCallback);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_GET_ACTIVITY + PRAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};

function getActivityService() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var PRAMS = "&id=" + id;
	var SERVICE_GET_ACTIVITY = Alloy.Globals.Constants.SERVICE_GET_ACTIVITY;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_ACTIVITY + PRAMS, getActivityServiceCallback);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_GET_ACTIVITY + PRAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};
/*
 * Callback gunction for FB and Google+ login
 */

function getActivityServiceCallback(e) {
	Ti.API.info("getContactService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				Ti.API.info('response.action_success = ' + response.action_success);
				if (response.action_success == 'true') {
					if (response.data) {
						//rowNumer = 0;

						numberOfRows = response.data.length;
						Ti.API.info("numberOfRows " + numberOfRows);
						Ti.API.info("Alloy.Globals.showRows " + Alloy.Globals.showRows);
						activityArry = response.data;

						if (Alloy.Globals.showRows >= numberOfRows) {
							Ti.API.info("COME !");
							getActivityList(activityArry, numberOfRows);
							rowNumer = numberOfRows;

							$.showBtn.visible = false;
						} else {
							Ti.API.info("COME 2");
							getActivityList(activityArry, Alloy.Globals.showRows);
							$.showBtn.visible = true;
						}

					} else {
						Alloy.Globals.Alert("There is activity found, please add it");
						$.separatorLine.visible = false;
						$.showBtn.visible = false;
						numberOfRows = 0;
					}

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
		}
	} else {
		//Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}

	Alloy.Globals.LoadingScreen.close();
}

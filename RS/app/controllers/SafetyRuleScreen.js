var args = arguments[0] || {};

var tableView = $.safetyTable;
var id = Ti.App.Properties.getString("id");
var numberOfRows = 1;
var showRows = 10;
var rowNumer = 0;
var lastDistance = 0;
function closeSafetyFun(e) {
	$.SafetyRuleScreen.close();
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
	notificationWin.oldWin = $.SafetyRuleScreen;
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
			panicScreen.oldWin = $.SafetyRuleScreen;
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

function tableClickFun(e) {
	Ti.API.info('e.row : ' + JSON.stringify(e.row));

	//Is this a parent cell?
	if (e.source.click == 'no') {
		e.source.click = 'yes';
		var row = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,

			color : '#565656',
			selectedBackgroundColor : "#F8F8F9",
			selectedColor : "#565656",

			font : {
				fontSize : 15
			},
		});

		row.add(Ti.UI.createLabel({
			height : Ti.UI.SIZE,
			text : e.row.desc,
			left : 15,
			right : 15,
			top : 8,
			bottom : 8,

			color : '#565656',
			selectedBackgroundColor : "#F8F8F9",
			selectedColor : "#565656",
			font : {
				fontSize : 15
			},
		}));

		Ti.API.info("e.index " + e.row.desc);
		tableView.insertRowAfter(e.index, row, {
			animated : true
		});
		e.row.rightImage = "/images/up_arrow.png";
	} else {
		if (e.source.click == 'yes') {
			e.source.click = 'no';
			Ti.API.info("e.index1 " + e.row.ind);
			tableView.deleteRow(e.index + 1, {
				animated : true
			});
			e.row.rightImage = "/images/down_arrow.png";
		}
	}
};

var safetyArray = [];
function getSafetyRulesList(data, len) {
	updating = true;
	rowNumer = 0;
	safetyArray = [];
	for (var i = 0; i < len; i++) {

		var row = Ti.UI.createTableViewRow({
			className : 'row',
			ind : i,
			click : "no",
			touchEnabled : true,
			focusable : true,
			height : 60,

			rightImage : "/images/down_arrow.png",
			color : '#565656',
			selectedColor : "#565656",
			selectedBackgroundColor : "#F8F8F9",
			desc : data[i].ruleDescription
		});

		var enabledWrapperView = Ti.UI.createView({
			left : 15,
			height : 44,
			width : 44,
			borderRadius : 22,
			borderColor : "#2941AE",
			backgroundColor : "#2941AE",
			//borderWidth : 1,

			description : data[i].ruleDescription,
			//ind : i,
			//click : "no",
			touchEnabled : false,
			focusable : false,
		});

		var disabledWrapperView = Ti.UI.createImageView({
			touchEnabled : false,
			focusable : false,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			image : data[i].rule_img,
			defaultImage : "/images/no_img.png",
		});
		enabledWrapperView.add(disabledWrapperView);

		var label = Ti.UI.createLabel({

			color : '#565656',
			selectedColor : "#565656",
			//ind : i,
			//click : "no",
			objName : 'label',
			text : data[i].ruleName,
			touchEnabled : false,
			focusable : false,
			left : 75,
			right : 0,
			//height : 30,
			font : {
				fontSize : 16
			},
			ellipsize : true,
			//wordWrap : false,

		});
		row.add(label);

		row.add(enabledWrapperView);
		safetyArray.push(row);

	};
	$.safetyTable.setData(safetyArray);
	showRows = showRows + 10;
}

function showMoreFun(e) {
	Ti.API.info("rowNumer " + rowNumer);
	Ti.API.info("numberOfRows  " + numberOfRows);
	Ti.API.info("showRow  " + showRows);
	if (rowNumer == numberOfRows) {
		$.showBtn.visible = false;
		return;
	}

	if (showRows >= numberOfRows) {
		Ti.API.info("COME !");
		getSafetyRulesList(safetyRuleArray, numberOfRows);
		rowNumer = numberOfRows;
		$.showBtn.visible = false;
	} else {
		Ti.API.info("COME 2");

		getSafetyRulesList(safetyRuleArray, showRows);
		$.showBtn.visible = true;
	}
}

function getSafetyRulesService() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var SERVICE_GET_SAFETY_RULES = Alloy.Globals.Constants.SERVICE_GET_SAFETY_RULES;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_SAFETY_RULES + PARAMS, getSafetyRulesServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_SAFETY_RULES + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

var safetyRuleArray;
function getSafetyRulesServiceCallback(e) {
	Ti.API.info("getSafetyRulesServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {

					safetyRuleArray = response.data;
					numberOfRows = response.data.length;
					if (showRows >= numberOfRows) {
						Ti.API.info("COME !");

						getSafetyRulesList(safetyRuleArray, numberOfRows);
						rowNumer = numberOfRows;

						$.showBtn.visible = false;
					} else {
						Ti.API.info("COME 2");

						getSafetyRulesList(safetyRuleArray, showRows);
						$.showBtn.visible = true;
					}
				} else {
					Alloy.Globals.Alert(response.response_message);
					$.showBtn.visible = false;
					numberOfRows = 0;
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error getSafetyRulesServiceCallback :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();

}
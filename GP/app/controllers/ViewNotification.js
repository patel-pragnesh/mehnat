// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

exports.finalize = function(){
	Ti.API.info('Inside Notification finalize');
};

/*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {
	Alloy.Globals.openLeft();
}

var notificationData = [];
function renderNotificationList(data) {
	notificationData = [];
	for (var i = 0; i <data.length; i++) {
		var notificationRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE
		});
		var mainVW = Ti.UI.createView({
			height : Ti.UI.SIZE,
			top : 10,
			bottom : 10,

			layout : "vertical"
		});
		notificationRow.add(mainVW);
		var titleLbl = Ti.UI.createLabel({
			text : data[i].title,
			left : 20,
			color : "black",
			font : {
				fontSize : 16,
				fontFamily : "Montserrat-Regular",
			}
		});
		mainVW.add(titleLbl);
		var descLbl = Ti.UI.createLabel({
			top : 8,
			text : data[i].message,
			left : 20,
			color : "black",
			font : {
				fontSize : 15,
				fontFamily : "Montserrat-Light",
			}
		});
		mainVW.add(descLbl);

		var dateLbl = Ti.UI.createLabel({
			top : 8,
			text : data[i].created_at,
			left : 20,
			color : "black",
			font : {
				fontSize : 14,
				fontFamily : "Montserrat-UltraLight",
			}
		});
		mainVW.add(dateLbl);
		notificationRow.add(mainVW);
		notificationData.push(notificationRow);
	};
	$.notificationTable.setData(notificationData);
}



function openFunc(){
	getNotificationService();
}

function getNotificationService() {
	var data = {};
	data.store_id = Alloy.Globals.store_id;
	data.user_id = Alloy.Globals.employee_id;
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_GET_NOTIFICATION = Alloy.Globals.Constants.SERVICE_GET_NOTIFICATION;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_GET_NOTIFICATION, getNotificationCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_GET_NOTIFICATION);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

function getNotificationCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {
				if (response.response_code == '1') {
					renderNotificationList(response.result);
				} else {
					Alloy.Globals.Notifier.show(response.message);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error getNotificationCallback :: ' + e.message);
			tracker.addException({
				description : "ViewNotificaion: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}
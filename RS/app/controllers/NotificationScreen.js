var args = arguments[0] || {};
Alloy.Globals.isNotification = true;

var audioPlayer = Ti.Media.createSound({
	url:"",
});
function closeNotifcationFun(e) {
	Alloy.Globals.isNotification = false;
	$.NotificationScreen.close();
	if (audioPlayer.isPlaying()) {
		audioPlayer.release();
	}
}

function closeFun() {
	Alloy.Globals.isNotification = false;
	if (audioPlayer.isPlaying()) {
		audioPlayer.release();
	}
}

var preObj = null;
var newObj = null;
function tableClickFun(e) {
	Ti.API.info(e.source + "   " + e.row.audio);
	audioPlayer.url=e.row.audio;
	if (e.source.name == "btn") {
		newObj = e.source;
		Ti.API.info(e.source.toggle);
		if (preObj) {
			//Ti.API.info("preObj11 " + preObj.toggle);
		}
		if (preObj) {

			if (preObj != e.source) {
				//Ti.API.info("preObj12 " + preObj.toggle);
				if (preObj.toggle == "false") {
					audioPlayer.release();
					preObj.toggle = "true";
					preObj.image = "/images/play.png";
				}

			}
		}
		if (e.source.toggle == "true") {

			audioPlayer.play();
			e.source.toggle = "false";
			e.source.image = "/images/stop.png";
		} else {
			audioPlayer.release();
			e.source.toggle = "true";
			e.source.image = "/images/play.png";
		}

		preObj = e.source;
		audioPlayer.addEventListener("complete", function(k) {
			Ti.API.info("COMPELTE");
			audioPlayer.release();
			newObj.toggle = "true";
			newObj.image = "/images/play.png";
		});

	}

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
			panicScreen.oldWin = $.NotificationScreen;

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

var notificationArray = [];

function getNotifactionList(data) {
	notificationArray = [];
	for (var i = 0; i < data.length; i++) {

		var row = Ti.UI.createTableViewRow({
			className : 'row',
			touchEnabled : true,
			focusable : true,
			height : Ti.UI.SIZE,
			color : '#565656',
			selectedColor : "#565656",
			selectedBackgroundColor : "#F8F8F9",

			audio : data[i].notification_audio_msg,

		});

		var mainView = Ti.UI.createView({
			left : 0,
			right : 60,
			height : Ti.UI.SIZE,
			top : 0,
			touchEnabled : false,
			focusable : false,
		});
		row.add(mainView);
		var detailView = Ti.UI.createView({
			left : 15,
			top : 5,
			layout : "vertical",
			height : Ti.UI.SIZE,

			touchEnabled : false,
			focusable : false,
			name : "",
		});
		mainView.add(detailView);

		var headingLbl = Ti.UI.createLabel({

			color : '#2843AE',
			objName : 'label',
			text : data[i].notification_title.capitalize(),
			touchEnabled : false,
			focusable : false,
			top : 0,
			left : 0,
			right : 0,
			height : 24,
			name : "",
			font : {
				fontSize : 15
			},
			ellipsize : true,
			wordWrap : false,

		});
		detailView.add(headingLbl);
		var clockView = Ti.UI.createView({
			left : 0,
			right : 0,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			name : "",
			focusable : false,
		});
		detailView.add(clockView);
		var clockimg = Ti.UI.createImageView({
			touchEnabled : false,
			focusable : false,
			left : 0,
			image : "/images/clock.png",
			name : "",
		});
		clockView.add(clockimg);
		var clockLbl = Ti.UI.createLabel({
			color : '#717171',
			objName : 'label',
			text : data[i].date,
			touchEnabled : false,
			focusable : false,
			left : 25,
			right : 0,
			name : "",
			height : 16,
			font : {
				fontSize : 12
			},
			ellipsize : true,
			wordWrap : false,
		});
		clockView.add(clockLbl);
		var locationView = Ti.UI.createView({
			top : 5,
			left : 0,
			right : 0,
			height : Ti.UI.SIZE,
			name : "",
			touchEnabled : false,
			focusable : false,
			//layout : "horizontal"
		});
		detailView.add(locationView);
		var locationimg = Ti.UI.createImageView({
			touchEnabled : false,
			focusable : false,
			left : 0,
			name : "",
			image : "/images/location.png"
		});
		locationView.add(locationimg);
		var locationLbl = Ti.UI.createLabel({

			color : '#717171',
			objName : 'label',
			text : data[i].address,
			touchEnabled : false,
			focusable : false,

			left : 25,
			right : 0,
			height : 18,
			font : {
				fontSize : 12
			},
			ellipsize : true,
			wordWrap : false,
			name : "",

		});
		locationView.add(locationLbl);
		var descView = Ti.UI.createView({
			top : 5,
			left : 0,
			right : 0,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			focusable : false,
			name : "",
		});
		detailView.add(descView);
		var descImg = Ti.UI.createImageView({
			touchEnabled : false,
			focusable : false,
			left : 0,
			top : 0,
			image : "/images/discription.png",
			name : "",
		});
		descView.add(descImg);
		var descLbl = Ti.UI.createLabel({

			color : '#717171',
			objName : 'label',
			text : data[i].notification_msg,
			touchEnabled : false,
			focusable : false,
			top : 0,
			left : 25,
			right : 0,
			//height : 18,
			font : {
				fontSize : 12
			},
			name : "",
		});
		descView.add(descLbl);
		var bottomView = Ti.UI.createView({
			top : 1,
			height : 10,
			name : "",
			touchEnabled : false,
			focusable : false,
			//backgroundColor:"red"
		});
		detailView.add(bottomView);
		var audioBtn = Ti.UI.createButton({
			right : 5,
			backgroundImage : "none",
			name : "btn",
			width : "55",
			image : "/images/play.png",
			touchEnabled : true,
			focusable : true,
			toggle : "true"
		});
		row.add(audioBtn);

		//row.add(imgView);
		notificationArray.push(row);

	};
	if (data != null) {
		$.separatorLine.visible = true;
	} else {
		$.separatorLine.visible = false;
	}
	$.notificationTable.setData(notificationArray);
}

exports.getNotificationService = function() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var id = Ti.App.Properties.getString("id");

	var SERVICE_GET_NOTIFICATION = Alloy.Globals.Constants.SERVICE_GET_NOTIFICATION;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_NOTIFICATION + PARAMS, getNotificationServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_NOTIFICATION + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}

};
function getNotificationService() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var id = Ti.App.Properties.getString("id");

	var SERVICE_GET_NOTIFICATION = Alloy.Globals.Constants.SERVICE_GET_NOTIFICATION;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_NOTIFICATION + PARAMS, getNotificationServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_NOTIFICATION + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}

};
function getNotificationServiceCallback(e) {
	Ti.API.info("getNotificationServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {

					if (response.data.length > 0) {
						getNotifactionList(response.data);

						managePushService();
					} else {
						Alloy.Globals.Alert("Notifications not found");
					}
					Alloy.Globals.notifyVW.visible = false;
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

function managePushService() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var id = Ti.App.Properties.getString("id");

	var SERVICE_MANAGE_PUSH_COUNT = Alloy.Globals.Constants.SERVICE_MANAGE_PUSH_COUNT;
	var PARAMS = "&id=" + id + "&device_id=" + Alloy.Globals.deviceToken + "&is_read=" + 1;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_MANAGE_PUSH_COUNT + PARAMS, managePushServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_MANAGE_PUSH_COUNT + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};
function managePushServiceCallback(e) {
	Ti.API.info("managePushService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {

				} else {

					Ti.API.info(response.response_message);
				}
			} else {
				Ti.API.info("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error managePushService :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	//Alloy.Globals.LoadingScreen.close();

}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

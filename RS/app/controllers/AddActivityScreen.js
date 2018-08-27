var args = arguments[0] || {};

/*
 * Variable defined fo r the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

var id = Ti.App.Properties.getString("id");

function closeAddActivityFun(e) {
	$.AddActivityScreen.close();
}

function meterReturnFun() {
	$.petrolTF.focus();
}

function petrolReturnFun() {
	$.priceTF.focus();
}

function editFun(e) {
	if ($.editBtn.focusable == false) {
		return;
	}
	$.editBtn.focusable = false;
	if (OS_IOS) {
		var updateProfile = Alloy.createController("UpdateProfile", profileData).getView();

		Alloy.Globals.navWindow.openWindow(updateProfile);
	} else {
		var updateProfile = Alloy.createController("UpdateProfile", profileData).getView();
		updateProfile.open();
	}
	updateProfile.oldWin = $.AddActivityScreen;

	Alloy.Globals.currentWindow = updateProfile;

	setTimeout(function(e) {
		$.editBtn.focusable = true;
	}, 2000);
}

function winClickFun(e) {
	Ti.API.info(e.source.name);
	if (e.source.name != "tf") {
		$.readingTF.blur();
		$.petrolTF.blur();
		$.priceTF.blur();
	}
}

exports.exgetProfileService = function() {

	var SERVICE_GET_PROFILE = Alloy.Globals.Constants.SERVICE_GET_PROFILE;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_PROFILE + PARAMS, getProfileServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_PROFILE + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};
function getProfileService() {

	var SERVICE_GET_PROFILE = Alloy.Globals.Constants.SERVICE_GET_PROFILE;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_PROFILE + PARAMS, getProfileServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_PROFILE + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};
function getProfileServiceCallback(e) {
	Ti.API.info("getProfileServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					$.nameLbl.visible = false;
					$.emailLbl.visible = false;
					$.contactLbl.visible = false;

					$.userPic.image = response.data.user_img;
					$.readingTF.value = response.data.name;
					$.petrolTF.value = response.data.email;
					$.priceTF.value = response.data.contact;
					profileData = response.data;
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error getProfileServiceCallback :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();

}

function priceChangeFun(e) {

	if ($.priceTF.value.length > 0) {
		$.contactLbl.visible = false;
	} else {
		$.contactLbl.visible = true;
	}
}

function emailChangeFun(e) {

	if ($.petrolTF.value.length > 0) {
		$.emailLbl.visible = false;
	} else {
		$.emailLbl.visible = true;
	}
}

function nameChangeFun(e) {

	if ($.readingTF.value.length > 0) {
		$.nameLbl.visible = false;
	} else {
		$.nameLbl.visible = true;
	}
}

function saveActivityFun() {
	if ($.submitBtn.focusable == false) {
		return;
	}
	$.submitBtn.focusable = false;
	if ($.readingTF.value != '' && $.readingTF.value.trim().length > 0) {
		var isValid1 = isValid($.readingTF.value);
		if (isValid1) {
			if ($.petrolTF.value != '' && $.petrolTF.value.trim().length > 0) {
				var isValid1 = isValid($.petrolTF.value);
				if (isValid1) {

					if ($.priceTF.value != '' && $.priceTF.value.trim().length > 0) {
						var isValid1 = isValid($.priceTF.value);
						if (isValid1) {
							addActivityService();
							return true;

						} else {
							$.submitBtn.focusable = true;
							Alloy.Globals.Alert("Please enter numeric value of fuel price");

							return false;
						}
					} else {
						$.submitBtn.focusable = true;
						Alloy.Globals.Alert("Please enter fuel price");

						return false;
					}
				} else {
					$.submitBtn.focusable = true;

					Alloy.Globals.Alert("Please enter numeric value of fuel quantity in litre");

					return false;
				}

			} else {
				$.submitBtn.focusable = true;
				Alloy.Globals.Alert("Please enter fuel quantity in litre");
				return false;
			}
		} else {
			$.submitBtn.focusable = true;
			Alloy.Globals.Alert("Please enter numeric value of your vehicle reading");
			return false;
		}
	} else {
		$.submitBtn.focusable = true;
		Alloy.Globals.Alert("Please enter your vehicle reading");
		return false;
	}

}

function isValid(str) {
	Ti.API.info("STRING : " + !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str));
	return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

var date = new Date();
function addActivityService() {
	var data = {};
	data.id = id;
	data.meter_reading = $.readingTF.value;
	data.fuel = $.petrolTF.value;
	data.price = $.priceTF.value;
	data.date = date.toLocaleDateString();

	Ti.API.info('Data : ' + JSON.stringify(data));
	var SERVICE_ADD_ACTIVITY = Alloy.Globals.Constants.SERVICE_ADD_ACTIVITY;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_ADD_ACTIVITY, addActivityServiceCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_ADD_ACTIVITY);
	} else {
		$.submitBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function addActivityServiceCallback(e) {
	Ti.API.info("updateProfileServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					$.AddActivityScreen.close();
					Alloy.Globals.showRows = 10;
					Alloy.Globals.myActivity.getActivityService();

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error updateProfileServiceCallback :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();
	$.submitBtn.focusable = true;
}

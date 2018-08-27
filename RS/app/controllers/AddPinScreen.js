var args = arguments[0] || {};

Ti.API.info('Detail : ' + JSON.stringify(args));
if (!Alloy.Globals.addPin) {
	$.titleLbl.text = "Update Pin";
	$.nameTF.value = args.pin_name;
	$.pinTF.value = args.pin_number;
	var rowId = args.id;
	if (OS_IOS) {
		if ($.nameTF.value.length > 0) {
			$.nameLbl.visible = false;
		}
		if ($.pinTF.value.length > 0) {
			$.emailLbl.visible = false;
		}
	}

}
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var selectedImage = null;
var id = Ti.App.Properties.getString("id");

function closeAddActivityFun(e) {
	$.AddPinScreen.close();
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
	updateProfile.oldWin = $.AddPinScreen;

	Alloy.Globals.currentWindow = updateProfile;

	setTimeout(function(e) {
		$.editBtn.focusable = true;
	}, 2000);
}

function winClickFun(e) {
	Ti.API.info(e.source.name);
	if (e.source.name != "tf") {
		$.nameTF.blur();
		$.pinTF.blur();

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

function emailChangeFun(e) {

	if ($.pinTF.value.length > 0) {
		$.emailLbl.visible = false;
	} else {
		$.emailLbl.visible = true;
	}
}

function nameChangeFun(e) {

	if ($.nameTF.value.length > 0) {
		$.nameLbl.visible = false;
	} else {
		$.nameLbl.visible = true;
	}
}

function nameReturnFun(e) {
	$.pinTF.focus();
}

function savePinFun() {
	if ($.submitBtn.focusable == false) {
		return;
	}
	$.submitBtn.focusable = false;
	if ($.nameTF.value != '' && $.nameTF.value.trim().length > 0) {

		if ($.pinTF.value != '' && $.pinTF.value.trim().length > 0) {
			if ($.pinTF.value > 0) {
	Ti.API.info("Ti.Geolocation.locationServicesEnabled "+ Ti.Geolocation.locationServicesEnabled);
				if (Ti.Geolocation.locationServicesEnabled) {
					if (Alloy.Globals.addPin) {

						addPinService();
					} else {
						updatePinService(rowId);
					}

				} else {
					$.submitBtn.focusable = true;
					Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
				}

				return true;
			} else {

				Alloy.Globals.Alert("Please enter numeric value of pin");
				$.submitBtn.focusable = true;
				return false;
			}

		} else {
			$.submitBtn.focusable = true;
			Alloy.Globals.Alert("Please enter pin number");
			return false;
		}

	} else {
		$.submitBtn.focusable = true;
		Alloy.Globals.Alert("Please enter pin name");
		return false;
	}

}

function addPinService() {
	var data = {};
	data.id = id;
	data.pin_name = $.nameTF.value;
	data.pin_number = $.pinTF.value;

	Ti.API.info('Data : ' + JSON.stringify(data));
	var SERVICE_ADD_PIN = Alloy.Globals.Constants.SERVICE_ADD_PIN;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_ADD_PIN, addPinServiceCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_ADD_PIN);
	} else {
		$.submitBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function updatePinService(rowId) {
	var data = {};
	data.id = rowId;
	data.user_id = id;
	data.pin_name = $.nameTF.value;
	data.pin_number = $.pinTF.value;

	Ti.API.info('Data : ' + JSON.stringify(data));
	var SERVICE_UPDATE_PIN = Alloy.Globals.Constants.SERVICE_UPDATE_PIN;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_UPDATE_PIN, addPinServiceCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_UPDATE_PIN);
	} else {
		$.submitBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function addPinServiceCallback(e) {
	Ti.API.info("addPinService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					$.AddPinScreen.close();
					Alloy.Globals.pinObj.getPinService();
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error addPinService :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	$.submitBtn.focusable = true;
	Alloy.Globals.LoadingScreen.close();

}

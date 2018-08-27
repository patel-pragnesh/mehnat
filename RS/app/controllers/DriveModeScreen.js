var args = arguments[0] || {};

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

var id = Ti.App.Properties.getString("id");

function closeAddActivityFun(e) {
	$.DriveModeScreen.close();
}

function meterReturnFun() {
	$.newPasswordTF.focus();
}

function petrolReturnFun() {
	$.confirmPasswordTF.focus();
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
	updateProfile.oldWin = $.DriveModeScreen;

	Alloy.Globals.currentWindow = updateProfile;

	setTimeout(function(e) {
		$.editBtn.focusable = true;
	}, 2000);
}

function winClickFun(e) {
	Ti.API.info(e.source.name);
	if (e.source.name != "tf") {
		$.oldPasswordTF.blur();
		$.newPasswordTF.blur();
		$.confirmPasswordTF.blur();
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
					$.oldPasswordTF.value = response.data.name;
					$.newPasswordTF.value = response.data.email;
					$.confirmPasswordTF.value = response.data.contact;
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

	if ($.confirmPasswordTF.value.length > 0) {
		$.contactLbl.visible = false;
	} else {
		$.contactLbl.visible = true;
	}
}

function emailChangeFun(e) {

	if ($.newPasswordTF.value.length > 0) {
		$.emailLbl.visible = false;
	} else {
		$.emailLbl.visible = true;
	}
}

function nameChangeFun(e) {

	if ($.oldPasswordTF.value.length > 0) {
		$.nameLbl.visible = false;
	} else {
		$.nameLbl.visible = true;
	}
}

function changePasswordFun() {
	if ($.submitBtn.focusable == false) {
		return;
	}
	$.submitBtn.focusable = false;

	if (removeSpaces($.oldPasswordTF.value) != '' && removeSpaces($.oldPasswordTF.value) != null) {
		Ti.API.info("OLD " + Ti.App.Properties.getString('password') + " OLD1 " + $.oldPasswordTF.value);
		if (removeSpaces($.oldPasswordTF.value) == Ti.App.Properties.getString('password')) {

			if (removeSpaces($.newPasswordTF.value) != '' && removeSpaces($.newPasswordTF.value) != null) {
				if (removeSpaces($.newPasswordTF.value).length >= 6 && removeSpaces($.newPasswordTF.value).length <= 15) {

					if (removeSpaces($.newPasswordTF.value) == removeSpaces($.confirmPasswordTF.value)) {
						changePasswordService();
					} else {

						$.submitBtn.focusable = true;
						Alloy.Globals.Alert("Confirm password does not match to new password");
					}
				} else {
					$.submitBtn.focusable = true;
					Alloy.Globals.Alert("New password can not be less than 6 characters and exceed 15 characters in length");
				}
			} else {
				$.submitBtn.focusable = true;
				Alloy.Globals.Alert("Please enter new password");
			}
		} else {
			$.submitBtn.focusable = true;
			Alloy.Globals.Alert("Please enter valid old password");
		}
	} else {
		$.submitBtn.focusable = true;
		Alloy.Globals.Alert("Please enter old password");
	}

}

function removeSpaces(string) {

	if (string != null) {
		Ti.API.info('string1 ' + string.split(' ').join(''));
		return string.split(' ').join('');
	} else {
		Ti.API.info('string2 ' + string);
		return '';
	}
};

function changePasswordService() {
	var data = {};
	data.id = id;
	data.old_password = $.oldPasswordTF.value;
	data.new_password = $.newPasswordTF.value;

	Ti.API.info('Data : ' + JSON.stringify(data));
	var SERVICE_CHANGE_PASSWORD = Alloy.Globals.Constants.SERVICE_CHANGE_PASSWORD;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_CHANGE_PASSWORD, changePasswordServiceCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_CHANGE_PASSWORD);
	} else {
		$.submitBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function changePasswordServiceCallback(e) {
	Ti.API.info("updateProfileServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					$.DriveModeScreen.close();
					Ti.App.Properties.setString('password', $.newPasswordTF.value);
					Alloy.Globals.Alert(response.response_message);
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

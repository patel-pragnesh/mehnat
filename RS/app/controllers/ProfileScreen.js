var args = arguments[0] || {};
var profileData;
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var selectedImage = null;
var id = Ti.App.Properties.getString("id");

function closeProfileFun(e) {
	$.ProfileScreen.close();
}
if (Alloy.Globals.isFbLogin){
	$.changePwdBtn.visible = false;
} 
function changePasswordFun(e){
	if ($.changePwdBtn.focusable == false) {
		return;
	}
	$.changePwdBtn.focusable = false;
	var changePassword = Alloy.createController("DriveModeScreen").getView();
	if (OS_IOS) {

		Alloy.Globals.navWindow.openWindow(changePassword);
	} else {
		
		changePassword.open();
	}
	changePassword.oldWin = $.ProfileScreen;

	Alloy.Globals.currentWindow = changePassword;

	setTimeout(function(e) {
		$.changePwdBtn.focusable = true;
	}, 2000);
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
	updateProfile.oldWin = $.ProfileScreen;

	Alloy.Globals.currentWindow = updateProfile;

	setTimeout(function(e) {
		$.editBtn.focusable = true;
	}, 2000);
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

					$.userPic.image = response.data.user_img;
					
					
					$.nameTF.value = response.data.name;
					$.emailTF.value = response.data.email;
					$.contactTF.value = response.data.contact;
					$.pinTF.value = response.data.pin_number;

					profileData = response.data;

					if (OS_IOS) {
						if ($.nameTF.value.length > 0) {
							$.nameLbl.visible = false;
						}
						if ($.emailTF.value.length > 0) {
							$.emailLbl.visible = false;
						}
						if ($.contactTF.value.length > 0) {
							$.contactLbl.visible = false;
						}
						if ($.pinTF.value.length > 0 && $.pinTF.value != null) {
							$.pinLbl.visible = false;
						}

					}
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

function showFun() {
	var dialog = Ti.UI.createAlertDialog({
		message : 'Your location pin \n' + $.pinTF.value,
		ok : 'Ok',
		title : 'Road Safety'
	});
	dialog.show();

}

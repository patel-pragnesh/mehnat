// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Alloy.Globals.isLogin = false;
Alloy.Globals.isFrom = 1;
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

function winClickFunc(e) {
	if (e.source.name != "tf") {
		$.emailTF.blur();
		$.passwordTF.blur();
	}
}

function emailReturnFunc() {
	$.passwordTF.focus();
}

function openFunc() {
	$.loginWin.animate({
		duration : 1000,
		opacity : 1
	});
}

function openForgotWindow() {
	var forgotWin = Alloy.createController("ForgotPassword").getView();
	$.navWindow.openWindow(forgotWin);
}

function loginFunc() {
	if ($.loginBtn.focusable == false) {
		return;
	}
	$.loginBtn.focusable = false;
	if ($.emailTF.value != '' && $.emailTF.value.trim().length > 0) {
		var validEmail = checkemail($.emailTF.value.trim());
		if (validEmail) {
			if ($.passwordTF.value != '' && $.passwordTF.value.trim().length > 0) {

				if ($.passwordTF.value.trim().length >= 8 && $.passwordTF.value.trim().length <= 15) {
					loginService();
				} else {
					$.loginBtn.focusable = true;
					Alloy.Globals.Notifier.show(L("login_validate_password_length"));
					return false;
				}
			} else {
				$.loginBtn.focusable = true;
				Alloy.Globals.Notifier.show(L("login_validate_password"));
				return false;
			}
		} else {
			Alloy.Globals.Notifier.show(L("login_invalid_email"));
			$.loginBtn.focusable = true;
			return false;
		}
	} else {
		$.loginBtn.focusable = true;
		Alloy.Globals.Notifier.show(L("login_username_validation"));
		return false;
	}

}

function loginService() {
	var data = {};

	data.email = $.emailTF.value.trim();
	data.password = $.passwordTF.value.trim();
	data.device_login = "pos";
	data.device_token = Alloy.Globals.deviceToken;
	//data.device_token = "3214324";
	data.udid = Ti.App.Properties.getString("uniqueDeviceId");
	
	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_LOGIN = Alloy.Globals.Constants.SERVICE_LOGIN;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_LOGIN, loginServiceCallback, data);
		$.loginBtn.focusable = true;
	} else {
		$.loginBtn.focusable = true;
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function for handling login response
 */
function loginServiceCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {
				if (response.response_code == '1') {
					if (Ti.App.Properties.getString("store_id") != response.result[0].store_id) {
						Ti.App.Properties.setString("last_updated_date", "");
						Ti.App.Properties.setString("parkedBadge", null);
						Alloy.Globals.DbManager.deleteAllTableDetails();
					}
					Ti.App.Properties.setBool("Store_check", false);
					Alloy.Globals.manager_id = response.result[0].employee_id;
					Ti.App.Properties.setString("manager_id", response.result[0].employee_id);
					Alloy.Globals.store_id = response.result[0].store_id;
					Ti.App.Properties.setString("store_id", response.result[0].store_id);
					Ti.App.Properties.setObject("storeManagerLoginResponse", response);
					Ti.App.Properties.setBool("Store_check", false);
					//Alloy.Globals.fullname = response.result[0].fullname;
					//Alloy.Globals.userimage = response.result[0].profile_pic;
					//Alloy.Globals.store_name = response.result[0].store_name;
					//Ti.App.Properties.setObject("profileData", response.result[0]);
					var d = new Date();
					tracker.setUserID(response.result[0].email);
					tracker.addEvent({
						category : "Store Manager Login",
						action : "Manager " + response.result[0].fullname + " logged in for store " + response.result[0].store_name + " at " + d.toDateString(),
						label : "Manager " + response.result[0].fullname + " logged in at " + d.toLocaleDateString(),
						value : 1
					});

					//Alloy.Globals.openHome();
					var clockIn = Alloy.createController("ClockInOutScreen").getView();
					clockIn.open();
					$.emailTF.value = "";
					$.passwordTF.value = "";
					$.navWindow.close();

				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error Login :: ' + e.message);
			tracker.addException({
				description : "Login Screen: " + e.message,
				fatal : false
			});
		}

	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}


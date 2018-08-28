// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

function winClickFunc(e) {
	if (e.source.name != "tf") {
		$.emailTF.blur();
	}
}

function submitFunc() {
	if ($.submitBtn.focusable == false) {
		return;
	}
	$.submitBtn.focusable = false;
	if ($.emailTF.value != '' && $.emailTF.value.trim().length > 0) {
		var validEmail = checkemail($.emailTF.value.trim());
		if (validEmail) { 
			forgotPasswordService();
		} else {
			Alloy.Globals.Notifier.show(L("login_invalid_email"));
			$.submitBtn.focusable = true;
			return false;
		}
	} else {
		$.submitBtn.focusable = true;
		Alloy.Globals.Notifier.show(L("login_username_validation"));
		return false;
	}
}

function forgotPasswordService() {
	var data = {};

	data.email = $.emailTF.value.trim();
	data.device_type = "pos";
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_FORGOT_PASSWORD = Alloy.Globals.Constants.SERVICE_FORGOT_PASSWORD;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_FORGOT_PASSWORD, forgotPasswordServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_FORGOT_PASSWORD);

	} else {
		$.submitBtn.focusable = true;
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function for handling forgot password service response
 */
function forgotPasswordServiceCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				Ti.API.info('response.action_success = ' + response.response_code);

				if (response.response_code == '1') {
					$.forgotPasswordWin.close();

				}
				Alloy.Globals.Notifier.show(response.responseMessage);

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error forgotpassword :: ' + e.message);
			tracker.addException({
				description : "Forgot Password: " + e.message,
				fatal : false
			});
		}

	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	$.submitBtn.focusable = true;
	Alloy.Globals.LoadingScreen.close();
}


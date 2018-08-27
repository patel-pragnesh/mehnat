var args = arguments[0] || {};
function closeForgotPasswordFun(e) {

	if (OS_IOS) {
		$.ForgotPasswordScreen.close({
			transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
	} else {
		$.ForgotPasswordScreen.close();
	}
}

function verifyEmail(e) {
	if (Ti.Network.online) {
		$.verifyBtn.touchEnabled = false;
		if ($.emailTF.value != '' && $.emailTF.value.trim().length > 0) {
			var validEmail = checkemail($.emailTF.value.trim());
			if (validEmail) {
				forgetPassword();
			} else {

				Alloy.Globals.Alert("Please enter valid email-id");
				$.verifyBtn.touchEnabled = true;
				return false;
			}
		} else {

			Alloy.Globals.Alert("Please enter your email-id");
			$.verifyBtn.touchEnabled = true;
			return false;
		}
	} else {
		$.verifyBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function winClickFun(e) {
	Ti.API.info(e.source.name);
	if (e.source.name != "tf") {
		$.emailTF.blur();

	}
}

function cancelFun(e) {
	$.ForgotPasswordScreen.close();
}

function verifyEmailViaKepad(e) {
	$.verifyBtn.fireEvent("click");
}

function forgetPassword() {
	var data = {};

	data.email = $.emailTF.value.trim();

	Ti.API.info("DATA FOR FORGET PASSWORD :  " + JSON.stringify(data));
	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var SERVICE_FORGOT_PASSWORD = Alloy.Globals.Constants.SERVICE_FORGOT_PASSWORD;
	var PARAMS = "&email=" + $.emailTF.value.trim();
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_FORGOT_PASSWORD + PARAMS, forgetpasswordCallback, data);
		Ti.API.info("URL " + DOMAIN_URL + SERVICE_FORGOT_PASSWORD + PARAMS);

	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
		$.verifyBtn.touchEnabled = true;
	}
}

function forgetpasswordCallback(e) {
	Ti.API.info("Forget Password response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				if (response.action_success == 'true') {
					$.emailTF.value = "";
					if (OS_IOS) {
						$.ForgotPasswordScreen.close({
							transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
						});
					} else {
						$.ForgotPasswordScreen.close();
					}
					Alloy.Globals.Alert(response.response_message);
				} else {
					Ti.API.info('Step1');
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error forgetpasswordCallback :: ' + e.error);

		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Ti.API.info('Step3');
	Alloy.Globals.LoadingScreen.close();
	$.verifyBtn.touchEnabled = true;
}

/*
 * Function for email validation
 */
function checkemail(emailAddress) {
	var str = emailAddress;
	var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (filter.test(str)) {
		testresults = true;
	} else {
		testresults = false;
	}
	return (testresults);
};
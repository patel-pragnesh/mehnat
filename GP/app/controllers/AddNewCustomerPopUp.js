// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('AddRemoveCash Screen');
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

function winClickFunc(e) {
	if (e.source.name != "tf") {
		//$.fullNameTf.blur();
		//$.emailTf.blur();
		$.mobNoTf.blur();
	}
}

function openFunc() {
	$.addNwCustomerWin.animate({
		duration : 200,
		opacity : 1,
	});
}

function closewinFun() {
	$.addNwCustomerWin.animate({
		duration : 500,
		opacity : 0,
	});
	setTimeout(function() {
		$.addNwCustomerWin.close();
	}, 500);

}

function nameReturnFunc() {
	$.emailTf.focus();
}

function emailReturnFunc() {

	$.mobNoTf.focus();
}



function validateCustomerDetails() {
	// if ($.fullNameTf.value != '' && $.fullNameTf.value.trim().length > 0) {
	// if ($.emailTf.value != '' && $.emailTf.value.trim().length > 0) {
	// if (ValidateEmail($.emailTf.value.trim())) {
	if ($.mobNoTf.value != '' && $.mobNoTf.value.trim().length > 0) {
		if ($.mobNoTf.value.trim().length == 12) {
			sendAppLinkService();
		} else {
			Alloy.Globals.Notifier.show("Please enter valid mobile number.");
		}
	} else {
		Alloy.Globals.Notifier.show("Please enter mobile number.");
	}
	//}
	// else {
	// Alloy.Globals.Notifier.show("Please enter a valid email id");
	// }
	// } else {
	// Alloy.Globals.Notifier.show("Please enter customer email id");
	// }
	// } else {
	// Alloy.Globals.Notifier.show("Please enter customer fullname");
	// }
}



function ValidateEmail(emailvalue) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailvalue)) {
		return (true);
	}
	return (false);
}

function addUserService() {

	var data = {};
	data.fullname = $.fullNameTf.value.trim();
	data.email = $.emailTf.value.trim();
	data.mobile_no = $.mobNoTf.value.trim();
	data.store_id = Alloy.Globals.store_id;
	data.user_id = Alloy.Globals.employee_id;
	
	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_ADD_USER = Alloy.Globals.Constants.SERVICE_ADD_USER;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_ADD_USER, addUserServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_ADD_USER);

	} else {

		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function of Add user, in this after success add user on the UI of POS left window section
 */
function addUserServiceCallback(e) {
	Ti.API.info("addUserServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				if (response.response_code == '1') {
					// args.addCustomerLbl.visible = false;
					// args.profileImage.visible = true;
					// args.centerVW.visible = true;
					// args.centerVW.getChildren()[0].text =$.fullNameTf.value;
					// args.centerVW.getChildren()[1].getChildren()[1].text = $.mobNoTf.value;
					// args.loyaltyBtn.image = "/images/Discount_btn_1.png";
					var obj = {};
					obj.homeObj = args;
					obj.userinfo = response.result;
					obj.name = $.fullNameTf.value.trim();
					obj.email = $.emailTf.value.trim();
					obj.mobile = $.mobNoTf.value.trim();
					obj.loyalty_point = 0;
					obj.id = response.result.id;
					obj.isfrom = "registerCustomer";
					
					
					var otpPopup = Alloy.createController("AddCustomerOTPDialog", obj).getView();
					otpPopup.open();

					$.addNwCustomerWin.close();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error addUserServiceCallback :: ' + e.message);
			tracker.addException({
				description : "AddNewCustomerPopup "+e.message,
				fatal : false
			});
		}
	} else {

		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}
function formateMobNoFun(e){
	var numbers = e.source.value.replace(/\D/g, ''),
        char = {0:'',3:'-',6:'-'};
    e.source.value = '';
    for (var i = 0; i < numbers.length; i++) {
       e.source.value += (char[i]||'') + numbers[i];
    }
}

//Web service for send download link to customer 
function sendAppLinkService() {

	var data = {};
	data.mobile_no = $.mobNoTf.value.trim();
	data.store_id = Alloy.Globals.store_id;
	data.user_id = Alloy.Globals.employee_id;
	
	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_SEND_APP_LINK = Alloy.Globals.Constants.SERVICE_SEND_APP_LINK;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_SEND_APP_LINK, sendAppLinkServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_SEND_APP_LINK);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function for send app link api
 */
function sendAppLinkServiceCallback(e) {
	Ti.API.info("addUserServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				if (response.response_code == '1') {
					$.addNwCustomerWin.close();
				}
				Alloy.Globals.Notifier.show(response.responseMessage);
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error sendAppLinkServiceCallback :: ' + e.message);
			tracker.addException({
				description : "AddNewCustomerPopup "+e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}
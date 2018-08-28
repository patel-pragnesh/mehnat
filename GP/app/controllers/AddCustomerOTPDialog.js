// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('OTP Screen');

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
function winClickFunc(e) {
	if (e.source.name != "tf") {
		$.otpTf.blur();
	}
}

function openFunc() {

	$.otpWin.animate({
		duration : 200,
		opacity : 1,
	});
	if (args.from == "pos" || args.from == "placeOrder" || args.from == "refund" || args.from == "giftCard") {
		$.otpTf.value = args.otp;

	} else {
		$.otpTf.value = args.userinfo.user_otp;
	}
	$.resendbtn.title = "Resend";
	$.okbtn.title = "Done";

}

function closewinFun() {
	if (args.isfrom == "registerCustomer") {
		cancelOtpService();
	} else {
		closeWin();
	}

}

function validateOTPDetails() {
	if ($.otpTf.value != '' && $.otpTf.value.trim().length > 0) {
		if (args.from == "pos" || args.from == "placeOrder" || args.from == "refund" || args.from == "giftCard") {
			verifyOTPForCheckout();
		} else {
			verifyOtpService();
		}
	} else {
		Alloy.Globals.Notifier.show("Please enter OTP.");
	}
}

function verifyOtpService() {

	var data = {};

	data.customer_id = args.userinfo.id;
	data.user_otp = $.otpTf.value.trim();
	data.user_id = Alloy.Globals.employee_id;
	data.store_id = Alloy.Globals.store_id;

	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_VERIFY_OTP = Alloy.Globals.Constants.SERVICE_VERIFY_OTP;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_VERIFY_OTP, verifyOtpServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_VERIFY_OTP);

	} else {

		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function of verify otp, in this after success add user on the UI of POS left window section
 */
function verifyOtpServiceCallback(e) {
	Ti.API.info("verifyOtpServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				if (response.response_code == '1') {

					setUserDetailInPosScreen();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error verifyOtpServiceCallback :: ' + e.message);
			tracker.addException({
				description : "AddCustomerOTPDialog " + e.message,
				fatal : false
			});
		}
	} else {

		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}

function ValidateEmail(emailvalue) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailvalue)) {
		return (true);
	}
	return (false);
}

function resendOTPFunc() {
	// if (args.from == "pos") {
	resendOTPForCheckout();
	// } else {
	//resendOtpService();
	//}
}

function resendOtpService() {

	var data = {};
	if (args.from == "placeOrder") {
		data.otp_type = 2;
		data.customer_id = Alloy.Globals.customer_id;
	} else if (args.from == "pos") {
		data.otp_type = 1;
		data.customer_id = args.userinfo.id;
	} else {
		data.otp_type = 2;
		data.customer_id = args.userinfo.id;
	}

	data.store_id = Alloy.Globals.store_id;
	data.user_id = Alloy.Globals.employee_id;

	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_RESEND_OTP = Alloy.Globals.Constants.SERVICE_RESEND_OTP;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_RESEND_OTP, resentOtpServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_RESEND_OTP);

	} else {

		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function of resend otp
 */
function resentOtpServiceCallback(e) {
	Ti.API.info("resentOtpServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				if (response.response_code == '1') {
					//$.addcustomerLbl.text = response.result.user_otp;
					$.otpTf.value = response.result.user_otp;

					//setUserDetailInPosScreen();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error resentOtpServiceCallback :: ' + e.message);
			tracker.addException({
				description : "AddCustomerOTPDialog " + e.message,
				fatal : false
			});
		}
	} else {

		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}

function setUserDetailInPosScreen() {
	args.homeObj.addCustomerLbl.visible = false;
	args.homeObj.profileImage.visible = true;
	args.homeObj.centerVW.visible = true;
	args.homeObj.centerVW.getChildren()[0].text = args.userinfo.fullname;
	args.homeObj.centerVW.getChildren()[1].getChildren()[1].text = args.userinfo.mobile_no;
	args.homeObj.centerVW.getChildren()[2].getChildren()[1].text = 0 + " Pts.";
	Alloy.Globals.name = args.userinfo.fullname;
	Alloy.Globals.mobile = args.userinfo.mobile_no;
	Alloy.Globals.email = args.userinfo.email;
	Alloy.Globals.customer_id = args.userinfo.id;
	//Alloy.Globals.getLoyalyValueService(args.userinfo.id);
	Alloy.Globals.loyalty_point = 0;
	loyaltyObj.userRemainingPoints = -1;
	loyaltyObj.userPoints = 0;
	args.homeObj.loyaltyBtn.image = "/images/Discount_btn_1.png";
	$.otpWin.close();

	var cfdObj = {};
	cfdObj.subTotal = args.homeObj.subTotalLbl;
	cfdObj.discount = args.homeObj.discountLbl;
	cfdObj.tax = args.homeObj.taxLbl;
	cfdObj.grandTotal = args.homeObj.grandTotalLbl;
	cfdObj.loyaltyPoint = args.homeObj.loyaltyPointLbl;
	cfdObj.loyaltyVal = args.homeObj.loyaltyValueLbl;
	cfdObj.cartDetail = Alloy.Globals.cartDetailSendData;
	cfdObj.customerName = args.userinfo.fullname;
	cfdObj.customerLoyaltyPoints = "0 Pts.";

	Ti.API.info('JSON.stringify(cfdObj) = ' + JSON.stringify(cfdObj));
	//setTimeout(function() {
	bonjourBrowser.clearBuffer();
	bonjourBrowser.sendData(JSON.stringify(cfdObj));
}

//Web Service for resend OTP in case of checkout and coming from pos screen
function resendOTPForCheckout() {

	var SERVICE_SEND_OTP_CHECKOUT = Alloy.Globals.Constants.SERVICE_SEND_OTP_CHECKOUT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var obj = {};
		obj.employee_id = Alloy.Globals.employee_id;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		if (args.from == "placeOrder") {
			obj.otp_type = 2;
			obj.customer_id = Alloy.Globals.customer_id;
		} else if (args.from == "pos") {
			obj.otp_type = 1;
			obj.customer_id = Alloy.Globals.customer_id;
		} else if (args.from == "refund") {
			obj.otp_type = 3;
			obj.customer_id = Alloy.Globals.customer_id;
		} else {
			obj.otp_type = 0;
			obj.customer_id = args.userinfo.id;
		}

		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_SEND_OTP_CHECKOUT, resendOTPForCheckoutCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_SEND_OTP_CHECKOUT);
	} else {

		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

};

/*
 * Getting response of resendOTPForCheckoutCallback in the callback function
 */
function resendOTPForCheckoutCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response  ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {

				if (response.response_code == '1') {
					// $.addcustomerLbl.text = response.result.user_otp;
					$.otpTf.value = response.result.user_otp;
				}
				Alloy.Globals.Notifier.show(response.responseMessage);
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error sendOTPForCheckoutCallback service : ' + e.message);
			tracker.addException({
				description : "AddCustomerOPTScreen1: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}

//Web Service for verify OTP in case of checkout and coming from pos screen
function verifyOTPForCheckout() {

	var SERVICE_VERIFY_OTP_CEHCKOUT = Alloy.Globals.Constants.SERVICE_VERIFY_OTP_CEHCKOUT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var obj = {};
		obj.employee_id = Alloy.Globals.employee_id;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		obj.user_otp = $.otpTf.value.trim();
		if (args.from == "placeOrder") {
			//obj.order_id = args.response.order_id;
			//obj.sub_total = args.response.result[0].total;
			obj.otp_type = 2;
		} else if (args.from == "refund") {
			obj.otp_type = 3;
		} else if (args.from == "giftCard") {
			obj.otp_type = 4;
		} else {
			obj.otp_type = 1;
		}
		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_VERIFY_OTP_CEHCKOUT, verifyOTPForCheckoutCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_VERIFY_OTP_CEHCKOUT);
	} else {

		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

};

/*
 * Getting response of verifyOTPForCheckoutCallback in the callback function
 */
function verifyOTPForCheckoutCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response  ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {

				if (response.response_code == '1') {

					if (args.from == "placeOrder") {
						//Alloy.Globals.setVariableAfterPlacedOrder(args.response);
						//reverseSyncService();
						Alloy.Globals.checkoutObj.splitPaymentCalculation(args.btn, 0);
						Alloy.Globals.checkoutObj.checkCashMethod();
						Alloy.Globals.Notifier.show(response.responseMessage);
					} else if (args.from == "refund") {
						Alloy.Globals.refundValidation();
					} else if (args.from == "giftCard") {
						Alloy.Globals.transaction();
					} else {
						if (args.checkoutBtn.title == L('update_txt')) {
							Alloy.Globals.updateValue(args);
						} else {
							var checkOutScreen = Alloy.createController("CheckOutScreen", args);
							Alloy.Globals.checkoutObj = checkOutScreen;
							Alloy.Globals.navwin.openWindow(checkOutScreen.getView());
						}
						Alloy.Globals.Notifier.show(response.responseMessage);
					}
					$.otpWin.close();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error verifyOTPForCheckoutCallback service : ' + e.message);
			tracker.addException({
				description : "AddCustomerOPTScreen2: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}

/*
 * Cancel OTP service call on close pop up of otp
 */
function cancelOtpService() {

	var data = {};

	data.customer_id = args.userinfo.id;

	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_CANCEL_OTP = Alloy.Globals.Constants.SERVICE_CANCEL_OTP;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_CANCEL_OTP, cancelOtpServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_CANCEL_OTP);

	} else {

		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function of cancel otp, in this after success add user on the UI of POS left window section
 */
function cancelOtpServiceCallback(e) {
	Ti.API.info("cancelOtpService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				if (response.response_code == '1') {
					closeWin();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error cancelOtpService :: ' + e.message);

		}
	} else {

		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}

function closeWin() {
	$.otpWin.animate({
		duration : 500,
		opacity : 0,
	});
	setTimeout(function() {
		$.otpWin.close();
	}, 500);
}

/*
 * Webservice call for reverse syncing
 */
function reverseSyncService() {

	var data = {};

	data.store_id = Alloy.Globals.store_id;
	data.employee_id = Alloy.Globals.employee_id;
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_REVERSE_SYNC = Alloy.Globals.Constants.SERVICE_REVERSE_SYNC;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_REVERSE_SYNC, reverseSyncServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_REVERSE_SYNC);

	} else {
		Alloy.Globals.Alert("No internet connection");
	}
}

/*
 * Callback function for reverseSyncService
 */
function reverseSyncServiceCallback(e) {
	Ti.API.info("reverseSyncServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				Ti.API.info('response.action_success = ' + response.response_code);

				if (response.response_code == '1') {

				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error social Login List :: ' + e.message);
		}

	} else {
		Alloy.Globals.Notifier.show("No internet connection");
	}
	Alloy.Globals.LoadingScreen.close();
}
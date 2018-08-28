// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

exports.finalize = function() {
	Ti.API.info('Inside Giftcard finalize');
};

/*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {
	Alloy.Globals.openLeft();
}

function openFunc() {

	previousObj = $.row1;

}

function printReceptFunc() {
	if (Ti.App.Properties.getObject("peripheral")) {
		Alloy.Globals.PrintReceipt.printGiftCardReceptFun(new Date(), getTime(new Date()));
	} else {
		showPrinterDialog();
	}
}

function showPrinterDialog() {
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : 'Printer not connected, would you like to continue without printing receipt?',
		title : 'Gongcha POS'
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			dialog.hide();
		} else {
			Alloy.Globals.PrintReceipt.printGiftCardReceptFun(new Date(), getTime(new Date()));
		}
	});
	dialog.show();
}

function getTime(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12;
	// the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm.toUpperCase();
	return strTime;
}

var method = "906";
var transationTyp = "Gift Card Activation";
function cardOptionTableClickFun(e) {
	if (previousObj) {
		previousObj.backgroundColor = "#ffffff";
	}
	e.row.backgroundColor = "#E0E0E0";
	previousObj = e.row;
	if (e.index == 0) {
		$.win.title = "Activate Card";
		$.amountLbl.text = "Activation amount";
		transationTyp = "Gift Card Activation";
		method = "906";
	} else if (e.index == 1) {
		$.win.title = "Recharge Card";
		$.amountLbl.text = "Recharge amount";
		method = "905";
		transationTyp = "Gift Card Increment";
	}

}

/*
 * Function for clearing pin number textfield value
 */

function cleardailpadfun() {
	$.calculateTF.value = "";
}

function cancelFunc(e) {
	$.addRemoveCashWin.animate({
		duration : 200,
		opacity : 0,
	});
	setTimeout(function() {
		$.addRemoveCashWin.close();
	}, 200);
}

function kepadHideFun(e) {
	if (e.source.name != "tf") {
		$.cardNoTf.blur();

	}
}

Alloy.Globals.transaction = function() {

	var data = {
		"jsonrpc" : "2.0",
		"method" : method,
		"id" : "437",
		"params" : ["0", sequenceNo(), "696636", "2164", $.cardNoTf.value.trim(), $.calculateTF.value.trim()]
	};
	

	Ti.API.info('DATA ' + JSON.stringify(data));

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.postFormData("https://dc-us2.givex.com:50104", transactionCallback, JSON.stringify(data));

	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
};

/*
 * Callback function for clockin and clock out
 */
function transactionCallback(e) {
	Ti.API.info("transactionCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				Ti.API.info('response.result[1] = ' + response.result[1]);

				if (response.result[1] == '0') {
					if (method == "905") {
						Alloy.Globals.Notifier.show("Your card has recharged successfully. Card balance is $" + response.result[3]);
					} else {
						Alloy.Globals.Notifier.show("Your card has activated now");
					}
					$.cardNoTf.value = "";
					$.calculateTF.value = "";
					if (Ti.App.Properties.getObject("peripheral")) {
						//Alloy.Globals.PrintReceipt.printGiftCardReceptFun(new Date(), getTime(new Date()), response, $.calculateTF.value.trim(), splitString($.cardNoTf.value.trim()), Alloy.Globals.store_name, transationTyp);
					} else {
						showPrinterDialog();
					}
				} else {
					//Alloy.Globals.PrintReceipt.printGiftErrorFun(new Date(), getTime(new Date()), response, $.calculateTF.value.trim(), splitString($.cardNoTf.value.trim()), Alloy.Globals.store_name, transationTyp);
					Alloy.Globals.Notifier.show(response.result[2]);
				}

				// else if (response.result[1] == '10') {
				// //Alloy.Globals.PrintReceipt.printGiftErrorFun(new Date(), getTime(new Date()), response, $.calculateTF.value.trim(), splitString($.cardNoTf.value.trim()), Alloy.Globals.store_name, transationTyp);
				// } else if (response.result[1] == '11') {
				// //Alloy.Globals.PrintReceipt.printGiftErrorFun(new Date(), getTime(new Date()), response, $.calculateTF.value.trim(), splitString($.cardNoTf.value.trim()), Alloy.Globals.store_name, transationTyp);
				// } else if (response.result[1] == '9') {
				// //	Alloy.Globals.PrintReceipt.printGiftErrorFun(new Date(), getTime(new Date()), response, $.calculateTF.value.trim(), splitString($.cardNoTf.value.trim()), Alloy.Globals.store_name, transationTyp);
				// } else if (response.result[1] == '8') {
				// Alloy.Globals.PrintReceipt.printGiftErrorFun(new Date(), getTime(new Date()), response, $.calculateTF.value.trim(), splitString($.cardNoTf.value.trim()), Alloy.Globals.store_name, transationTyp);
				// }else if (response.result[1] == '2') {
				// //Alloy.Globals.PrintReceipt.printGiftErrorFun(new Date(), getTime(new Date()), response, $.calculateTF.value.trim(), splitString($.cardNoTf.value.trim()), Alloy.Globals.store_name, transationTyp);
				// Alloy.Globals.Notifier.show(response.result[2]);
				// }
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error GiftCard :: ' + e.message);
		}
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
	Alloy.Globals.LoadingScreen.close();

}

  
/*
* Getting pin number textfield value on dialpad click
*/


function dialpadbtnfun(e) {
	$.calculateTF.value = $.calculateTF.value.trim() + e.source.name;
}

function validateCard() {

	if ($.cardNoTf.value != '' && $.cardNoTf.value.trim().length > 0) {
		if ($.calculateTF.value != '' && $.calculateTF.value.trim().length > 0) {
			sendOTPForCheckout();
		} else {
			Alloy.Globals.Notifier.show(L("amount_validation_text"));
		}

	} else {

		Alloy.Globals.Notifier.show(L("gift_card_validation"));

	}
}


// String.prototype.replaceAt=function(index, replacement) {
//     return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
// }


function splitString(number) {
	var str = number;
	var res = str.slice(6, 11);
	var newStr = str.replace(res, "XXXXX");
	Ti.API.info('newStr.length-1 = ' + newStr.length - 1);
	var finalStr = newStr + "X";

	Ti.API.info('res = ' + res);
	Ti.API.info('newStr = ' + newStr);
	Ti.API.info('finalStr = ' + finalStr);
	return finalStr;

}

function winClick(e) {
	Ti.API.info('e.source.name = ' + e.source.name);
	if (e.source.name != "tf") {
		$.cardNoTf.blur();
	}
}

function sequenceNo() {
	var number = Math.floor(Math.random() * 5000);
	return number;
}

//Web Service for send OTP in case of activate/Recharge gift card
function sendOTPForCheckout() {

	var SERVICE_SEND_OTP_CHECKOUT = Alloy.Globals.Constants.SERVICE_SEND_OTP_CHECKOUT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var obj = {};
		obj.employee_id = Alloy.Globals.employee_id;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		obj.otp_type = 4;
		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_SEND_OTP_CHECKOUT, sendOTPForCheckoutCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_SEND_OTP_CHECKOUT);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

};

/*
 * Getting response of sendOTPForCheckoutCallback in the callback function
 */

function sendOTPForCheckoutCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response  ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {

				if (response.response_code == '1') {

					var obj = {};
					obj.from = "giftCard";
					obj.otp = response.result.user_otp;
					var otpPopup = Alloy.createController("AddCustomerOTPDialog", obj).getView();
					otpPopup.open();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error sendOTPForRefundCallback service : ' + e.message);
			tracker.addException({
				description : "Order History SEND OTP: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}


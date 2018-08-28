// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('CheckOut Screen');
var paymentMethod = "";
var type = "normal";
var totalHousingAmount = Alloy.Globals.totalHousingAmount;
var splitPaymentArray = [];
var quickPaymentArray = [];
var givex_num;
var ind;
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var totalHousingAmount = Alloy.Globals.totalHousingAmount;
var splitPaymentArray = [];
var quickPaymentArray = [];
$.blcDuevalue.text = "$" + parseFloat(args.order[0].total).toFixed(2);
$.blcDuevalue.textData = Number(toFixed(args.order[0].total).toFixed(2));
$.exactBtn.textData = $.blcDuevalue.textData;
var balancDue = Number(toFixed(args.order[0].total).toFixed(2));
var changeDue = 0;

$.addPaymentLbl.textData = Number(toFixed(args.order[0].total).toFixed(2));
$.addPaymentLbl.text = "$" + toFixed(args.order[0].total).toFixed(2);
Alloy.Globals.closeFrom = 0;
Alloy.Globals.isCheckoutOpen = true;
Alloy.Globals.checkoutWin = $.checkoutWin;

$.changeDuevalue.text = "$0.00";
$.changeDuevalue.textData = 0;
function openFunc() {
	args.checkoutBtn.title = L('update_txt');
	Alloy.Globals.isUpdateAvailable = false;
	/*
	 args.checkoutBtn.visible = false;
	 args.loyaltyBtn.visible = false;
	 args.checkoutBtn.height = 0;
	 for (var i = 0; i < args.tableData.length; i++) {
	 args.tableData[i].editable = false;
	 args.tableData[i].getChildren()[0].getChildren()[1].getChildren()[0].visible = false;
	 args.tableData[i].getChildren()[0].getChildren()[1].getChildren()[2].visible = false;
	 args.tableData[i].getChildren()[2].visible = false;
	 args.tableData[i].getChildren()[3].visible = false;
	 };*/

}

Alloy.Globals.updateValue = function(obj) {
	args = obj;
	Alloy.Globals.isUpdateAvailable = false;
	$.blcDuevalue.text = "$" + parseFloat(args.order[0].total).toFixed(2);
	balancDue = Number(parseFloat(args.order[0].total).toFixed(2));
	Alloy.Globals.resetAllComponent();
	checkZeroPayment('zero_payment');

};

//func for checkout balance is zero, if yes, set payment method "zero_payment" and only enabled cash button
function checkZeroPayment(method) {
	if (args.order[0].total == 0.00 || args.order[0].total == 0) {
		$.creditCrdBtn.enabled = false;
		$.creditCrdBtn.color = "#6F7071";
		$.housingBtn.backgroundColor = "#ECECF3";
		$.housingBtn.enabled = false;
		$.housingBtn.color = "#6F7071";
		$.giftCardBtn.enabled = false;
		$.cashBtn.backgroundColor = "#c32032";
		$.cashBtn.color = "white";
		$.cashBtn.paymentMethod = method;
		paymentMethod = method;
		var obj = {};
		obj.id = Math.floor(Math.random() * 500);
		obj.method = "Cash";
		obj.status = "Success";
		obj.changeDue = 0;
		obj.trans_num = 0;
		obj.givex_num = 0;
		obj.givex_code = 0;
		obj.calculationAmt = 0.00;
		obj.isPaymentDone = true;
		obj.paymentMethod = method;
		obj.amt = 0.00;
		quickPaymentArray.push(obj);
	}
}

checkZeroPayment('zero_payment');

//func for enabled all payment method
function enabledAllPaymentMethod() {
	$.creditCrdBtn.enabled = true;
	$.creditCrdBtn.backgroundColor = "#ECECF3";
	$.creditCrdBtn.color = "#6F7071";
	$.housingBtn.backgroundColor = "#ECECF3";
	$.housingBtn.color = "#6F7071";
	$.housingBtn.enabled = true;
	$.giftCardBtn.backgroundColor = "#ECECF3";
	$.giftCardBtn.color = "#6F7071";
	$.giftCardBtn.enabled = true;
	$.cashBtn.backgroundColor = "#ECECF3";
	$.cashBtn.color = "#6F7071";
	$.cashBtn.enabled = true;
	paymentMethod = "";
	/*
	 if (paymentMethod == "cash") {
	 $.cashBtn.backgroundColor = "#c32032";
	 $.cashBtn.color = "#fff";
	 } else if (paymentMethod == "housing_management") {
	 $.housingBtn.backgroundColor = "#c32032";
	 $.housingBtn.color = "#fff";
	 } else if (paymentMethod == "credit_card") {
	 $.creditCrdBtn.backgroundColor = "#c32032";
	 $.creditCrdBtn.color = "#fff";
	 } else if (paymentMethod == "giftCard") {
	 $.giftCardBtn.backgroundColor = "#c32032";
	 $.giftCardBtn.color = "#fff";
	 }*/

}

//func for check if Cash payment is higher than balance due to disable all button except cash
function checkHigherPayment() {
	$.creditCrdBtn.enabled = false;
	$.creditCrdBtn.color = "#6F7071";
	$.creditCrdBtn.backgroundColor = "#ECECF3";
	$.housingBtn.backgroundColor = "#ECECF3";
	$.housingBtn.enabled = false;
	$.housingBtn.color = "#6F7071";
	$.giftCardBtn.enabled = false;
	$.giftCardBtn.color = "#6F7071";
	$.giftCardBtn.backgroundColor = "#ECECF3";
	$.cashBtn.backgroundColor = "#c32032";
	$.cashBtn.enabled = true;
	$.cashBtn.color = "white";
	$.cashBtn.paymentMethod = "cash";
	paymentMethod = "cash";

}

function BackFun() {
	Alloy.Globals.closeFrom = 0;
	/*
	 if (args.tableData.length > 0) {
	 for (var i = 0; i < args.tableData.length; i++) {
	 if (args.tableData[i].getChildren()[0].getChildren()[2].customLoyaltyID == "") {
	 args.tableData[i].getChildren()[0].getChildren()[1].getChildren()[0].visible = true;
	 args.tableData[i].getChildren()[0].getChildren()[1].getChildren()[2].visible = true;
	 args.tableData[i].getChildren()[3].visible = true;

	 }

	 args.tableData[i].getChildren()[2].visible = true;

	 args.tableData[i].editable = true;
	 };
	 }*/

	$.checkoutWin.close();
}

function onCloseFunc() {
	Alloy.Globals.checkoutObj = null;
	Alloy.Globals.isCheckoutOpen = false;
	if (args.tableData.length <= 0) {
		for (var i = 0; i < args.tableData.length; i++) {
			if (args.tableData[i].getChildren()[0].getChildren()[2].customLoyaltyID == "") {
				args.tableData[i].getChildren()[0].getChildren()[1].getChildren()[0].visible = true;
				args.tableData[i].getChildren()[0].getChildren()[1].getChildren()[2].visible = true;

				args.tableData[i].getChildren()[3].visible = true;
			}
			args.tableData[i].getChildren()[2].visible = true;
			args.tableData[i].editable = true;
		};

		args.taxLbl.text = "$0.00";
		args.subTotalLbl.text = "$0.00";
		args.discountLbl.text = "$0.00";
		args.grandTotalLbl.text = "$0.00";
		args.taxLbl.textData = 0;
		args.subTotalLbl.textData = 0;
		args.discountLbl.textData = 0;
		args.grandTotalLbl.textData = 0;
		args.orderListTable.top = Titanium.Platform.displayCaps.platformHeight * 0.13;
		args.orderListTable.bottom = "7.16%";
		args.checkoutBtn.height = Titanium.Platform.displayCaps.platformHeight * 0.0716;
		args.no_data_layout_headerVw.height = "60%";
		args.checkoutBtn.title = L('no_sale');
		args.orderListTable.setData([]);
		args.checkoutBtn.visible = true;
		args.loyaltyBtn.visible = true;
	} else {
		if (Alloy.Globals.closeFrom == 0) {
			args.checkoutBtn.visible = true;
			args.loyaltyBtn.visible = true;
			args.orderListTable.bottom = "7.16%";
			args.orderListTable.top = "20.23%";
			args.no_data_layout_headerVw.height = 0;
			args.checkoutBtn.title = L('checkout_txt');
			args.checkoutBtn.height = Titanium.Platform.displayCaps.platformHeight * 0.0716;
		}
	}

}

sample_data = [{
	method : "Credit Card",
	status : 'Success',
	totalAmnt : "$ 40",
}, {
	method : "Cash",
	status : 'Success',
	totalAmnt : "$ 350",
}];

function getNewOrderList(itemDetail) {
	var tableData = [];
	var row = Ti.UI.createTableViewRow({
		height : 40,
		backgroundColor : "white",
		selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
		detail : itemDetail
	});

	var methodnameLbl = Ti.UI.createLabel({
		color : '#3A322E',
		text : itemDetail.method,
		left : "10%",
		font : {
			fontSize : 15,
		},
	});
	row.add(methodnameLbl);
	var statusLbl = Ti.UI.createLabel({
		color : '#3A322E',
		text : itemDetail.status,
		font : {
			fontSize : 15,
		},
	});
	row.add(statusLbl);
	//if (itemDetail.calculationAmt != 0) {
	//var amount = toFixed(itemDetail.calculationAmt).toFixed(2);
	//} else {
	var amount = toFixed(itemDetail.amt).toFixed(2);
	//}
	var amountLbl = Ti.UI.createLabel({
		color : '#3A322E',
		text : "$" + amount,
		right : "13%",
		font : {
			fontSize : 15,
		},
		ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

	});
	row.add(amountLbl);
	var amountRemoveImg = Ti.UI.createImageView({
		image : "/images/remove.png",
		right : "6%",
		name : "remove"
	});
	row.add(amountRemoveImg);

	$.paymentTable.appendRow(row);

}

function splitTableClick(e) {

	if (e.source.name == "remove") {
		removePaymentDetail(e.index);
	}
}

function removePaymentDetail(index) {
	try {
		changeDue = toFixed(changeDue - splitPaymentArray[index].changeDue);
		if (splitPaymentArray[index].paymentMethod == "housing_management") {
			totalHousingAmount = totalHousingAmount + splitPaymentArray[index].calculationAmt;
		}
		Ti.API.info('housing amount after remove ' + totalHousingAmount);
		$.changeDuevalue.text = "$" + changeDue.toFixed(2);
		$.changeDuevalue.textData = changeDue;
		if (splitPaymentArray[index].paymentMethod == "cash") {
			if (Number(splitPaymentArray[index].calculationAmt) > Number(splitPaymentArray[index].amt)) {
				$.blcDuevalue.textData = Number($.blcDuevalue.textData) + Number(splitPaymentArray[index].amt);
			} else {
				$.blcDuevalue.textData = Number($.blcDuevalue.textData) + Number(splitPaymentArray[index].calculationAmt);
			}
		} else {
			$.blcDuevalue.textData = Number($.blcDuevalue.textData) + Number(splitPaymentArray[index].calculationAmt);
		}
		splitPaymentArray.splice(index, 1);
		$.blcDuevalue.text = "$" + parseFloat($.blcDuevalue.textData).toFixed(2);
		$.exactBtn.textData = $.blcDuevalue.textData;
		$.addPaymentLbl.textData = 0;
		$.addPaymentLbl.text = "$0.00";

		$.paymentTable.deleteRow(index);
		if (splitPaymentArray.length <= 0) {
			type = "normal";
			initChangeDue();
			$.addPaymentLbl.textData = Number(toFixed(args.order[0].total).toFixed(2));
			$.addPaymentLbl.text = "$" + toFixed(args.order[0].total).toFixed(2);

		} else {
			Ti.API.info('splitPaymentArray.length ' + splitPaymentArray.length);
			exports.checkCashMethod(paymentMethod);

		}
		//showChangeDue();

		Ti.API.info("array " + JSON.stringify(splitPaymentArray));
		Ti.API.info("type " + type);
	} catch(e) {
		Ti.API.info('Error splitTableClick ' + e.message);
	}
}

function resetFunc() {
	// authorizedTransactionRequest();
	// return;
	if (Alloy.Globals.isUpdateAvailable) {
		Alloy.Globals.Notifier.show(L("update_validation"));
		return;
	}
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : 'Are you sure want to reset all payment?',
		title : 'Gongcha POS'
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			dialog.hide();
		} else {
			Alloy.Globals.resetAllComponent();
		}
	});
	dialog.show();

}

Alloy.Globals.resetAllComponent = function() {
	type = "normal";
	initChangeDue();
	$.addPaymentLbl.textData = Number(toFixed(args.order[0].total).toFixed(2));
	$.addPaymentLbl.text = "$" + parseFloat(args.order[0].total).toFixed(2);
	$.blcDuevalue.text = "$" + parseFloat(args.order[0].total).toFixed(2);
	$.blcDuevalue.textData = Number(toFixed(args.order[0].total).toFixed(2));
	balancDue = Number(toFixed(args.order[0].total).toFixed(2));
	$.exactBtn.textData = $.blcDuevalue.textData;
	splitPaymentArray = [];
	quickPaymentArray = [];
	$.paymentTable.setData(splitPaymentArray);
	Ti.API.info("array " + JSON.stringify(splitPaymentArray));
	Ti.API.info("type " + type);
	totalHousingAmount = Alloy.Globals.totalHousingAmount;
	enabledAllPaymentMethod();
	checkZeroPayment('zero_payment');

};

function initChangeDue() {
	changeDue = 0;
	$.changeDuevalue.text = "$0.00";
	$.changeDuevalue.textData = 0;
}

function cashMethodClick() {
	settingBackgroundColorOfBtn($.cashBtn);
}

function creditCardMethodClick() {
	settingBackgroundColorOfBtn($.creditCrdBtn);
}

function loyaltyPointMethodClick() {
	//settingBackgroundColorOfBtn($.loyaltyPointBtn);
}

function HousincAccMethodClick() {
	if (Alloy.Globals.customer_id != 0 && Alloy.Globals.customer_id != "0" && Alloy.Globals.customer_id != undefined) {

		//if (Alloy.Globals.totalHousingAmount > args.order[0].total) {
		settingBackgroundColorOfBtn($.housingBtn);
		//} else {
		//Alloy.Globals.Notifier.show("You don't have sufficient amount");
		//}
	} else {
		Alloy.Globals.Notifier.show(L("add_customer_validation"));
	}
}

function giftCartBtnClick() {
	settingBackgroundColorOfBtn($.giftCardBtn);
}

function settingBackgroundColorOfBtn(btn) {
	if (Alloy.Globals.isUpdateAvailable) {
		Alloy.Globals.Notifier.show(L("update_validation"));
		return;
	}
	$.cashBtn.backgroundColor = "#ECECF3";
	$.cashBtn.color = "#6F7071";
	$.creditCrdBtn.backgroundColor = "#ECECF3";
	$.creditCrdBtn.color = "#6F7071";
	$.housingBtn.backgroundColor = "#ECECF3";
	$.housingBtn.color = "#6F7071";
	$.giftCardBtn.backgroundColor = "#ECECF3";
	$.giftCardBtn.color = "#6F7071";
	paymentMethod = btn.paymentMethod;
	if (paymentMethod == "zero_payment") {
		quickPaymentArray = [];
		var obj = {};
		obj.id = Math.floor(Math.random() * 500);
		obj.method = "Cash";
		obj.status = "Success";
		obj.changeDue = 0;
		obj.calculationAmt = 0.00;
		obj.trans_num = 0;
		obj.givex_num = 0;
		obj.givex_code = 0;
		obj.isPaymentDone = true;
		obj.paymentMethod = btn.paymentMethod;
		obj.amt = 0.00;
		quickPaymentArray.push(obj);
		return;
	}
	if (validateMethodRedundancy(paymentMethod)) {
		return;
	}

	//below condition for quick payment
	if ($.addPaymentLbl.textData == 0 && $.blcDuevalue.textData == balancDue) {
		quickPaymentCalculation(btn);
		btn.backgroundColor = "#c32032";
		btn.color = "white";
	}
	//below condition for split payment
	if ($.addPaymentLbl.textData != 0) {
		if (paymentMethod == "housing_management" || paymentMethod == "gift_card" || paymentMethod == "credit_card") {
			if (!validateCheckoutAmount()) {
				Alloy.Globals.Notifier.show("You can't pay more than balance due from account");
				return;
			}
		}

		if (paymentMethod == "credit_card") {
			if ($.addPaymentLbl.textData < 1) {
				Alloy.Globals.Notifier.show('Minimum amount to pay via credit card is $1.00');
				return;
			}
			if (Ti.App.Properties.getString("pax_ip")) {
				authorizedTransactionRequest($.addPaymentLbl.textData, btn);
			} else {
				Alloy.Globals.Notifier.show(L('pax_validation_text2'));
			}
			return;
		} else if (paymentMethod == "gift_card") {

			if (Ti.App.Properties.getString("pax_ip")) {
				swipeEMVRequest(btn);
			} else {
				Alloy.Globals.Notifier.show(L('pax_validation_text2'));
			}
			return;
			/*
			 var dialog = Ti.UI.createAlertDialog({
			 text : 'Init text',
			 title : 'Enter Givex Number',
			 style : Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT,
			 buttonNames : ['OK'],
			 keyboardType : Titanium.UI.KEYBOARD_TYPE_NUMBER_PAD
			 });
			 dialog.show();
			 dialog.addEventListener("click", function(e) {

			 if (e.text.length > 0) {
			 if (e.text > 0) {
			 preAuthGiftTransaction(toFixed($.addPaymentLbl.textData).toFixed(2), Math.floor(Math.random() * 50000), btn, e.text);
			 } else {
			 Alloy.Globals.Notifier.show("Enter valid givex number");
			 }
			 Ti.API.info('E.text ' + e.text);
			 }
			 });*/

		} else if (paymentMethod == "housing_management") {
			sendOTPForCheckout(btn);
		} else {
			exports.splitPaymentCalculation(btn, 0, 0, 0);
			exports.checkCashMethod();
		}

	}
	Ti.API.info("splitPaymentArray " + JSON.stringify(splitPaymentArray));
	Ti.API.info("quickPaymentArray " + JSON.stringify(quickPaymentArray));
}

var btnType;
//Web Service for send OTP in case of any discount applied on order and on api success goto checkout screen
function sendOTPForCheckout(btn) {
	btnType = btn;
	var SERVICE_SEND_OTP_CHECKOUT = Alloy.Globals.Constants.SERVICE_SEND_OTP_CHECKOUT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var obj = {};
		obj.employee_id = Alloy.Globals.employee_id;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		obj.otp_type = 2;
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
					obj.from = "placeOrder";
					obj.otp = response.result.user_otp;
					obj.btn = btnType;
					var otpPopup = Alloy.createController("AddCustomerOTPDialog", obj).getView();
					otpPopup.open();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error sendOTPForCheckoutCallback service : ' + e.message);
			tracker.addException({
				description : "CHECKOUT SEND OTP: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}

function validateMethodRedundancy(paymentMethod) {
	for (var i = 0; i < splitPaymentArray.length; i++) {
		if (splitPaymentArray[i].paymentMethod == paymentMethod) {
			Alloy.Globals.Notifier.show("Same payment method is not accept");
			return true;
		}
	};
	return false;
}

function validateCheckoutAmount() {
	var a = 0;
	for (var i = 0; i < splitPaymentArray.length; i++) {
		if (splitPaymentArray[i].paymentMethod != "cash") {
			a += splitPaymentArray[i].amt;
		}
	};
	var sub = balancDue - a;
	Ti.API.info('Sub ' + parseFloat(sub.toFixed(2)));
	Ti.API.info('a ' + parseFloat($.addPaymentLbl.textData));
	if (parseFloat($.addPaymentLbl.textData) > parseFloat(sub.toFixed(2))) {
		Ti.API.info('1');
		return false;
	}
	Ti.API.info('2');
	return true;

}

exports.checkCashMethod = function(paymentMethod) {

	var sum = 0;
	var subtractValue = 0;
	var cdue = 0;
	var cal_amt = 0;

	for (var i = 0; i < splitPaymentArray.length; i++) {
		if (splitPaymentArray[i].paymentMethod != "cash") {
			sum += splitPaymentArray[i].amt;
		}
		cdue += splitPaymentArray[i].amt;
	};

	if (balancDue < cdue) {
		changeDue = Number(parseFloat(cdue).toFixed(2)) - Number(parseFloat(balancDue).toFixed(2));
		$.changeDuevalue.text = "$" + changeDue.toFixed(2);
		$.changeDuevalue.textData = changeDue;
	} else {
		initChangeDue();
	}

	for (var i = 0; i < splitPaymentArray.length; i++) {
		if (splitPaymentArray[i].paymentMethod == "cash") {
			splitPaymentArray[i].changeDue = changeDue;
			if (sum != 0) {

				subtractValue = balancDue - sum;
				if (splitPaymentArray[i].amt > Number(parseFloat(subtractValue).toFixed(2))) {
					splitPaymentArray[i].calculationAmt = Number(parseFloat(subtractValue).toFixed(2));
				}
				var chk_bal = splitPaymentArray[i].calculationAmt + sum;
				Ti.API.info('splitPaymentArray : ' + JSON.stringify(splitPaymentArray));
				Ti.API.info('SUM : ' + Number(parseFloat(sum).toFixed(2)));
				Ti.API.info('chk_bal : ' + Number(parseFloat(chk_bal).toFixed(2)));
				Ti.API.info('balancDue : ' + balancDue);
				if (Number(parseFloat(chk_bal).toFixed(2)) == balancDue) {
					$.blcDuevalue.textData = 0;
					$.blcDuevalue.text = "$0.00";
					$.exactBtn.textData = 0;
				} else if (Number(parseFloat(cdue).toFixed(2)) < balancDue) {
					splitPaymentArray[i].calculationAmt = splitPaymentArray[i].amt;
					$.blcDuevalue.textData = balancDue - Number(parseFloat(cdue).toFixed(2));
					$.blcDuevalue.text = "$" + parseFloat($.blcDuevalue.textData).toFixed(2);
					$.exactBtn.textData = Number(parseFloat($.blcDuevalue.textData).toFixed(2));
				}

			} else {
				if (splitPaymentArray[i].amt >= balancDue) {
					splitPaymentArray[i].calculationAmt = Number(parseFloat(balancDue).toFixed(2));
					$.blcDuevalue.textData = 0;
					$.blcDuevalue.text = "$0.00";
					$.exactBtn.textData = 0;
				} else {
					var remainingBal = balancDue - splitPaymentArray[i].amt;
					$.blcDuevalue.textData = Number(parseFloat(remainingBal).toFixed(2));
					$.blcDuevalue.text = "$" + parseFloat($.blcDuevalue.textData).toFixed(2);
					$.exactBtn.textData = Number(parseFloat(remainingBal).toFixed(2));
					splitPaymentArray[i].calculationAmt = splitPaymentArray[i].amt;
				}
			}
			break;
		}
	};
	Ti.API.info("splitPaymentArray " + JSON.stringify(splitPaymentArray));
};

function quickPaymentCalculation(btn) {
	if (btn.paymentMethod == "housing_management") {
		if (totalHousingAmount < $.blcDuevalue.textData) {
			Alloy.Globals.Notifier.show("You don't have sufficient amount");
			return;
		}
		//totalHousingAmount = totalHousingAmount - $.blcDuevalue.textData;
		Ti.API.info('housing amount after quick payment ' + totalHousingAmount);
	}
	quickPaymentArray = [];
	var obj = {};
	obj.id = Math.floor(Math.random() * 500);
	obj.method = (btn.paymentMethod == "cash") ? "Cash" : (btn.paymentMethod == "housing_management") ? "Housing Account" : (btn.paymentMethod == "credit_card") ? "Credit Card" : (btn.paymentMethod == "gift_card") ? "Gift Card" : "Cash";
	obj.status = "Success";
	obj.changeDue = 0;
	obj.trans_num = 0;
	obj.givex_num = 0;
	obj.givex_code = 0;
	obj.calculationAmt = toFixed($.blcDuevalue.textData);
	obj.paymentMethod = btn.paymentMethod;
	obj.isPaymentDone = (btn.paymentMethod == "cash") ? true : (btn.paymentMethod == "housing_management") ? true : false;
	obj.amt = toFixed($.blcDuevalue.textData);
	quickPaymentArray.push(obj);
	type = "normal";
	splitPaymentArray = [];
}

exports.splitPaymentCalculation = function(btn, transactionNumer, givexAuthCode, givexNumber) {
	if (btn.paymentMethod == "housing_management") {

		if (totalHousingAmount < $.addPaymentLbl.textData) {
			Alloy.Globals.Notifier.show("You don't have sufficient amount");
			return;
		}
		totalHousingAmount = totalHousingAmount - $.addPaymentLbl.textData;
		Ti.API.info('housing amount after split payment ' + totalHousingAmount);
	}
	quickPaymentArray = [];
	type = "split";
	var obj = {};
	obj.id = Math.floor(Math.random() * 500);
	obj.method = (btn.paymentMethod == "cash") ? "Cash" : (btn.paymentMethod == "housing_management") ? "Housing Account" : (btn.paymentMethod == "credit_card") ? "Credit Card" : (btn.paymentMethod == "gift_card") ? "Gift Card" : "Cash";
	obj.status = "Success";
	obj.trans_num = transactionNumer;
	obj.givex_num = givexNumber;
	obj.givex_code = givexAuthCode;
	obj.isPaymentDone = (btn.paymentMethod == "cash") ? true : (btn.paymentMethod == "housing_management") ? true : false;
	obj.changeDue = 0;
	obj.paymentMethod = btn.paymentMethod;
	if ($.blcDuevalue.textData == 0) {
		obj.changeDue = $.addPaymentLbl.textData;
		changeDue = $.addPaymentLbl.textData + changeDue;
		$.changeDuevalue.text = "$" + changeDue.toFixed(2);
		$.changeDuevalue.textData = changeDue;
		if ((btn.paymentMethod == "cash")) {
			obj.calculationAmt = 0;
		} else {
			obj.calculationAmt = $.addPaymentLbl.textData;
		}

	} else if ($.addPaymentLbl.textData >= $.blcDuevalue.textData) {
		changeDue = $.addPaymentLbl.textData - $.blcDuevalue.textData;
		obj.changeDue = changeDue;

		if ((btn.paymentMethod == "cash")) {
			obj.calculationAmt = $.blcDuevalue.textData;
		} else {
			obj.calculationAmt = $.addPaymentLbl.textData;
		}
		$.blcDuevalue.textData = 0;
		$.blcDuevalue.text = "$0.00";
		$.changeDuevalue.text = "$" + changeDue.toFixed(2);
		$.changeDuevalue.textData = changeDue;
	} else {
		//Ti.API.info($.blcDuevalue.textData+"  "+$.addPaymentLbl.textData);
		var a = $.blcDuevalue.textData - $.addPaymentLbl.textData;
		$.blcDuevalue.textData = parseFloat(Number(a).toFixed(2));
		$.blcDuevalue.text = "$" + $.blcDuevalue.textData.toFixed(2);
		obj.calculationAmt = $.addPaymentLbl.textData;
	}
	obj.amt = $.addPaymentLbl.textData;
	$.exactBtn.textData = $.blcDuevalue.textData;
	$.addPaymentLbl.textData = 0;
	$.addPaymentLbl.text = "$0.00";
	splitPaymentArray.push(obj);
	//showChangeDue();
	getNewOrderList(obj);

};

function isCheckoutBalanceClearBeforPlaceOder() {
	if (type == "split") {
		var c = 0;
		for (var i = 0; i < splitPaymentArray.length; i++) {
			c += Number(splitPaymentArray[i].calculationAmt);
		};
		Ti.API.info(Number(parseFloat(c).toFixed(2)) + "  " + balancDue);
		if (Number(parseFloat(c).toFixed(2)) == balancDue && $.blcDuevalue.textData == 0) {
			return true;
		}
		Alloy.Globals.Notifier.show("More payment needed");
		return false;
	} else {
		if (quickPaymentArray.length <= 0) {

			Alloy.Globals.Notifier.show("Please select payment method");
			return false;
		}
		if (quickPaymentArray[0].paymentMethod == "housing_management") {
			if (Alloy.Globals.totalHousingAmount < quickPaymentArray[0].calculationAmt) {
				Alloy.Globals.Notifier.show("You don't have sufficient housing amount");
				return false;
			}
		}
		return true;
	}
}

function checkPaymentMethod(method) {
	try {
		var flag = false;
		if (type == "split") {
			for (var i = 0; i < splitPaymentArray.length; i++) {
				if (splitPaymentArray[i].paymentMethod == method) {
					if (method == "credit_card") {
						var detail = {};
						detail.transNum = splitPaymentArray[i].transactionNumber;
						detail.amt = splitPaymentArray[i].calculationAmt;
						return detail;
					}
					return true;
				}
			};
		} else {
			if (quickPaymentArray[0].paymentMethod == method) {
				return true;
			}
		}
		return false;
	} catch(e) {
		Ti.API.info("Error checkPaymentMethod " + e.message);
	}
}

function placedOrderService() {
	var SERVICE_PLACE_ORDER = Alloy.Globals.Constants.SERVICE_PLACE_ORDER;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var last_updated_date = "";

		var obj = {};
		obj.customer_id = Alloy.Globals.customer_id;
		obj.customer_name = Alloy.Globals.name;
		obj.customer_mobile_no = Alloy.Globals.mobile;
		obj.customer_email = Alloy.Globals.email;
		obj.customer_address = "NA";
		obj.order_type = "pos";
		obj.employee_id = parseInt(Alloy.Globals.employee_id);
		obj.employee_name = Alloy.Globals.fullname;
		obj.store_id = parseInt(Alloy.Globals.store_id);
		obj.store_name = Alloy.Globals.store_name;
		if (type == "split") {
			//obj.payment_method = JSON.stringify(createFinalSplitArray());
			obj.payment_method = JSON.stringify(splitPaymentArray);

		} else {
			obj.payment_method = JSON.stringify(quickPaymentArray);
		}

		//if (checkPaymentMethod("housing_management")) {
		//obj.order_status = "incompleted";
		//} else {
		obj.order_status = "completed";
		//}
		obj.order_total_price = args.order[0].total;
		obj.order_details = JSON.stringify(args.order);
		obj.user_id = Alloy.Globals.employee_id;

		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_PLACE_ORDER, placedOrderServiceCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_PLACE_ORDER);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

// var dummyResponse = [{
//   "method": "T01",
//   "version": "T01",
//   "resultCode": "000000",
//   "resultMessage": "OK",
//   "authCode": "009538",
//   "referenceNumber": "821113547784",
//   "ECRreferenceNumber": "3243",
//   "cardLastFourNumber": "4111",
//   "entryMode": "Scan",
//   "expireDate": "1222",
//   "cardType": "02",
//   "cardHolder": "UAT USA/Test Card 07      ",
//   "transactionNumber": "0141",
//   "hostReferenceNumber": "1094218923",
//   "AID": "A0000000041010",
//   "TC": "39C4234C309BAB83",
//   "appName": "MasterCard"
// }]
// var msrRes=[{
//   "method": "T01",
//   "version": "T01",
//   "resultCode": "000000",
//   "resultMessage": "OK",
//   "authCode": "",
//   "referenceNumber": "",
//   "ECRreferenceNumber": "3243",
//   "cardLastFourNumber": "0016",
//   "entryMode": "Manual",
//   "expireDate": "1225",
//   "cardType": "Visa",
//   "cardHolder": "",
//   "transactionNumber": "0148",
//   "hostReferenceNumber": "1094222794"
// }];

Alloy.Globals.setVariableAfterPlacedOrder = function(response) {
	var customerName = Alloy.Globals.name;
	showChangeDue();
	Alloy.Globals.closeFrom = 1;

	Alloy.Globals.processSync();
	$.checkoutWin.close();

	tracker.addEvent({
		category : "Transaction",
		action : "OrderId: " + response.order_id + " Payment method " + paymentMethod + " and checkout balance " + args.order[0].total,
		label : "",
		value : 1
	});

	Alloy.Globals.refreshCartItem();

	//
	// var device = Alloy.Globals.DbManager.getPrinterDetail().to;
	// Ti.API.info('device =' + JSON.stringify(device));
	// Ti.API.info('device2 =' + device[0].peripheral);
	// centralManager.connectPeripheral(device[0].peripheral);

	// if (Ti.App.Properties.getObject("device")) {
	// var device = Ti.App.Properties.getObject("device");
	// centralManager.connectPeripheral(Ti.App.Properties.getObject("device"));
	// }
	//Alloy.Globals.printReceiptFun(response, getDate(new Date()));
	var logInData = Ti.App.Properties.getObject("loginResponse");
	var printConfigData = Alloy.Globals.DbManager.getPrinterReceiptConfigurationDetailFromDB();

	//Wrap data to be printed
	var printData = {
		orderData : response,
		printConfig : printConfigData,
		customerName : customerName,
		storeName : logInData.result[0].store_name,
		storeAddress : logInData.result[0].store_address,
		brandName : "Gongcha",
		dateTime : getDate(new Date())
	};

	//Print receipt
	if (Alloy.Globals.printer.getReceiptPrinterMode() == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH) {

		//Check connection with printer
		var blePrinterId = Alloy.Globals.printer.getReceiptBluetoothPrinterId();
		if (blePrinterId != null && blePrinterId != "") {

			Alloy.Globals.printer.connectBluetoothReceiptPrinter(blePrinterId, function(status, message) {
				if (status) {
					//Print test receipt
					Alloy.Globals.printer.printReceiptViaBluetooth(printData, function(status) {
						Ti.API.info('Receipt printed successfully by bluetooth printer');
					});
				} else {
					if (message) {
						Alloy.Globals.Notifier.show(message);
					} else {
						Alloy.Globals.Notifier.show(L('printer_connection_failed'));
					}
				}
			});
		} else {
			Alloy.Globals.Notifier.show(L("printer_connection_failed"));
		}

	} else if (Alloy.Globals.printer.getReceiptPrinterMode() == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_NETWORK) {

		//Fetch saved ip address from cache
		var networkPrinterId = Alloy.Globals.printer.getReceiptNetworkPrinterId();

		if (networkPrinterId != null && networkPrinterId != "") {

			//Check connection with printer
			Alloy.Globals.printer.connectNetworkReceiptPrinter(networkPrinterId, function(status) {
				if (status) {
					//Print test receipt
					Alloy.Globals.printer.printReceiptViaNetwork(printData, function(status) {
						Ti.API.info('Receipt printed successfully by network printer');
					});
				} else {
					Alloy.Globals.Notifier.show(L("printer_connection_failed"));
				}
			});
		} else {
			Alloy.Globals.Notifier.show(L("printer_connection_failed"));
		}

	}

	//Print label
	var labelPrinterId = Alloy.Globals.printer.getLabelNetworkPrinterId();

	if (labelPrinterId != null && labelPrinterId != "") {

		//Check connection with printer
		Alloy.Globals.printer.connectNetworkLabelPrinter(labelPrinterId, function(status) {
			if (status) {

				var drinkIndex = 1;
				//Print label for all items in the order
				for (var i = 0; i < printData.orderData.result[0].orderDetails.length; i++) {
					//Repeat print of an item for the quantity defined
					for (var j = 0; j < printData.orderData.result[0].orderDetails[i].quantity; j++) {
						Alloy.Globals.printer.printLabelViaNetwork(printData, i, drinkIndex, function(status) {
							Ti.API.info('Label printed successfully by network printer');
						});
						drinkIndex++;
					};
				}
			}
		});
	}

	// if (Ti.App.Properties.getString("receiptPrinterMode") == "receiptViaNetwork") {
	// if (Ti.App.Properties.getObject("receiptNetworkPrinter")) {
	// Alloy.Globals.PrintReceipt.printReceiptViaNetworkFun(response, customerName, logInData.result[0].store_name, logInData.result[0].store_address);
	// }
	// } else {
	// if (Ti.App.Properties.getObject("peripheral")) {
	//
	// Alloy.Globals.PrintReceipt.printReceiptFun(response, getDate(new Date()), customerName, logInData.result[0].store_name, logInData.result[0].store_address);
	// //Dummy
	// //Alloy.Globals.PrintReceipt.printMSRReceiptFun(logInData.result[0].store_name, logInData.result[0].store_address,logInData.result[0].phone_number,new Date(), getTime(new Date()),msrRes[0]);
	//
	// }
	// }

	// customerName = "";
	// for (var i = 0; i < response.result[0].orderDetails.length; i++) {
	// var modifierStr = "";
	// var isLastItem = 0;
	// var isFirstItem = "";
	// var itemCounterValue = i + 1 + "/" + response.result[0].orderDetails.length;
	// var menuDetail = response.result[0].orderDetails;
	// for (var j = 0; j < menuDetail[i].customizationOpt.length; j++) {
	// for (var k = 0; k < menuDetail[i].customizationOpt[j].option.length; k++) {
	// if (j == 0 && k == 0) {
	// modifierStr = modifierStr + menuDetail[i].customizationOpt[j].option[k].modifier_prefix_name + "" + menuDetail[i].customizationOpt[j].option[k].modifier_name;
	// } else {
	// modifierStr = modifierStr + "," + menuDetail[i].customizationOpt[j].option[k].modifier_prefix_name + "" + menuDetail[i].customizationOpt[j].option[k].modifier_name;
	// }
	// }
	// }
	//
	// //Ti.API.info('modifierStr =' + modifierStr);
	// var buffer = Ti.createBuffer({
	// length : 3
	// });
	// buffer[0] = 0x1B;
	// buffer[1] = 0x1D;
	// buffer[2] = 48;
	//
	// var quantity = parseInt(response.result[0].orderDetails[i].quantity);
	// for (var j = 0; j < quantity; j++) {
	// if (i + 1 == response.result[0].orderDetails.length && j + 1 == quantity) {
	// isLastItem = 1;
	// } else {
	// isLastItem = -1;
	// }
	// if (i == 0 && j == 0) {
	// isFirstItem = "1";
	// } else {
	// isFirstItem = "-1";
	// }
	// //Ti.API.info('response.tostring() = ' + JSON.stringify(response));
	// //Alloy.Globals.PrintLabel.printLabelFun(response.result[0].orderDetails[i].menu_name + " " + response.result[0].orderDetails[i].serving_name.charAt(0), modifierStr, itemCounterValue, isLastItem, JSON.stringify(response), response.order_id);
	// Alloy.Globals.PrintLabel.printLabelFun(response.result[0].orderDetails[i].menu_name + " " + response.result[0].orderDetails[i].serving_name.charAt(0), modifierStr, itemCounterValue, isLastItem, JSON.stringify(response), response.order_token, isFirstItem);
	// }
	// }
	reverseSyncService();

};
function showChangeDue() {
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Ok'],
		//message : 'Printer not connected, would you like to continue without printing receipt?',
		title : 'Change Due: $' + toFixed(changeDue).toFixed(2)
	});
	if (changeDue != 0) {
		dialog.show();
	}

}

/*
 * Getting response of placedOrderServiceCallback in the callback function and perform all database related stuff
 */

function placedOrderServiceCallback(e) {
	Ti.API.info('Response : ' + JSON.stringify(e));
	if (e.success) {
		try {
			var response = JSON.parse(e.response);
			Ti.API.info('Response : ' + JSON.stringify(response));
			if (response != null) {
				if (response.response_code == '1') {

					Ti.API.info('insuccess');
					Alloy.Globals.LoadingScreen.close();
					Alloy.Globals.Notifier.show(response.msg);
					Alloy.Globals.setVariableAfterPlacedOrder(response);
					splitPaymentArray = [];
					quickPaymentArray = [];

				} else {
					Alloy.Globals.LoadingScreen.close();
					Alloy.Globals.Notifier.show(response.msg);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
				Alloy.Globals.LoadingScreen.close();
			}
		} catch(e) {
			Alloy.Globals.LoadingScreen.close();
			Ti.API.info('Error CheckOutScreen : ' + e.message);
			tracker.addException({
				description : "CheckOutScreen: " + e.message,
				fatal : false
			});

		}
	} else {
		Alloy.Globals.LoadingScreen.close();
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);

	}

}

var res = {
	"method" : "T01",
	"version" : "T01",
	"resultCode" : "000000",
	"resultMessage" : "OK",
	"authCode" : "000000",
	"referenceNumber" : "822513854150",
	"ECRreferenceNumber" : "3243",
	"cardLastFourNumber" : "9997",
	"entryMode" : "Manual",
	"expireDate" : "1225",
	"cardType" : "OTHER",
	"cardHolder" : "",
	"transactionNumber" : "07",
	"hostReferenceNumber" : "1097392914"
};

function doneFunc() {

	//swipeEMVRequest();
	//var logInData = Ti.App.Properties.getObject("loginResponse");
	//Alloy.Globals.PrintReceipt.printMSRReceiptFun(logInData.result[0].store_name, logInData.result[0].store_address,logInData.result[0].phone_number,new Date(), getTime(new Date()),res);
	//return;

	if (role_permission.indexOf("place_order") != -1) {
		if (Alloy.Globals.isUpdateAvailable) {
			Alloy.Globals.Notifier.show(L("update_validation"));
			return;
		}
		if (isCheckoutBalanceClearBeforPlaceOder()) {
			// var printerConnected = false;
			// if (Ti.App.Properties.getString("receiptPrinterMode") == "receiptViaNetwork") {
			// if (Ti.App.Properties.getObject("receiptNetworkPrinter")) {
			// printerConnected = true;
			// }
			// } else {
			// if (Ti.App.Properties.getObject("peripheral")) {
			// printerConnected = true;
			// }
			// }
			if (Alloy.Globals.printer.isReceiptPrinterAvailable()) {
				if (checkPaymentMethod("credit_card") || checkPaymentMethod("gift_card")) {

					if (checkPaymentMethod("credit_card")) {
						if (Ti.App.Properties.getString("pax_ip")) {
							isCreditOrGiftTransaction();
						} else {
							Alloy.Globals.Notifier.show(L('pax_validation_text2'));
						}
					} else {
						isCreditOrGiftTransaction();
					}

				} else {
					placedOrderService();
				}
			} else {
				showPrinterDialog();
			}
		}
	} else {
		Alloy.Globals.Notifier.show(L('validation_order_permission'));
	}

}

function isCreditOrGiftTransaction() {
	for (var i = 0; i < splitPaymentArray.length; i++) {
		if (splitPaymentArray[i].isPaymentDone == false) {
			if (splitPaymentArray[i].paymentMethod == "credit_card") {
				postAuthorizedTransactionRequest(splitPaymentArray[i].calculationAmt, splitPaymentArray[i].trans_num, i);
				return false;
			} else if (splitPaymentArray[i].paymentMethod == "gift_card") {
				postAuthGiftTransaction(splitPaymentArray[i].calculationAmt, splitPaymentArray[i].trans_num, splitPaymentArray[i].givex_num, i, splitPaymentArray[i].givex_code);
				return false;
			}
		}
	};
	return true;
}

function cancelTransactionInErrorCase(method) {
	for (var i = 0; i < splitPaymentArray.length; i++) {
		if (splitPaymentArray[i].paymentMethod == method) {
			if (splitPaymentArray[i].isPaymentDone == true) {
				if (method == "credit_card") {
					returnCreditTransactionRequest(splitPaymentArray[i].calculationAmt, splitPaymentArray[i].trans_num, i);
				} else if (method == "gift_card") {
					returnGiftTransactionRequest(splitPaymentArray[i].calculationAmt, splitPaymentArray[i].trans_num, splitPaymentArray[i].givex_code, splitPaymentArray[i].givex_num, i);
				}

			}
		}
	};

}

function returnCreditTransactionRequest(amt, transNum, index) {
	ind = index;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var request = Alloy.Globals.PaxCommunicator.voidTransactionRequest(amt, transNum);
		Ti.API.info('request ' + request);
		var base64 = Ti.Utils.base64encode(request);
		var paxURL = "http://" + Ti.App.Properties.getString("pax_ip") + ":10009/?" + base64;
		Alloy.Globals.PaxCommunicator.get(paxURL, returnCreditTransactionRequestCallback);
		Ti.API.info('Transaction URL ' + paxURL);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

}

function returnCreditTransactionRequestCallback(e) {

	if (e.success) {
		try {
			var response = e.response;
			Ti.API.info('Response : ' + JSON.stringify(response));
			if (response != null) {

				var res = Alloy.Globals.PaxCommunicator.parserTransactionResponse(e.response, "transaction");
				if (res.resultCode == "000000") {
					removePaymentDetail(ind);
					Alloy.Globals.Notifier.show("Payment has returned successfully");

				} else {

					checkTransactionErrorMsg(res.resultCode, res.resultMessage);

					Alloy.Globals.LoadingScreen.close();
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
				Alloy.Globals.LoadingScreen.close();
			}
		} catch(err) {
			Ti.API.info('transactionEMVRequestCallback Error ' + err.message);
			tracker.addException({
				description : "CheckOutScreen2: " + err.message,
				fatal : false
			});
			Alloy.Globals.LoadingScreen.close();
		}
	} else {
		Alloy.Globals.Notifier.show(e.message);
		Alloy.Globals.LoadingScreen.close();

	}

}

function initializeEMVRequest() {
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var request = Alloy.Globals.PaxCommunicator.swipeGiftCardRequest();
		Ti.API.info('request ' + request);
		var base64 = Ti.Utils.base64encode(request);
		var paxURL = "http://" + Ti.App.Properties.getString("pax_ip") + ":10009/?" + base64;
		Alloy.Globals.PaxCommunicator.get(paxURL, initializeEMVRequestCallback);
		Ti.API.info('Transaction URL ' + paxURL);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

}

function initializeEMVRequestCallback(e) {
	Ti.API.info('CALLBACK initializeEVMRequestCallback ' + JSON.stringify(e));
	if (e.success) {
		try {
			var response = e.response;
			//Ti.API.info('Response : ' + JSON.stringify(response));
			if (response != null) {
				var res = Alloy.Globals.PaxCommunicator.parserInitializeResponse(e.response, "initiallize");
				if (res.resultCode == "000000") {
					//transactionEMVRequest(toFixed(args.order[0].total));

					//transaction();
				} else {
					checkTransactionErrorMsg(res.resultCode);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(err) {
			Ti.API.info('transactionEMVRequestCallback Error ' + err.message);
			tracker.addException({
				description : "CheckOutScreen2: " + err.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}

}

var btnObj;

function authorizedTransactionRequest(amt, btn) {
	btnObj = btn;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var request = Alloy.Globals.PaxCommunicator.createAuthTransactionRequest(amt.toFixed(2));
		Ti.API.info('request ' + request);
		var base64 = Ti.Utils.base64encode(request);
		var paxURL = "http://" + Ti.App.Properties.getString("pax_ip") + ":10009/?" + base64;
		Alloy.Globals.PaxCommunicator.get(paxURL, authorizedTransactionRequestCallback);
		Ti.API.info('Transaction URL ' + paxURL);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

function authorizedTransactionRequestCallback(e) {
	Ti.API.info('E ' + JSON.stringify(e));
	if (e.success) {
		try {
			var response = e.response;
			Ti.API.info('Response : ' + JSON.stringify(response));
			if (response != null) {

				var res = Alloy.Globals.PaxCommunicator.parserTransactionResponse(e.response, "transaction");
				if (res.resultCode == "000000") {
					exports.splitPaymentCalculation(btnObj, res.transactionNumber, 0, 0);
					exports.checkCashMethod();
					Alloy.Globals.Notifier.show(L('pax_auth'));
					Ti.API.info("splitPaymentArray " + JSON.stringify(splitPaymentArray));
					Ti.API.info("quickPaymentArray " + JSON.stringify(quickPaymentArray));
				} else {
					checkTransactionErrorMsg(res.resultCode);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(err) {
			Ti.API.info('transactionEMVRequestCallback Error ' + err.message);
			tracker.addException({
				description : "CheckOutScreen2: " + err.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(e.message);

	}
	Alloy.Globals.LoadingScreen.close();

}

function postAuthorizedTransactionRequest(amt, transNum, index) {
	ind = index;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var request = Alloy.Globals.PaxCommunicator.createPostTransactionRequest(amt.toFixed(2), transNum);
		Ti.API.info('request ' + request);
		var base64 = Ti.Utils.base64encode(request);
		var paxURL = "http://" + Ti.App.Properties.getString("pax_ip") + ":10009/?" + base64;
		Alloy.Globals.PaxCommunicator.get(paxURL, postAuthorizedTransactionRequestCallback);
		Ti.API.info('Transaction URL ' + paxURL);
	} else {
		cancelTransactionInErrorCase("gift_card");
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

function postAuthorizedTransactionRequestCallback(e) {
	Ti.API.info('E ' + JSON.stringify(e));
	if (e.success) {
		try {
			var response = e.response;
			Ti.API.info('Response : ' + JSON.stringify(response));
			if (response != null) {

				var res = Alloy.Globals.PaxCommunicator.parserTransactionResponse(e.response, "transaction");
				if (res.resultCode == "000000") {
					splitPaymentArray[ind].isPaymentDone = true;
					splitPaymentArray[ind].trans_num = res.hostReferenceNumber;
					Alloy.Globals.Notifier.show(L('pax_approved'));
					if (isCreditOrGiftTransaction()) {
						Ti.API.info('***************************');
						placedOrderService();
						return;
					}
					Alloy.Globals.LoadingScreen.close();

					Ti.API.info('Credit DONE : ' + JSON.stringify(splitPaymentArray));
				} else {
					Alloy.Globals.LoadingScreen.close();
					checkTransactionErrorMsg(res.resultCode);
					cancelTransactionInErrorCase("gift_card");

				}

			} else {
				Alloy.Globals.LoadingScreen.close();
				cancelTransactionInErrorCase("gift_card");
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(err) {
			Alloy.Globals.LoadingScreen.close();
			cancelTransactionInErrorCase("gift_card");
			Ti.API.info('transactionEMVRequestCallback Error ' + err.message);
			tracker.addException({
				description : "CheckOutScreen2: " + err.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.LoadingScreen.close();
		Alloy.Globals.Notifier.show(e.message);
		cancelTransactionInErrorCase("gift_card");

	}

}

function getDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12;
	// the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = date.toLocaleDateString() + " " + hours + ':' + minutes + ' ' + ampm.toUpperCase();
	return strTime;
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
			if (checkPaymentMethod("credit_card") || checkPaymentMethod("gift_card")) {
				if (checkPaymentMethod("credit_card")) {
					if (Ti.App.Properties.getString("pax_ip")) {
						isCreditOrGiftTransaction();
					} else {
						Alloy.Globals.Notifier.show(L('pax_validation_text2'));
					}
				} else {
					isCreditOrGiftTransaction();
				}
			} else {
				placedOrderService();
			}
		}
	});
	dialog.show();
}

function checkHousingAmountAvailable() {
	if (Alloy.Globals.totalHousingAmount > args.order[0].total) {
		placedOrderService();
	} else {
		Alloy.Globals.Notifier.show("You don't have sufficient amount");
	}
}

/*
function transaction() {
var data = {
"jsonrpc" : "2.0",
"method" : "902",
"id" : "437",
"params" : ["0", "4591", "5678:31024", "1234:3547", "603628784142002187878", "8.00"]
};

Ti.API.info('DATA ' + JSON.stringify(data));

if (Ti.Network.online) {

// Communicator.postFormData("https://dev-dataconnect.givex.com:55104", transactionCallback, JSON.stringify(data));
// Communicator.postFormData("https://dev-dataconnect.givex.com:56104", transactionCallback, JSON.stringify(data));
Communicator.postFormData("https://dev-dataconnect.givex.com:55105", transactionCallback, JSON.stringify(data));
Ti.API.info('https://dev-dataconnect.givex.com:55105');

} else {
Alloy.Globals.Alert("No internet connection");
}
}

function reverseTransaction() {
var data = {
"jsonrpc" : "2.0",
"method" : "918",
"id" : "437",
"params" : ["0", "4591", "5678:31024", "1234:3547", "603628784142002187878", "8.00"]
};

Ti.API.info('DATA ' + JSON.stringify(data));

if (Ti.Network.online) {

//Communicator.postFormData("https://dev-dataconnect.givex.com:55104", transactionCallback, JSON.stringify(data));
//Communicator.postFormData("https://dev-dataconnect.givex.com:56104", transactionCallback, JSON.stringify(data));
Communicator.postFormData("https://dev-dataconnect.givex.com:55105", reverseTransactionCallback, JSON.stringify(data));
Ti.API.info('https://dev-dataconnect.givex.com:55105');

} else {
Alloy.Globals.Alert("No internet connection");
}
}

function reverseTransaction1() {
var data = {
"jsonrpc" : "2.0",
"method" : "901",
"id" : "437",
"params" : ["0", "4591", "5678:31024", "1234:3547", "603628784142002187878", "8.00"]
};

Ti.API.info('DATA ' + JSON.stringify(data));

if (Ti.Network.online) {

//Communicator.postFormData("https://dev-dataconnect.givex.com:55104", transactionCallback, JSON.stringify(data));
//Communicator.postFormData("https://dev-dataconnect.givex.com:56104", transactionCallback, JSON.stringify(data));
Communicator.postFormData("https://dev-dataconnect.givex.com:50104", transactionCallback, JSON.stringify(data));
Ti.API.info('https://dev-dataconnect.givex.com:50104');
} else {
Alloy.Globals.Alert("No internet connection");
}
}*/

/*
* Callback function for clockin and clock out
*/
/*
function transactionCallback(e) {
Ti.API.info("transactionCallback response : " + JSON.stringify(e));
if (e.success) {

} else {
//reverseTransaction();
}

}*/

// function reverseTransactionCallback(e) {
// Ti.API.info("reverseTransactionCallback response : " + JSON.stringify(e));
// if (e.success) {
//
// } else {
// reverseTransaction1();
// }
//
// }

function openAddPaymentPopUp() {
	var addPaymentpopup = Alloy.createController("AddPaymentPopUp").getView();
	addPaymentpopup.open();
}

function selectPaymentFunc(e) {
	if (args.order[0].total == 0.00 || args.order[0].total == 0) {
		return;
	}
	Alloy.Globals.splitPaymentCalculation(e.source.textData);
	enabledAllPaymentMethod();

}

Alloy.Globals.splitPaymentCalculation = function(payment) {
	if (args.order[0].total == 0.00 || args.order[0].total == 0) {
		return;
	}
	$.addPaymentLbl.text = "$" + toFixed(payment).toFixed(2);
	$.addPaymentLbl.textData = toFixed(payment);
	Ti.API.info($.addPaymentLbl.textData + " " + $.blcDuevalue.textData + "  " + balancDue);
};

function preAuthGiftTransaction(amt, transactionCode, btn, givexNum) {
	btnObj = btn;
	givex_num = givexNum;
	var data = {
		"jsonrpc" : "2.0",
		"method" : "920", //Pre-Auth
		"id" : "437",
		"params" : ["0", transactionCode, "696636", "2164", givex_num, amt]
		//"params" : ["0", "4592", "5678:31024", "1234:3547", "603628455842002187867", "0.01"],
	};

	Ti.API.info('DATA ' + JSON.stringify(data));

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.postFormData("https://dc-us2.givex.com:50104", preAuthGiftTransactionCallback, JSON.stringify(data));
		Ti.API.info('https://dc-us2.givex.com:50104');
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 *Callback function for pre auth gift transaction
 */

function preAuthGiftTransactionCallback(e) {
	Ti.API.info("preAuthGiftTransactionCallback response : " + JSON.stringify(e));
	if (e.success) {
		var response = JSON.parse(e.response);
		Ti.API.info("response : " + response);
		if (response.result[1] == "0") {

			Ti.API.info('Trasaction Code ' + response.result[0]);
			Ti.API.info('Givex Code ' + response.result[2]);
			exports.splitPaymentCalculation(btnObj, response.result[0], response.result[2], givex_num);
			exports.checkCashMethod();
		} else {
			if (response.result[1] == "9") {
				Alloy.Globals.Notifier.show("Insufficient balance, please recharge first");
			} else {
				Alloy.Globals.Notifier.show("Authorization failed. Please try again");
			}

		}

	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}

function postAuthGiftTransaction(amt, transactionCode, givexNum, index, authCode) {
	ind = index;
	var data = {
		"jsonrpc" : "2.0",
		"method" : "921", //Post-Auth
		"id" : "437",
		"params" : ["0", transactionCode, "696636", "2164", givex_num, amt, authCode]
	};
	Ti.API.info('DATA ' + JSON.stringify(data));

	if (Ti.Network.online) {
		Communicator.postFormData("https://dc-us2.givex.com:50104", postAuthGiftTransactionCallback, JSON.stringify(data));
		Ti.API.info('https://dc-us2.givex.com:50104');
	} else {
		cancelTransactionInErrorCase("credit_card");
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 *Callback function for pre auth gift transaction
 */

function postAuthGiftTransactionCallback(e) {
	Ti.API.info("postAuthGiftTransactionCallback response : " + JSON.stringify(e));
	if (e.success) {
		var response = JSON.parse(e.response);
		Ti.API.info("response : " + response);
		if (response.result[1] == "0") {

			Ti.API.info('trasaction Code ' + response.result[0]);
			Ti.API.info('givex Code ' + response.result[2]);
			splitPaymentArray[ind].isPaymentDone = true;
			splitPaymentArray[ind].trans_num = response.result[0];
			splitPaymentArray[ind].givex_code = response.result[2];
			if (isCreditOrGiftTransaction()) {
				Ti.API.info('***************************');
				placedOrderService();
				return;
			}
			Alloy.Globals.LoadingScreen.close();
			Ti.API.info('splitPaymentArray ' + JSON.stringify(splitPaymentArray));

		} else {
			if (response.result[1] == "9") {
				Alloy.Globals.Notifier.show("Insufficient balance, please recharge first");
			} else {
				Alloy.Globals.Notifier.show("Post Authorization failed. Please try again");
			}

			Alloy.Globals.LoadingScreen.close();
			cancelTransactionInErrorCase("credit_card");
		}

	} else {
		Alloy.Globals.LoadingScreen.close();
		cancelTransactionInErrorCase("credit_card");
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}

}

function returnGiftTransactionRequest(amt, transactionCode, givexCode, givexNum, index) {
	ind = index;
	var data = {
		"jsonrpc" : "2.0",
		"method" : "918", //Reversal
		"id" : "437",
		"params" : ["0", transactionCode, "696636", "2164", givex_num, amt]
	};
	Ti.API.info('DATA ' + JSON.stringify(data));

	if (Ti.Network.online) {
		Communicator.postFormData("https://dc-us2.givex.com:50104", returnGiftTransactionRequestCallback, JSON.stringify(data));
		Ti.API.info('https://dc-us2.givex.com:50104');
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 *Callback function for pre auth gift transaction
 */

function returnGiftTransactionRequestCallback(e) {
	Ti.API.info("returnGiftTransactionRequestCallback response : " + JSON.stringify(e));
	if (e.success) {
		var response = JSON.parse(e.response);
		Ti.API.info("response : " + response);
		if (response.result[1] == "0") {

			removePaymentDetail(ind);
			Alloy.Globals.LoadingScreen.close();
			Ti.API.info('splitPaymentArray ' + JSON.stringify(splitPaymentArray));
		} else {
			Alloy.Globals.Notifier.show("Return of gift payment has failed. Please try again");
			Alloy.Globals.LoadingScreen.close();
		}
	} else {
		Alloy.Globals.LoadingScreen.close();
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}

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

// String.prototype.replaceAt=function(index, replacement) {
//      return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
// }

// setTimeout(function() {
//connectToPrinter();
// }, 1000);

// var devicesList = [];
// var storedCFDPeripheral = Ti.App.Properties.getObject("peripheral");
//
// function connectToPrinter() {
// try {
// for (var i = 0; i < devicesList.length; i++) {
// if (devicesList[i].advertisementData.hasOwnProperty("kCBAdvDataServiceUUIDs")) {
// if (devicesList[i].advertisementData.kCBAdvDataServiceUUIDs[0] == storedPeripheral[0] && devicesList[i].advertisementData.kCBAdvDataServiceUUIDs[1] == storedPeripheral[1]) {
// var device = devicesList[i];
// Ti.API.info('devicesList[i] =' + JSON.stringify(devicesList[i]));
// centralManager.connectPeripheral(device.peripheral);
// //centralManager.stopScan();
// }
//
// }
// }
// } catch(e) {
// Ti.API.info("In catch = " + e.message);
//
// }
// }
//
// centralManager.addEventListener('didConnectPeripheral', function(e) {
// Ti.API.info('didConnectPeripheral');
// Ti.API.info(e);
// Ti.API.info('here***********');
//
// // Now you can add event listener to the found peripheral.
// // Make sure to handle event listeners properly and remove them
// // when you don't need them anymore
// try {
// myPeripheral = e.peripheral;
// Alloy.Globals.myPeripheral = myPeripheral;
// Alloy.Globals.myPeripheralName = myPeripheral.name;
// Ti.API.info("Peripheral name = " + myPeripheral.name);
// Ti.API.info("Peripheral rssi = " + myPeripheral.rssi);
// Ti.API.info("Peripheral state = " + myPeripheral.state);
// Ti.API.info("Peripheral services = " + myPeripheral.services);
//
// var uuids = [];
//
// for (var i = 0; i < devicesList.length; i++) {
// if (devicesList[i].peripheral == myPeripheral) {
// devicesList[i].connected = true;
//
// Ti.API.info('advertisementData.kCBAdvDataServiceUUIDs = ' + devicesList[i].advertisementData.kCBAdvDataServiceUUIDs.toString());
// // Ti.API.info("advertisementData.kCBAdvDataServiceUUIDs type of = " + typeof devicesList[i].advertisementData.kCBAdvDataServiceUUIDs);
// var tempuuids = devicesList[i].advertisementData.kCBAdvDataServiceUUIDs.toString().split(",");
//
// for (var i = 0; i < tempuuids.length; i++) {
// uuids.push(tempuuids[i].toString());
// };
// }
// }
//
// Alloy.Globals.myPeripheral.addEventListener('didDiscoverServices', function(e) {
// Ti.API.info('didDiscoverServices');
// Ti.API.info(e);
//
// Ti.API.info('peripheral has ' + e.peripheral.services.length + ' service(s)');
// var services = e.peripheral.services;
//
// for (var i = 0; i < services.length; i++) {
// Ti.API.info('service characteristics ' + JSON.stringify(services));
// e.peripheral.discoverCharacteristicsForService({
// characteristics : [],
// service : services[i]
// });
// }
// });
//
// Alloy.Globals.myPeripheral.addEventListener('didDiscoverCharacteristicsForService', function(e) {
// Ti.API.info('didDiscoverCharacteristicsForService');
// characteristics = e.service.characteristics;
// var obj = {};
// Alloy.Globals.characteristics = characteristics;
// Ti.API.info("End**");
// });
//
// Alloy.Globals.myPeripheral.addEventListener('didUpdateValueForCharacteristic', function(e) {
// Ti.API.info('didUpdateValueForCharacteristic');
// Ti.API.info(e);
// });
//
// Ti.API.info("uuids *****************= " + uuids);
// if (uuids) {
// Alloy.Globals.myPeripheral.discoverServices("E7810A71-73AE-499D-8C15-FAA9AEF0C3F2");
// }
// } catch(e) {
// Ti.API.info("Error didConnectPeripheral " + e.message);
// }
// });
//
// centralManager.addEventListener('didDisconnectPeripheral', function(e) {
// Ti.API.info('didDisconnectPeripheral');
// Ti.API.info(e);
// for (var i = 0; i < devicesList.length; i++) {
// if (devicesList[i].peripheral == e.peripheral) {
// devicesList[i].connected = false;
// Ti.App.Properties.setObject("peripheral", "");
// }
// }
// });

//Gift card code
// function transaction() {
// var data = {
// "jsonrpc" : "2.0",
// "method" : "902",
// "id" : "437",
// "params" : ["0", "1213", "5678:31024", "1234:3547", "603628784142002187878", "7.00"]
// };
//
// Ti.API.info('DATA ' + JSON.stringify(data));
//
// if (Ti.Network.online) {
//
// //Communicator.postFormData("https://dev-dataconnect.givex.com:55104", transactionCallback, JSON.stringify(data));
// Communicator.postFormData("https://dev-dataconnect.givex.com:56104", transactionCallback, JSON.stringify(data));
// //Communicator.postFormData("https://dev-dataconnect.givex.com:56104", transactionCallback, JSON.stringify(data));
//
// } else {
// Alloy.Globals.Alert("No internet connection");
// }
// }
//
// function reverseTransaction() {
// var data = {
// "jsonrpc" : "2.0",
// "method" : "918",
// "id" : "437",
// "params" : ["0", "1213", "5678:31024", "1234:3547", "603628784142002187878", "7.00"]
// };
//
// Ti.API.info('DATA ' + JSON.stringify(data));
//
// if (Ti.Network.online) {
//
// //Communicator.postFormData("https://dev-dataconnect.givex.com:55104", reverseTransactionCallback, JSON.stringify(data));
// Communicator.postFormData("https://dev-dataconnect.givex.com:56104", reverseTransactionCallback, JSON.stringify(data));
//
// } else {
// Alloy.Globals.Alert("No internet connection");
// }
// }

// function reverseTransactionCallback(e) {
// Ti.API.info("reverseTransactionCallback response : " + JSON.stringify(e));
// if (e.success) {
//
// } else {
// reverseTransaction1();
// }
//
// }
//
// function reverseTransactionSecondCallback(e) {
// Ti.API.info("transactionCallback response : " + JSON.stringify(e));
// if (e.success) {
// var response = JSON.parse(e.response);
// Alloy.Globals.PrintReceipt.printTimeOutFun(new Date(), getTime(new Date()), response, "0.1", splitString("603628784142002187878"), Alloy.Globals.store_name, "","4592");
//
// } else {
// reverseTransaction();
// }
//
// }
// function splitString(number) {
// var str = number;
// var res = str.slice(6, 11);
// var newStr = str.replace(res, "XXXXX");
// Ti.API.info('newStr.length-1 = ' + newStr.length - 1);
// var finalStr = newStr + "X";
//
// Ti.API.info('res = ' + res);
// Ti.API.info('newStr = ' + newStr);
// Ti.API.info('finalStr = ' + finalStr);
// return finalStr;
//
// }
// function reverseTransaction() {
// var data = {
// "jsonrpc" : "2.0",
// "method" : "918",
// "id" : "437",
// "params" : ["0", "4592", "5678:31024", "1234:3547", "603628784142002187878", "8.00"]
// };
//
// Ti.API.info('DATA ' + JSON.stringify(data));
//
// if (Ti.Network.online) {
//
// //Communicator.postFormData("https://dev-dataconnect.givex.com:55104", transactionCallback, JSON.stringify(data));
// //Communicator.postFormData("https://dev-dataconnect.givex.com:56104", transactionCallback, JSON.stringify(data));
// Communicator.postFormData("https://dev-dataconnect.givex.com:55105", reverseTransactionCallback, JSON.stringify(data));
// Ti.API.info('https://dev-dataconnect.givex.com:55105');
//
// } else {
// Alloy.Globals.Alert("No internet connection");
// }
// }
//
// function reverseTransaction1() {
// var data = {
// "jsonrpc" : "2.0",
// "method" : "902",
// "id" : "437",
// "params" : ["0", "4592", "5678:31024", "1234:3547", "603628784142002187878", "8.00"]
// };
//
// Ti.API.info('DATA ' + JSON.stringify(data));
//
// if (Ti.Network.online) {
//
// //Communicator.postFormData("https://dev-dataconnect.givex.com:55104", transactionCallback, JSON.stringify(data));
// //Communicator.postFormData("https://dev-dataconnect.givex.com:56104", transactionCallback, JSON.stringify(data));
// Communicator.postFormData("https://dev-dataconnect.givex.com:50104", reverseTransactionSecondCallback, JSON.stringify(data));
// Ti.API.info('https://dev-dataconnect.givex.com:50104');
//
// } else {
// Alloy.Globals.Alert("No internet connection");
// }
// }
/*
* Callback function for clockin and clock out
*/
// function transactionCallback(e) {
// Ti.API.info("transactionCallback response : " + JSON.stringify(e));
// if (e.success) {
//
// } else {
// reverseTransaction();
// }
//
// }
//
// function reverseTransactionCallback(e) {
// Ti.API.info("transactionCallback response : " + JSON.stringify(e));
// if (e.success) {
// var response = JSON.parse(e.response);
// Alloy.Globals.PrintReceipt.printTimeOutFun(new Date(), getTime(new Date()), response, "0.1", splitString("603628784142002187878"), Alloy.Globals.store_name, "","1213");
//
// } else {
// reverseTransaction();
// }
//
// }
function transactionEMVRequest(amt, tn) {
	var request = Alloy.Globals.PaxCommunicator.swipeGiftCardRequest(amt, "125", "1096744557");
	Ti.API.info('request ' + request);
	var base64 = Ti.Utils.base64encode(request);
	var paxURL = "http://" + Ti.App.Properties.getString("pax_ip") + ":10009/?" + base64;
	Alloy.Globals.PaxCommunicator.get(paxURL, transactionEMVRequestCallback);
	Ti.API.info('Transaction URL ' + paxURL);
}

function transactionEMVRequestCallback(e) {
	Ti.API.info('E ' + JSON.stringify(e));
	if (e.success) {
		try {
			var response = e.response;
			Ti.API.info('Response : ' + JSON.stringify(response));
			if (response != null) {

				var res = Alloy.Globals.PaxCommunicator.parserTransactionResponse(e.response, "transaction");
				if (res.resultCode == "000000") {
					var logInData = Ti.App.Properties.getObject("loginResponse");
					// Alloy.Globals.PrintReceipt.printMSRReceiptFun(logInData.result[0].store_name, logInData.result[0].store_address, logInData.result[0].phone_number, new Date(), getTime(new Date()), res);
					//Alloy.Globals.Notifier.show(L('pax_approved'));
				} else {
					checkTransactionErrorMsg(res.resultCode);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(err) {
			Ti.API.info('transactionEMVRequestCallback Error ' + err.message);
			tracker.addException({
				description : "CheckOutScreen2: " + err.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);

	}

}

function swipeEMVRequest(btn) {
	btnObj = btn;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var request = Alloy.Globals.PaxCommunicator.swipeGiftCardRequest();
		Ti.API.info('request ' + request);
		var base64 = Ti.Utils.base64encode(request);
		var paxURL = "http://" + Ti.App.Properties.getString("pax_ip") + ":10009/?" + base64;
		Alloy.Globals.PaxCommunicator.get(paxURL, swipeEMVRequestCallback);
		Ti.API.info('Transaction URL ' + paxURL);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

}

function swipeEMVRequestCallback(e) {
	Alloy.Globals.LoadingScreen.close();
	if (e.success) {
		try {
			var response = e.response;
			Ti.API.info('Response : ' + JSON.stringify(response));
			if (response != null) {

				var res = Alloy.Globals.PaxCommunicator.parserSwipCardResponse(e.response, "transaction");
				if (res.resultCode == "000000") {
					preAuthGiftTransaction(toFixed($.addPaymentLbl.textData).toFixed(2), Math.floor(Math.random() * 50000), btnObj, res.cardNumber);
				} else {
					checkTransactionErrorMsg(res.resultMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(err) {
			Ti.API.info('swipeEMVRequestCallback Error ' + err.message);
			tracker.addException({
				description : "CheckOutScreen3: " + err.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	
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

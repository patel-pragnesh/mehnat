// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('Close Register');
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

/*
 *
 */
var registerDetails = [];
var totalSumOrderdetail = 0;
var totalCreditCardOrderdetailSum = 0;
var totalGiftCardSum = 0;
var totalHousingAccountOrderdetailSum = 0;
var totalSale = 0;
var id;
var openingNote = "";

exports.finalize = function() {
	Ti.API.info('Inside CloseRegister finalize');
};
function fetchRegisterDetails() {
	registerDetails = Alloy.Globals.DbManager.getRegisterDetail("");

	if (registerDetails.length > 0) {
		$.openingAmntLbl.text = "$" + registerDetails[0].previous_day_amount;
		openingNote = registerDetails[0].opening_note;
		$.openingNoteLbl.text = openingNote;
		//$.openingDateLbl.text = getDate(new Date(registerDetails[0].opening_time));
		$.openingDateLbl.text = Alloy.Globals.DateTimeUtils.getFormattedDate(new Date(registerDetails[0].opening_time));
		id = registerDetails[0].id;
		totalSumOrderdetail = totalSumOrderdetail + registerDetails[0].previous_day_amount;
	};
	var paymentDetails = Alloy.Globals.DbManager.getPaymentDetailFromDB();
	Ti.API.info('paymentDetails deatil = ' + JSON.stringify(paymentDetails));
	for (var i = 0; i < paymentDetails.length; i++) {
		var date = paymentDetails[i].created_at;
		var a = date.toString().replace(" ", "T");
		var time = new Date(a).getTime();
		var orderUpdateTime = (time + new Date(time).getTimezoneOffset() * 60 * 1000);
		if (paymentDetails[i].is_refund == "0") {
			if (orderUpdateTime >= registerDetails[0].opening_time) {
				switch(paymentDetails[i].payment_method) {
				case "cash":
					totalSumOrderdetail = totalSumOrderdetail + paymentDetails[i].amount;
					break;
				case "credit_card":
					totalCreditCardOrderdetailSum = totalCreditCardOrderdetailSum + paymentDetails[i].amount;
					break;
				case "housing_management":
					totalHousingAccountOrderdetailSum = totalHousingAccountOrderdetailSum + paymentDetails[i].amount;
					break;
				case "gift_card":
					totalHousingAccountOrderdetailSum = totalHousingAccountOrderdetailSum + paymentDetails[i].amount;
					break;
				}
			}
		}
	}
	// $.cashExpecterLbl.text = (totalSumOrderdetail).toFixed(2);
	// $.cashDiffLbl.text = "0.00";
	// $.creditCardExpectdLbl.text = (totalCreditCardOrderdetailSum).toFixed(2);
	// $.housingAccountExcepted.text = (totalHousingAccountOrderdetailSum).toFixed(2);
	var orderDetails = Alloy.Globals.DbManager.getSumOfTotalSales();
	Ti.API.info('cashDetails = ' + JSON.stringify(orderDetails));
	for (var i = 0; i < orderDetails.length; i++) {
		var date = orderDetails[i].updated_at;
		var a = date.toString().replace(" ", "T");
		var time = new Date(a).getTime();
		var orderUpdateTime = (time + new Date(time).getTimezoneOffset() * 60 * 1000);
		if (orderUpdateTime >= registerDetails[0].opening_time) {
			if (orderDetails[i].is_refund == 0) {
				totalSumOrderdetail = totalSumOrderdetail + orderDetails[i].order_total_price;
			}
		}
	};
	$.cashExpecterLbl.text = (totalSumOrderdetail).toFixed(2);
	$.cashDiffLbl.text = "0.00";
	var cardPaymentDetails = Alloy.Globals.DbManager.getSumCardPaymentOfTotalSales();
	Ti.API.info('cardPaymentDetails = ' + JSON.stringify(cardPaymentDetails));
	for (var i = 0; i < cardPaymentDetails.length; i++) {
		var date = cardPaymentDetails[i].updated_at;
		var a = date.toString().replace(" ", "T");
		var time = new Date(a).getTime();
		var orderByCardUpdateTime = (time + new Date(time).getTimezoneOffset() * 60 * 1000);
		if (orderByCardUpdateTime >= registerDetails[0].opening_time) {
			if (cardPaymentDetails[i].is_refund == 0) {
				totalCreditCardOrderdetailSum = totalCreditCardOrderdetailSum + cardPaymentDetails[i].order_total_price;
			}
		}
	};
	$.creditCardExpectdLbl.text = (totalCreditCardOrderdetailSum).toFixed(2);
	$.creditCrdDiffLbl.text = (totalCreditCardOrderdetailSum).toFixed(2);

	var housingAccountSalesDetails = Alloy.Globals.DbManager.getSumHousingAmountOfTotalSales();
	Ti.API.info('Housing PaymentDetails = ' + JSON.stringify(housingAccountSalesDetails));
	for (var i = 0; i < housingAccountSalesDetails.length; i++) {
		var date = housingAccountSalesDetails[i].updated_at;
		var a = date.toString().replace(" ", "T");
		var time = new Date(a).getTime();
		var housingorderUpdateTime = (time + new Date(time).getTimezoneOffset() * 60 * 1000);
		if (housingorderUpdateTime >= registerDetails[0].opening_time) {
			if (housingAccountSalesDetails[i].is_refund == 0) {
				totalHousingAccountOrderdetailSum = totalHousingAccountOrderdetailSum + housingAccountSalesDetails[i].order_total_price;
			}
		}
	};
	$.housingAccountExcepted.text = (totalHousingAccountOrderdetailSum).toFixed(2);

	var totalSalesDetails = Alloy.Globals.DbManager.getTotalSales();
	Ti.API.info('total sale = ' + JSON.stringify(totalSalesDetails));
	for (var i = 0; i < totalSalesDetails.length; i++) {
		var date = totalSalesDetails[i].updated_at;
		var a = date.toString().replace(" ", "T");
		var time = new Date(a).getTime();
		var saleUpdateTime = (time + new Date(time).getTimezoneOffset() * 60 * 1000);
		if (saleUpdateTime >= registerDetails[0].opening_time) {
			if (totalSalesDetails[i].is_refund == 0) {
				totalSale = totalSale + totalSalesDetails[i].order_total_price;
			}
		}
	};
	$.saleLbl.text = "$" + (totalSale).toFixed(2);

	var giftCardSalesDetails = Alloy.Globals.DbManager.getSumGiftCardAmountOfTotalSales();
	Ti.API.info('giftCardSalesDetailsDetails = ' + JSON.stringify(giftCardSalesDetails));
	for (var i = 0; i < giftCardSalesDetails.length; i++) {
		var date = giftCardSalesDetails[i].updated_at;
		var a = date.toString().replace(" ", "T");
		var time = new Date(a).getTime();
		var giftCardUpdateTime = (time + new Date(time).getTimezoneOffset() * 60 * 1000);
		if (giftCardUpdateTime >= registerDetails[0].opening_time) {
			if (giftCardSalesDetails[i].is_refund == 0) {
				totalCreditCardOrderdetailSum = totalCreditCardOrderdetailSum + giftCardSalesDetails[i].order_total_price;
			}
		}
	};
	$.giftCardExcepted.text = (totalHousingAccountOrderdetailSum).toFixed(2);

}

fetchRegisterDetails();
function calculateCashDifferenceFun(e) {
	$.cashDiffLbl.text = (e.source.value - totalSumOrderdetail).toFixed(2);
}

function calculateCardDifferenceFun(e) {
	$.creditCrdDiffLbl.text = (e.source.value - totalCreditCardOrderdetailSum).toFixed(2);
}

/*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {
	$.cashsummryCountedTf.blur();
	$.creditCountedTf.blur();
	$.giftCountedTf.blur();
	Alloy.Globals.openLeft();
}

function textAreaChangeFun(e) {
	if (e.source.value.length > 0) {
		$.hintLbl.visible = false;
	} else {
		$.hintLbl.visible = true;
	}
}

function validateCloseRegisterDetails() {
	if ($.cashsummryCountedTf.value != '' && $.cashsummryCountedTf.value.trim().length > 0) {
		var validNumber = validateNumberAndDot($.cashsummryCountedTf.value.trim());
		if (validNumber) {
			//if ($.clousernoteTF.value != '' && $.clousernoteTF.value.trim().length > 0) {
			opneCloseRegisterPopoverFun("");

			//} else {
			//Alloy.Globals.Notifier.show("Please enter closure note");
			//	}
		} else {
			Alloy.Globals.Notifier.show("Please enter valid cash amount");
		}
	} else {
		Alloy.Globals.Notifier.show("Please enter total cash counted");
	}
}

var popover;
var amountTf;
function opneCloseRegisterPopoverFun(amt) {
	var closeRegisterPopoverView = Ti.UI.createView({
		backgroundColor : "white",
		layout : "vertical",
		width : 270,
		height : 180
	});

	var title = Ti.UI.createLabel({
		color : "000",
		width : Ti.UI.FILL,
		textAlign : "center",
		top : 20,
		text : "Amount Left In Drawer",
		font : {
			fontSize : 14,
		},
	});
	closeRegisterPopoverView.add(title);

	amountTf = Ti.UI.createTextField({
		top : 0,
		top : 25,
		right : 25,
		left : 25,
		borderColor : "#E7E7E7",
		borderWidth : "1",
		borderRadius : "6",
		width : Ti.UI.FILL,
		keyboardType : Titanium.UI.KEYBOARD_TYPE_PHONE_PAD,
		hintTextColor : "#bfbfbf",
		paddingLeft : 10,
		hintText : "Enter Your Amount",
		font : {
			fontSize : 15,
		},
		height : 30,
		editable : false,
		value:amt
	});

	closeRegisterPopoverView.add(amountTf);

	var doneBtn = Ti.UI.createButton({
		title : "OK",
		width : "40%",
		height : "30",
		color : "white",
		backgroundColor : "#c32032",
		borderRadius : 6,
		top : 25,
		bottom : 25

	});
	closeRegisterPopoverView.add(doneBtn);
	amountTf.addEventListener("click", function(e) {
		var pinPad = Alloy.createController("PinPad", "closeRegister").getView();
		pinPad.open();
		popover.hide();
	});
	doneBtn.addEventListener('click', function(e) {
		if (amountTf.value.trim().length > 0) {
			//popover.hide();
			var validNumber = validateNumberAndDot(amountTf.value.trim());
			if (validNumber) {
				insertclosingDetailsInDb(amountTf.value);
			} else {
				Alloy.Globals.Notifier.show("Please enter valid amount");
			}
		} else {
			Alloy.Globals.Notifier.show("Please enter amount");
		}
	});

	popover = Ti.UI.iPad.createPopover({

		horizontalWrap : false,
		backgroundColor : "white",
		arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_DOWN,
		contentView : closeRegisterPopoverView
	});

	popover.show({
		view : $.closeRegisterBtn
	});
}
function openPinPadForCountedFunc(){
	var pinPad = Alloy.createController("PinPad", "counted").getView();
	pinPad.open();
}
function openOpenRegisterScreenFun() {
	Alloy.Globals.openRegisterLbl.text = "Open Register";
	Ti.App.Properties.setObject("isRegisterOpened", 0);
	$.closeRegister.close();
	var openRegisterWin = Alloy.createController("OpenRegisterScreen");
	Alloy.Globals.drawer.centerWindow = openRegisterWin.openRegister;
	Alloy.Globals.currentWindow = openRegisterWin;

}

function insertclosingDetailsInDb(closingamount) {
	var newOrdersASAPListArray = Alloy.Globals.DbManager.Get_Sale_Asap_From_DB();
	var newOrdersLATERListArray = Alloy.Globals.DbManager.Get_Sale_Later_From_DB();
	if ((newOrdersASAPListArray != null && newOrdersASAPListArray.length > 0) || (newOrdersLATERListArray != null && newOrdersLATERListArray.length > 0)) {
		showPendingOrderDialog();
	} else {
		var closeRegisterDetailJson = {};
		closeRegisterDetailJson.status = "closed";
		closeRegisterDetailJson.previous_day_amount = closingamount;
		closeRegisterDetailJson.updated_date = new Date().getTime();
		closeRegisterDetailJson.cash_expected_amount = totalSumOrderdetail;
		closeRegisterDetailJson.cash_found = $.cashsummryCountedTf.value.trim();
		closeRegisterDetailJson.cash_difference = $.cashDiffLbl.text;
		closeRegisterDetailJson.card_expected_amount = "";
		closeRegisterDetailJson.card_found = "";
		closeRegisterDetailJson.card_difference = "";
		closeRegisterDetailJson.giftcard_expected_amount = "";
		closeRegisterDetailJson.giftcard_found = "";
		closeRegisterDetailJson.giftcard_difference = "";
		closeRegisterDetailJson.closing_note = $.clousernoteTF.value;
		closeRegisterDetailJson.closing_time = new Date().getTime();
		Alloy.Globals.DbManager.insertCloseRegisterDetail(closeRegisterDetailJson, id);
		reverseSyncService();
	}
}

function showPendingOrderDialog() {
	var dialog = Ti.UI.createAlertDialog({
		buttonNames : ['OK'],
		message : 'You have some orders pending in new order section, please complete them before closing the register',
		title : 'Gongcha POS'
	});
	dialog.addEventListener('click', function(k) {
		dialog.hide();
		popover.hide();
	});
	dialog.show();
}

/*
 * Webservice call for reverse syncing
 */
function reverseSyncService() {

	var data = {};
	data.reverse_sync_data = JSON.stringify(fetchRegisterDataForReverseSync());
	data.store_id = Alloy.Globals.store_id;
	data.employee_id = Alloy.Globals.employee_id;
	data.user_id = Alloy.Globals.employee_id;

	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_REVERSE_SYNC = Alloy.Globals.Constants.SERVICE_REVERSE_SYNC;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_REVERSE_SYNC, reverseSyncServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_REVERSE_SYNC);

	} else {
		Alloy.Globals.Notifier.show("No internet connection");
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
					Ti.App.Properties.setObject("reverseSyncDate", new Date().getTime());
					popover.hide();
					openOpenRegisterScreenFun();
					Alloy.Globals.totalAmount = response.store_amount;
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error CloseRegisterScreen :: ' + e.message);
			tracker.addException({
				description : "CloseRegisterScreen: " + e.message,
				fatal : false
			});
		}

	} else {
		Alloy.Globals.Notifier.show("No internet connection");
	}
	Alloy.Globals.LoadingScreen.close();
}

function winFun(e) {
	Ti.API.info(e.source.name);

	if (e.source.name != 'tf') {
		$.cashsummryCountedTf.blur();
		$.creditCountedTf.blur();
		$.giftCountedTf.blur();
		$.clousernoteTF.blur();

	}
}

/*
 * fetching details of register from data base for reverse sync returns register table data according to added date
 */
function fetchRegisterDataForReverseSync() {
	var register = [];
	var mainArray = [];
	var mainJson = {};
	var registerArray = Alloy.Globals.DbManager.getClosedRegisterDetail(id);
	mainJson.ospos_register = registerArray;
	mainArray.push(mainJson);
	return mainArray;
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

function validateNumberAndDot(s) {
	var rgx = /^[0-9]*\.?[0-9]*$/;
	return s.match(rgx);
}

var openingnotePopoverView = null;
function openNotePopOver() {
	var notePopoverView = Ti.UI.createView({
		backgroundColor : "white",
		layout : "vertical",
		width : 270,
		height : 180
	});
	var title = Ti.UI.createLabel({
		width : Ti.UI.FILL,
		textAlign : "center",
		height : 30,
		backgroundColor : "#382b20",
		text : "Opening Note",
		color : "white",
		font : {
			fontSize : 16,
		},
	});
	notePopoverView.add(title);

	var openingNoteTA = Ti.UI.createTextArea({
		top : 15,
		right : 15,
		left : 15,
		borderColor : "#E7E7E7",
		borderWidth : "1",
		height : 120,
		value : openingNote,
		editable : false,
		borderRadius : "6",
		width : Ti.UI.FILL,
		keyboardType : Titanium.UI.KEYBOARD_TYPE_PHONE_PAD,
		hintTextColor : "#bfbfbf",
		paddingLeft : 10,
		hintText : "Enter Your Amount",
		font : {
			fontSize : 14,
		},
	});

	notePopoverView.add(openingNoteTA);

	openingnotePopoverView = Ti.UI.iPad.createPopover({

		horizontalWrap : false,
		backgroundColor : "#382b20",
		arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_UP,
		contentView : notePopoverView
	});

	openingnotePopoverView.show({
		view : $.openingNoteLbl
	});
}

exports.getAmountFromPinPad = function(value,from) {
	if(from == "counted"){
		$.cashsummryCountedTf.value =value;
		return;
	}
	if(amountTf){
		opneCloseRegisterPopoverFun(value);
	}else{
		opneCloseRegisterPopoverFun("");
	}
	
}; 
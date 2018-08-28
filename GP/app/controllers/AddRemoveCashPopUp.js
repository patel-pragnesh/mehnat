// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
Ti.API.info('args  =' + JSON.stringify(args));
var payType = JSON.stringify(args);

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

function openFunc() {
	$.addRemoveCashWin.animate({
		duration : 200,
		opacity : 1,
	});
}

function returnFunc(e) {
	$.noteTf.focus();
}

if (payType == 1) {
	$.payeeLbl.text = (L("pay_from_txt"));
} else {
	$.payeeLbl.text = (L("pay_to_txt"));
}
/*
 * Getting pin number textfield value on dialpad click
 */
function dialpadbtnfun(e) {
	$.calculateTF.value = $.calculateTF.value.trim() + e.source.name;
}

/*
 * Function for clearing pin number textfield value
 */

function cleardailpadfun() {
	$.calculateTF.value = "";
}

/*
 * Function for validating data
 */
function validateDatafun() {
	if ($.payTf.value != '' && $.payTf.value.trim().length > 0) {
		if ($.noteTf.value != '' && $.noteTf.value.trim().length > 0) {
			if ($.calculateTF.value != '' && $.calculateTF.value.trim().length > 0) {
				if ($.calculateTF.value > 0) {
					var validNumber = validateNumberAndDot($.calculateTF.value.trim());
					if (validNumber) {
						if (payType == 2) {
							if (parseFloat($.calculateTF.value) <= parseFloat(Alloy.Globals.totalAmount)) {
								insertTillManagementDataToDb();
							} else {
								Alloy.Globals.Notifier.show(L("till_mgmt_validation"));
							}
						} else {
							insertTillManagementDataToDb();
						}
					} else {
						Alloy.Globals.Notifier.show("Please enter valid amount");
					}
				} else {
					Alloy.Globals.Notifier.show("Entered amount should be greater than 0");
				}
			} else {
				Alloy.Globals.Notifier.show("Please enter amount");
			}
		} else {
			Alloy.Globals.Notifier.show("Please enter description");
		}
	} else {
		if (payType == 1) {
			Alloy.Globals.Notifier.show("Please enter the reason in pay from field");

		} else {
			Alloy.Globals.Notifier.show("Please enter the reason in pay to field");
		}

	}

}

/*
 * insert till management data to db
 */
function insertTillManagementDataToDb() {
	var tillManagemntDetailJson = {};
	tillManagemntDetailJson.employee_id = Alloy.Globals.employee_id;
	tillManagemntDetailJson.employee_name = Alloy.Globals.fullname;
	tillManagemntDetailJson.employee_image = Alloy.Globals.userimage;
	tillManagemntDetailJson.date = new Date().getTime();
	tillManagemntDetailJson.description = $.noteTf.value;
	tillManagemntDetailJson.pay_type = payType;
	tillManagemntDetailJson.amount = $.calculateTF.value;
	tillManagemntDetailJson.pay_for = $.payTf.value;

	Alloy.Globals.DbManager.insertTillManagementDetail(tillManagemntDetailJson);
	Alloy.Globals.PrintReceipt.openDrawerFun();
	reverseSyncService();

}

/*
 * Webservice call for reverse syncing
 */
function reverseSyncService() {

	var data = {};

	data.reverse_sync_data = JSON.stringify(fetchTillManagementDataForReverseSync());
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
					Ti.App.Properties.setObject("reverseSyncDate", new Date().getTime());
					Alloy.Globals.fetchTillManagementData();
					Alloy.Globals.totalAmount = response.store_amount;
					Alloy.Globals.totalcashLbl.text = "$" + toFixed(response.store_amount);

					$.addRemoveCashWin.close();

				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error AddRemoveCashPopup :: ' + e.message);
			tracker.addException({
				description : "AddRemoveCashPopup " + e.message,
				fatal : false
			});
		}

	} else {
		Alloy.Globals.Notifier.show("No internet connection");
	}
	Alloy.Globals.LoadingScreen.close();
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
		$.payTf.blur();
		$.noteTf.blur();
	}
}

/*
 * fetching details of tillmanagement from data base for reverse sync returns TillManagement table data according to added date
 */
function fetchTillManagementDataForReverseSync() {
	var register = [];
	var mainArray = [];
	var mainJson = {};
	var tillManagementArray = Alloy.Globals.DbManager.getTillManagementDetail(Ti.App.Properties.getObject("reverseSyncDate"));
	mainJson.ospos_tillmanagement = tillManagementArray;
	mainArray.push(mainJson);
	return mainArray;
}

function validateNumberAndDot(s) {
	var rgx = /^[0-9]*\.?[0-9]*$/;
	return s.match(rgx);
}

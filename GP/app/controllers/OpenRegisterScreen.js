// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('OpenRegister Screen');
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

var registerDetails = [];

exports.finalize = function(){
	Ti.API.info('Inside OpenRegister finalize');
};
function fetchRegisterDetails() {
	registerDetails = Alloy.Globals.DbManager.getRegisterDetail("");
	if (registerDetails.length > 0) {
		$.balancTF.value = registerDetails[0].previous_day_amount;
	};  
	//$.dateLbl.text = getDate(new Date());
	$.dateLbl.text = Alloy.Globals.DateTimeUtils.getFormattedDate(new Date());
}

fetchRegisterDetails();
/*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {
	$.balancTF.blur();
	$.noteTF.blur();
	Alloy.Globals.openLeft();
}

function textAreaChangeFun(e) {
	if (e.source.value.length > 0) {
		$.hintLbl.visible = false;
	} else {
		$.hintLbl.visible = true;
	}
}

function validateOpenRegisterFun() {
	if ($.balancTF.value != '' && $.balancTF.value.trim().length > 0) {
		var validNumber = validateNumberAndDot($.balancTF.value.trim());
		if (validNumber) {
			///if ($.noteTF.value != '' && $.noteTF.value.trim().length > 0) {

				insertOpenRegisterDataToDb();

			//} else {
				//Alloy.Globals.Notifier.show("Please enter description");
			//}
		} else {
			Alloy.Globals.Notifier.show("Please enter valid amount");
		}
	} else {
		Alloy.Globals.Notifier.show("Please enter amount");
	}

}

function winFun(e) {
	Ti.API.info(e.source.name);

	if (e.source.name != 'tf') {
		$.balancTF.blur();
		$.noteTF.blur();

	}
}

/*
 * insert till management data to db
 */
function insertOpenRegisterDataToDb() {
	var openRegisterDetailJson = {};
	openRegisterDetailJson.opening_time = new Date().getTime();
	openRegisterDetailJson.opening_note = $.noteTF.value;
	openRegisterDetailJson.status = "opened";
	openRegisterDetailJson.previous_day_amount = $.balancTF.value;
	openRegisterDetailJson.updated_date = new Date().getTime();
	//Alloy.Globals.DbManager.insertOpenCloseRegisterDetail(openRegisterDetailJson, "");
	Alloy.Globals.DbManager.insertOpenRegisterDetail(openRegisterDetailJson);
	reverseSyncService();

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
					openCloseRegisterScreenFun();
					Alloy.Globals.totalAmount = response.store_amount;
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error social Login List :: ' + e.message);
			tracker.addException({
				description : "OpenRegisterScreen: " + e.message,
				fatal : false
			});
		}

	} else {
		Alloy.Globals.Notifier.show("No internet connection");
	}
	Alloy.Globals.LoadingScreen.close();
}

/*
 * fetching details of register from data base for reverse sync returns register table data according to added date
 */
function fetchRegisterDataForReverseSync() {
	var register = [];
	var mainArray = [];
	var mainJson = {};
	var registerArray = Alloy.Globals.DbManager.getRegisterDetail(Ti.App.Properties.getObject("reverseSyncDate"));
	mainJson.ospos_register = registerArray;
	mainArray.push(mainJson);
	return mainArray;
}

function openCloseRegisterScreenFun() {
	Alloy.Globals.openRegisterLbl.text = "Close Register";
	Ti.App.Properties.setObject("isRegisterOpened", 1);
	$.openRegister.close();
	var CloseRegisterWin = Alloy.createController("CloseRegisterScreen");
	Alloy.Globals.drawer.centerWindow = CloseRegisterWin.closeRegister;
	Alloy.Globals.currentWindow = CloseRegisterWin;

}

function getDate() {
	var str;
	var amPM = '';
	var d = new Date();
	var day = d.getDate();
	var monthIndex = d.getMonth() + 1;
	var year = d.getFullYear();

	var currentHour = d.getHours();

	if (currentHour < 12) {
		amPM = 'AM';
	} else {
		amPM = 'PM';
	}

	if (currentHour == 0) {
		currentHour = 12;
	}

	if (currentHour > 12) {
		currentHour = currentHour - 12;
	}

	var currentMinute = d.getMinutes();
	currentMinute = currentMinute + '';

	if (currentMinute.length == 1) {
		currentMinute = '0' + currentMinute;
	}
	str = day + '/' + monthIndex + '/' + year + " " + currentHour + ':' + currentMinute + ' ' + amPM;
	return str;
}

function validateNumberAndDot(s) {
	var rgx = /^[0-9]*\.?[0-9]*$/;
	return s.match(rgx);
}
function openPinFunc()
{
	var pinPad = Alloy.createController("PinPad","openRegister").getView();
	pinPad.open();
}

exports.getAmountFromPinPad = function(value){
	$.balancTF.value = value;
};

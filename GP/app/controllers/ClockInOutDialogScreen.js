// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('CheckInOut Popup');
Ti.API.info('args : ' + args);
var actionType = args;

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

exports.finalize = function(){
	Ti.API.info('Inside Clockinout finalize');
};

/*
 * Getting pin number textfield value on dialpad click
 */
function dialpadbtnfun(e) {
	$.pinNoTF.value = $.pinNoTF.value.trim() + e.source.name;
}

/*
 * Function for clearing pin number textfield value
 */

function cleardailpadfun() {
	$.pinNoTF.value = "";
}

/*
 * Function for validating login
 */
function validateLoginfun() {
	if ($.pinNoTF.value != '' && $.pinNoTF.value.trim().length > 0) {
		if ($.pinNoTF.value.trim().length >= 4 && $.pinNoTF.value.trim().length <= 6) {
			clockinOutService();

		} else {
			Alloy.Globals.Notifier.show("Please enter a valid pin number");
		}
	} else {
		Alloy.Globals.Notifier.show("Please enter a pin number");
	}

}

/*
 * Function for opening dashboard after validating pin
 */
function openDashboardScreenFunc() {
	var posDashboard = Alloy.createController("TabGroup").getView();
	posDashboard.open();
}

function clockinOutService() {

	var data = {};

	data.login_pin = $.pinNoTF.value.trim();
	data.action_type = actionType;
	if(Alloy.Globals.isLogin){
		data.previous_store_id = Ti.App.Properties.getString("store_id");
	}
	data.user_id = Alloy.Globals.employee_id;
	data.store_id = Alloy.Globals.store_id;
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_USER_CLOCK_IN_OUT = Alloy.Globals.Constants.SERVICE_USER_CLOCK_IN_OUT;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_USER_CLOCK_IN_OUT, clockInOutServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_USER_CLOCK_IN_OUT);

	} else {
		$.loginBtn.focusable = true;
		Alloy.Globals.Notifier.show(Alloy.Globals.langConvert("internat_connection_message"));
	}
}

/*
 * Callback function for clockin and clock out
 */
function clockInOutServiceCallback(e) {
	Ti.API.info("loginServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {

			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				Ti.API.info('response.action_success = ' + response.response_code);
				if (response.response_code == '1') {
					tracker.setUserID(response.result[0].email);

					// Alloy.Globals.employee_id = response.result[0].employee_id;
					// Alloy.Globals.store_id = response.result[0].store_id;
					// Alloy.Globals.fullname = response.result[0].fullname;
					// Alloy.Globals.store_name = response.result[0].store_name;
					// Alloy.Globals.userimage = response.result[0].profile_pic;
					// Ti.App.Properties.setObject("profileData", response.result[0]);
					$.checkinoutdialogWin.close();
					// Alloy.Globals.storeNameTxt.text = Alloy.Globals.store_name;
					Alloy.Globals.Notifier.show(response.responseMessage);

					var d = new Date();
					if (actionType == 1) {
						tracker.addEvent({
							category : "Clock-In",
							action : "Employee " + response.result[0].fullname + " clocked in for store " + response.result[0].store_name + " at " + d.toDateString(),
							label : '',
							value : 1
						});
					} else {
						
						tracker.addEvent({
							category : "Clock-Out",
							action : "Employee " + response.result[0].fullname + " clocked in for store " + response.result[0].store_name + " at " + d.toDateString(),
							label : "",
							value : 1
						});
					}
					// if (Alloy.Globals.isLogin) {
						// Alloy.Globals.storeNameTxt.text = Alloy.Globals.store_name;
						// Alloy.Globals.setProfileDataToGUI();
					// }

				} else {
						$.pinNoTF.value="";
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error ClockInOutDialogScreen :: ' + e.message);
			tracker.addException({
				description : "ClockInOutDialogScreen: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show("No internet connection");
	}
	Alloy.Globals.LoadingScreen.close();
}

function cancleScreenFun(e) {
	$.checkinoutdialogWin.animate({
		duration : 200,
		opacity : 0,
	});
	setTimeout(function() {
		$.checkinoutdialogWin.close();
	}, 200);
}

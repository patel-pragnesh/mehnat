// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
Alloy.Globals.isLogin = false;
Alloy.Globals.isFrom = 1;
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var type;

function openFunc() {
	if (Alloy.Globals.isFrom == 0) {
		$.navWindow.animate({
			duration : 200,
			opacity : 1,
		});
		
	}
}
	$.storeNameLbl.text = Ti.App.Properties.getObject("storeManagerLoginResponse").result[0].store_name;
		Ti.API.info('Ti.App.Properties.getObject("storeManagerLoginResponse").result[0].store_name = '+Ti.App.Properties.getObject("storeManagerLoginResponse").result[0].store_name);
	
/*
 * Digital clock showing clock in clock out time
 */

function getFormattedTime() {
	var amPM = '';
	var d = new Date();
	var day = d.getDate();
	var monthIndex = d.getMonth();
	var year = d.getFullYear();

	$.dateLbl.text = day + ' ' + monthNames[monthIndex] + ', ' + year;

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
	$.timeLbl.text = currentHour + ':' + currentMinute + ' ' + amPM;

}

var clockInterval = setInterval(getFormattedTime, 5000);
getFormattedTime();

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
		if ($.pinNoTF.value.trim().length != 3) {
			clockinOutService();

		} else {
			Alloy.Globals.Alert("Please enter a valid pin number");
		}
	} else {
		Alloy.Globals.Alert("Please enter a pin number");
	}
}

/*
 * Function for opening dialpad for clock in out
 */
function clockInPinFun(e) {
	// $.clockinVw.backgroundColor = "#BD1B38";
	// $.clockoutVw.backgroundColor = "#382E2C";
	var clockinDialogWin = Alloy.createController("ClockInOutDialogScreen", 1).getView();
	clockinDialogWin.open();
}

/*
 * Function for opening dialpad for clock in out
 */
function clockOutPinFun(e) {
	// $.clockinVw.backgroundColor = "#382E2C";
	// $.clockoutVw.backgroundColor = "#BD1B38";
	var clockinDialogWin = Alloy.createController("ClockInOutDialogScreen", 2).getView();
	clockinDialogWin.open();
}

/*
 * Function for opening dashboard after validating pin
 */
function openDashboardScreenFunc() {
	Alloy.Globals.openHome();
	$.pinNoTF.value = "";
}

function clockinOutService() {

	var data = {};

	data.login_pin = $.pinNoTF.value.trim();
	data.action_type = 1;
	data.device_token = Alloy.Globals.deviceToken;
	data.store_id = Ti.App.Properties.getString("store_id");
	
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_USER_CLOCK_IN_OUT = Alloy.Globals.Constants.SERVICE_USER_CLOCK_IN_OUT;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_USER_CLOCK_IN_OUT, clockInOutServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_USER_CLOCK_IN_OUT);

	} else {
		Alloy.Globals.Alert("No internet connection");
	}
}

/*
 * Callback function for clockin and clock out
 */
function clockInOutServiceCallback(e) {
	Ti.API.info("clockInOutServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				Ti.API.info('response.action_success = ' + response.response_code);

				if (response.response_code == '1') {
					// if (Ti.App.Properties.getString("store_id") != response.result[0].store_id) {
						// Ti.App.Properties.setString("last_updated_date", "");
						// Ti.App.Properties.setString("parkedBadge", null);
						// Alloy.Globals.DbManager.deleteAllTableDetails();
					// }
					Alloy.Globals.employee_id = response.result[0].employee_id;
					Alloy.Globals.store_id = response.result[0].store_id;
					//Ti.App.Properties.setString("store_id", response.result[0].store_id);
					Ti.App.Properties.setObject("loginResponse", response);
					Alloy.Globals.fullname = response.result[0].fullname;
					Alloy.Globals.userimage = response.result[0].profile_pic;
					Alloy.Globals.store_name = response.result[0].store_name;
					Ti.App.Properties.setObject("profileData", response.result[0]);
					
					var d = new Date();
					tracker.setUserID(response.result[0].email);
					tracker.addEvent({
						category : "Clock-In",
						action : "Employee " + response.result[0].fullname + " clocked in for store " + response.result[0].store_name + " at " + d.toDateString(),
						label : "User " + response.result[0].fullname + " clocked in at " + d.toLocaleDateString(),
						value : 1
					});
					
					
					
					// if (Alloy.Globals.isFrom == 0) {
					// $.navWindow.close();
					// Alloy.Globals.storeNameTxt.text = Alloy.Globals.store_name;
					// Alloy.Globals.setProfileDataToGUI();
					// } else {
					// openDashboardScreenFunc();
					//}
					Alloy.Globals.openHome();
					$.navWindow.close();
					
				} else {
					$.pinNoTF.value="";
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error ClockInOutScreen :: ' + e.message);
			tracker.addException({
				description : "ClockInOutScreen: " + e.message,
				fatal : false
			});
		}

	} else {
		Alloy.Globals.Notifier.show("No internet connection");
	}
	Alloy.Globals.LoadingScreen.close();
}

/*
var slidermenuWin = Ti.UI.createWindow({
	backgroundColor : "white",
	height : Ti.UI.FILL
});

Alloy.Globals.openHome = function(response) {
	var NappSlideMenu = require('dk.napp.slidemenu');

	ledge = Ti.Platform.displayCaps.platformWidth / 1.5;
	Alloy.Globals.homedrawerWidth = Ti.Platform.displayCaps.platformWidth - ledge;
	Ti.API.info("123456" + Alloy.Globals.homedrawerWidth);
	Alloy.Globals.ledge = ledge;
	Titanium.API.info("Ti.Platform.locale   " + Titanium.App.Properties.getString('locale'));
	var lang = Titanium.App.Properties.getString('locale');

	var sliderScreen = Alloy.createController("SliderMenu");
	var homeScreen = Alloy.createController("TabGroup");
	Alloy.Globals.homeObj = homeScreen;
	Alloy.Globals.drawer = NappSlideMenu.createSlideMenuWindow({
		centerWindow : homeScreen.tabgroup,
		leftWindow : sliderScreen.slidermenu,
		leftLedge : ledge,
		backgroundColor : "#2B3541",
		zIndex : 0
	});

	Alloy.Globals.drawer.addEventListener("open", function(e) {
		Alloy.Globals.drawer.setPanningMode("NoPanning");
		Alloy.Globals.drawer.setCenterhiddenInteractivity("TouchDisabledWithTapToClose");
	});

	Alloy.Globals.openLeft = function() {

		Alloy.Globals.drawer.setCenterhiddenInteractivity("TouchDisabledWithTapToClose");
		Alloy.Globals.drawer.toggleLeftView();
	};
	Alloy.Globals.drawer.open();

};*/


function logoutManagerFun(){
	showLogOutDialog();
}
function showLogOutDialog() {
	dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : "Are you sure you want to logout?",
		title : "Gongcha POS"
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			dialog.hide();
		} else {
			//Alloy.Globals.logout();
			Alloy.Globals.logoutService("manager");

		}
	});
	dialog.show();
}


var a = "";
Alloy.Globals.logoutService = function(type) {
	a = type;
	var data = {};
	if (type == "manager") {
		data.user_id = Ti.App.Properties.getString("manager_id");
	} else {
		data.user_id = Alloy.Globals.employee_id;
	}

	data.store_id = Alloy.Globals.store_id;
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_LOGOUT = Alloy.Globals.Constants.SERVICE_LOGOUT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_LOGOUT, logoutServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_LOGOUT);

	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
};

function logoutServiceCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				Ti.API.info('response.action_success = ' + response.response_code);

				if (response.response_code == '1') {
					
						Alloy.Globals.managerLogout();
					

				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error Logout :: ' + e.message);
			tracker.addException({
				description : "Logout: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}

Alloy.Globals.managerLogout = function() {
	try {
		//Alloy.Globals.drawer.close();
		Alloy.Globals.isCheckoutOpen = false;
		Ti.App.Properties.setObject("loginResponse", null);
		Ti.App.Properties.setObject("profileData", null);
		Ti.App.Properties.setObject("storeManagerLoginResponse", null);
		Alloy.Globals.currentWindow = null;
		var loginObj = Alloy.createController("LoginScreen").getView();
		loginObj.open();
		
		if (Alloy.Globals.popover) {
			Alloy.Globals.popover.hide();
		}

		Alloy.Globals.employee_id = "";
		Alloy.Globals.store_id = "";
		Alloy.Globals.fullname = "";
		Alloy.Globals.userimage = "";
		Alloy.Globals.store_name = "";
		if (Alloy.Globals.syncInterval) {
			clearInterval(Alloy.Globals.syncInterval);
			Alloy.Globals.syncInterval = null;
		}
	} catch(e) {
		Ti.API.info('Error logout() ' + e.message);
	}
};

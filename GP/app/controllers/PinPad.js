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
		if (validateCurrency($.pinNoTF.value.trim())) {
			if(args == "openRegister"){
				Alloy.Globals.openRegisterObj.getAmountFromPinPad($.pinNoTF.value.trim(),"");
			}else if(args == "closeRegister"){
				Alloy.Globals.closeRegisterObj.getAmountFromPinPad($.pinNoTF.value.trim(),"");
			}else if(args == "counted"){
				Alloy.Globals.closeRegisterObj.getAmountFromPinPad($.pinNoTF.value.trim(),"counted");
			}
			$.pinPad.close();

		} else {
			Alloy.Globals.Notifier.show("Please enter a valid amount");
		}
	} else {
		Alloy.Globals.Notifier.show("Please enter a amount");
	}

}

/*
 * Function for opening dashboard after validating pin
 */
function openDashboardScreenFunc() {
	var posDashboard = Alloy.createController("TabGroup").getView();
	posDashboard.open();
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


   function validateCurrency(amount) {
      var regex = /^[0-9]\d*(?:\.\d{0,2})?$/;
      return regex.test(amount);
    }
    
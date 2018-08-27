var args = arguments[0] || {};

// GET THE USER ID
var id = Ti.App.Properties.getString("id");
var contactData = [];

function closeContactFun(e) {
	$.UpdateContactScreen.close();
}

// Get data from the view contact
$.nameTF.value = args.name;
$.emailTF.value = args.email;
$.contactTF.value = args.contact;
$.txtArea.value = args.set_msg;
if (OS_IOS) {

	if ($.nameTF.value.length > 0) {
		$.nameLbl.visible = false;
	}
	if ($.emailTF.value.length > 0) {
		$.emailLbl.visible = false;
	}
	if ($.contactTF.value.length > 0) {
		$.contactLbl.visible = false;
	}
}
/*
 function openNotification(e) {
 var notificationWin = Alloy.createController("NotificationScreen").getView();
 if (OS_IOS) {
 Alloy.Globals.navWindow.openWindow(notificationWin, {
 animated : true
 });
 } else {
 notificationWin.open();
 }

 Alloy.Globals.currentWindow = notificationWin;
 }*/

function contactChangeFun(e) {

	if ($.contactTF.value.length > 0) {
		$.contactLbl.visible = false;
	} else {
		$.contactLbl.visible = true;
	}
}

function emailChangeFun(e) {

	if ($.emailTF.value.length > 0) {
		$.emailLbl.visible = false;
	} else {
		$.emailLbl.visible = true;
	}
}

function nameChangeFun(e) {

	if ($.nameTF.value.length > 0) {
		$.nameLbl.visible = false;
	} else {
		$.nameLbl.visible = true;
	}
}

/*
 function rememberMe(e) {
 Ti.API.info($.remeberView.toggle);
 if (false == $.remeberView.toggle) {
 // alert(e.source.toggle);
 $.remeberBtn.title = '\u2713';
 $.remeberView.toggle = true;

 } else {
 // alert(e.source.toggle);
 $.remeberBtn.title = '';
 $.remeberView.toggle = false;

 }

 };*/

function winClickFun(e) {
	Ti.API.info("winClickFun " + e.source.name);
	if (e.source.name != "tf") {
		$.nameTF.blur();
		$.contactTF.blur();
		$.emailTF.blur();
		$.txtArea.blur();
	}
}

function openContactListFun(e) {
	if (contactData.length > 0) {
		var selectContactListWin = Alloy.createController("SelectContactListScreen", contactData).getView();
		if (OS_IOS) {
			Alloy.Globals.navWindow.openWindow(selectContactListWin, {
				animated : true
			});
		} else {
			selectContactListWin.open();
		}
		selectContactListWin.oldWin = $.AddContactScreen;
		Alloy.Globals.currentWindow = selectContactListWin;
	} else {
		Alloy.Globals.Alert("There is no contact available in contact list");
	}

}

function openPanic(e) {

	if (OS_IOS) {
		var panicScreen = Alloy.createController("PanicScreen").getView();

		Alloy.Globals.navWindow.openWindow(panicScreen);
	} else {
		var panicScreen = Alloy.createController("PanicScreen").getView();
		panicScreen.open();
	}
	panicScreen.oldWin = $.AddContactScreen;

	Alloy.Globals.currentWindow = panicScreen;

}

function nameReturnFun(e) {
	$.contactTF.focus();
}

function contactReturnFun(e) {
	$.emailTF.focus();
}

function emailReturnFun(e) {
	$.txtArea.focus();
}

function addContact_via_TextArea_Fun(e) {
	Ti.API.info("Alert");
	if (OS_ANDROID) {
		$.txtArea.blur();
	}

	//$.submitBtn.fireEvent("click");
}

function addContactFun(e) {
	var isvalidate = validateContact();
	if (isvalidate) {
		updateContactService();
	}

}

function validateContact() {
	if ($.nameTF.value != '' && $.nameTF.value.trim().length > 0) {
		var isValid1 = isValid($.nameTF.value);
		if (isValid1) {
			if ($.contactTF.value != '' && $.contactTF.value.trim().length > 0) {
				if ($.contactTF.value > 0) {
					if ($.contactTF.value.trim().length >= 8 && $.contactTF.value.trim().length <= 15) {

						if ($.emailTF.value != '' && $.emailTF.value.trim().length > 0) {
							var validEmail = checkemail($.emailTF.value.trim());
							if (validEmail) {
								if ($.txtArea.value != '' && $.txtArea.value.trim().length > 0) {
									var isTextAreaSpecialChar = isValid($.txtArea.value);
									if (isTextAreaSpecialChar) {
										return true;
									} else {
										Alloy.Globals.Alert("Please set the valid message");
										return false;
									}
								} else {
									Alloy.Globals.Alert("Please set the message");
									return false;
								}
							} else {
								Alloy.Globals.Alert("Please enter valid email-id");
								return false;
							}

						} else {
							if ($.txtArea.value != '' && $.txtArea.value.trim().length > 0) {
								var isTextAreaSpecialChar = isValid($.txtArea.value);
								if (isTextAreaSpecialChar) {
									return true;
								} else {
									Alloy.Globals.Alert("Please set the valid message");
									return false;
								}
							} else {
								Alloy.Globals.Alert("Please set the message");
								return false;
							}
						}
					} else {

						Alloy.Globals.Alert("Phone number can not less 8 characters and exceed 15 characters in length");
						return false;
					}
				} else {
					Alloy.Globals.Alert("Please enter valid contact number");
					return false;
				}
			} else {
				Alloy.Globals.Alert("Please enter contact number");
				return false;
			}
		} else {
			Alloy.Globals.Alert("Please enter valid name");
			return false;
		}
	} else {
		Alloy.Globals.Alert("Please enter name");
		return false;
	}
};
function isValid(str) {
	Ti.API.info("STRING : " + !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@]/g.test(str));
	return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@]/g.test(str);
}

/*
 * Function for add contacts
 */

function updateContactService() {
	var data = {};

	data.name = $.nameTF.value;
	data.contact = $.contactTF.value;
	data.email = $.emailTF.value;
	data.set_msg = $.txtArea.value;
	data.id = args.id;
	data.user_id = id;

	Ti.API.info('DATA ' + JSON.stringify(data));
	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var SERVICE_UPDATE_CONTACT = Alloy.Globals.Constants.SERVICE_UPDATE_CONTACT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_UPDATE_CONTACT, updateContactServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_UPDATE_CONTACT);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

/*
 * Callback gunction for FB and Google+ login
 */

function updateContactServiceCallback(e) {
	Ti.API.info("addContactServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				Ti.API.info('response.action_success = ' + response.action_success);
				if (response.action_success == 'true') {
					$.UpdateContactScreen.close();
					Alloy.Globals.viewContactObj.getContactService();
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
		}
	} else {
		//Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}

	Alloy.Globals.LoadingScreen.close();
}

/*
 * Function for email validation
 */
function checkemail(emailAddress) {
	var str = emailAddress;
	var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (filter.test(str)) {
		testresults = true;
	} else {
		testresults = false;
	}
	return (testresults);
};
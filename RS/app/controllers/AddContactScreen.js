var args = arguments[0] || {};

// GET THE USER ID
var id = Ti.App.Properties.getString("id");
var contactData = [];

function closeContactFun(e) {
	$.AddContactScreen.close();
}

function openNotification(e) {
	if ($.notificationBtn.focusable == false) {
		return;
	}
	$.notificationBtn.focusable = false;
	var notificationWin = Alloy.createController("NotificationScreen").getView();
	if (OS_IOS) {
		Alloy.Globals.navWindow.openWindow(notificationWin, {
			animated : true
		});
	} else {
		notificationWin.open();
	}
	notificationWin.oldWin = $.AddContactScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
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
	if ($.contactListBtn.focusable == false) {
		return;
	}
	$.contactListBtn.focusable = false;
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
	setTimeout(function(e) {
		$.contactListBtn.focusable = true;
	}, 2000);
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
		//$.txtArea.blur();
	}

	//$.submitBtn.fireEvent("click");
}

function addContactFun(e) {
	if (Ti.Network.online) {
		if ($.submitBtn.focusable == false) {
			return;
		}
		$.submitBtn.focusable = false;
		var isvalidate = validateContact();
		if (isvalidate) {
			addContactService();
		} else {
			$.submitBtn.focusable = true;
		}

	} else {

		$.submitBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}

}

function isValid(str) {
	Ti.API.info("STRING : " + !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@]/g.test(str));
	return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@]/g.test(str);
}

function validateContact() {
	if ($.nameTF.value != '' && $.nameTF.value.trim().length > 0) {
		var isSpecialChar = isValid($.nameTF.value.trim());
		Ti.API.info("isSpecialChar " + isSpecialChar);
		if (isSpecialChar) {
			if ($.contactTF.value != '' && $.contactTF.value.trim().length > 0) {
				if ($.contactTF.value > 0) {
					if ($.contactTF.value.trim().length >= 8 && $.contactTF.value.trim().length <= 15) {
						if ($.emailTF.value != '' && $.emailTF.value.trim().length > 0) {
							var validEmail = checkemail($.emailTF.value.trim());
							if (validEmail) {
								if ($.txtArea.value != '' && $.txtArea.value.trim().length > 0) {
									var isTextAreaSpecialChar = isValid($.txtArea.value);
									Ti.API.info("isTextAreaSpecialChar " + isTextAreaSpecialChar);
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
								Ti.API.info("isTextAreaSpecialChar " + isTextAreaSpecialChar);
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

}

/*
 * Function for add contacts
 */

function addContactService() {
	var data = {};

	data.name = $.nameTF.value;
	data.contact = $.contactTF.value;
	data.email = $.emailTF.value;
	data.set_msg = $.txtArea.value;
	data.id = id;

	Ti.API.info('DATA ' + JSON.stringify(data));
	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var SERVICE_ADD_CONTACT = Alloy.Globals.Constants.SERVICE_ADD_CONTACT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_ADD_CONTACT, addContactServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_ADD_CONTACT);
	} else {

		$.submitBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

/*
 * Callback gunction for FB and Google+ login
 */

function addContactServiceCallback(e) {
	Ti.API.info("addContactServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				Ti.API.info('response.action_success = ' + response.action_success);
				if (response.action_success == 'true') {
					$.AddContactScreen.close();
					Ti.API.info("loy.Globals.viewContactOpened " + Alloy.Globals.viewContactOpened);
					if (Alloy.Globals.viewContactOpened) {
						Ti.API.info("loy.Globals.viewContactOpened " + Alloy.Globals.viewContactOpened);
						Alloy.Globals.viewContactObj.getContactService();
					} else {
						var viewcontactWin = Alloy.createController("ViewContactScreen");
						Alloy.Globals.viewContactObj = viewcontactWin;
						if (OS_IOS) {
							Alloy.Globals.navWindow.openWindow(viewcontactWin.getView(), {
								animated : true
							});
						} else {
							viewcontactWin.getView().open();
						}

						viewcontactWin.getView().oldWin = $.AddContactScreen;
						Alloy.Globals.currentWindow = viewcontactWin.getView();
					}

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
	$.submitBtn.focusable = true;
	Alloy.Globals.LoadingScreen.close();
}

exports.addDetailFromContactList = function(data) {
	Ti.API.info("DATA : " + JSON.stringify(data));
	try {
		$.nameTF.value = data.name;
		$.contactTF.value = data.contact[0];
		if ($.contactTF.value.length > 0) {
			var val = $.contactTF.value;
			while (true) {
				if (val.indexOf(" ") != -1) {
					var val = val.replace(" ", "");
					continue;
				} else {
					break;
				}
			};
		}
		$.contactTF.value = val;

		Ti.API.info('data.email : ' + JSON.stringify(data.email));
		if (data.email != "") {
			if (OS_ANDROID) {
				//$.emailTF.value = data.email.other[0];
			} else {
				//$.emailTF.value = data.email.home[0];
			}

		}
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
	} catch(e) {
		Ti.API.info('Erroer : ' + e.error);
	}

};
if (OS_IOS) {

	if (Ti.Contacts.hasContactsPermissions()) {
		Ti.API.info("TRUE");
	} else {
		Ti.API.info("False");
		Ti.Contacts.requestContactsPermissions(function(e) {
			if (e.success) {
				Ti.API.info("TRUE 1 " + JSON.stringify(e));
			} else {
				Ti.API.info("TRUE 2 " + JSON.stringify(e));
			}
		});
	}
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
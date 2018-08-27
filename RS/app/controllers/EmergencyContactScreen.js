var args = arguments[0] || {};

//This global variable define for knowing the status about viewContact screen open or not

Alloy.Globals.viewContactOpened = false;

function closeEmergencyContactFun(e) {
	$.panicBtn.focusable = false;

	$.addContactBtn.touchEnabled = "false";
	$.freeBtn.touchEnabled = "false";
	$.viewContactBtn.touchEnabled = "false";
	if ($.freeBtn.focusable == false) {
		return;
	}
	$.freeBtn.focusable = false;
	$.EmergencyContactScreen.close();
	setTimeout(function(e) {
		$.freeBtn.focusable = true;
		$.addContactBtn.touchEnabled = "true";
		$.freeBtn.touchEnabled = "true";
		$.viewContactBtn.touchEnabled = "true";

		$.panicBtn.focusable = true;
	}, 2000);
}

function viewContactTSFun(e) {
	$.viewContactBtn.color = "white";
}

function viewContactTEFun(e) {
	$.viewContactBtn.color = "#2941AE";
}

function addContactTSFun(e) {
	$.addContactBtn.color = "white";
}

function addContactTEFun(e) {
	$.addContactBtn.color = "#2941AE";
}

function freeContactTSFun(e) {
	$.freeBtn.color = "white";
}

function freeContactTEFun(e) {
	$.freeBtn.color = "#2941AE";
}

function openNotification(e) {
	$.panicBtn.focusable = false;
	$.addContactBtn.touchEnabled = "false";
	$.freeBtn.touchEnabled = "false";
	$.viewContactBtn.touchEnabled = "false";
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

	notificationWin.oldWin = $.EmergencyContactScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
		$.addContactBtn.touchEnabled = "true";
		$.freeBtn.touchEnabled = "true";
		$.viewContactBtn.touchEnabled = "true";
		$.panicBtn.focusable = true;
	}, 2000);
}

function openPanic(e) {
	if (Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) {
		$.addContactBtn.touchEnabled = "false";
		$.freeBtn.touchEnabled = "false";
		$.viewContactBtn.touchEnabled = "false";
		if (Alloy.Globals.isContact == 1) {
			if ($.panicBtn.focusable == false) {
				return;
			}
			$.panicBtn.focusable = false;
			if (OS_IOS) {
				var panicScreen = Alloy.createController("PanicScreen").getView();

				Alloy.Globals.navWindow.openWindow(panicScreen);
			} else {
				var panicScreen = Alloy.createController("PanicScreen").getView();
				panicScreen.open();
			}
			panicScreen.oldWin = $.EmergencyContactScreen;
			Alloy.Globals.currentWindow = panicScreen;
		} else {
			Alloy.Globals.Alert("Please add emergency contact first");
		}
		setTimeout(function(e) {
			$.panicBtn.focusable = true;

			$.addContactBtn.touchEnabled = "true";
			$.freeBtn.touchEnabled = "true";
			$.viewContactBtn.touchEnabled = "true";
		}, 2000);
	} else {
		Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
	}
}

//$.allBtn.backgroundColor = "#2941AE";
//$.allBtn.color = "#ffffff";

//XML device all categroy button function
function viewContactFun(e) {
	$.addContactBtn.touchEnabled = "false";
	$.freeBtn.touchEnabled = "false";

	if ($.viewContactBtn.touchEnabled == "false") {
		return;
	}
	$.viewContactBtn.touchEnabled = "false";

	var viewcontactWin = Alloy.createController("ViewContactScreen");
	Alloy.Globals.viewContactObj = viewcontactWin;
	if (OS_IOS) {
		Alloy.Globals.navWindow.openWindow(viewcontactWin.getView(), {
			animated : true
		});
	} else {
		viewcontactWin.getView().open();
	}

	viewcontactWin.getView().oldWin = $.EmergencyContactScreen;
	Alloy.Globals.currentWindow = viewcontactWin.getView();
	setTimeout(function(e) {
		$.addContactBtn.touchEnabled = "true";
		$.viewContactBtn.touchEnabled = "true";
		$.freeBtn.touchEnabled = "true";

	}, 2000);
}

//XML device sponsored categroy button function
function addContactFun(e) {
	$.viewContactBtn.touchEnabled = "false";
	$.freeBtn.touchEnabled = "false";

	if ($.addContactBtn.touchEnabled == "false") {
		return;
	}
	$.addContactBtn.touchEnabled = "false";
	Alloy.Globals.viewContactOpened = false;
	var addContact = Alloy.createController("AddContactScreen");
	Alloy.Globals.addContactObj = addContact;
	if (OS_IOS) {

		Alloy.Globals.navWindow.openWindow(addContact.getView());
	} else {

		addContact.getView().open();
	}
	addContact.getView().oldWin = $.EmergencyContactScreen;
	Alloy.Globals.currentWindow = addContact.getView();
	setTimeout(function(e) {
		$.addContactBtn.touchEnabled = "true";
		$.viewContactBtn.touchEnabled = "true";
		$.freeBtn.touchEnabled = "true";

	}, 2000);

}


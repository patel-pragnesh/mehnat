var args = arguments[0] || {};
// GET THE USER ID
var id = Ti.App.Properties.getString("id");
var data = args;
//Define for getting the index number of table while delete the contact
var index;

//Set the status of view contact
Alloy.Globals.viewContactOpened = true;

//XML Define function for back press
function closeWindowFun(e) {
	$.ViewContactScreen.close();
	Alloy.Globals.viewContactOpened = false;
}

function closeFun(e) {
	Alloy.Globals.viewContactOpened = false;
}

function closeFunAndroid(e) {
	$.ViewContactScreen.close();
	Alloy.Globals.viewContactOpened = false;
}

//XML Define function for open notification screen
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

	notificationWin.oldWin = $.ViewContactScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
}

//XML Define function for open panic screen
function openPanic(e) {
	if (Alloy.Globals.latitude != null && Alloy.Globals.longitude != null) {
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
			panicScreen.oldWin = $.ViewContactScreen;
			Alloy.Globals.currentWindow = panicScreen;
			setTimeout(function(e) {
				$.panicBtn.focusable = true;
			}, 2000);
		} else {
			Alloy.Globals.Alert("Please add emergency contact first");
		}
	} else {
		Alloy.Globals.Alert("You currently have all location services for this device disabled. If you proceed, you will be asked to confirm whether location services should be reenabled.");
	}
}

//XML Define function for open add contact

function openAddContactFun(e) {
	Ti.API.info('$.addBtn.toggle ' + $.addBtn.toggle);
	if ($.addBtn.toggle != "false") {
		Alloy.Globals.viewContactOpened = true;
		var addContact = Alloy.createController("AddContactScreen");
		Alloy.Globals.addContactObj = addContact;
		if (OS_IOS) {

			Alloy.Globals.navWindow.openWindow(addContact.getView());
		} else {

			addContact.getView().open();
		}
		addContact.oldWin = $.ViewContactScreen;
		Alloy.Globals.currentWindow = addContact.getView();
	} else {
		Alloy.Globals.Alert("You can not add more than 5 contact");
	}

}

function tblClickFun(e) {
	if ($.contactTable.touchEnabled == "false") {
		return;
	}
	$.contactTable.touchEnabled = "false";
	if (e.source.name == "edit") {
		if (OS_IOS) {
			var updateScreen = Alloy.createController("UpdateContactScreen", e.row.detail).getView();

			Alloy.Globals.navWindow.openWindow(updateScreen);
		} else {
			var updateScreen = Alloy.createController("UpdateContactScreen", e.row.detail).getView();
			updateScreen.open();
		}
		updateScreen.oldWin = $.ViewContactScreen;
		Alloy.Globals.currentWindow = updateScreen;

	} else if (e.source.name == "delete") {

		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', 'No'],
			message : 'Are you sure want to delete ' + e.row.detail.name + ' contact?',
			title : 'Road Safety'
		});
		dialog.addEventListener('click', function(k) {
			if (k.index === 0) {
				index = e.index;
				exports.deleteContactService(e.row.id);
			}

		});
		dialog.show();

	}
	setTimeout(function() {
		$.contactTable.touchEnabled = "true";
	}, 2000);
}

var listArray = [];
function getCallList(data) {
	listArray = [];

	for (var i = 0; i < data.length; i++) {
		var row = Ti.UI.createTableViewRow({

			touchEnabled : true,
			focusable : true,
			height : 50,
			//title : data[i].name,
			//color : '#565656',
			//selectedColor : "#565656",
			selectedBackgroundColor : "#F8F8F9",
			detail : data[i],
			id : data[i].id,

		});

		row.add(Ti.UI.createLabel({
			left : 10,
			right : 100,
			height : 30,
			font : {
				fontSize : 16
			},
			color : '#565656',
			text : data[i].name.capitalize(),

		}));
		Ti.API.info("Name " + data[i].name.capitalize());

		row.add(Ti.UI.createButton({
			right : 0,
			height : 50,
			width : 50,
			name : "edit",
			backgroundImage : "none",
			image : "/images/Edit_active.png"
		}));
		row.add(Ti.UI.createButton({
			name : "delete",
			right : 50,
			height : 50,
			width : 50,
			backgroundImage : "none",
			image : "/images/cancel_active.png"
		}));
		listArray.push(row);
	};
	$.contactTable.setData(listArray);
	if (data != null) {
		$.separatorLine.visible = true;
	} else {
		$.separatorLine.visible = false;
	}

}

/*
 * Function for get contacts
 */

exports.getContactService = function() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var PRAMS = "&id=" + id;
	var SERVICE_GET_CONTACT = Alloy.Globals.Constants.SERVICE_GET_CONTACT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_CONTACT + PRAMS, getContactServiceCallback);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_GET_CONTACT + PRAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};

function getContactService() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var PRAMS = "&id=" + id;
	var SERVICE_GET_CONTACT = Alloy.Globals.Constants.SERVICE_GET_CONTACT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_CONTACT + PRAMS, getContactServiceCallback);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_GET_CONTACT + PRAMS);
	} else {

		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};

/*
 * Callback gunction for FB and Google+ login
 */

function getContactServiceCallback(e) {
	Ti.API.info("getContactService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				Ti.API.info('response.action_success = ' + response.action_success);
				if (response.action_success == 'true') {
					getCallList(response.data);
					if (response.data.length >= 5) {

						$.addBtn.toggle = "false";
					} else {
						$.addBtn.toggle = "true";
					}
					Alloy.Globals.isContact = 1;
				} else {
					$.separatorLine.visible = false;
					Alloy.Globals.Alert(response.response_message);
					Alloy.Globals.isContact = 0;
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
 * Function for delete contacts
 */

exports.deleteContactService = function(rowId) {

	Ti.API.info('DATA ' + JSON.stringify(data));
	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var PRAMS = "&id=" + rowId;
	var SERVICE_DELETE_CONTACT = Alloy.Globals.Constants.SERVICE_DELETE_CONTACT;
	if (Ti.Network.online) {
		//Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_DELETE_CONTACT + PRAMS, deleteContactServiceCallback);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_DELETE_CONTACT + PRAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
};

/*
 * Callback gunction for FB and Google+ login
 */

function deleteContactServiceCallback(e) {
	Ti.API.info("deleteContactService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				Ti.API.info('response.action_success = ' + response.action_success);
				if (response.action_success == 'true') {
					$.contactTable.deleteRow(index, {
						animated : true
					});
					exports.getContactService();
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

	//Alloy.Globals.LoadingScreen.close();
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

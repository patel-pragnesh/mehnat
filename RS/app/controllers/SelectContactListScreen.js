var args = arguments[0] || {};
// GET THE USER ID
var id = Ti.App.Properties.getString("id");
var listArray = [];
var contactData = [];
//XML Define function for back press
function closeWindowFun(e) {
	$.SelectContactListScreen.close();
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

	notificationWin.oldWin = $.SelectContactListScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
}

//XML Define function for open panic screen
function openPanic(e) {
	
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
		panicScreen.oldWin = $.SelectContactListScreen;
		Alloy.Globals.currentWindow = panicScreen;
		setTimeout(function(e) {
			$.panicBtn.focusable = true;
		}, 2000);
	} else {
		Alloy.Globals.Alert("Please add emergency contact first");
	}

}

/*
 * Function for search piece (Define in XML TextField)
 */
var newArr = [];
function searchArticle(e) {
	newArr = [];
	if (contactData.length > 0) {

		var searchTxt = e.source.value;

		for (var i = 0; i < contactData.length; i++) {
			var rest = contactData[i];

			if ((rest.name.toLowerCase().indexOf(searchTxt.toLowerCase()) != -1)) {

				newArr.push(rest);

			} else {

			}
		}

	}
	getCallList(newArr, false);
}

// Repopulate contact data

function reloadContacts() {
	Alloy.Globals.LoadingScreen.open();
	var contacts = Ti.Contacts.getAllPeople();
	Ti.API.info("CONTACTS +" + JSON.stringify(contacts));

	contactData = [];
	var contactDetail = {};

	for (var i = 0; i < contacts.length; i++) {
		contactDetail = {};
		var name = contacts[i].fullName;
		var contact = contacts[i].phone.mobile;
		var email = contacts[i].email;
		var image = contacts[i].image;

		if (!name || name.length === 0) {
			name = "No Name";
		}
		if (!email || email.length === 0) {
			email = "No Email";
		}

		if (!contact || contact.length === 0) {
			//contact = "[" + "No Contact" + "]";
		} else {
			contactDetail.name = name;
			contactDetail.contact = contact;
			contactDetail.email = email;
			contactDetail.image = image;
			contactData.push(contactDetail);
		}
	}
	Ti.API.info("contactDetail " + JSON.stringify(contactData));
	if (contactData.length > 0) {
		getCallList(contactData, true);
	} else {
		Alloy.Globals.LoadingScreen.close();
		Alloy.Globals.Alert("There is no contact available in contact list");
	}
}

function getCallList(data, flag) {
	listArray = [];
	for (var i = 0; i < data.length; i++) {
		var row = Ti.UI.createTableViewRow({
			className : "detail",
			touchEnabled : true,
			focusable : true,
			height : 60,
			//rightImage : "/images/next.png",
			color : '#565656',
			selectedColor : "#565656",
			selectedBackgroundColor : "#F8F8F9",
			detail : data[i]
		});

		row.add(Ti.UI.createView({
			left : 10,
			touchEnabled : false,
			focusable : false,
			height : 46,
			width : 46,
			borderColor : "#2941AE",
			borderWidth : 1,

		}));
		row.getChildren()[0].add(Ti.UI.createImageView({
			image : data[i].image,
			defaultImage : "/images/no_img.png"

		}));

		row.add(Ti.UI.createLabel({
			color : '#565656',
			text : data[i].name,
			touchEnabled : false,
			focusable : false,
			left : 75,
			right : 0,
			top : 8,
			height : 25,
			font : {
				fontSize : 14
			},
			ellipsize : true,
			wordWrap : false,

		}));

		row.add(Ti.UI.createImageView({
			image : "/images/contact.png",
			top : 35,
			height : 16,
			width : 16,
			left : 75,
		}));

		row.add(Ti.UI.createLabel({
			color : '#565656',
			text : data[i].contact[0],
			touchEnabled : false,
			focusable : false,
			left : 105,
			right : 0,
			top : 35,
			height : 16,
			font : {
				fontSize : 12
			},
			ellipsize : true,
			wordWrap : false,

		}));

		listArray.push(row);

	};

	if (listArray.length > 0) {
		$.contactTable.setData(listArray);

	} else {

		var tablerow = Ti.UI.createTableViewRow({
			height : 65,
			width : '100%',
			selectedBackgroundColor : 'none',
			selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
			//rightImage : "/images/arrow_list_icon@2x.png"

		});

		var articleName = Ti.UI.createLabel({
			text : "Search result not found",
			color : '#242021',
			height : "25dp",
			ellipsize : true,
			wordWrap : false,
			font : {
				fontSize : 18,
				fontFamily : 'MuseoSansRounded-500',
				fontType : '300',
				fontStyle : 'crisp'
			},

		});
		tablerow.add(articleName);
		listArray.push(tablerow);
		$.contactTable.setData(listArray);
	}
	if (flag == true) {
		Alloy.Globals.LoadingScreen.close();
	}
}

function tblClickFun(e) {
	Alloy.Globals.addContactObj.addDetailFromContactList(e.row.detail);
	$.SelectContactListScreen.close();
	Ti.API.info('Data : ' + JSON.stringify(e.row.detail));
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

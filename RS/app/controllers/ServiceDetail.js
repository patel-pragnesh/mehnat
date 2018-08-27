var args = arguments[0] || {};

var listArray = [];

var data = args.services;

if (OS_ANDROID) {
	$.lbl.text = args.catName.capitalize();
} else {
	$.ServiceDetail.title = args.catName.capitalize();
}
var a = [];

function closeWindowFun(e) {
	$.ServiceDetail.close();
}

function winOpen(e) {
	sortingFun(data);
}

function sortingFun(data) {
	a = [];
	Ti.API.info('Data : ' + JSON.stringify(data));
	Ti.API.info('Alloy.Globals.sponsor_type : ' + Alloy.Globals.sponsor_type);
	for (var i = 0; i < data.length; i++) {
		if (data[i].sponser_type == Alloy.Globals.sponsor_type) {

			a.push(data[i]);
		}

	};
	Ti.API.info('Data : ' + JSON.stringify(a));
	if (a.length > 0) {
		getDetailList(a);
	} else if (Alloy.Globals.sponsor_type == "0") {
		getDetailList(data);
	} else {
		Alloy.Globals.Alert("No data available");
	}

}

//XML device back press button function
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
		panicScreen.oldWin = $.ServiceDetail;
		Alloy.Globals.currentWindow = panicScreen;
		setTimeout(function(e) {
			$.panicBtn.focusable = true;
		}, 2000);
	} else {
		Alloy.Globals.Alert("Please add emergency contact first");
	}
}

function openCategoryDetail(e) {
	Ti.API.info('contact : ' + e.source.name);
	if (e.source.name == "calling") {

		if ($.listTable.focusable == false) {
			return;
		}
		$.listTable.focusable = false;
		var contact = e.row.contact;

		var dialog = Ti.UI.createAlertDialog({
			cancel : 0,
			buttonNames : ['No', 'Yes'],
			message : 'Are you sure want to call?',
			title : 'Road Safety'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {

			} else {

				try {
					if (OS_ANDROID) {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_CALL,
							data : "tel:" + contact
						});
						Ti.Android.currentActivity.startActivity(intent);
					} else {
						Titanium.Platform.openURL("tel:" + contact);
					}
				} catch(e) {
					Ti.API.info("Error " + e.error);
				}
			}

		});
		dialog.show();
		setTimeout(function(e) {
			$.listTable.focusable = true;
		}, 2000);
	}

}

function getDetailList(data) {
	listArray = [];
	$.listTable.setData(listArray);
	for (var i = 0; i < data.length; i++) {

		var row = Ti.UI.createTableViewRow({
			className : "detail",
			touchEnabled : true,
			focusable : true,
			height : 90,
			layout : "vertical",
			color : '#565656',
			selectedColor : "#565656",
			selectedBackgroundColor : "#F8F8F9",
			contact : data[i].contact
		});
		
		row.add(Ti.UI.createView({
			top : 0,
			backgroundColor : "#F0F0F0",
			height : 30,
			name : "",
		}));
		row.getChildren()[0].add(Ti.UI.createLabel({
			color : "#585858",
			text : data[i].name.capitalize(),
			touchEnabled : false,
			focusable : false,
			left : 10,
			right : 0,
			height : 26,
			name : "",
			font : {
				fontSize : 16
			},
			ellipsize : true,
			wordWrap : false,

		}));
		
		row.add(Ti.UI.createView({
			height :70,
			
			//layout : "horizontal"
		}));
		
		row.getChildren()[1].add(Ti.UI.createImageView({
			image : "/images/calling_button.png",
			name : "",
			right : 10,
			name : "calling"
		}));
		row.getChildren()[1].add(Ti.UI.createView({
			left : 10,
			touchEnabled : false,
			focusable : false,
			height : 45,
			width : 45,
			borderColor : "#2941AE",
			borderWidth : 1,
			name : "",
		}));
		row.getChildren()[1].getChildren()[1].add(Ti.UI.createImageView({
			image : data[i].service_img,
			defaultImage : "/images/no_img.png",
			name : "",
		}));
		row.getChildren()[1].add(Ti.UI.createView({
			left : 70,
			touchEnabled : false,
			focusable : false,
			height : Ti.UI.SIZE,
			layout : "horizontal",
			name : "",
			right : "50dp",
			top : 10
		}));
		row.getChildren()[1].getChildren()[2].add(Ti.UI.createImageView({
			image : "/images/call.png",
			name : "",
		}));
		row.getChildren()[1].getChildren()[2].add(Ti.UI.createLabel({
			color : "#565656",
			text : data[i].contact,
			touchEnabled : false,
			focusable : false,
			left : 10,
			right : 0,
			height : 15,
			font : {
				fontSize : 11
			},
			name : "",
			ellipsize : true,
			wordWrap : false,

		}));
		row.getChildren()[1].add(Ti.UI.createView({
			left : 70,
			touchEnabled : false,
			focusable : false,
			height : Ti.UI.SIZE,
			top : 30,
			right : 50,
			name : "",
			layout : "horizontal"

		}));

		row.getChildren()[1].getChildren()[3].add(Ti.UI.createImageView({
			image : "/images/location.png",
			name : "",
			top:0,

		}));
		row.getChildren()[1].getChildren()[3].add(Ti.UI.createLabel({
			color : "#565656",
			text : data[i].address,
			touchEnabled : false,
			focusable : false,
			
			left : 8,
			width:"80%",
			
			font : {
				fontSize : 11
			},
			name : "",
			//ellipsize : true,
			//wordWrap : false,

		}));

		listArray.push(row);

	};
	$.listTable.setData(listArray);
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

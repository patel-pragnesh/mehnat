var args = arguments[0] || {};
var id = Ti.App.Properties.getString("id");

//categoryArray variable for the hold entire data of getCategroy service
var categoryArray = args;
var services = categoryArray.services;
//slidIn and slideOUt define for picker animation
var slideIn = Titanium.UI.createAnimation({
	bottom : 0
});
var slideOut = Titanium.UI.createAnimation({
	bottom : -262
});

//XML device back press button
function closeWindowFun(e) {
	$.NearestServiceScreen.close();
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
		panicScreen.oldWin = $.NearestServiceScreen;
		Alloy.Globals.currentWindow = panicScreen;
		setTimeout(function(e) {
			$.panicBtn.focusable = true;
		}, 2000);
	} else {
		Alloy.Globals.Alert("Please add emergency contact first");
	}
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
	notificationWin.oldWin = $.PinScreen;
	Alloy.Globals.currentWindow = notificationWin;
	setTimeout(function(e) {
		$.notificationBtn.focusable = true;
	}, 2000);
}

$.allBtn.backgroundImage = "/images/Blue_rectangle.png";
$.allBtn.color = "#ffffff";

//XML device all categroy button function
function allFun(e) {
	$.allBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.allBtn.color = "#ffffff";
	$.sponsoredBtn.backgroundImage = "/images/Rectangle.png";
	$.sponsoredBtn.color = "#2941AE";
	$.freeBtn.backgroundImage = "/images/Rectangle.png";
	$.freeBtn.color = "#2941AE";

	getAnnotation(categoryArray.services);

}

//XML device sponsored categroy button function
function sponsoredFun(e) {
	$.allBtn.backgroundImage = "/images/Rectangle.png";
	$.allBtn.color = "#2941AE";
	$.sponsoredBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.sponsoredBtn.color = "#ffffff";
	$.freeBtn.backgroundImage = "/images/Rectangle.png";
	$.freeBtn.color = "#2941AE";
	var a = [];

	for (var j = 0; j < services.length; j++) {
		if ("1" == services[j].sponser_type) {
			//Ti.API.info("Value : " + categoryArray[i].catName);
			a.push(services[j]);

		}

	};
	getAnnotation(a);
	Ti.API.info("Value : " + JSON.stringify(a));
}

//XML device free categroy button function
function freeFun(e) {
	$.allBtn.backgroundImage = "/images/Rectangle.png";
	$.allBtn.color = "#2941AE";
	$.sponsoredBtn.backgroundImage = "/images/Rectangle.png";
	$.sponsoredBtn.color = "#2941AE";
	$.freeBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.freeBtn.color = "#ffffff";
	var a = [];

	for (var j = 0; j < services.length; j++) {
		if ("2" == services[j].sponser_type) {

			a.push(services[j]);

		}

	};
	getAnnotation(a);
	Ti.API.info("Value : " + JSON.stringify(a));
}

// MAP section present here

//var Map = require('ti.map');

var mapview = Alloy.Globals.Map.createView({
	mapType : Alloy.Globals.Map.NORMAL_TYPE,
	userLocation : true,
	height : '100%',
	width : '100%',

	animate : true,
	regionFit : true,
	annotations : annoArray,
	region : {
		latitude : Alloy.Globals.latitude,
		longitude : Alloy.Globals.longitude,
		latitudeDelta : 1,
		longitudeDelta : 1
	}
});
$.mapcontainer.add(mapview);

var annoArray = [];
//Show annotation function
getAnnotation(categoryArray.services);
function getAnnotation(data) {
	try {
		annoArray = [];
		Ti.API.info('get ' + JSON.stringify(data));

		for (var i = 0; i < data.length; i++) {
			Ti.API.info("data[i].services[j].service_map_img " + data[i].service_map_img);

			var image1 = Ti.UI.createImageView({
				image : data[i].service_map_img,
				hires : true,
				backgroundImage : "none",
				defaultImage : "none",
			});

			var anno1 = Alloy.Globals.Map.createAnnotation({
				latitude : data[i].latitude,
				//image : data[i].service_map_img,
				longitude : data[i].longitude,
				title : data[i].name,
				subtitle : data[i].address,
				contact : data[i].contact,
				myid : 1,
				font : {
					fontSize : 10.0928,
					fontFamily : "Roboto-Light",
					FontStyle : "Light",
					fontType : "Smooth"
				},
				rightButton : '/images/calling_button.png',
			});
			if (data[i].service_map_img != null) {
				if (OS_IOS) {
					anno1.customView = image1;
				} else {
					anno1.image = data[i].service_map_img;
				}

			}
			annoArray.push(anno1);
			//Ti.API.info("annoArray.push(anno1); " + JSON.stringify(annoArray));
		};
		Ti.API.info("annoArray.push(anno1); " + JSON.stringify(annoArray));
		if (annoArray.length > 0) {
		} else {
			Alloy.Globals.Alert("There is no service found");
		}
		mapview.annotations = annoArray;
	} catch(e) {
		Ti.API.info('Get Annotation Error : ' + e.error);
	}
}

mapview.addEventListener('click', function(e) {
	try {

		if (e.annotation.myid == 1 && (e.clicksource == 'rightButton' || e.clicksource == 'rightPane')) {
			var contact = e.annotation.contact;
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
		}
	} catch(e) {
	}
});
function openSortingListPicker(e) {

	if (categoryArray) {
		$.sortBtn.touchEnabled = false;

		var teamPickerView = Ti.UI.createView({

			height : 262,
			bottom : -262,
			width : "100%",
			layout : 'vertical',
			zIndex : 30
		});

		var spacer = Titanium.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});

		var cancel = Titanium.UI.createButton({
			title : 'Cancel',
			color : 'white',
			backgroundImage : 'none',
			style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED
		});
		var done = Titanium.UI.createButton({
			title : 'Done',
			color : 'white',
			backgroundImage : 'none',
			style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED
		});

		var toolbar = Ti.UI.iOS.createToolbar({
			top : 0,
			barColor : '#2941AE',
			translucent : true,
			//opacity : '0.9',
			items : [cancel, spacer, done]
		});

		teamPickerView.add(toolbar);
		datepicker = Ti.UI.createPicker({

			top : 0,
			width : "100%",
			selectionIndicator : true,

		});

		teamPickerView.add(datepicker);
		var row1 = Ti.UI.createPickerRow({
			title : "Select Category",
			width : "100%"
		});
		datepicker.add(row1);

		for (var i = 0; i < categoryArray.length; i++) {

			var row = Ti.UI.createPickerRow({
				title : categoryArray[i].catName.capitalize(),
				width : "100%"
			});
			datepicker.add(row);
		};
		var value = categoryArray[0];
		datepicker.addEventListener('change', function(e) {

			Ti.API.info(e.row.title);
			value = e.row.title;

		});

		done.addEventListener('click', function() {
			Ti.API.info("Value : " + value);
			$.sortBtn.touchEnabled = true;
			teamPickerView.animate(slideOut);
			if (value != "Select Category") {
				for (var i = 0; i < categoryArray.length; i++) {
					if (value == categoryArray[i].catName.capitalize()) {

						Ti.API.info("Value : " + categoryArray[i].catName);
						var a = [];
						a.push(categoryArray[i]);
						getAnnotation(a);
						break;
					}
				};
			} else if (value == "Select Category") {
				getAnnotation(categoryArray);
			}
		});

		cancel.addEventListener('click', function() {
			$.sortBtn.touchEnabled = true;

			teamPickerView.animate(slideOut);

		});
		teamPickerView.animate(slideIn);

		$.NearestServiceScreen.add(teamPickerView);
	} else {
		Alloy.Globals.Alert("There is no categroy found.");
	}
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

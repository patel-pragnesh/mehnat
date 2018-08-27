var args = arguments[0] || {};
var id = Ti.App.Properties.getString("id");

//categoryArray variable for the hold entire data of getCategroy service
var categoryArray = [];
var sponsor_type = "0";
//slidIn and slideOUt define for picker animation
var slideIn = Titanium.UI.createAnimation({
	bottom : 0
});
var slideOut = Titanium.UI.createAnimation({
	bottom : -262
});

//XML device back press button
function closeWindowFun(e) {
	$.RoadAssistanceScreen.close();
}

function closeEmergencyContactFun(e) {
	$.EmergencyContactScreen.close();
}

function viewContactTSFun(e) {
	$.allBtn.color = "white";
}

function viewContactTEFun(e) {
	$.allBtn.color = "#2941AE";
}

function addContactTSFun(e) {
	$.sponsoredBtn.color = "white";
}

function addContactTEFun(e) {
	$.sponsoredBtn.color = "#2941AE";
}

function freeContactTSFun(e) {
	$.freeBtn.color = "white";
}

function freeContactTEFun(e) {
	$.freeBtn.color = "#2941AE";
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
		panicScreen.oldWin = $.RoadAssistanceScreen;
		Alloy.Globals.currentWindow = panicScreen;
		setTimeout(function(e) {
			$.panicBtn.focusable = true;
		}, 2000);
	} else {
		Alloy.Globals.Alert("Please add emergency contact first");
	}
}

$.allBtn.backgroundImage = "/images/Blue_rectangle.png";
$.allBtn.color = "#ffffff";

//XML device all categroy button function
function allFun(e) {
	sponsor_type = "0";
	$.allBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.allBtn.color = "#ffffff";
	$.sponsoredBtn.backgroundImage = "/images/Rectangle.png";
	$.sponsoredBtn.color = "#2941AE";
	$.freeBtn.backgroundImage = "/images/Rectangle.png";
	$.freeBtn.color = "#2941AE";
	if (categoryArray.length > 0) {
		getAnnotation(categoryArray, sponsor_type);
		
	} else {
		Alloy.Globals.Alert("There is no category found");
	}
	

}

//XML device sponsored categroy button function
function sponsoredFun(e) {
	sponsor_type = "1";
	$.allBtn.backgroundImage = "/images/Rectangle.png";
	$.allBtn.color = "#2941AE";
	$.sponsoredBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.sponsoredBtn.color = "#ffffff";
	$.freeBtn.backgroundImage = "/images/Rectangle.png";
	$.freeBtn.color = "#2941AE";
	if (categoryArray.length > 0) {
		getAnnotation(categoryArray, sponsor_type);
	} else {
		Alloy.Globals.Alert("There is no category found");
	}

}

//XML device free categroy button function
function freeFun(e) {
	sponsor_type = "2";
	$.allBtn.backgroundImage = "/images/Rectangle.png";
	$.allBtn.color = "#2941AE";
	$.sponsoredBtn.backgroundImage = "/images/Rectangle.png";
	$.sponsoredBtn.color = "#2941AE";
	$.freeBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.freeBtn.color = "#ffffff";

	if (categoryArray.length > 0) {
		getAnnotation(categoryArray, sponsor_type);
	} else {
		Alloy.Globals.Alert("There is no category found");
	}

}

//XML device bottom toggle button function for Map/List
function changeLayout(e) {
	if ($.listViewBtn.focusable == false) {
		return;
	}
	$.listViewBtn.focusable = false;

	if (categoryArray) {
		if (OS_IOS) {
			var listScreen = Alloy.createController("RoadAssistanceListScreen", categoryArray).getView();
			Alloy.Globals.navWindow.openWindow(listScreen);
		} else {
			var listScreen = Alloy.createController("RoadAssistanceListScreen", categoryArray).getView();
			listScreen.open();
		}
		listScreen.oldWin = $.RoadAssistanceScreen;
		Alloy.Globals.currentWindow = listScreen;
	} else {
		Alloy.Globals.Alert("There is no data available");
	}
	setTimeout(function(e) {
		$.listViewBtn.focusable = true;
	}, 2000);
}

// MAP section present here

//var Map = require('ti.map');

var mapview = Alloy.Globals.Map.createView({
	mapType : Alloy.Globals.Map.NORMAL_TYPE,
	userLocation : true,
	top : 0,
	bottom : 0,
	left : 0,
	right : 0,
	animate : true,
	regionFit : true,
	region : {
		latitude : Alloy.Globals.latitude,
		longitude : Alloy.Globals.longitude,
		latitudeDelta : 1,
		longitudeDelta : 1
	}
});
$.mapcontainer.add(mapview);

var annoArray = [];
function getAnnotation(data, sponsor_type) {
	Ti.API.info("sponsor_type " + sponsor_type);

	annoArray = [];

	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].services.length; j++) {
			var image1 = Ti.UI.createImageView({
				backgroundImage : "none",
				defaultImage : "none",
				image : data[i].services[j].service_map_img,
				hires : true
			});
			var anno1 = Alloy.Globals.Map.createAnnotation({
				latitude : data[i].services[j].latitude,

				longitude : data[i].services[j].longitude,
				title : data[i].services[j].name,
				subtitle : data[i].services[j].address,
				contact : data[i].services[j].contact,
				myid : 1,
				font : {
					fontSize : 10.0928,
					fontFamily : "Roboto-Light",
					FontStyle : "Light",
					fontType : "Smooth"
				},
				rightButton : '/images/calling_button.png',
			});
			if (data[i].services[j].service_map_img != null) {
				if (OS_IOS) {
					anno1.customView = image1;
				} else {
					anno1.image = data[i].services[j].service_map_img;
				}

			}
			if (sponsor_type == data[i].services[j].sponser_type) {
				annoArray.push(anno1);
			} else if (sponsor_type == "0") {
				annoArray.push(anno1);
			}

			//Ti.API.info("annoArray.push(anno1); " + JSON.stringify(annoArray));
		};

	}
	Ti.API.info("annoArray  " + JSON.stringify(annoArray));
	//if(annoArray.length>0){}else{Alloy.Globals.Alert("There is no service found");}
	mapview.annotations = annoArray;
}

mapview.addEventListener('click', function(e) {
	try{
	
	if (e.annotation.myid == 1 && (e.clicksource == 'rightButton' || e.clicksource == 'rightPane')) {
		var contact = e.annotation.contact;
		Ti.API.info('contact ' + contact);
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
	}catch(e){
		Ti.API.info("Error on annotation : "+e.error);
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
			left : 0,
			right : 0,
			top : 0,
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
						getAnnotation(a, sponsor_type);
						break;
					}
				};
			} else if (value == "Select Category") {
				getAnnotation(categoryArray, sponsor_type);
			}
		});

		cancel.addEventListener('click', function() {
			$.sortBtn.touchEnabled = true;

			teamPickerView.animate(slideOut);

		});
		teamPickerView.animate(slideIn);

		$.RoadAssistanceScreen.add(teamPickerView);
	} else {
		Alloy.Globals.Alert("There is no categroy found.");
	}
}

function openCategoryDetail(e) {
	Ti.API.info('className : ' + JSON.stringify(e.row.className));
	if (e.row.className == "category") {
		getDetailList(e.row.detail);
	} else if (e.row.className == "detail") {
		var contact = e.row.contact;
		Ti.API.info('contact : ' + e.row.contact);
		var dialog = Ti.UI.createAlertDialog({
			cancel : 0,
			buttonNames : ['No', 'Yes'],
			message : 'Are you sure want to call?',
			title : 'Road Safety'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
			} else {

				Titanium.Platform.openURL("tel:" + contact);
			}

		});
		dialog.show();

	}

}

function getCategoryRulesService() {
	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var SERVICE_GET_CATEGORY = Alloy.Globals.Constants.SERVICE_GET_CATEGORY;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_CATEGORY + PARAMS, getCategoryRulesServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_CATEGORY + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function getCategoryRulesServiceCallback(e) {
	Ti.API.info("getCategoryRulesServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					categoryArray = response.data;
					if (OS_ANDROID) {
						initializePickerAndroid(response.data);
					}
					if (categoryArray.length > 0) {
						getAnnotation(categoryArray, sponsor_type);
					} else {
						Alloy.Globals.Alert("There is no category found");
					}

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error getCategoryRulesServiceCallback :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();

}

function initializePickerAndroid(data) {
	var row1 = Ti.UI.createPickerRow({
		title : "Select Category",
		width : "100%"
	});
	$.teamPicker.add(row1);

	for (var i = 0; i < data.length; i++) {
		var row = Ti.UI.createPickerRow({
			title : data[i].catName.capitalize(),
			width : "100%"
		});
		$.teamPicker.add(row);
	};
	var value = "Select Category";
	$.teamPicker.addEventListener('change', function(e) {
		Ti.API.info(e.row.title);
		if (categoryArray) {
			Ti.API.info(e.row.title);
			value = e.row.title;
			if (value != "Select Category") {
				for (var i = 0; i < categoryArray.length; i++) {
					if (value == categoryArray[i].catName.capitalize()) {

						Ti.API.info("Value : " + categoryArray[i].catName);
						var a = [];
						a.push(categoryArray[i]);
						getAnnotation(a, sponsor_type);
						break;
					}
				};
			} else if (value == "Select Category") {
				//getAnnotation(categoryArray, sponsor_type);
			}
		} else {
			Alloy.Globals.Alert("There is no category found");
		}
		$.teamPicker.setSelectedRow(0, 0, false);
	});
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

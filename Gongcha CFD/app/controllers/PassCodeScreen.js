// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args,
    _storeList,
    popover;

var LAST_STORE_LOCATION = Ti.App.Properties.getObject("SelectedStore"),
    CONTENT_VIEW,
    NO_DATA_LBL,
    SEARCH_BAR_VIEW,
    PREVIOUS_ROW;

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

function init() {
	// $.NodataLbl.font = {
	// fontSize : 18,
	// fontFamily : "Helvetica-Bold"
	// };
	//
	// $.NodataLbl.visible = true;
	createPopoverTable();

}

init();

function createPopoverTable() {
	CONTENT_VIEW = Ti.UI.createView({
		width : 500,
		height : Ti.UI.FILL,
		top : 0,
		backgroundColor : "yellow"
	});

	var tableNSearchView = Ti.UI.createView({
		width : "100%",
		height : Ti.UI.FILL,
		top : 0,
		layout : "vertical"
	});

	SEARCH_BAR_VIEW = Ti.UI.createSearchBar({
		barColor : "#b3b3b3",
		showCancel : false,
		height : Ti.UI.SIZE,
		hintText : "Search"
	});
	SEARCH_BAR_VIEW.addEventListener("return", searchReturn);
	SEARCH_BAR_VIEW.addEventListener("change", searchBarChangeEvt);
	tableNSearchView.add(SEARCH_BAR_VIEW);

	_storeList = Ti.UI.createTableView({
		separatorColor : "transparent",
		backgroundColor : "#EAE9E8",
		height : Ti.UI.FILL,
		width : "100%"
	});

	_storeList.addEventListener("click", changePickUpStore);
	_storeList.addEventListener("scorll", searchReturn);
	tableNSearchView.add(_storeList);

	NO_DATA_LBL = Ti.UI.createLabel({
		fontSize : 18,
		fontFamily : "Helvetica-Bold",
		color : "#d3d3d3",
		touchEnabled : false,
		textid : "DATA_NOT_AVAILABLE"
	});

	CONTENT_VIEW.add(tableNSearchView);
	CONTENT_VIEW.add(NO_DATA_LBL);

	_storeList.setData(createCards(Ti.App.Properties.getObject("StoreList")));
	// $.numericPadView.visible = false;
	// // storeListPopOver();
	// $.setupStoreWin.add(CONTENT_VIEW);
}

/*
 * Function for validating login
 */
function validateLoginfun() {
	if ($.pinNoTF.value != '' && $.pinNoTF.value.trim().length > 0) {
		if ($.pinNoTF.value.trim().length != 3) {
			checkAuthorization($.pinNoTF.value);

		} else {
			Alloy.Globals.Notifier.show(L("ENTER_VALID_PIN_NUMBER"));
		}
	} else {
		Alloy.Globals.Notifier.show(L("ENTER_PIN_NUMBER"));
	}
}

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

// Cancel button click event handler
function closeSetupFunc(e) {
	$.passCodeWin.close();
}

function checkAuthorization(_authPin) {
	var url = DOMAIN_URL + 'kiosk/checkEmployeeLogin';

	var a = 'login_pin=' + _authPin;
	a = a + '&deviceType=' + 3;
	a = a + '&deviceId=' + Titanium.Platform.id;
	a = a + '&store_id=' + Ti.App.Properties.getString("store_id");

	Ti.API.info('url checkEmployeeLogin : ' + url);
	Ti.API.info('checkEmployeeLogin parameters : ' + a);

	//requestedUtils.post(url, a, function(e) {
	Communicator.post(url, function(e) {
		// try {

		if (e.success) {

			var responseData = JSON.parse(e.response);
			Ti.API.info('responseData ' + JSON.stringify(responseData));
			if (responseData.response_code == 1) {
				$.numericPadView.visible = false;
				if (args.onComplete != undefined && args.onComplete != null) {
					args.onComplete();
				}

				Alloy.Globals.loginNavWin.close();
			} else {
				Alloy.Globals.LoadingScreen.close();
				Alloy.Globals.Notifier.show(responseData.responseMessage);
			}
		} else {
			Alloy.Globals.LoadingScreen.close();
			Alloy.Globals.Notifier.show(e.message);
		}
		// } catch(e) {
		// Alloy.Globals.LoadingScreen.close();
		// Ti.API.info('in catch checkAuthorization  Setup Store screen' + JSON.stringify(e));
		// }

	}, a);
}

function storeListPopOver() {

	popover = Ti.UI.iPad.createPopover({
		backgroundColor : '#EAE9E8',
		contentView : CONTENT_VIEW,
		arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_UP,
		// width : "65%",
		// height : "90%"
	});

	popover.show({
		view : $.popoverView
	});

	popover.addEventListener("hide", function(e) {
		$.passCodeWin.close();
	});
}

// Create Card View for the Gift Cards
function createCards(menuList) {
	if (menuList == null || menuList == undefined) {
		menuList = [];
	}
	var menuData = [];

	Ti.API.info('menuList ' + JSON.stringify(menuList));

	for (var i = 0; i < menuList.length; i++) {

		var row = Ti.UI.createTableViewRow({
			// width : Ti.UI.FILL,
			cardDetails : menuList[i],
			title : menuList[i].store_name,
			locationAdd : menuList[i].store_name,
			color : "transparent",
			height : Ti.UI.SIZE,
			backgroundColor : "transparent",
			selectedBackgroundColor : "transparent",

		});

		if (OS_IOS) {
			row.selectionStyle = Ti.UI.iOS.TableViewCellSelectionStyle.NONE;
		}

		var cardView = Ti.UI.createView({
			height : 95,
			width : "95%",
			backgroundColor : "#fff",
			borderColor : "#D4D3D1",
			borderWidth : 1.5,
			top : 7,
			touchEnabled : false,
			layout : "vertical"
		});

		/*
		 * State and city view
		 */
		var stateCityView = Ti.UI.createView({
			height : "20%",
			width : "95%",
			top : 10,
			touchEnabled : false,
			layout : "horizontal",
			left : "5%",
		});

		var stateCityLabel = Ti.UI.createLabel({
			text : menuList[i].store_name,
			font : {
				fontSize : 18,
				//fontWeight : "bold",
				fontFamily : "Helvetica"
			},
			touchEnabled : false,
			color : "#000",
		});
		stateCityView.add(stateCityLabel);
		cardView.add(stateCityView);
		/*
		 * address view
		 */
		var addressView = Ti.UI.createView({
			height : "15%",
			width : "95%",
			top : 8,
			touchEnabled : false,
			layout : "horizontal"
		});
		var addressImageHolder = Ti.UI.createView({
			height : "100%",
			width : "7%",
		});
		var addressImage = Ti.UI.createImageView({
			image : "/images/icon01.png",
			height : Ti.UI.SIZE,
			//width : Ti.UI.SIZE,
		});
		addressImageHolder.add(addressImage);

		var stateCityLabel = Ti.UI.createLabel({
			text : menuList[i].address,
			font : {
				fontSize : 14,
				//fontWeight : "bold",
				fontFamily : "Helvetica"
			},
			touchEnabled : false,
			color : "#666666",
			left : "0",
			height : 10,
			width : "90%",
			ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
		});
		addressView.add(addressImageHolder);
		addressView.add(stateCityLabel);
		cardView.add(addressView);

		/*
		 * contact view
		 */
		var contactView = Ti.UI.createView({
			height : "15%",
			width : "95%",
			//	backgroundColor : "red",
			top : 8,
			touchEnabled : false,
			layout : "horizontal"
		});

		var contactImageHolder = Ti.UI.createView({
			height : "100%",
			width : "7%",

		});

		var contactImage = Ti.UI.createImageView({
			image : "/images/icon02.png",
			height : Ti.UI.SIZE,
			//width : Ti.UI.SIZE,
		});
		contactImageHolder.add(contactImage);

		var contactNumberLabel = Ti.UI.createLabel({
			text : menuList[i].mobile_no,
			font : {
				fontSize : 14,
				//fontWeight : "bold",
				fontFamily : "Helvetica"
			},
			touchEnabled : false,
			color : "#666666",
			left : "0",
		});
		contactView.add(contactImageHolder);
		contactView.add(contactNumberLabel);
		cardView.add(contactView);

		/*
		* openCloseTiminng
		*/
		/*
		var TimingView = Ti.UI.createView({
		height : "20%",
		width : "95%",
		top : 0,
		touchEnabled : false,
		});
		var View = Ti.UI.createView({
		height : "100%",
		width : "100%",
		touchEnabled : false,
		//backgroundColor : "red",
		left : "0",
		//layout : "horizontal"
		});

		var TimeImageMainHolder = Ti.UI.createView({
		height : "100%",
		width : "60%",
		touchEnabled : false,
		// backgroundColor : "pink",
		layout : "horizontal",
		left : "0",

		});

		var timeImageHolder = Ti.UI.createView({
		height : "100%",
		width : "7.5%",
		left : "4%",
		// backgroundColor : "red"
		});

		var timeImage = Ti.UI.createImageView({
		image : "/images/icon03.png",
		height : Ti.UI.SIZE,
		//width : Ti.UI.SIZE,
		left : 0,
		});
		timeImageHolder.add(timeImage);

		var openCloseTime = Ti.UI.createLabel({
		// text : "10 am to 10 pm",
		// text : ,
		font : {
		fontSize : 11,
		//fontWeight : "bold",
		fontFamily : "Helvetica"
		},
		touchEnabled : false,
		color : "#666666",
		left : "0",
		// backgroundColor :"yellow"
		});*/

		// var openCloseValue = getOpenCloseTime(menuList[i].open_hrs, menuList[i].close_hrs, menuList[i].closed);
		//
		// if (openCloseValue.substring(0, 6) == L("CLOSED")) {
		// row.touchEnabled = false;
		// row.storeClosed = true;
		// if (openCloseValue.length < 7) {
		// openCloseTime.text = openCloseValue;
		// openCloseTime.color = "#D5443A";
		// openCloseTime.font = {
		// fontSize : 12,
		// fontWeight : "bold",
		// fontFamily : "Helvetica"
		// };
		// } else {
		// var attr = Ti.UI.createAttributedString({
		// text : openCloseValue,
		// attributes : [{
		// type : Ti.UI.ATTRIBUTE_FONT,
		// value : {
		// fontSize : 12,
		// fontWeight : "bold",
		// fontFamily : "Helvetica"
		// },
		// range : [0, 7]
		// }, {
		// type : Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
		// value : '#D5443A',
		// range : [0, 7]
		// }, {
		// type : Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
		// value : '#666666',
		// range : [8, openCloseValue.length]
		// }]
		// });
		// openCloseTime.attributedString = attr;
		// }
		//
		// } else {
		// openCloseTime.text = openCloseValue;
		// row.storeClosed = false;
		// }

		/*
		 TimeImageMainHolder.add(timeImageHolder);
		 TimeImageMainHolder.add(openCloseTime);
		 View.add(TimeImageMainHolder);
		 TimingView.add(View);
		 cardView.add(TimingView);*/

		/*
		 * Distance tag
		 */
		var distanceView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : "20%",
			//top :10,
			right : "10",
			touchEnabled : true,
		});

		var distanceImage = Ti.UI.createImageView({
			image : "/images/icon04.png",
			height : Ti.UI.SIZE,
		});

		var distanceLabel = Ti.UI.createLabel({
			text : "2km",
			font : {
				fontSize : 16,
				//fontWeight : "bold",
				fontFamily : "Helvetica"
			},
			touchEnabled : false,
			color : "#c52837",
			right : "0",
		});
		distanceView.add(distanceImage);
		distanceView.add(distanceLabel);
		// cardView.add(distanceView);
		row.add(cardView);
		var checkBoxImage = Ti.UI.createImageView({
			//image : "/images/check_box_tick.png",
			height : 20,
			right : 25,
			top : 45,
			zIndex : 5,
		});
		row.add(checkBoxImage);

		if (LAST_STORE_LOCATION != null && LAST_STORE_LOCATION != undefined) {
			if (menuList[i].id == LAST_STORE_LOCATION.id) {
				checkBoxImage.image = "/images/customized_tick.png";
				PREVIOUS_ROW = checkBoxImage;
			}
		}

		menuData.push(row);
	}

	if (menuList.length > 0) {
		NO_DATA_LBL.visible = false;
	} else {
		NO_DATA_LBL.visible = true;
	}
	return menuData;
}

function searchReturn() {
	SEARCH_BAR_VIEW.blur();
}

function changePickUpStore(e) {
	Ti.API.info('e*******' + JSON.stringify(e.source));

	if (e.row.storeClosed == true) {
		return;
	}

	if (Ti.App.Properties.getObject("SelectedStore") != null && Ti.App.Properties.getObject("SelectedStore") != undefined) {
		if (Ti.App.Properties.getObject("SelectedStore").id == e.row.cardDetails.id) {
			return;
		}
	}

	Ti.API.info('rowDetails ' + e.row);
	if (PREVIOUS_ROW != null) {
		PREVIOUS_ROW.image = "none";
		PREVIOUS_ROW.visible = false;
	}
	e.row.getChildren()[1].image = "/images/customized_tick.png";
	e.row.getChildren()[1].visible = true;
	PREVIOUS_ROW = e.row.getChildren()[1];
	Ti.API.info('e.row.locationAdd' + JSON.stringify(e.row.cardDetails));
	Ti.App.Properties.setObject("SelectedStore", e.row.cardDetails);
	// args.locationAddLb.text = e.row.locationAdd;

	Ti.API.info('Ti.App.Properties.getObject("SelectedStore") ' + JSON.stringify(Ti.App.Properties.getObject("SelectedStore")));
	if (Ti.App.Properties.getObject("SelectedStore") != null && Ti.App.Properties.getObject("SelectedStore") != undefined) {
		if (Ti.App.Properties.getObject("SelectedStore").city != "" && Ti.App.Properties.getObject("SelectedStore").city != undefined && Ti.App.Properties.getObject("SelectedStore").city != null) {
			if (Ti.App.Properties.getObject("SelectedStore").state != "" && Ti.App.Properties.getObject("SelectedStore").state != undefined && Ti.App.Properties.getObject("SelectedStore").state != null) {
				// args.locationAddLb.text = Ti.App.Properties.getObject("SelectedStore").state + " - " + Ti.App.Properties.getObject("SelectedStore").city;
				args.locationAddLb(Ti.App.Properties.getObject("SelectedStore").state + " - " + Ti.App.Properties.getObject("SelectedStore").city);
			} else {
				// args.locationAddLb.text = Ti.App.Properties.getObject("SelectedStore").city;
				args.locationAddLb(Ti.App.Properties.getObject("SelectedStore").city);
			}

		} else if (Ti.App.Properties.getObject("SelectedStore").address != "" && Ti.App.Properties.getObject("SelectedStore").address != undefined && Ti.App.Properties.getObject("SelectedStore").address != null) {
			// args.locationAddLb.text = Ti.App.Properties.getObject("SelectedStore").address;
			args.locationAddLb(Ti.App.Properties.getObject("SelectedStore").address);
		} else if (Ti.App.Properties.getObject("SelectedStore").store_name != "" && Ti.App.Properties.getObject("SelectedStore").store_name != undefined && Ti.App.Properties.getObject("SelectedStore").store_name != null) {
			// args.locationAddLb.text = Ti.App.Properties.getObject("SelectedStore").store_name;
			args.locationAddLb(Ti.App.Properties.getObject("SelectedStore").store_name);
		}
	} else {
		// args.locationAddLb.color = "#fff";
		// args.locationAddLb.text = L("SELECT_STORE");
		args.locationAddLb(L("SELECT_STORE"));
	}

	// $.passCodeWin.close();
	popover.hide();
}

function searchBarChangeEvt(e) {
	var menuListItemForSrch = Ti.App.Properties.getObject("StoreList");

	var searchTxt = e.value;
	Ti.API.info('searchTxt ' + searchTxt);
	var newArr = [];
	try {
		for (var i = 0; i < menuListItemForSrch.length; i++) {
			var rest = menuListItemForSrch[i].city + " " + menuListItemForSrch[i].state + " " + menuListItemForSrch[i].address + " " + menuListItemForSrch[i].store_name;

			if (rest.toLowerCase().indexOf(searchTxt.toLowerCase()) != -1) {

				newArr.push(menuListItemForSrch[i]);

			} else {

			}
		}
		_storeList.setData(createCards(newArr));
	} catch(e) {
		Ti.API.error('in searchBar change event catch ' + JSON.stringify(e));
		tracker.addException({
			description : "searchBar => Change Event: " + e.message,
			fatal : false
		});
	}
};

// Get the opening and closing time of the store
function getOpenCloseTime(openTimings, closeTimings, closedDays) {
	var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	var d = new Date();
	var day = days[d.getDay()];

	if (closedDays[day] == "1") {
		var retValue = L("CLOSED") + storeOpensAt(openTimings, closedDays, day);
		Ti.API.info('getOpenCloseTime ' + retValue);
		return retValue;
	}

	// 	get opening time in 12 hour format
	if ((openTimings[day] != undefined && openTimings[day] != null)) {
		var openingTime = openTimings[day];
		openingTime = tConvert(openingTime);
	} else {
		var openingTime = "NA";
	}

	// 	get closing time in 12 hour format
	if ((closeTimings[day] != undefined && closeTimings[day] != null)) {
		var closingTime = closeTimings[day];
		closingTime = tConvert(closingTime);
	} else {
		var closingTime = "NA";
	}

	var openCloseTime = openingTime + " to " + closingTime;
	Ti.API.info('openCloseTime ' + openCloseTime);

	return openCloseTime;

}

function tConvert(time) {
	// Check correct time format and split into components
	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	// Ti.API.info('time ' + time);
	if (time.length > 1) {// If time format correct
		time = time.slice(1);
		// Remove full string match value
		// Ti.API.info('time remove ' + time);
		// time = time.splice (3,1);  // Remove millsecond string match value
		// Ti.API.info('time remove ' + time);
		time[3] = " ";
		time[5] = +time[0] < 12 ? 'AM' : 'PM';
		// Set AM/PM
		// Ti.API.info('time[5] ' + time);
		time[0] = +time[0] % 12 || 12;
		// Adjust hours
		// Ti.API.info('time[0] ' + time);
	}
	return time.join('');
	// return adjusted time or original string
}
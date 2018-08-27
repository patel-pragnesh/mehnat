var args = arguments[0] || {};
var id = Ti.App.Properties.getString("id");

//categoryArray variable for the hold entire data of getCategroy service
var categoryArray = args;
getList(categoryArray);
//slidIn and slideOUt define for picker animation
var slideIn = Titanium.UI.createAnimation({
	bottom : 0
});
var slideOut = Titanium.UI.createAnimation({
	bottom : -262
});

//XML device back press button
function closeWindowFun(e) {
	$.RoadAssistanceListScreen.close();
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
		panicScreen.oldWin = $.RoadAssistanceListScreen;
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
Alloy.Globals.sponsor_type = "0";

//XML device all categroy button function
function allFun(e) {
	$.allBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.allBtn.color = "#ffffff";
	$.sponsoredBtn.backgroundImage = "/images/Rectangle.png";
	$.sponsoredBtn.color = "#2941AE";
	$.freeBtn.backgroundImage = "/images/Rectangle.png";
	$.freeBtn.color = "#2941AE";
	Alloy.Globals.sponsor_type = "0";
}

//XML device sponsored categroy button function
function sponsoredFun(e) {
	$.allBtn.backgroundImage = "/images/Rectangle.png";
	$.allBtn.color = "#2941AE";
	$.sponsoredBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.sponsoredBtn.color = "#ffffff";
	$.freeBtn.backgroundImage = "/images/Rectangle.png";
	$.freeBtn.color = "#2941AE";
	Alloy.Globals.sponsor_type = "1";

}

//XML device free categroy button function
function freeFun(e) {
	$.allBtn.backgroundImage = "/images/Rectangle.png";
	$.allBtn.color = "#2941AE";
	$.sponsoredBtn.backgroundImage = "/images/Rectangle.png";
	$.sponsoredBtn.color = "#2941AE";
	$.freeBtn.backgroundImage = "/images/Blue_rectangle.png";
	$.freeBtn.color = "#ffffff";
	Alloy.Globals.sponsor_type = "2";
}

//XML device bottom toggle button function for Map/List
function changeLayout(e) {
	$.RoadAssistanceListScreen.close();
}

function openCategoryDetail(e) {
	if ($.listTable.focusable == false) {
		return;
	}
	$.listTable.focusable = false;
	if (OS_IOS) {
		var servicedetail = Alloy.createController("ServiceDetail", e.row.detail).getView();
		Alloy.Globals.navWindow.openWindow(servicedetail);
	} else {
		var servicedetail = Alloy.createController("ServiceDetail", e.row.detail).getView();
		servicedetail.open();
	}
	servicedetail.oldWin = $.RoadAssistanceListScreen;

	Alloy.Globals.currentWindow = servicedetail;
	setTimeout(function(e) {
		$.listTable.focusable = true;
	}, 2000);

}

var listArray = [];
function getList(data) {
	Ti.API.info("Data : " + JSON.stringify(data));
	listArray = [];
	var catObj = {};
	for (var i = 0; i < data.length; i++) {
		catObj = {};
		catObj.catName = data[i].catName;
		catObj.services = data[i].services;
		var row = Ti.UI.createTableViewRow({

			className : "category",
			touchEnabled : true,
			focusable : true,
			height : 40,
			rightImage : "/images/next.png",
			color : '#565656',
			selectedColor : "#565656",
			selectedBackgroundColor : "#F8F8F9",
			detail : catObj
		});

		row.add(Ti.UI.createLabel({
			color : "#2941AE",
			selectedColor : "#565656",
			objName : 'label',
			text : data[i].catName.capitalize(),
			touchEnabled : false,
			focusable : false,
			left : 15,
			right : 0,
			height : 30,
			font : {
				fontSize : 16
			},
			ellipsize : true,
			wordWrap : false,
		}));

		listArray.push(row);

	};
	$.listTable.setData(listArray);
}

function initializePickerAndroid(data) {
	var teamPicker = Ti.UI.createPicker({

	});

	for (var i = 0; i < data.length; i++) {
		var row = Ti.UI.createPickerRow({
			title : data[i].catName,
			width : "100%"
		});
		teamPicker.add(row);
	};
	var value = data[0];
	teamPicker.addEventListener('change', function(e) {
		Ti.API.info(e.row.title);
		value = e.row.title;
	});
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

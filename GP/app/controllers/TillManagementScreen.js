// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('TillManagement Screen');
var tillManagementArray = [];

exports.finalize = function(){
	Ti.API.info('Inside TillManagement finalize');
};

/*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {
	Alloy.Globals.openLeft();
}

Alloy.Globals.totalcashLbl = $.totalcashLbl;
Alloy.Globals.fetchTillManagementData = function() {
	tillManagementArray = Alloy.Globals.DbManager.getTillManagementDetail("");
	renderTillManagementList(tillManagementArray);
	Alloy.Globals.totalcashLbl.text = "$" + toFixed(Alloy.Globals.totalAmount).toFixed(2);
};

Alloy.Globals.fetchTillManagementData();

function renderTillManagementList(tillManagementData) {
	var tableData = [];
	for (var i = 0; i < tillManagementData.length; i++) {
		var row = Ti.UI.createTableViewRow({
			backgroundColor : "white",
			height : Ti.UI.SIZE,
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
		});

		var mainView = Ti.UI.createView({
			width : Ti.UI.FILL,
			top : 15,
			bottom : 15,
			height : Ti.UI.SIZE,
			layout : "horizontal"
		});

		var employInfoVw = Ti.UI.createView({
			width : "22%",
			left : "2%",
			height : Ti.UI.SIZE,
			layout : "horizontal"
		});
		mainView.add(employInfoVw);

		var userImg = Ti.UI.createImageView({
			height : 30,
			width : 30,
			top : 0,
			left : 0,
			borderRadius : 15,
			defaultImage : "/images/user_img.png",
			image : tillManagementData[i].employee_image,
		});
		employInfoVw.add(userImg);
		var employeeNameIdView = Ti.UI.createImageView({
			layout : "vertical",
			left : 5,
			top : 0
		});
		employInfoVw.add(employeeNameIdView);
		var employeeNameLbl = Ti.UI.createLabel({
			text : tillManagementData[i].employee_name,
			color : "#372E2C",
			height : Ti.UI.SIZE,
			left : 0,
			font : {
				fontSize : 12,
				fontFamily : "Montserrat-Light"
			},
		});
		employeeNameIdView.add(employeeNameLbl);
		var employeeID = Ti.UI.createLabel({
			text : "Employee Id- " + tillManagementData[i].employee_id,
			color : "#372E2C",
			height : Ti.UI.SIZE,
			left : 0,
			font : {
				fontSize : 11,
				fontFamily : "Montserrat-Light"
			},
		});
		employeeNameIdView.add(employeeID);

		var dateTimLbl = Ti.UI.createLabel({
			width : "17%",
			color : "#372E2C",
			height : Ti.UI.SIZE,
			font : {
				fontSize : 13,
				fontFamily : "Montserrat-Light"
			},
		});
		var date;
		if ( typeof (tillManagementData[i].date) == "number") {
			date = Alloy.Globals.DateTimeUtils.getFormattedDate(new Date(tillManagementData[i].date));
		} else {
			var a = tillManagementData[i].date.toString().replace(" ", "T");
			//date = getDate(new Date(new Date(a).getTime()));
			date = Alloy.Globals.DateTimeUtils.getFormattedDate(tillManagementData[i].date);
		}
		dateTimLbl.text = date;
		mainView.add(dateTimLbl);

		var descriptionLbl = Ti.UI.createLabel({
			width : "32%",
			text : tillManagementData[i].description,
			color : "#372E2C",
			height : Ti.UI.SIZE,
			font : {
				fontSize : 13,
				fontFamily : "Montserrat-Light"
			},
		});
		mainView.add(descriptionLbl);

		var payInOutLbl = Ti.UI.createLabel({
			width : "15%",
			color : "#372E2C",
			height : Ti.UI.SIZE,
			font : {
				fontSize : 13,
				fontFamily : "Montserrat-Light"
			},
		});
		mainView.add(payInOutLbl);
		if (tillManagementData[i].pay_type == 1) {
			payInOutLbl.text = "Pay-In";
		} else {
			payInOutLbl.text = "Pay-Out";
		}

		var amntLbl = Ti.UI.createLabel({
			width : "10%",
			text : "$" + tillManagementData[i].amount,
			color : "#372E2C",
			textAlign : "right",
			height : Ti.UI.SIZE,
			font : {
				fontSize : 13,
				fontFamily : "Montserrat-Light"
			},
		});
		mainView.add(amntLbl);
		row.add(mainView);
		tableData.push(row);

	};
	$.tillManagementTbl.setData(tableData);
}

var searchBar = Titanium.UI.createSearchBar({
	barColor : "#c32032",
	showCancel : true,
	visible : true,
	zIndex : 10,
	height : 44,
	width : 400,
	right : 0,
	top : 20
});

function addSearchBarFun(e) {

	$.tillManagemntWindow.add(searchBar);
}

searchBar.addEventListener('change', function(e) {
	var searchTxt = e.value;
	var newArr = [];

	for (var i = 0; i < tillManagementData.length; i++) {
		var rest = tillManagementData[i].employeeName + tillManagementData[i].amount;

		if (rest.toLowerCase().indexOf(searchTxt.toLowerCase()) != -1) {

			newArr.push(tillManagementData[i]);

		} else {

		}
	}
	renderTillManagementList(newArr);

	Ti.API.info(JSON.stringify(newArr));

});

searchBar.addEventListener('cancel', function() {
	Alloy.Globals.drawer.centerWindow.remove(searchBar);
	renderTillManagementList(tillManagementData);
});

function openAddRemoveCashPopUp(title) {
	var addRemoveCashpopup = Alloy.createController("AddRemoveCashPopUp", title).getView();
	addRemoveCashpopup.open();
}

function getDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12;
	// the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = date.toLocaleDateString() + " " + hours + ':' + minutes + ' ' + ampm.toUpperCase();
	return strTime;
}

function openDrawer(e){
	var printerConnected = false;
			if (Ti.App.Properties.getString("receiptPrinterMode") == "receiptViaNetwork") {
				if (Ti.App.Properties.getObject("receiptNetworkPrinter")) {
					printerConnected = true;
				}
			} else {
				if (Ti.App.Properties.getObject("peripheral")) {
					printerConnected = true;
				}
			}
			if (printerConnected) {
				openAddRemoveCashPopUp(e.source.name);
			}else{
				showPrinterDialog(e.source.name);
			}
}


function showPrinterDialog(name) {
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : 'Drawer not connected',
		title : 'Gongcha POS'
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			dialog.hide();
		} else {
			openAddRemoveCashPopUp(name);
		}
	});
	dialog.show();
}

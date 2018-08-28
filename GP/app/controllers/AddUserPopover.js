// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('AddUserPopup Screen');
Alloy.Globals.popover = $.popover;

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

var page = 1;
function openFunc() {
	//$.customer_search_bar.focus();
}

function scanFunc() {
	//Alloy.Globals.Notifier.show("Please scan the QR code");
	$.customer_search_bar.blur();
	$.customer_search_bar.value = "";
	$.hiddenTF.focus();
	$.scanVW.visible = true;
	$.mainContainer.visible = false;
}

function cancelFunc(e) {
	$.popover.hide();
}

function stopFunc(e) {
	$.scanLbl.text = "Please scan QR code";
	$.scanVW.visible = false;
	$.mainContainer.visible = true;
	$.hiddenTF.blur();
}

var customerList = [];
var totalLen;
position = 0;
var isSearch = false;

function changeFunc(e) {
	var searchTxt = e.value;
	$.scanLbl.text = "Reading...";
	// if (searchTxt.length >= 6) {
	// var splitStr = "!$312$!";
	// var lastSplitStr = "$!312!$";
	// if (searchTxt.indexOf(splitStr) != -1) {
	// var firstStr = searchTxt.split(splitStr);
	// $.customer_search_bar.visible = false;
	// Ti.API.info('firstStr[1] ' + firstStr[1]);
	// if (firstStr[1].indexOf(lastSplitStr) != -1) {
	// var val = "";
	// try {
	// val = JSON.parse(Titanium.Utils.base64decode(firstStr[1].split(lastSplitStr)[0]));
	// } catch(k) {
	// val = "";
	// Ti.API.info('ERROR --- ' + k.message);
	// return;
	// }
	//
	// Ti.API.info('val ' + val);
	// if ( typeof val == "object") {
	// getScanValue(val);
	// }
	// return;
	// }
	// //Ti.API.info('Final ' + searchTxt);
	// return;
	// }
	//
	// }
	$.scanLbl.visible = true;
	Ti.API.info('Split ' + searchTxt);
	var obj;
	try {
		obj = JSON.parse(searchTxt);
	} catch(k) {
		Ti.API.info('ERROR --- ' + k.message);
		return;
	}

	Ti.API.info('obj ' + obj);
	if ( typeof obj == "object") {
		Ti.API.info('Split ' + JSON.stringify(obj));
		$.scanLbl.visible = false;
		getScanValue(obj);
	}
	return;

}

$.customer_search_bar.addEventListener('change', function(e) {
	var searchTxt = e.value;
	/*
	 if (searchTxt.length >= 6) {
	 var splitStr = "!$312$!";
	 var lastSplitStr = "$!312!$";
	 if (searchTxt.indexOf(splitStr) != -1) {
	 var firstStr = searchTxt.split(splitStr);
	 $.customer_search_bar.visible = false;
	 Ti.API.info('firstStr[1] ' + firstStr[1]);
	 if (firstStr[1].indexOf(lastSplitStr) != -1) {
	 var val = "";
	 try {
	 val = JSON.parse(Titanium.Utils.base64decode(firstStr[1].split(lastSplitStr)[0]));
	 } catch(k) {
	 val = "";
	 Ti.API.info('ERROR --- ' + k.message);
	 return;
	 }

	 Ti.API.info('val ' + val);
	 if ( typeof val == "object") {
	 getScanValue(val);
	 }
	 return;
	 }
	 return;
	 }
	 }*/

	var newArr = [];
	if (searchTxt.length % 3 == 0 && searchTxt.length != 0) {
		getSearchedUserListService(searchTxt);
		isSearch = true;
		$.actInd.hide();
		$.msgLbl.visible = false;
	} else if (searchTxt.length == 0) {
		isSearch = false;
		createRow(customerList);
		$.actInd.hide();
		$.msgLbl.visible = false;
	}
});
function getScanValue(response) {
	$.customer_search_bar.blur();
	$.popover.hide();
	args.addCustomerLbl.visible = false;
	args.profileImage.visible = true;
	args.centerVW.visible = true;
	args.centerVW.getChildren()[0].text = response.customer_name;
	args.centerVW.getChildren()[1].getChildren()[1].text = response.contact;

	args.loyaltyBtn.image = "/images/Discount_btn_1.png";
	Alloy.Globals.name = response.customer_name;
	Alloy.Globals.customer_id = response.customer_id;
	Alloy.Globals.mobile = response.contact;
	Alloy.Globals.email = response.email;
	if (response.loyalty_point != undefined) {
		Alloy.Globals.loyalty_point = response.loyalty_point;
		loyaltyObj.userPoints = parseInt(response.loyalty_point);
		args.centerVW.getChildren()[2].getChildren()[1].text = response.loyalty_point + " Pts.";
	}

	loyaltyObj.userRemainingPoints = -1;

	Alloy.Globals.getLoyalyValueService(response.customer_id);
}

currentSize = 0;

// to know when the table is loading
isLoading = false;

var tableData = [];
var previousHeaderTitle = "A";

function createRow(detail, isSearch) {
	tableData = [];
	for (var i = 0; i < detail.length; i++) {

		var headerVW = Ti.UI.createView({
			backgroundColor : "#EBEBED",
			width : Ti.UI.FILL,
			height : 30,

		});

		var headerLbl = Ti.UI.createLabel({
			backgroundColor : "#EBEBED",
			color : "black",
			left : 10,
			height : 30,
			text : detail[i].fullname.charAt(0),
			font : {
				fontSize : 18,
				fontWeight : "semibold"
			}
		});
		headerVW.add(headerLbl);
		var section;
		if (previousHeaderTitle == detail[i].fullname.charAt(0)) {
			if (tableData.length == 0) {
				section = Ti.UI.createTableViewSection({
					backgroundColor : "#EBEBED",
					headerView : headerVW,
				});
				tableData.push(section);
			}
		} else {
			previousHeaderTitle = detail[i].fullname.charAt(0);
			section = Ti.UI.createTableViewSection({
				backgroundColor : "#EBEBED",
				headerView : headerVW,
			});
			tableData.push(section);

		}

		var row = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			layout : "vertical",
			customer_id : detail[i].id,
			filter : detail[i].fullname,
			name : detail[i].fullname,
			contact : detail[i].mobile_no,
			email : detail[i].email,
			loyalty_point : detail[i].loyalty_point,

		});
		var nameLbl = Ti.UI.createLabel({
			left : 10,
			right : 10,
			height : 24,
			top : 5,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			text : detail[i].fullname,
			font : {
				fontSize : 18,
			},
			color : "black"
		});
		row.add(nameLbl);
		var contactLbl = Ti.UI.createLabel({
			left : 10,
			right : 10,
			height : 24,
			bottom : 5,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			text : detail[i].mobile_no,
			font : {
				fontSize : 14,
			},
			color : "black"
		});
		row.add(contactLbl);
		section.add(row);
		currentSize += 10;
	};
	$.userTable.data = tableData;
	setTimeout(function() {
		// give some time to the previous loop
		// adjust miliseconds according to your data source speed
		isLoading = false;
	}, 500);
}

var obj = {};
function tableClickFunc(e) {
	$.customer_search_bar.blur();
	$.popover.hide();
	args.addCustomerLbl.visible = false;
	args.profileImage.visible = true;
	args.centerVW.visible = true;
	args.centerVW.getChildren()[0].text = e.row.name;
	args.centerVW.getChildren()[1].getChildren()[1].text = e.row.contact;

	args.loyaltyBtn.image = "/images/Discount_btn_1.png";
	Alloy.Globals.name = e.row.name;
	Alloy.Globals.customer_id = e.row.customer_id;
	Alloy.Globals.mobile = e.row.contact;
	Alloy.Globals.email = e.row.email;
	if (e.row.loyalty_point != undefined) {
		Alloy.Globals.loyalty_point = e.row.loyalty_point;
		loyaltyObj.userPoints = parseInt(e.row.loyalty_point);
		args.centerVW.getChildren()[2].getChildren()[1].text = e.row.loyalty_point + " Pts.";
	}

	loyaltyObj.userRemainingPoints = -1;

	Alloy.Globals.getLoyalyValueService(e.row.customer_id);
	var cfdObj = {};
	cfdObj.subTotal = args.subTotalLbl;
	cfdObj.discount = args.discountLbl;
	cfdObj.tax = args.taxLbl;
	cfdObj.grandTotal = args.grandTotalLbl;
	cfdObj.loyaltyPoint = args.loyaltyPointLbl;
	cfdObj.loyaltyVal = args.loyaltyValueLbl;
	cfdObj.cartDetail = Alloy.Globals.cartDetailSendData;
	cfdObj.customerName = e.row.name;
	cfdObj.customerLoyaltyPoints = e.row.loyalty_point + " Pts.";

	Ti.API.info('JSON.stringify(cfdObj) = ' + JSON.stringify(cfdObj));
	//setTimeout(function() {
	bonjourBrowser.clearBuffer();
	bonjourBrowser.sendData(JSON.stringify(cfdObj));

}

function openAddCustomerDialog() {
	$.popover.hide();
	var addnewUsrPopup = Alloy.createController("AddNewCustomerPopUp", args).getView();
	addnewUsrPopup.open();

}

$.userTable.addEventListener('postlayout', function() {
	initialTableSize = $.userTable.rect.height;
});
position = 0;

// function loadMore(e) {
// //Ti.API.info('customerListArray.total = '+customerListArray);
// //if (customerList.total >= 10) {
// getUserService(page);
// //}
// }

// cross-platform event listener for lazy tableview loading
function lazyload(_evt) {
	$.customer_search_bar.blur();
	//Ti.API.info('lazy loding calling........');
	// var triggerLoad;
	if (isSearch == false) {
		if (OS_IOS) {

			if ((position && _evt.contentOffset.y > position) && (_evt.contentOffset.y + _evt.size.height > _evt.contentSize.height)) {
				if (isLoading)
					return;
				isLoading = true;
				position = _evt.contentOffset.y;
				Ti.API.info("POSITION : " + position);
				//$.newstbl.scrollToIndex(position, false);

				if (customerList.length >= 10) {
					getUserService(page);
				}
			}

			position = _evt.contentOffset.y;
		} else {

			if (position && _evt.firstVisibleItem >= position && _evt.totalItemCount <= (_evt.firstVisibleItem + _evt.visibleItemCount)) {
				if (isLoading)
					return;
				isLoading = true;
				//position = _evt.firstVisibleItem;
				Ti.API.info("POSITION : " + position);
				//$.newstbl.scrollToIndex(position, false);

				if (customerList.length >= 10) {
					getUserService(page);
				}
			}
			position = _evt.firstVisibleItem;
		}
	}
}

function getUserService() {

	var data = {};
	data.page = page;
	data.user_id = Alloy.Globals.employee_id;
	data.store_id = Alloy.Globals.store_id;
	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_GET_CUSTOMER_LIST = Alloy.Globals.Constants.SERVICE_GET_CUSTOMER_LIST;
	if (Ti.Network.online) {
		//Alloy.Globals.LoadingScreen.open();
		$.actInd.show();
		$.msgLbl.visible = true;
		Communicator.post(DOMAIN_URL + SERVICE_GET_CUSTOMER_LIST, getUserServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_GET_CUSTOMER_LIST);
	} else {
		$.actInd.hide();
		$.msgLbl.visible = false;
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function of Add user, in this after success add user on the UI of POS left window section
 */
function getUserServiceCallback(e) {
	Ti.API.info("getUserServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				if (response.response_code == '1') {
					if (response.result != "") {
						if (customerList == "" && customerList.length <= 0) {
							customerList = response.result;
						} else {
							customerList = customerList.concat(response.result);
							Ti.API.info('customerList1 =' + JSON.stringify(customerList));
							Ti.API.info('response.result =' + JSON.stringify(response.result));
						}

						totalLen = response.total;
						if (totalLen <= (page * 10)) {
							$.msgLbl.visible = false;
							$.actInd.hide();
						}++page;
						Ti.API.info('customerList =' + JSON.stringify(customerList));
						createRow(customerList);
					} else {
						if (totalLen <= (page * 10)) {

						}
						//--page;
						$.actInd.hide();
						isLoading = true;
						$.msgLbl.visible = false;
						//Alloy.Globals.Alert(response.Response_Message);
					}
				} else {
					$.actInd.hide();
					isLoading = false;
					$.msgLbl.visible = false;
					Alloy.Globals.Notifier.show(response.message);
				}
			} else {
				$.actInd.hide();
				isLoading = false;
				$.msgLbl.visible = false;
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			$.actInd.hide();
			isLoading = false;
			$.msgLbl.visible = false;
			Ti.API.info('Error getUserServiceCallback :: ' + e.message);
			tracker.addException({
				description : "AddUserPopover: " + e.message,
				fatal : false
			});
		}
	} else {
		$.actInd.hide();
		isLoading = false;
		$.msgLbl.visible = false;
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}

	//Alloy.Globals.LoadingScreen.close();
}

function check() {
	if (previousHeaderTitle == addNewUserArray[i].name.charAt(0)) {
		Ti.API.info("Here" + addNewUserArray[i].name.charAt(0));
		if (i == 0) {
			section = Ti.UI.createTableViewSection({
				backgroundColor : "#EBEBED",
				headerView : headerVW,
			});
			tableData.push(section);
		}
	} else {
		Ti.API.info("In Else");
		previousHeaderTitle = addNewUserArray[i].name.charAt(0);
		if (tableData != []) {
			tableData.push(section);
		} else {
			section = Ti.UI.createTableViewSection({
				backgroundColor : "#EBEBED",
				headerView : headerVW,
			});
			tableData.push(section);
		}
	}
}

getUserService();
function getSearchedUserListService(searchTxt) {

	var data = {};
	data.search = searchTxt;
	data.user_id = Alloy.Globals.employee_id;
	data.store_id = Alloy.Globals.store_id;

	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_SEARCH_CUSTOMER = Alloy.Globals.Constants.SERVICE_SEARCH_CUSTOMER;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_SEARCH_CUSTOMER, getSearchUserServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_SEARCH_CUSTOMER);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function of Add user, in this after success add user on the UI of POS left window section
 */
function getSearchUserServiceCallback(e) {
	Ti.API.info("getSearchUserServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				if (response.response_code == '1') {
					createRow(response.result);
				} else {
					Alloy.Globals.Notifier.show(response.message);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			tracker.addException({
				description : "AddUserPopover: " + e.message,
				fatal : false
			});
			Ti.API.info('Error getSearchUserServiceCallback :: ' + e.message);
		}
	} else {

		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}

// if (customerList.length < 10) {
//
// $.msgLbl.visible = false;
//
// //$.loadBtn.visible = false;
// }
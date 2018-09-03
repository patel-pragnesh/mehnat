// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('POSDashboard');
Alloy.Globals.isCheckoutOpen = false;
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
Alloy.Globals.cartDetailSendData = [];
//for CFD
var sendIndex = 0;
var transferStr = "";
var sendDataLength = 250;
Alloy.Globals.navwin = $.navwin;
Alloy.Globals.index = 0;
Alloy.Globals.categorySubcategorytype = 1;
// 1 = for main category 2 = subcategory
var daysArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
Alloy.Globals.name = "NA";
Alloy.Globals.customer_id = 0;
Alloy.Globals.mobile = 0;
Alloy.Globals.email = "NA";
Alloy.Globals.loyalty_point = 0;
Alloy.Globals.totalAmount = 0;
Alloy.Globals.isCartEmpty = true;
var selectedCategoryJson = {};
var discount = 0;
var tax = 0;
var loyalty_id = "";

function setXMLObjectLayoutDynamically() {
	$.subTotalLbl.textData = 0;
	$.grandTotalLbl.textData = 0;
	$.taxLbl.textData = 0;
	$.discountLbl.textData = 0;
	$.discountLbl.discountId = 0;

	$.profileVW.height = Titanium.Platform.displayCaps.platformHeight * 0.13;
	$.profileImage.height = $.profileVW.height * 0.75;
	$.profileImage.width = $.profileVW.height * 0.75;
	$.profileImage.borderRadius = ($.profileVW.height * 0.75) / 2;

	$.centerVW.left = Titanium.Platform.displayCaps.platformWidth * 0.1025;

	$.loyaltyBtn.height = $.profileVW.height * 0.48;
	$.loyaltyBtn.width = $.profileVW.height * 0.48;

	$.sectionVW.top = $.profileVW.height;
	// $.sectionVW.height = Titanium.Platform.displayCaps.platformHeight * 0.0846;
	$.sectionVW.height = Titanium.Platform.displayCaps.platformHeight * 0.0423;
	//Initially when no data is in the order list set the top of table view for hinding order no detail view height
	$.orderListTable.top = $.profileVW.height;
	//when there is order set top of table view for showing order no detail view height
	$.orderListTable.bottom = Titanium.Platform.displayCaps.platformHeight * 0.0716;

	$.checkoutBtn.height = Titanium.Platform.displayCaps.platformHeight * 0.0716;
	$.bottomMenuVW.height = Titanium.Platform.displayCaps.platformHeight * 0.0716;
	$.bottomLoyaltyBtn.height = $.checkoutBtn.height * 0.80;
	$.bottomLoyaltyBtn.width = $.checkoutBtn.height * 0.80;
	$.removeLoyaltyBtn.height = $.checkoutBtn.height * 0.80;
	$.removeLoyaltyBtn.width = $.checkoutBtn.height * 0.80;
	$.removeProductBtn.height = $.checkoutBtn.height * 0.80;
	$.removeProductBtn.width = $.checkoutBtn.height * 0.80;
	var h = Titanium.Platform.displayCaps.platformHeight * 0.15;
	$.drinkImageVW.height = h * 0.66;
	$.drinkImageVW.width = h * 0.66;
	$.drinkTitleVW.left = $.drinkImageVW.width + 30;
	$.loyaltyPointLbl.textData = 0;
	$.loyaltyValueLbl.textData = 0;
}

/*
 * Left Window related code
 */

function openFunc(e) {
	
	setXMLObjectLayoutDynamically();
	setTimeout(function(e) {
		Alloy.Globals.drawer.setPanningMode("NoPanning");
		Alloy.Globals.processSync();

	}, 200);
	$.POSDashboard.animate({
		opacity : 1,
		duration : 500
	});
	//scheduled()
}

/*
 * Left menu toggle Button Function which is defined in XML
 */
function menuFunc(e) {

}

function navTabBarClickFun(e) {

	if (e.index == 0) {
		$.searchCategoryBtn.enabled = true;
		$.loyaltyVW.visible = false;
		$.subCategoryVW.visible = false;
		$.categoryVW.visible = true;
		$.backBtn.visible = false;
		loyaltyObj.customLoyaltyID = "";
		loyaltyObj.loyaltyID = "";
		loyaltyObj.loyaltyVW = "";
		loyaltyObj.loyaltyValue = 0;
		loyaltyObj.loyaltyPoints = 0;
		loyaltyObj.loyaltyQty = 0;
		loyaltyObj.loyaltyArray = [];

	} else {
		if (role_permission.indexOf("loyalty_point") != -1) {
			if (Alloy.Globals.customer_id != 0 && Alloy.Globals.customer_id != "0" && Alloy.Globals.customer_id != undefined) {
				$.searchCategoryBtn.enabled = false;
				$.loyaltyVW.visible = true;
				$.backBtn.visible = true;
				$.subCategoryVW.visible = false;
				$.categoryVW.visible = false;
				$.loyaltyDetailVW.visible = false;
				$.notificationCountVW.visible = false;

				$.notificationCountLbl.text = 0;
				loyaltyObj.customLoyaltyID = "";
				loyaltyObj.loyaltyID = "";
				loyaltyObj.loyaltyVW = "";
				loyaltyObj.loyaltyValue = 0;
				loyaltyObj.loyaltyPoints = 0;
				loyaltyObj.loyaltyQty = 0;
				loyaltyObj.loyaltyArray = [];
			} else {
				$.tabbedBar.setIndex(0);
				Alloy.Globals.Notifier.show(L("add_customer_validation"));
			}
		} else {

			$.tabbedBar.setIndex(0);
			Alloy.Globals.Notifier.show(L("validation_loyalty_permission"));

		}

	}
}

/*
 * Right Menu Parked order Button Function which is defined in XML
 */
Alloy.Globals.parkedOrderId = 0;
function parkedOrderFunc(e) {

	if (parkedOrderArray.length > 0) {

		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', 'No'],
			message : 'Are you sure want to park this order?',
			title : 'Gongcha POS'
		});
		dialog.addEventListener('click', function(k) {
			if (k.index === k.source.cancel) {
				Ti.API.info('The cancel button was clicked');
			} else {
				Alloy.Globals.saveParkedOrderDataInDB();
			}
		});

		dialog.show();

	} else {
		Alloy.Globals.Notifier.show(L('validation_parked_txt'));
	}

}

Alloy.Globals.saveParkedOrderDataInDB=function() {
	var parkedOrderJson = {};
	parkedOrderJson.id = Alloy.Globals.parkedOrderId;
	parkedOrderJson.parkedDate = getDate(new Date());
	parkedOrderJson.total_amount = $.grandTotalLbl.textData;
	parkedOrderJson.sub_total = $.subTotalLbl.textData;
	parkedOrderJson.discount = JSON.stringify({
		textData : $.discountLbl.textData,
		type : $.discountLbl.type,
		id : $.discountLbl.discountId,
		user_point : parseFloat(loyaltyObj.userPoints)
	});
	parkedOrderJson.tax = $.taxLbl.textData;
	parkedOrderJson.name = Alloy.Globals.name;
	parkedOrderJson.email = Alloy.Globals.email;
	parkedOrderJson.mobile = Alloy.Globals.mobile;
	parkedOrderJson.customer_id = Alloy.Globals.customer_id;
	parkedOrderJson.detail = JSON.stringify(parkedOrderArray);
	Ti.API.info('parkedOrderJson ' + JSON.stringify(parkedOrderJson));
	Alloy.Globals.DbManager.insertParkedOrderDetail(parkedOrderJson);
	if (Alloy.Globals.parkedOrderTab.badge) {
		var badgeCount = parseInt(Alloy.Globals.parkedOrderTab.badge) + 1;
		Alloy.Globals.parkedOrderTab.badge = badgeCount.toString();
		Ti.App.Properties.setString("parkedBadge", badgeCount.toString());
	} else {
		Alloy.Globals.parkedOrderTab.badge = "1";
		Ti.App.Properties.setString("parkedBadge", "1");
	}

	Alloy.Globals.parkedOrderId = 0;
	refreshAllItem();
};

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

/*
 * Right Menu Delete order Button Function which is defined in XML
 */

function deleteOrderFunc(e) {
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : 'Would you like to cancel this order?',
		title : 'Gongcha POS'
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			Ti.API.info('The cancel button was clicked');
		} else {
			bonjourBrowser.sendData("deleteCart");
			refreshAllItem();
			tracker.addEvent({
				category : "Void-Order",
				action : "voidOrder",
				label : "Order has void successfully",
				value : 1
			});
		}
	});
	if (Alloy.Globals.name != "NA" || tableData.length > 0) {
		dialog.show();
	}

}

function refreshAllItem() {
	$.tabbedBar.setIndex(0);
	Alloy.Globals.categorySubcategorytype = 1;
	$.searchCategoryBtn.enabled = true;
	$.loyaltyVW.visible = false;
	$.backBtn.visible = false;
	$.loyaltyDetailVW.visible = false;
	$.notificationCountVW.visible = false;
	$.notificationCountLbl.text = 0;
	$.subCategoryVW.visible = false;
	$.categoryVW.visible = true;
	bonjourBrowser.sendData("deleteCart");
	selected_item_array = [];
	Alloy.Globals.name = "NA";
	Alloy.Globals.customer_id = 0;
	Alloy.Globals.loyalty_point = 0;
	Alloy.Globals.mobile = 0;
	Alloy.Globals.email = "NA";
	$.loyaltyLbl.text = "0 Pts.";
	$.addCustomerLbl.text = "Add Customer";
	$.addCustomerLbl.visible = true;
	$.profileImage.visible = false;
	$.centerVW.visible = false;

	$.loyaltyBtn.visible = true;
	$.loyaltyBtn.image = "/images/Add-customer.png";
	$.orderListTable.setData([]);
	tableData = [];
	add_to_cart_data = [];
	parkedOrderArray = [];	
	if (Alloy.Globals.isCheckoutOpen) {
		Alloy.Globals.closeFrom = 1;
		Alloy.Globals.checkoutWin.close();
		Alloy.Globals.isCheckoutOpen = false;
	}
	Alloy.Globals.isCheckoutOpen = false;
	Alloy.Globals.index = 0;
	$.subTotalLbl.textData = 0;
	$.subTotalLbl.text = "$" + 0.00;
	$.discountLbl.textData = 0;
	$.discountLbl.text = "-$0.00";
	$.discountLbl.type = "";
	$.taxLbl.textData = 0;
	$.taxLbl.text = "+$0.00";
	$.grandTotalLbl.textData = 0;
	$.grandTotalLbl.text = "$" + 0.00;
	
	
	
	Alloy.Globals.check_any_row_selected();
	checkCartHasEmpty();
	$.orderListTable.top = $.profileVW.height;
	$.orderListTable.bottom = "7.16%";
	$.no_data_layout_headerVw.height = "60%";
	$.checkoutBtn.title = L('no_sale');

	loyaltyObj = {
		customLoyaltyID : "",
		loyaltyID : "",
		loyaltyVW : "",
		userPoints : 0,
		userRemainingPoints : -1,
		loyaltyValue : 0,
		loyaltyPoints : 0,
		loyaltyQty : 0,
		loyaltyArray : [],
		selectedDrink : -1
	};
	Alloy.Globals.isUpdateAvailable = false;

}

//Function for void an order excute only when order is completed

Alloy.Globals.refreshCartItem = function() {
	Alloy.Globals.categorySubcategorytype = 1;
	$.tabbedBar.setIndex(0);
	$.searchCategoryBtn.enabled = true;
	$.loyaltyVW.visible = false;
	$.backBtn.visible = false;
	$.loyaltyDetailVW.visible = false;
	$.notificationCountVW.visible = false;
	$.notificationCountLbl.text = 0;
	$.subCategoryVW.visible = false;
	$.categoryVW.visible = true;
	Alloy.Globals.name = "NA";
	Alloy.Globals.customer_id = 0;
	Alloy.Globals.loyalty_point = 0;
	Alloy.Globals.mobile = 0;
	Alloy.Globals.email = "NA";
	$.loyaltyLbl.text = "0 Pts.";
	$.addCustomerLbl.text = "Add Customer";
	$.addCustomerLbl.visible = true;
	$.profileImage.visible = false;
	$.centerVW.visible = false;
	$.loyaltyBtn.image = "/images/Add-customer.png";
	$.orderListTable.setData([]);
	tableData = [];
	bonjourBrowser.sendData("deleteCart");
	Alloy.Globals.parkedOrderId = 0;
	selected_item_array = [];
	add_to_cart_data = [];
	parkedOrderArray = [];
	$.orderListTable.top = $.profileVW.height;
	$.orderListTable.bottom = "7.16%";
	$.no_data_layout_headerVw.height = "60%";
	$.checkoutBtn.title = L('no_sale');
	$.checkoutBtn.visible = true;
	$.loyaltyBtn.visible = true;
	Alloy.Globals.isCheckoutOpen = false;
	$.checkoutBtn.height = Titanium.Platform.displayCaps.platformHeight * 0.0716;
	Alloy.Globals.index = 0;
	$.subTotalLbl.textData = 0;
	$.subTotalLbl.text = "$" + 0.00;
	$.discountLbl.textData = 0;
	$.discountLbl.discountId = 0;
	$.discountLbl.text = "-$0.00";
	$.discountLbl.type = "";
	$.taxLbl.textData = 0;
	$.taxLbl.text = "+$0.00";
	$.grandTotalLbl.textData = 0;
	$.grandTotalLbl.text = "$" + 0.00;
	Alloy.Globals.check_any_row_selected();
	checkCartHasEmpty();
	loyaltyObj = {
		customLoyaltyID : "",
		loyaltyID : "",
		loyaltyVW : "",
		userPoints : 0,
		userRemainingPoints : -1,
		loyaltyValue : 0,
		loyaltyPoints : 0,
		loyaltyQty : 0,
		loyaltyArray : [],
		selectedDrink : -1
	};
	Alloy.Globals.isUpdateAvailable = false;

};

/*
 * Right Menu sync Button Function which is defined in XML
 */
function syncFunc(e) {
	Alloy.Globals.processSync("syncBtn");
}

// Add 5 mintues interval for data syncing in background
Alloy.Globals.syncInterval = setInterval(function() {
	Alloy.Globals.processSync("interval");
}, 300000);

/*
 * Xml defined function by which we can back to category screen from subcategory
 */
function backToCategoryFunc(e) {
	Alloy.Globals.categorySubcategorytype = 1;
	$.categoryVW.visible = true;
	$.subCategoryVW.visible = false;
	$.navwin.remove(searchBar);
	renderCategoryGrid(Alloy.Globals.DbManager.Get_Category_Data_From_DB());
	searchBar.value = "";
	renderSubCategoryGrid([]);
}

var searchBar = Titanium.UI.createSearchBar({
	barColor : "#c32032",
	showCancel : true,
	height : 44,
	name : "tf",
	top : 20,
});

/*
 * Xml function by which we can search category or sub category
 */
$.POSDashboard.addEventListener('visible', function(e) {
	if (e.view == 'detail') {
		e.button.title = "Master";
		$.POSDashboard.detailView.getWindow().leftNavButton = e.button;
	} else if (e.view == 'master') {
		$.POSDashboard.detailView.getWindow().leftNavButton = null;
	}
});
function searchCategoryFunc(e) {

	$.navwin.add(searchBar);
	searchBar.focus();
	renderSubCategoryGrid(Alloy.Globals.DbManager.Get_Menu_Search_Data_From_DB(""));

}
searchBar.addEventListener('focus', function(e) {
	$.subCategoryNameLbl.text = "Search Result";
	$.categoryVW.visible = false;
	$.subCategoryVW.visible = true;
	$.loyaltyVW.visible = false;
});
searchBar.addEventListener('change', function(e) {
	Ti.API.info("search value+ " + e.value);
	var searchTxt = e.value;
	var newArr = [];
	// if (Alloy.Globals.categorySubcategorytype == 1) {
		// for (var i = 0; i < search_data.length; i++) {
			// var rest = search_data[i].category_name;
// 
			// if (rest.toLowerCase().indexOf(searchTxt.toLowerCase()) != -1) {
// 
				// newArr.push(search_data[i]);
// 
			// } else {
// 
			// }
		// }
		// renderCategoryGrid(newArr);
	//} else if (Alloy.Globals.categorySubcategorytype == 2) {
		var searchData = Alloy.Globals.DbManager.Get_Menu_Search_Data_From_DB(searchTxt);
		/*
		for (var i = 0; i < searchSubCatogryData.length; i++) {
					var rest = searchSubCatogryData[i].menu_name;
		
					if (rest.toLowerCase().indexOf(searchTxt.toLowerCase()) != -1) {
		
						newArr.push(searchSubCatogryData[i]);
		
					} else {
		
					}
				}*/
		
		renderSubCategoryGrid(searchData);
		//renderSubCategoryGrid(newArr, getSelectedSubCategory(newArr), selectedCategoryJson);
		Ti.API.info('selectedCategoryJson '+ JSON.stringify(selectedCategoryJson));
		Ti.API.info('getSelectedSubCategory(newArr) '+ JSON.stringify(getSelectedSubCategory(newArr)));
	// }
	Ti.API.info(JSON.stringify(newArr));

});

searchBar.addEventListener('cancel', function() {
	$.navwin.remove(searchBar);
	// if (Alloy.Globals.categorySubcategorytype == 1) {
		// renderCategoryGrid(search_data);
	// } else if (Alloy.Globals.categorySubcategorytype == 2) {
		// renderSubCategoryGrid(searchSubCatogryData, getSelectedSubCategory(searchSubCatogryData), selectedCategoryJson);
	// }
	$.categoryVW.visible = true;
	$.subCategoryVW.visible = false;
	$.loyaltyVW.visible = false;
	searchBar.value = "";
	renderSubCategoryGrid([]);
	
});

/*
 * Xml function by which we can open the detail view of checkout section(Billing)
 */

function checkoutFunc() {
	$.navwin.remove(searchBar);

	if ($.checkoutBtn.title != L('no_sale')) {
		var registerData = Alloy.Globals.DbManager.getRegisterDetail("");
		try {
			Ti.API.info('registerData on checkout = ' + JSON.stringify(registerData));

			if (registerData.length > 0) {
				if (registerData[0].status != "closed") {
					var openedDate = new Date(registerData[0].updated_date);
					Ti.API.info('openedDate.getDate() = ' + openedDate.getDate());
					Ti.API.info('new Date().getDate() = ' + new Date().getDate());
					if (openedDate.getDate() == new Date().getDate()) {

						var finalOrderArray = [];
						var finalCheckoutDataObj = {};
						finalCheckoutDataObj.total = toFixed($.grandTotalLbl.textData);
						finalCheckoutDataObj.subTotal = toFixed($.subTotalLbl.textData);
						finalCheckoutDataObj.tax = toFixed(tax);
						finalCheckoutDataObj.taxValue = toFixed($.taxLbl.text.replace("+$", ""));
						finalCheckoutDataObj.store_id = Alloy.Globals.store_id;
						finalCheckoutDataObj.loyalty_point = $.loyaltyPointLbl.textData;
						finalCheckoutDataObj.loyalty_value = $.loyaltyValueLbl.textData;
						finalCheckoutDataObj.pickup_date = '';
						finalCheckoutDataObj.discount_total_price = toFixed($.discountLbl.text.replace("-$", ""));
						finalCheckoutDataObj.discount = {
							discount : toFixed($.discountLbl.textData),
							type : $.discountLbl.type, //value & percentage
							id : $.discountLbl.discountId
						};
						var cartArray = [];
						for (var i = 0; i < add_to_cart_data.length; i++) {
							var obj = {};
							obj.id = add_to_cart_data[i].id;
							obj.menu_id = add_to_cart_data[i].menu_id;
							obj.qty = add_to_cart_data[i].qty;
							obj.quantity = add_to_cart_data[i].quantity;
							obj.menu_name = add_to_cart_data[i].menu_name;
							obj.menu_image = add_to_cart_data[i].menu_image;
							obj.menu_description = add_to_cart_data[i].menu_description;
							obj.category_id = add_to_cart_data[i].category_id;
							obj.category_name = add_to_cart_data[i].category_name;
							obj.itemCustomizedPrice = add_to_cart_data[i].discountVW.priceObj.totalPrice * parseInt(add_to_cart_data[i].quantity);
							obj.serving_id = add_to_cart_data[i].serving_id;
							obj.serving_name = add_to_cart_data[i].serving_name;
							obj.serving_price = add_to_cart_data[i].serving_price;
							obj.customizationOpt = add_to_cart_data[i].customizationOpt;
							obj.discount_type = add_to_cart_data[i].discountVW.discount_type;
							obj.discount_rate = add_to_cart_data[i].discountVW.discount_rate;
							obj.discount_price = add_to_cart_data[i].discountVW.getChildren()[1].text.replace("-$", "");
							obj.discountId = add_to_cart_data[i].discountVW.discountId;
							obj.apply_option = add_to_cart_data[i].discountVW.apply_option;
							obj.loyalty_id = add_to_cart_data[i].loyaltyID;
							obj.custom_loyalty_id = add_to_cart_data[i].customLoyaltyID;
							obj.loyalty_points = add_to_cart_data[i].loyaltyPoints;
							obj.loyalty_value = add_to_cart_data[i].loyaltyValue;
							obj.discount_title = "";
							cartArray.push(obj);
						};
						finalCheckoutDataObj.orderDetails = cartArray;
						Ti.API.info('finalCheckoutDataObj ' + JSON.stringify(finalCheckoutDataObj));
						//function for Validate coupon discount expired or not
						if (validateForIsCouponCodeExpire(add_to_cart_data) == false) {
							Alloy.Globals.Notifier.show("Applied coupon discount expired");
							return;
						}
						//Validation for check minimum required quantity
						if (!validateForMinimumRequiredQuantity(add_to_cart_data)) {
							return;
						}
						finalOrderArray.push(finalCheckoutDataObj);
						var isDiscountApplied = checkIsDiscountApplied();

						var screenObj = {};
						screenObj.tableData = tableData;
						screenObj.checkoutBtn = $.checkoutBtn;
						screenObj.orderListTable = $.orderListTable;
						screenObj.no_data_layout_headerVw = $.no_data_layout_headerVw;
						screenObj.taxLbl = $.taxLbl;
						screenObj.subTotalLbl = $.subTotalLbl;
						screenObj.discountLbl = $.discountLbl;
						screenObj.grandTotalLbl = $.grandTotalLbl;
						screenObj.loyaltyBtn = $.loyaltyBtn;
						screenObj.order = finalOrderArray;
						screenObj.from = "pos";
						//	$.orderListTable.bottom = 0;

						if (isDiscountApplied || $.discountLbl.textData != 0) {
							if ($.checkoutBtn.title == L('update_txt')) {
								if (Alloy.Globals.isUpdateAvailable) {
									updateCheckout(screenObj, "otp");
								}
							} else {
								sendOTPForCheckout(screenObj);
							}

						} else {
							if ($.checkoutBtn.title == L('update_txt')) {
								if (Alloy.Globals.isUpdateAvailable) {
									updateCheckout(screenObj);
								}
							} else {
								var checkOutScreen = Alloy.createController("CheckOutScreen", screenObj);
								Alloy.Globals.checkoutObj = checkOutScreen;
								$.navwin.openWindow(checkOutScreen.getView());
							}

						}
					} else {
						Alloy.Globals.Notifier.show("Please close register for present day");
					}
				} else {
					Alloy.Globals.Notifier.show("Please open register");
				}
			} else {
				Alloy.Globals.Notifier.show("Please open register for the day");
			}

		} catch(e) {
			Ti.API.info('Error Open Checkout Screen ' + e.message);
			tracker.addException({
				description : "POSDashboard1: " + e.message,
				fatal : false
			});

		}
	}

}


function updateCheckout(screenObj, to) {
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : 'If you update, your checkout screen will reset.',
		title : 'Are you sure?'
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			dialog.hide();
		} else {
			if (to == "otp") {
				sendOTPForCheckout(screenObj);
			} else {
				Alloy.Globals.updateValue(screenObj);
			}

		}
	});
	dialog.show();
}

function checkIsDiscountApplied() {
	for (var i = 0; i < add_to_cart_data.length; i++) {
		//First condition for is any dicount apply
		//Second for check is any always type dicount should not apply
		//Third for check is any dicount apply
		if (add_to_cart_data[i].discountVW.discountId != -1 && add_to_cart_data[i].discountVW.apply_option != 0 && add_to_cart_data[i].discountVW.apply_option != -1) {
			return true;
		}
	}
	return false;
}

//function for check coupon minimum required quantity
function validateForMinimumRequiredQuantity(data) {
	for (var i = 0; i < data.length; i++) {
		if (data[i].discountVW.apply_option == 1) {
			for (var j = 0; j < discountData.length; j++) {
				if (discountData[j].id == data[i].discountVW.discountId) {
					if (parseInt(data[i].discountVW.quantity) >= parseInt(discountData[j].quantity)) {
						//continue;
					} else {
						Alloy.Globals.Notifier.show("Minimum required quantity for applied discount is " + discountData[j].quantity + " for  " + data[i].discountVW.menu_name);
						return false;
					}
				}
			};
		}

	};
	return true;
}

// function for Validate coupon discount expired or not
function validateForIsCouponCodeExpire(data) {
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < discountData.length; j++) {
			if (discountData[j].id == data[i].discountId) {
				if (data[i].apply_option == 1) {
					//SECOND function for Validate coupon discount expired or not
					return validateDiscount(discountData[j]);
				}
			}
		};
	};
	return true;
}

///SECOND function for Validate coupon discount expired or not
function validateDiscount(discountData) {
	Ti.API.info('discountData **  ' + JSON.stringify(discountData));
	if (discountData.discount_repeat == 0) {
		var dateObj = discountData.start_date.split("-");
		Ti.API.info(dateObj[0] + "-" + dateObj[1] + "-" + dateObj[2]);
		var timeObj = discountData.start_time.split(":");
		Ti.API.info(timeObj[0] + "-" + timeObj[1] + "-" + timeObj[2]);
		startDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
		Ti.API.info('startDate ' + startDate.getTime());

		var dateObj1 = discountData.end_date.split("-");
		Ti.API.info(dateObj1[0] + "-" + dateObj1[1] + "-" + dateObj1[2]);
		var timeObj1 = discountData.end_time.split(":");
		Ti.API.info(timeObj1[0] + "-" + timeObj1[1] + "-" + timeObj1[2]);

		var endDate = new Date(dateObj1[0], dateObj1[1] - 1, dateObj1[2], timeObj1[0], timeObj1[1], timeObj1[2]);

		var currentDate = new Date();
		currentDate = currentDate.getTime();
		endDate = endDate.getTime();
		startDate = startDate.getTime();
		Ti.API.info('currentDate ' + currentDate);
		Ti.API.info('endDate ' + endDate);
		Ti.API.info('startDate ' + startDate);

		if (currentDate >= startDate && currentDate <= endDate) {
			return true;

		}
	} else if (discountData.discount_repeat == 1) {
		var currentDate = new Date();

		var dateObj = discountData.start_date.split("-");
		Ti.API.info(dateObj[0] + "-" + dateObj[1] + "-" + dateObj[2]);
		var timeObj = discountData.discount_start[daysArray[currentDate.getDay()]].split(":");
		Ti.API.info(timeObj[0] + "-" + timeObj[1] + "-" + timeObj[2]);
		startDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
		Ti.API.info('startDate ' + startDate);

		var dateObj1 = discountData.start_date.split("-");
		Ti.API.info(dateObj1[0] + "-" + dateObj1[1] + "-" + dateObj1[2]);
		var timeObj1 = discountData.discount_end[daysArray[currentDate.getDay()]].split(":");
		Ti.API.info(timeObj1[0] + "-" + timeObj1[1] + "-" + timeObj1[2]);

		var endDate = new Date(dateObj1[0], dateObj1[1] - 1, dateObj1[2], timeObj1[0], timeObj1[1], timeObj1[2]);
		Ti.API.info('EndDATE ' + endDate);

		currentDate = currentDate.getTime();
		endDate = endDate.getTime();
		startDate = startDate.getTime();
		Ti.API.info('currentDate ' + currentDate);
		Ti.API.info('endDate ' + endDate);
		Ti.API.info('startDate ' + startDate);

		if (currentDate >= startDate && currentDate <= endDate) {
			return true;
		}

	}
	return false;
}

/*
 * Left Window Row : Function for getting the order listing of selected category item from Right Window
 */
var rowHeight = Titanium.Platform.displayCaps.platformHeight * 0.078;
var tableData = [];
var add_to_cart_data = [];
var parkedOrderArray = [];
var selected_item_array = [];
var discountData = [];
var taxData = {};

Alloy.Globals.getOrderList = function(itemDetail, isNew, from,updateCFDBool) {
	
	if(updateCFDBool == undefined || updateCFDBool == null){
		updateCFDBool = true;
	}
	
	Ti.API.info('item Detail = '+itemDetail);
	var row = Ti.UI.createTableViewRow({
		color : 'black',
		backgroundColor : "white",
		selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
		detail : itemDetail,
		height : Ti.UI.SIZE,
		editable : true,
	});

	var mainView = Ti.UI.createView({
		top : 0,
		//left : "4%",
		height : rowHeight,
		width : "76%",
		layout : "horizontal"
	});
	row.add(mainView);

	var title = Ti.UI.createLabel({
		color : '#000000',
		text : itemDetail.menu_name,
		left : 0,
		width : "36%",
		font : {
			fontSize : 14,
			fontFamily : "Montserrat-Regular",
		},
		height : "60%",
		ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
	});
	mainView.add(title);

	var qtyView = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : "45%",
		left : 3,
	});
	mainView.add(qtyView);

	var minusBtn = Ti.UI.createButton({
		height : Ti.UI.FILL,
		width : "35%",
		left : 0,
		name : "minusBtn",
		backgroundImage : "none",
		image : "/images/Minus.png"
	});
	qtyView.add(minusBtn);

	var qtyText = Ti.UI.createLabel({
		color : '#000000',
		text : itemDetail.quantity,
		width : "30%",
		backgroundColor : "white",
		font : {
			fontSize : 14,
			fontFamily : "Montserrat-Regular",
		},
		height : Ti.UI.FILL,
		textAlign : "center",
		ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
	});
	qtyView.add(qtyText);
	var plusBtn = Ti.UI.createButton({
		height : Ti.UI.FILL,
		width : "35%",
		right : 0,
		name : "plusBtn",
		backgroundImage : "none",
		image : "/images/Add_icon.png"
	});
	qtyView.add(plusBtn);
	var priceText = Ti.UI.createLabel({
		height : "60%",
		color : '#000000',
		text : "$" + toFixed(itemDetail.serving_price * parseInt(itemDetail.quantity)).toFixed(2),
		textData : toFixed(itemDetail.serving_price * parseInt(itemDetail.quantity)),
		width : "18%",
		right : 0,
		font : {
			fontSize : 13,
			fontFamily : "Montserrat-Regular",
		},
		ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
		textAlign : "right",
		modifiertotal : 0,
		customLoyaltyID : itemDetail.customLoyaltyID,
		loyaltyID : itemDetail.loyaltyID,
		loyaltyValue : itemDetail.loyaltyValue,
		loyaltyPoints : itemDetail.loyaltyPoints,
	});
	mainView.add(priceText);

	var modifierGroupView = Ti.UI.createView({
		top : rowHeight + 2,
		height : Ti.UI.SIZE,
		layout : "vertical"
	});
	row.add(modifierGroupView);

	var editBtn = Ti.UI.createButton({
		height : rowHeight,
		width : Ti.UI.SIZE,
		right : 0,
		width : "12%",
		backgroundImage : "none",
		name : "editBtn",
		image : "/images/edit.png",

	});
	row.add(editBtn);

	for (var i = 0; i < itemDetail.customizationOpt.length; i++) {
		for (var j = 0; j < itemDetail.customizationOpt[i].option.length; j++) {

			var modifierView = Ti.UI.createView({
				top : 6,
				right : "12%",
				height : Ti.UI.SIZE,
				width : "74%",
				layout : "horizontal"
			});
			modifierGroupView.add(modifierView);

			var modifierName = Ti.UI.createLabel({
				color : '#c32032',
				left : 0,
				width : "42%",
				font : {
					fontSize : 13,
					fontFamily : "Montserrat-Light",
				},
				height : "15",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			modifierView.add(modifierName);

			if (itemDetail.customizationOpt[i].option[j].modifier_prefix_name != "") {
				modifierName.text = itemDetail.customizationOpt[i].option[j].modifier_prefix_name + " " + itemDetail.customizationOpt[i].option[j].modifier_name;
			} else {
				modifierName.text = itemDetail.customizationOpt[i].option[j].modifier_name;
			}

			var modifierQty = Ti.UI.createLabel({
				color : '#c32032',
				text : itemDetail.customizationOpt[i].option[j].quantity,
				left : 0,
				width : "33.80%",
				font : {
					fontSize : 13,
					fontFamily : "Montserrat-Light",
				},
				height : "15",
				textAlign : "center",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			modifierView.add(modifierQty);

			var totolModifierprice = Ti.UI.createLabel({
				color : '#c32032',
				text : "$" + toFixed(itemDetail.customizationOpt[i].option[j].quantity * itemDetail.customizationOpt[i].option[j].modifier_price).toFixed(2),
				textData : toFixed(itemDetail.customizationOpt[i].option[j].quantity * itemDetail.customizationOpt[i].option[j].modifier_price),
				right : 0,
				width : "24%",
				font : {
					fontSize : 13,
					fontFamily : "Montserrat-Light",
				},
				height : 15,
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
				textAlign : "right"
			});
			modifierView.add(totolModifierprice);
			if (i != 0) {
				priceText.modifiertotal = priceText.modifiertotal + totolModifierprice.textData;
			}
		};
	};

	priceText.totalPrice = priceText.modifiertotal + itemDetail.serving_price;
	priceText.textData = toFixed(priceText.totalPrice * itemDetail.quantity);
	priceText.text = "$" + toFixed(priceText.textData).toFixed(2);

	var discountVW = Ti.UI.createView({
		right : "12%",
		height : 0,
		width : "74%",
		isDiscountApply : false,
		category_id : itemDetail.category_id,
		menu_id : itemDetail.menu_id,
		serving_id : itemDetail.serving_id,
		priceObj : priceText,
		discount_type : 0,
		discount_rate : 0,
		quantity : itemDetail.quantity,
		apply_option : -1, //discountId = -1(No Discount option apply) apply_option=2(Manual Discount apply)
		discountId : -1, //discountId = -1(No Discount apply) - discountId = 0(Manual Discount apply)
		menu_name : itemDetail.menu_name,
		serving_name : itemDetail.serving_name,
		serving_price : itemDetail.serving_price,
	});

	var discountName = Ti.UI.createLabel({
		color : '#c32032',
		top : 5,
		text : "Discount",
		left : 0,
		width : "42%",
		font : {
			fontSize : 13,
			fontFamily : "Montserrat-Light",
		},
		height : 15,
		ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

	});
	discountVW.add(discountName);
	var discountPrice = Ti.UI.createLabel({
		color : '#c32032',
		top : 5,
		text : "$0",
		textData : 0,
		right : 0,
		width : "24%",
		font : {
			fontSize : 13,
			fontFamily : "Montserrat-Light",
		},
		height : 15,
		ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
		textAlign : "right"
	});
	discountVW.add(discountPrice);
	if (itemDetail.loyaltyID == "") {
		if (isNew == "1") {
			if (from == "parked") {

				discountVW.apply_option = itemDetail.discountVW.apply_option;
				discountVW.discount_rate = itemDetail.discountVW.discount_rate;
				discountVW.quantity = itemDetail.discountVW.quantity;
				discountVW.discount_type = itemDetail.discountVW.discount_type;
				discountVW.isDiscountApply = itemDetail.discountVW.isDiscountApply;
				discountVW.discountId = itemDetail.discountVW.discountId;
				discountVW.menu_name = itemDetail.discountVW.menu_name;

				if (discountVW.apply_option == 2 || discountVW.apply_option == 1) {
					if (discountVW.discount_type == "Percentage") {

						discountPrice.text = "-$" + toFixed((priceText.totalPrice * parseFloat(discountVW.discount_rate)) / 100).toFixed(2);
						priceText.totalPrice = toFixed(priceText.totalPrice) - toFixed((priceText.totalPrice * parseFloat(discountVW.discount_rate)) / 100);
					} else {
						discountPrice.text = "-$" + discountVW.discount_rate;
						priceText.totalPrice = toFixed(priceText.totalPrice - parseFloat(discountVW.discount_rate));
					}
					priceText.textData = toFixed(priceText.totalPrice * itemDetail.quantity);
					priceText.text = "$" + toFixed(priceText.textData).toFixed(2);

					discountVW.height = 20;

				} else {

					checkIndividualDiscount(discountPrice, priceText, discountVW, itemDetail);
					discountVW.isDiscountApply = false;
				}
			} else {
				discountVW.isDiscountApply = false;
				checkIndividualDiscount(discountPrice, priceText, discountVW, itemDetail);
			}
		} else {
			discountVW.apply_option = itemDetail.discountVW.apply_option;
			discountVW.discount_rate = itemDetail.discountVW.discount_rate;
			discountVW.quantity = itemDetail.discountVW.quantity;
			discountVW.discount_type = itemDetail.discountVW.discount_type;
			discountVW.isDiscountApply = itemDetail.discountVW.isDiscountApply;
			discountVW.discountId = itemDetail.discountVW.discountId;
			discountVW.menu_name = itemDetail.discountVW.menu_name;
			if (discountVW.apply_option == 2) {
				if (discountVW.discount_type == "Percentage") {
					discountPrice.text = "-$" + toFixed((priceText.totalPrice * parseFloat(discountVW.discount_rate)) / 100).toFixed(2);
					priceText.totalPrice = toFixed(priceText.totalPrice) - toFixed((priceText.totalPrice * parseFloat(discountVW.discount_rate)) / 100);
				} else {
					discountPrice.text = "-$" + discountVW.discount_rate;
					priceText.totalPrice = toFixed(priceText.totalPrice - parseFloat(discountVW.discount_rate));
				}
				priceText.textData = toFixed(priceText.totalPrice * itemDetail.quantity);
				priceText.text = "$" + toFixed(priceText.textData).toFixed(2);

				discountVW.height = 20;
			} else {
				discountVW.isDiscountApply = false;
				checkIndividualDiscount(discountPrice, priceText, discountVW, itemDetail);
			}

		}

		modifierGroupView.add(discountVW);
	} else {
		minusBtn.visible = false;
		plusBtn.visible = false;
	}

	var blankLbl = Ti.UI.createLabel({
		top : 0,
		text : "",
		height : 15,
	});
	modifierGroupView.add(blankLbl);

	var checkBoxBtn = Ti.UI.createButton({
		left : 0,
		width : "12%",
		height : 50,
		backgroundImage : "none",
		name : "checkBoxBtn",
		image : (itemDetail.toggle == true) ? '/images/check_box.png' : '/images/uncheck_box.png',
		toggle : (itemDetail.toggle == true) ? true : false,
		visible : false
	});
	row.add(checkBoxBtn);
	if (itemDetail.loyaltyID == "") {
		checkBoxBtn.visible = true;

	} else {
		checkBoxBtn.visible = false;
	}
	if (isNew == "1") {
		tableData.push(row);
	} else {
		tableData.splice(Alloy.Globals.index, 1, row);
	}

	checkCartHasEmpty();

	if (isNew == "1") {
		$.orderListTable.appendRow(row, {
			animate : true
		});
		add_to_cart_data.push(createJSON(itemDetail, discountVW, "add_to_cart_data"));

		parkedOrderArray.push(createJSON(itemDetail, discountVW, ""));
	} else {
		$.orderListTable.updateRow(Alloy.Globals.index, row, {
			animate : true
		});
		add_to_cart_data.splice(Alloy.Globals.index, 1, createJSON(itemDetail, discountVW, "add_to_cart_data"));
		parkedOrderArray.splice(Alloy.Globals.index, 1, createJSON(itemDetail, discountVW, ""));
		//below code for edit mode if user update selected item so it will update selected item for discount.
		if (itemDetail.toggle == true) {
			var selectedObj = {};
			selectedObj.row_discount_obj = row.getChildren()[1].getChildren()[row.getChildren()[1].getChildren().length - 2];
			selectedObj.id = row.detail.id;
			selectedObj.subTotalLbl = $.subTotalLbl;
			AddItem(selectedObj, "edit");
		}

	}

	if (itemDetail.loyaltyQty >= 1) {
		if (itemDetail.loyaltyQty == 1) {
			$.loyaltyVW.visible = true;
		}
		if (loyaltyObj.loyaltyVW != "") {
			loyaltyObj.loyaltyVW.backgroundColor = "#29150F";
			$.loyaltyVW.visible = true;
			$.loyaltyDetailVW.visible = true;
		}
		$.subCategoryVW.visible = false;
		$.categoryVW.visible = false;
	}
	setTimeout(function() {
		Alloy.Globals.getTotal(updateCFDBool);
	}, 200);

};
function createJSON(itemDetail, discountVW, jsonFor) {
	if (jsonFor == 'add_to_cart_data') {
		var obj = {};
		obj.id = itemDetail.id;
		obj.menu_id = itemDetail.menu_id;
		obj.qty = itemDetail.qty;
		obj.quantity = itemDetail.quantity;
		obj.menu_name = itemDetail.menu_name;
		obj.menu_image = itemDetail.menu_image;
		obj.menu_description = itemDetail.menu_description;
		obj.category_id = itemDetail.category_id;
		obj.category_name = itemDetail.category_name;
		obj.itemCustomizedPrice = 0;
		obj.serving_id = itemDetail.serving_id;
		obj.serving_name = itemDetail.serving_name;
		obj.serving_price = itemDetail.serving_price;
		obj.loyaltyID = itemDetail.loyaltyID;
		obj.loyaltyValue = itemDetail.loyaltyValue;
		obj.loyaltyPoints = itemDetail.loyaltyPoints;
		obj.customLoyaltyID = itemDetail.customLoyaltyID;

		obj.customizationOpt = itemDetail.customizationOpt;
		obj.discountVW = discountVW;

		return obj;
	} else {
		var obj = {};
		obj.id = itemDetail.id;
		obj.menu_id = itemDetail.menu_id;
		obj.qty = itemDetail.qty;
		obj.quantity = itemDetail.quantity;
		obj.menu_name = itemDetail.menu_name;
		obj.menu_image = itemDetail.menu_image;
		obj.menu_description = itemDetail.menu_description;
		obj.category_id = itemDetail.category_id;
		obj.category_name = itemDetail.category_name;
		obj.itemCustomizedPrice = 0;
		obj.serving_id = itemDetail.serving_id;
		obj.serving_name = itemDetail.serving_name;
		obj.serving_price = itemDetail.serving_price;
		obj.customizationOpt = itemDetail.customizationOpt;
		obj.modifier_group = itemDetail.modifier_group;
		obj.loyaltyID = itemDetail.loyaltyID;
		obj.loyaltyValue = itemDetail.loyaltyValue;
		obj.loyaltyPoints = itemDetail.loyaltyPoints;
		obj.customLoyaltyID = itemDetail.customLoyaltyID;
		obj.discountVW = discountVW;
		return obj;
	}

}

function checkIndividualDiscount(discountPrice, priceText, discountVW, itemDetail) {

	if (discountData.length > 0) {
		for (var i = 0; i < discountData.length; i++) {
			//Condition for apply to all
			if (discountData[i].apply_option == 0) {

				var checkPriorityOfMenu = false;
				if (discountData[i].menu_id != "") {
					var menuArray = discountData[i].menu_id.split(',');
					if (menuArray.length > 0) {
						for (var x = 0; x < menuArray.length; x++) {
							if (menuArray[x] == itemDetail.menu_id) {
								if (discountData[i].serving_sizes_id == "") {
									Ti.API.info('*Menu Select Without serving*');
									calculateDiscount(discountData[i], discountPrice, priceText, discountVW, itemDetail);
									checkPriorityOfMenu = true;
									break;
								} else {
									Ti.API.info('*Menu Select With serving*');
									var servingArray = discountData[i].serving_sizes_id.split(',');
									if (servingArray.length > 0) {
										for (var y = 0; y < servingArray.length; y++) {
											if (servingArray[y] == itemDetail.serving_id) {
												checkPriorityOfMenu = true;
												calculateDiscount(discountData[i], discountPrice, priceText, discountVW, itemDetail);
												break;
											}
										}
									}
								}
								break;
							}
						}
					}
				}
				if (checkPriorityOfMenu) {
					break;
				}
				if (discountData[i].category_id != "") {
					var categoryArray = discountData[i].category_id.split(',');
					if (categoryArray.length > 0) {
						for (var w = 0; w < categoryArray.length; w++) {
							if (categoryArray[w] == itemDetail.category_id) {
								if (discountData[i].serving_sizes_id == "") {
									Ti.API.info('*Category Select Without serving*');
									calculateDiscount(discountData[i], discountPrice, priceText, discountVW, itemDetail);
									break;
								} else {
									Ti.API.info('*Category Select With serving*');
									var servingArray = discountData[i].serving_sizes_id.split(',');
									if (servingArray.length > 0) {
										for (var z = 0; z < servingArray.length; z++) {
											if (servingArray[z] == itemDetail.serving_id) {
												calculateDiscount(discountData[i], discountPrice, priceText, discountVW, itemDetail);
												break;
											}
										}
									}
								}
							}
						}
					}
				}

			} else {
			}
		};
	} else {
		discountVW.height = 0;
	}
}

function calculateDiscount(discountData, discountPrice, priceText, discountVW, itemDetail) {

	if (discountData.discount_repeat == 0) {
		var dateObj = discountData.start_date.split("-");
		var timeObj = discountData.start_time.split(":");
		Ti.API.info("Start");
		Ti.API.info(JSON.stringify(dateObj));
		Ti.API.info(dateObj[0] + " " + dateObj[1] + " " + dateObj[2]);
		Ti.API.info(timeObj[0] + " " + timeObj[1] + " " + timeObj[2]);
		startDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
		Ti.API.info("Start Date: " + startDate);

		var dateObj1 = discountData.end_date.split("-");
		var timeObj1 = discountData.end_time.split(":");
		Ti.API.info("End");
		Ti.API.info(dateObj1[0] + " " + dateObj1[1] + " " + dateObj1[2]);
		Ti.API.info(timeObj1[0] + "-" + timeObj1[1] + "-" + timeObj1[2]);
		var endDate = new Date(dateObj1[0], dateObj1[1] - 1, dateObj1[2], timeObj1[0], timeObj1[1], timeObj1[2]);
		Ti.API.info("End Date: " + endDate);

		var currentDate = new Date();
		Ti.API.info("Current Date: " + currentDate);
		currentDate = currentDate.getTime();
		endDate = endDate.getTime();
		startDate = startDate.getTime();

		if (currentDate >= startDate && currentDate <= endDate) {
			if (discountData.discount_type == "Percentage") {

				discountPrice.text = "-$" + toFixed((priceText.totalPrice * discountData.discount_rate) / 100).toFixed(2);
				var discountRate = discountData.discount_rate;
				priceText.totalPrice = toFixed(priceText.totalPrice - ((priceText.totalPrice * discountData.discount_rate) / 100));
			} else {

				discountPrice.text = "-$" + discountData.discount_rate;
				var discountRate = discountData.discount_rate;
				priceText.totalPrice = toFixed(priceText.totalPrice - discountData.discount_rate);

			}
			discountVW.height = 20;
			discountVW.isDiscountApply = true;
			priceText.textData = priceText.totalPrice * itemDetail.quantity;
			priceText.text = "$" + toFixed(priceText.textData).toFixed(2);
			discountVW.discount_type = discountData.discount_type;
			discountVW.discount_rate = discountData.discount_rate;
			discountVW.discountId = discountData.id;
			discountVW.discountTitle = discountData.title;
			discountVW.apply_option = 0;
		}
	} else if (discountData.discount_repeat == 1) {

		var currentDate = new Date();
		var dateObj = discountData.start_date.split("-");
		if (discountData.discount_start[daysArray[currentDate.getDay()]] == "00:00:00") {
			return;
		}
		var timeObj = discountData.discount_start[daysArray[currentDate.getDay()]].split(":");
		startDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);

		var dateObj1 = discountData.start_date.split("-");
		var timeObj1 = discountData.discount_end[daysArray[currentDate.getDay()]].split(":");
		var endDate = new Date(dateObj1[0], dateObj1[1] - 1, dateObj1[2], timeObj1[0], timeObj1[1], timeObj1[2]);

		currentDate = currentDate.getTime();
		endDate = endDate.getTime();
		startDate = startDate.getTime();

		if (currentDate >= startDate && currentDate <= endDate) {
			if (discountData.discount_type == "Percentage") {
				discountPrice.text = "-$" + toFixed((priceText.totalPrice * discountData.discount_rate) / 100).toFixed(2);
				var discountRate = discountData.discount_rate;
				priceText.totalPrice = toFixed(priceText.totalPrice - ((priceText.totalPrice * discountData.discount_rate) / 100));
			} else {

				discountPrice.text = "-$" + discountData.discount_rate;
				var discountRate = discountData.discount_rate;
				priceText.totalPrice = toFixed(priceText.totalPrice - discountData.discount_rate);

			}
			discountVW.height = 20;
			discountVW.isDiscountApply = true;
			priceText.textData = priceText.totalPrice * itemDetail.quantity;
			priceText.text = "$" + toFixed(priceText.textData).toFixed(2);
			discountVW.discount_type = discountData.discount_type;
			discountVW.discount_rate = discountData.discount_rate;
			discountVW.discountId = discountData.id;
			discountVW.discountTitle = discountData.title;
			discountVW.apply_option = 0;
		}

	}
}

function orderTableClickFunc(e) {

	try {
		if (e.source.name == "plusBtn") {
			e.row.getChildren()[0].getChildren()[1].getChildren()[1].text = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text + 1;
			e.row.getChildren()[0].getChildren()[2].textData = toFixed((e.row.getChildren()[0].getChildren()[1].getChildren()[1].text) * e.row.getChildren()[0].getChildren()[2].totalPrice);
			e.row.getChildren()[0].getChildren()[2].text = "$" + toFixed(e.row.getChildren()[0].getChildren()[2].textData).toFixed(2);
			add_to_cart_data[e.index].quantity = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text;
			parkedOrderArray[e.index].quantity = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text;
			// below code for update discount
			tableData[e.index].getChildren()[1].getChildren()[e.row.getChildren()[1].getChildren().length - 2].quantity = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text;
			Alloy.Globals.getTotal();
			parkedOrderArray[e.index].discountVW = tableData[e.index].getChildren()[1].getChildren()[e.row.getChildren()[1].getChildren().length - 2];
		} else if (e.source.name == "minusBtn") {
			if (parseInt(e.row.getChildren()[0].getChildren()[1].getChildren()[1].text) > 1) {
				e.row.getChildren()[0].getChildren()[1].getChildren()[1].text = parseInt(e.row.getChildren()[0].getChildren()[1].getChildren()[1].text) - 1;
				e.row.getChildren()[0].getChildren()[2].textData = toFixed((e.row.getChildren()[0].getChildren()[1].getChildren()[1].text) * e.row.getChildren()[0].getChildren()[2].totalPrice);
				e.row.getChildren()[0].getChildren()[2].text = "$" + toFixed(e.row.getChildren()[0].getChildren()[2].textData).toFixed(2);
				add_to_cart_data[e.index].quantity = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text;
				parkedOrderArray[e.index].quantity = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text;
				tableData[e.index].getChildren()[1].getChildren()[e.row.getChildren()[1].getChildren().length - 2].quantity = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text;
				Alloy.Globals.getTotal();
				parkedOrderArray[e.index].discountVW = tableData[e.index].getChildren()[1].getChildren()[e.row.getChildren()[1].getChildren().length - 2];
			}
		} else if (e.source.name == "editBtn") {
			Alloy.Globals.index = e.index;
			var editObj = {};
			editObj.id = e.row.detail.id;
			editObj.menu_id = e.row.detail.menu_id;
			editObj.qty = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text;
			editObj.quantity = e.row.getChildren()[0].getChildren()[1].getChildren()[1].text;
			editObj.menu_name = e.row.detail.menu_name;
			editObj.menu_image = e.row.detail.menu_image;
			editObj.menu_description = e.row.detail.menu_description;
			editObj.category_id = e.row.detail.category_id;
			editObj.category_name = e.row.detail.category_name;
			editObj.itemCustomizedPrice = 0;
			editObj.serving_id = e.row.detail.serving_id;
			editObj.serving_name = e.row.detail.serving_name;
			editObj.serving_price = e.row.detail.serving_price;
			editObj.loyaltyID = e.row.detail.loyaltyID;
			editObj.customLoyaltyID = e.row.detail.customLoyaltyID;
			editObj.loyaltyValue = e.row.detail.loyaltyValue;
			editObj.loyaltyPoints = e.row.detail.loyaltyPoints;
			editObj.loyaltyQty = e.row.detail.loyaltyQty;
			editObj.from = "edit";
			editObj.toggle = e.row.getChildren()[3].toggle;
			editObj.modifier_group = e.row.detail.modifier_group;
			editObj.addToCartBtn = $.addToCartBtn;
			editObj.loyaltyVW = $.loyaltyVW;
			editObj.loyaltyDetailVW = $.loyaltyDetailVW;
			editObj.subCategoryVW = $.subCategoryVW;
			editObj.categoryVW = $.categoryVW;
			editObj.searchBar= searchBar;
			editObj.discountVW = e.row.getChildren()[1].getChildren()[e.row.getChildren()[1].getChildren().length - 2];
			Ti.API.info('EditObj : ' + JSON.stringify(editObj));
			var customizeOrderPopup = Alloy.createController("CustomizeOrderPopup", editObj).getView();
			customizeOrderPopup.open();
		} else if (e.source.name == "checkBoxBtn") {
			Ti.API.info(e.row.getChildren()[3].toggle);
			if (e.row.getChildren()[3].toggle == false) {
				var selectedObj = {};
				selectedObj.row_discount_obj = e.row.getChildren()[1].getChildren()[e.row.getChildren()[1].getChildren().length - 2];
				selectedObj.id = e.row.detail.id;
				selectedObj.subTotalLbl = $.subTotalLbl;
				AddItem(selectedObj);

				e.row.getChildren()[3].image = "/images/check_box.png";
				e.row.getChildren()[3].toggle = true;
			} else {
				var selectedObj = {};
				selectedObj.row_discount_obj = e.row.getChildren()[1].getChildren()[e.row.getChildren()[1].getChildren().length - 2];
				selectedObj.id = e.row.detail.id;
				selectedObj.subTotalLbl = $.subTotalLbl;
				AddItem(selectedObj);
				e.row.getChildren()[3].image = "/images/uncheck_box.png";
				e.row.getChildren()[3].toggle = false;
			}
		}
	} catch(e) {
		Ti.API.info('* Error Add To Cart Table Click * ' + e.message);
		tracker.addException({
			description : "POSDashboard2: " + e.message,
			fatal : false
		});
	}
}

function removeProductFunc(e) {

	for (var i = 0; i < selected_item_array.length; i++) {

		for (var j = 0; j < add_to_cart_data.length; j++) {

			if (selected_item_array[i].id == add_to_cart_data[j].id) {
				//selected_item_array.splice(i, 1);
				add_to_cart_data.splice(j, 1);
				parkedOrderArray.splice(j, 1);
				tableData.splice(j, 1);
				$.orderListTable.deleteRow(j);
			}
		};
	};
	selected_item_array = [];
	Alloy.Globals.check_any_row_selected();
	Alloy.Globals.getTotal();
	checkCartHasEmpty();

}

function addDiscountPrivateFunc(e) {
	if (role_permission.indexOf("discount") != -1) {
		if(isLoyaltyApplied()){
			Alloy.Globals.Notifier.show("You can't apply any discount because loyalty is already applied");
			return;
		}
		var obj = {};
		obj.from = "normal";
		obj.selectedMenu = selected_item_array;
		var addDiscountWin = Alloy.createController("AddDiscountPopup", obj).getView();
		addDiscountWin.open();
	} else {
		Alloy.Globals.Notifier.show(L('validation_discount_permission'));
	}
}

function removeDiscountPrivateFunc(e) {
	for (var i = 0; i < selected_item_array.length; i++) {
		for (var j = 0; j < add_to_cart_data.length; j++) {
			if (selected_item_array[i].id == add_to_cart_data[j].id) {
				tableData[j].getChildren()[0].getChildren()[2].totalPrice = toFixed(tableData[j].getChildren()[0].getChildren()[2].modifiertotal + tableData[j].detail.serving_price);
				tableData[j].getChildren()[0].getChildren()[2].textData = toFixed(tableData[j].getChildren()[0].getChildren()[2].totalPrice * tableData[j].getChildren()[1].getChildren()[tableData[j].getChildren()[1].getChildren().length - 2].quantity);
				tableData[j].getChildren()[0].getChildren()[2].text = "$" + toFixed(tableData[j].getChildren()[0].getChildren()[2].textData).toFixed(2);
				tableData[j].getChildren()[1].getChildren()[tableData[j].getChildren()[1].getChildren().length - 2].height = 0;
				tableData[j].getChildren()[1].getChildren()[tableData[j].getChildren()[1].getChildren().length - 2].discount_rate = 0;
				tableData[j].getChildren()[1].getChildren()[tableData[j].getChildren()[1].getChildren().length - 2].discount_type = 0;
				tableData[j].getChildren()[1].getChildren()[tableData[j].getChildren()[1].getChildren().length - 2].getChildren()[1].text = "-$0.00";
				tableData[j].getChildren()[1].getChildren()[tableData[j].getChildren()[1].getChildren().length - 2].isDiscountApply = false;
				tableData[j].getChildren()[1].getChildren()[tableData[j].getChildren()[1].getChildren().length - 2].apply_option = -1;
				tableData[j].getChildren()[1].getChildren()[tableData[j].getChildren()[1].getChildren().length - 2].discountId = -1;
				Alloy.Globals.check_any_row_selected();
				Alloy.Globals.getTotal();
			}
		};
	};

}

function AddItem(obj, from) {
	var itemId = obj.id;
	var selectedIndex = getIndex(itemId);
	if (selectedIndex == -1) {
		//Ti.API.info('add');
		selected_item_array.push(obj);
	} else {
		//	Ti.API.info('delete');
		if (from == "edit") {
			selected_item_array.splice(selectedIndex, 1, obj);
		} else {
			selected_item_array.splice(selectedIndex, 1);
		}

	}
	//Ti.API.info('selected_item_array ' + JSON.stringify(selected_item_array));
	Alloy.Globals.check_any_row_selected();
}

//get the index on the basis of gurad ID
function getIndex(itemId) {
	var a = -1;
	for (var i = 0; i < selected_item_array.length; i++) {
		if (itemId == selected_item_array[i].id) {
			a = i;
			break;
		}
	}
	return a;
}

Alloy.Globals.unCheckSelectedRow = function() {
	selected_item_array = [];
	for (var i = 0; i < tableData.length; i++) {
		tableData[i].getChildren()[3].toggle = false;
		tableData[i].getChildren()[3].image = '/images/uncheck_box.png';
	}
	Alloy.Globals.check_any_row_selected();
};

Alloy.Globals.check_any_row_selected = function() {
	var isDiscountPresent = true;
	for (var i = 0; i < selected_item_array.length; i++) {

		if (selected_item_array[i].row_discount_obj.height == 0 || selected_item_array[i].row_discount_obj.apply_option == 0 || selected_item_array[i].row_discount_obj.apply_option == undefined) {
			isDiscountPresent = false;
			$.removeProductBottomVW.visible = false;
			$.addDiscountLbl.text = "Add Discount";
			$.removeProductLbl.text = "Remove Products";
			break;
		}
	};
	if (isDiscountPresent) {
		$.removeProductBottomVW.visible = true;
		$.addDiscountLbl.text = "Add \n Discount";
		$.removeProductLbl.text = "Remove \n Products";
	}
	if (selected_item_array.length > 0) {
		$.bottomMenuVW.visible = true;
		$.checkoutBtn.visible = false;

	} else {
		$.checkoutBtn.visible = true;
		$.bottomMenuVW.visible = false;
	}

};

function tableDeleteFunc(e) {

	removeRowObject(e.index, e.row.detail.id, e.row.detail.customLoyaltyID);
	Alloy.Globals.getTotal();
	checkCartHasEmpty();
}

function checkLoyaltyId(index, deleteBtnObj) {
	var row = deleteBtnObj.row;
	var customLoyaltyId = deleteBtnObj.parent.parent.parent.customLoyaltyId;
	var loyaltyDetails = deleteBtnObj.parent.parent.parent.loyaltyDetails;

	Alloy.Globals.cartItems.splice(index, 1);
	$.cartItemsTbl.deleteRow(row);
	Ti.API.info('Alloy.Globals.cartItems ' + JSON.stringify(Alloy.Globals.cartItems));
	updateRowIndex();
	var cartRows = $.cartItemsTbl.data[0].rows;
	Ti.API.info('cartRows ' + cartRows.length);
	for (var i = 0; i < cartRows.length; i++) {
		if (customLoyaltyId == cartRows[i].customLoyaltyId) {
			Alloy.Globals.cartItems.splice(i, 1);
			$.cartItemsTbl.deleteRow(cartRows[i]);
			Ti.API.info('Alloy.Globals.cartItems ' + JSON.stringify(Alloy.Globals.cartItems));
			updateRowIndex();
		}
	}
	remainingLoyalties += Number(loyaltyDetails.loyalty_points);
	Ti.API.info('remainingLoyalties ' + remainingLoyalties);
}

function updateRowIndex() {
	var tableRows = $.cartItemsTbl.data[0].rows;
	Ti.API.info('tableRows : ' + tableRows.length);
	for (var i = 0; i < tableRows.length; i++) {
		Ti.API.info('tableRows i ' + tableRows[i].children);
		tableRows[i].children.index = i;
	}
}

function checkCartHasEmpty() {
	if (tableData.length > 0) {
		$.orderListTable.top = "20.23%";
		$.orderListTable.bottom = "7.16%";
		$.no_data_layout_headerVw.height = 0;
		if (Alloy.Globals.isCheckoutOpen) {
			$.checkoutBtn.title = L('update_txt');
		} else {
			$.checkoutBtn.title = L('checkout_txt');
		}
		Alloy.Globals.isCartEmpty = false;
	} else {
		Alloy.Globals.isCartEmpty = true;
		$.discountLbl.text = "-$" + 0.00;
		$.discountLbl.textData = 0;
		$.discountLbl.discountId = 0;
		$.taxLbl.text = "+$0.00";
		$.taxLbl.textData = 0;
		Alloy.Globals.getTotal();
		$.orderListTable.top = Titanium.Platform.displayCaps.platformHeight * 0.13;
		$.orderListTable.bottom = "7.16%";
		$.checkoutBtn.height = Titanium.Platform.displayCaps.platformHeight * 0.0716;
		$.no_data_layout_headerVw.height = "60%";
		$.checkoutBtn.title = L('no_sale');
		if (Alloy.Globals.isCheckoutOpen) {
			Alloy.Globals.closeFrom = 1;
			Alloy.Globals.checkoutWin.close();
			Alloy.Globals.isCheckoutOpen = false;
		}
	}
}

/*
 * Right Grid View creation code
 */
var showVW = Ti.UI.createAnimation({

	duration : 500,
	visible : true,

});
var hideVW = Ti.UI.createAnimation({

	duration : 500,
	visible : true,

});
$.categoryGrid.init({
	columns : 3,
	space : 10,
	gridBackgroundColor : '"#EDECF2',
	itemHeightDelta : 0,
	itemBackgroundColor : '#fff',
	itemBorderColor : 'transparent',
	itemBorderWidth : 0,
	itemBorderRadius : 0,
	search : searchBar
});

var categoryTemp = [];
var search_data = [];
var selected_itemIds = [];

var gridHeight = Ti.Platform.displayCaps.getPlatformHeight() * 0.11;
var gridImageViewHeight = gridHeight;

var searchSubCatogryData = [];
function renderCategoryGrid(sample_data) {
	categoryTemp = [];
	if (sample_data.length > 0) {
		$.staticCategoryLbl.text = L('categories_txt');
	} else {
		$.staticCategoryLbl.text = L('no_categories_txt');
	}
	for (var x = 0; x < sample_data.length; x++) {

		//CREATES A VIEW WITH OUR CUSTOM LAYOUT
		var view = Ti.UI.createView({
			left : 0,
			right : 0,
			height : Ti.UI.FILL,

		});
		var imgVW = Ti.UI.createView({
			width : gridImageViewHeight,
			height : gridImageViewHeight,
			left : 8,
			borderWidth : 1,
			borderColor : "#EDECF2",

		});
		view.add(imgVW);

		var img = Ti.UI.createImageView({
			defaultImage : "/images/defaultImg.png",
			image : sample_data[x].category_image,
			height : "90%"

		});
		imgVW.add(img);

		var title = Ti.UI.createLabel({
			left : gridImageViewHeight + 8 + 6,
			right : 4,
			textAlign : "left",
			font : {
				fontSize : 14,
				fontFamily : "Montserrat-Regular"
			},
			//text : sample_data[x].title,
			text : sample_data[x].category_name,
			color : "black",
			height : "50%",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		view.add(title);

		//THIS IS THE DATA THAT WE WANT AVAILABLE FOR THIS ITEM WHEN onItemClick OCCURS
		var values = {
			title : sample_data[x].category_name,
			image : sample_data[x].category_image,
			category_id : sample_data[x].id,
		};

		//NOW WE PUSH TO THE ARRAY THE VIEW AND THE DATA
		categoryTemp.push({
			view : view,
			data : values
		});
	};
	$.categoryGrid.addGridItems(categoryTemp);

	$.categoryGrid.setOnItemClick(function(e) {

		if (role_permission.indexOf("place_order") != -1) {
			searchSubCatogryData = [];
			var subCat = Alloy.Globals.DbManager.Get_Menu_Data_From_DB(e.source.data.category_id);
			if (subCat.length > 0) {
				searchSubCatogryData = subCat;
				var selected_subcategory = getSelectedSubCategory(subCat);
				//Below line for holding categoryData for passing in renderSubCategoryGrid function at search time
				selectedCategoryJson = e.source.data;
				renderSubCategoryGrid(subCat, selected_subcategory, e.source.data);
				$.subCategoryNameLbl.text = e.source.data.title;
				$.categoryVW.visible = false;
				$.subCategoryVW.visible = true;
				Alloy.Globals.categorySubcategorytype = 2;
				$.navwin.remove(searchBar);
			} else {
				Alloy.Globals.Notifier.show(L('menu_validation'));
			}
		} else {
			Alloy.Globals.Notifier.show(L('validation_order_permission'));
		}
	});
}

/*
 * Right Menu Grid View creation code
 */

$.subCategoryGrid.init({
	columns : 3,
	space : 10,
	gridBackgroundColor : '"#EDECF2',
	itemHeightDelta : 0,
	itemBackgroundColor : '#fff',
	itemBorderColor : 'transparent',
	itemBorderWidth : 0,
	itemBorderRadius : 0
});

var subCategorryTemp = [];
var selected_subCategory_array = [];
function renderSubCategoryGrid(sample_data, selectedItem, catValue) {
	subCategorryTemp = [];

	for (var x = 0; x < sample_data.length; x++) {
		var view = Ti.UI.createView({
			left : 0,
			right : 0,
			height : Ti.UI.FILL,
			backgroundColor : "white",
		});

		var imgVW = Ti.UI.createView({
			width : gridImageViewHeight,
			height : gridImageViewHeight,
			left : 8,
			borderWidth : 1,
			borderColor : "#EDECF2",
		});
		view.add(imgVW);

		var img = Ti.UI.createImageView({
			image : (sample_data[x].menu_image != "") ? sample_data[x].menu_image : "/images/defaultImg.png",
			defaultImage : "/images/defaultImg.png",
			height : "90%"
		});
		imgVW.add(img);

		var title = Ti.UI.createLabel({
			left : gridImageViewHeight + 8 + 6,
			width : "50%",
			textAlign : "left",
			font : {
				fontSize : 14,
				fontFamily : "Montserrat-Regular"
			},
			text : (sample_data[x].menu_alias == "") ? sample_data[x].menu_name : sample_data[x].menu_alias,
			color : "black",
			height : "50%",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		view.add(title);
		// if (selectedItem.length > 0) {
		// for (var i = 0; i < selectedItem.length; i++) {
		// if (selectedItem[i].data.id == sample_data[x].id) {
		//
		// view.borderColor = "#c32032";
		// view.borderRadius = 1;
		// }
		// };
		// }
		//THIS IS THE DATA THAT WE WANT AVAILABLE FOR THIS ITEM WHEN onItemClick OCCURS
		var values = {
			detail : sample_data[x],
			catValue : catValue
		};

		//NOW WE PUSH TO THE ARRAY THE VIEW AND THE DATA
		subCategorryTemp.push({
			view : view,
			data : values
		});

	};

	$.subCategoryGrid.addGridItems(subCategorryTemp);
	var focus = true;
	$.subCategoryGrid.setOnItemClick(function(e) {
		try {
			if (role_permission.indexOf("place_order") != -1) {

				Alloy.Globals.LoadingScreen.open();
				//Below setTimeout added because loader is not appearing early when data is heavy
				setTimeout(function(k) {
					var serving_value = [];
					var menu_serving_price = Alloy.Globals.DbManager.Get_Menu_Serving_From_DB(e.source.data.detail.id);
					for (var i = 0; i < menu_serving_price.length; i++) {
						var servingData = Alloy.Globals.DbManager.Get_Serving_From_DB(menu_serving_price[i].serving_id);
						var obj = {
							id : menu_serving_price[i].id,
							serving_id : menu_serving_price[i].serving_id,
							modifier_group_id : 0,
							price : menu_serving_price[i].price,
							modifier_price : menu_serving_price[i].price,
							serving_name : servingData.serving_name,
							serving_sort : servingData.serving_sort,
							quantity : 1,
							modifier_name : servingData.serving_name,
							modifier_prefix_name : "",
							modifier_apply_counter : 1,
							selection_time : "Single",
							selected : false,
							count : 0,
							enabled : true
						};
						serving_value.push(obj);
					};
					//Ti.API.info('serving_value '+JSON.stringify(serving_value));
					var a = serving_value.sort(function(a, b) {
						return a.serving_sort - b.serving_sort;
					});
					//Ti.API.info('Sort Order : '+ JSON.stringify(a));
					var modifierGroup = {
						id : 0,
						selection_time : "Single",
						modifier_group_name : "Cup Size",
						is_required : "1",
						modifiers : a
					};
					var all_modifier_group = [];
					all_modifier_group.push(modifierGroup);
					var menuId = e.source.data.detail.id;
					var menu_modifier_group = Alloy.Globals.DbManager.Get_Menu_Modifier_Group_From_DB(menuId);
					for (var i = 0; i < menu_modifier_group.length; i++) {
						var menuModifierGroupData = Alloy.Globals.DbManager.Get_Menu_Group_From_DB(menu_modifier_group[i].modifier_group_id, menuId);
						var obj = {
							id : menu_modifier_group[i].id,
							modifier_group_id : menu_modifier_group[i].modifier_group_id,
							is_required : menu_modifier_group[i].is_required,
							modifier_group_name : menuModifierGroupData.modifier_group_name,
							modifier_apply_counter : menuModifierGroupData.modifier_apply_counter,
							selection_time : menuModifierGroupData.selection_time,
							selected : false,
							enabled : true,
							showItem : true,
							modifiers : menuModifierGroupData.modifier
						};

						all_modifier_group.push(obj);
					};

					Ti.API.info('Final Array ' + JSON.stringify(all_modifier_group));
					// if(serving_value.length>0){
					// var ser_price =  all_modifier_group[0].modifiers[0].price;
					// }else{
					// var ser_price = 0;
					// }

					var menuObj = {
						id : e.source.data.detail.id,
						menu_id : e.source.data.detail.id,
						menu_name : (e.source.data.detail.menu_alias == "") ? e.source.data.detail.menu_name : e.source.data.detail.menu_alias,
						menu_description : e.source.data.detail.menu_description,
						menu_image : e.source.data.detail.menu_image,
						category_id : e.source.data.detail.category_id,
						category_name : e.source.data.detail.category_name,
						qty : 1,
						// menu_price :all_modifier_group[0].modifiers[0].price,
						menu_price : 0,
						store_id : parseInt(e.source.data.detail.store_id),
						from : "add",
						toggle : false,
						addToCartBtn : $.addToCartBtn,
						loyaltyVW : $.loyaltyVW,
						loyaltyDetailVW : $.loyaltyDetailVW,
						subCategoryVW : $.subCategoryVW,
						categoryVW : $.categoryVW,
						searchBar: searchBar,
						modifier_group : all_modifier_group
					};
					Ti.API.info('Final Menu Object ' + JSON.stringify(menuObj));

					// e.source.vw.borderColor = "#c32032";
					// e.source.vw.borderRadius = 1;

					customizeOrderPopup = Alloy.createController("CustomizeOrderPopup", menuObj).getView();
					customizeOrderPopup.open();

				}, 100);
			} else {
				Alloy.Globals.Notifier.show(L('validation_order_permission'));
			}
		} catch(e) {
			Ti.API.info('Error on menu click ' + e.message);
			Alloy.Globals.LoadingScreen.close();
			tracker.addException({
				description : "POSDashboard3: " + e.message,
				fatal : false
			});
		}

	});
}

/*
 * Function for calculate final subTotal including Tax plus discount
 */
var loyPoints = 0;
var loyVal = 0;
Alloy.Globals.isUpdateAvailable = false;

Alloy.Globals.updateCFD = function(e){
	var cfdObj = {};
	cfdObj.subTotal = $.subTotalLbl.text;
	cfdObj.discount = $.discountLbl.text;
	cfdObj.tax = $.taxLbl.text;
	cfdObj.grandTotal = $.grandTotalLbl.text;
	cfdObj.loyaltyPoint = $.loyaltyPointLbl.text;
	cfdObj.loyaltyVal = $.loyaltyValueLbl.text;
	cfdObj.customerLoyaltyPoints = $.loyaltyLbl.text;
	cfdObj.cartDetail = add_to_cart_data;
	
	cfdObj.customerName = Alloy.Globals.name;
	Ti.API.info('JSON.stringify(cfdObj) = '+JSON.stringify(cfdObj));
	setTimeout(function(){
		bonjourBrowser.clearBuffer();
		bonjourBrowser.sendData(JSON.stringify(cfdObj));
	},200);
};

Alloy.Globals.getTotal = function(updateDataToCFD) {
	
	if(updateDataToCFD == undefined || updateDataToCFD == null){
		updateDataToCFD = true;
	}
	
	var total = 0;
	var loyId = 0;
	loyPoints = 0;
	loyVal = 0;
	for (var i = 0; i < tableData.length; i++) {
		total = total + tableData[i].getChildren()[0].getChildren()[2].textData;
		if (tableData[i].getChildren()[0].getChildren()[2].customLoyaltyID != "") {
			if (tableData[i].getChildren()[0].getChildren()[2].customLoyaltyID != loyId) {
				loyPoints = loyPoints + parseInt(tableData[i].getChildren()[0].getChildren()[2].loyaltyPoints);
				loyVal = loyVal + calculateLoyaltyValue(tableData[i].getChildren()[0].getChildren()[2].customLoyaltyID, parseInt(tableData[i].getChildren()[0].getChildren()[2].loyaltyValue));
			}
			loyId = tableData[i].getChildren()[0].getChildren()[2].customLoyaltyID;
		}
	};

	if (tableData.length > 0) {
		if (loyPoints != 0) {
			loyaltyObj.userRemainingPoints = loyaltyObj.userPoints - loyPoints;
		} else {
			loyaltyObj.userRemainingPoints = -1;
		}
	} else {
		loyaltyObj.userRemainingPoints = -1;
	}
	Ti.API.info('loyaltyObj.userRemainingPoints ' + loyaltyObj.userRemainingPoints);

	checkLoyaltyApplied(loyPoints, loyVal);

	$.subTotalLbl.text = "$" + parseFloat(total).toFixed(2);
	$.subTotalLbl.textData = toFixed(total);

	var grandTotal = $.subTotalLbl.textData - toFixed(loyVal);
	if ($.subTotalLbl.textData == 0) {
		$.taxLbl.textData = 0;
	} else {
		$.taxLbl.textData = tax;
	}
	var discount = 0;
	if ($.discountLbl.type == "Percentage") {
		discount = toFixed((grandTotal * parseFloat($.discountLbl.textData)) / 100);
		$.discountLbl.text = "-$" + toFixed(parseFloat(discount)).toFixed(2);
	} else if ($.discountLbl.type == "Amount") {
		discount = parseFloat($.discountLbl.textData);
	} else {
		$.discountLbl.textData = 0;
		$.discountLbl.discountId = 0;
		$.discountLbl.text = "-$0.00";
	}
	if (grandTotal < discount) {
		$.discountLbl.text = "-$" + toFixed(parseFloat(grandTotal)).toFixed(2);
		grandTotal = 0;
	} else {
		grandTotal = grandTotal - discount;
	}
	//Ti.API.info($.subTotalLbl.textData + " " + ((grandTotal * $.taxLbl.textData) / 100));
	$.taxLbl.text = "+$" + toFixed((grandTotal * $.taxLbl.textData) / 100).toFixed(2);
	grandTotal = grandTotal + ((grandTotal * $.taxLbl.textData) / 100);
	$.grandTotalLbl.text = "$" + toFixed(grandTotal).toFixed(2);
	$.grandTotalLbl.textData = grandTotal;
	Alloy.Globals.isUpdateAvailable = true;
	Ti.API.info('test    Json = '+ JSON.stringify(add_to_cart_data));
	// if (Ti.App.Properties.getObject("cfdPeripheral")) {
	// sendIndex = 0;
	// sendDataLength = 250;
	// sendData();
	// Ti.API.info('start Time = '+ new Date());
	// }
	// $.loyaltyPointLbl.text = "-" + loyPoints + " Pts.";
		// $.loyaltyValueLbl.text = "-$" + toFixed(loyVal).toFixed(2);
		
	Alloy.Globals.cartDetailSendData = add_to_cart_data;
	/*
	var cfdObj = {};
		cfdObj.subTotal = $.subTotalLbl.text;
		cfdObj.discount = $.discountLbl.text;
		cfdObj.tax = $.taxLbl.text;
		cfdObj.grandTotal = $.grandTotalLbl.text;
		cfdObj.loyaltyPoint = $.loyaltyPointLbl.text;
		cfdObj.loyaltyVal = $.loyaltyValueLbl.text;
		cfdObj.customerLoyaltyPoints = $.loyaltyLbl.text;
		cfdObj.cartDetail = add_to_cart_data;
		
		cfdObj.customerName = Alloy.Globals.name;
		Ti.API.info('JSON.stringify(cfdObj) = '+JSON.stringify(cfdObj));
		setTimeout(function(){
			bonjourBrowser.clearBuffer();
			bonjourBrowser.sendData(JSON.stringify(cfdObj));
		},200);*/
	if(updateDataToCFD == true){
		Ti.API.info('********2********');	
		Alloy.Globals.updateCFD();
	}
	
	
};




function calculateLoyaltyValue(customID, itemLoyaltyValue) {
	var itemPrice = 0;
	for (var i = 0; i < tableData.length; i++) {
		if (tableData[i].getChildren()[0].getChildren()[2].customLoyaltyID == customID) {
			itemPrice = itemPrice + tableData[i].getChildren()[0].getChildren()[2].textData;
		}
	}
	Ti.API.info('final Value ' + itemPrice);
	if (itemPrice > itemLoyaltyValue) {
		return itemLoyaltyValue;
	} else {
		return itemPrice;
	}
}

function checkLoyaltyApplied(loyPoints, loyVal) {
	if (loyPoints > 0) {
		$.loyaltyPointLbl.textData = loyPoints;
		$.loyaltyValueLbl.textData = loyVal;
		$.loyaltyPointLbl.text = "-" + loyPoints + " Pts.";
		$.loyaltyValueLbl.text = "-$" + toFixed(loyVal).toFixed(2);
		$.loyaltyPointLbl.height = Ti.UI.SIZE;
		$.loyaltyPointLbl.top = 5;
		$.loyaltyValueLbl.height = Ti.UI.SIZE;
		$.loyaltyValueLbl.top = 5;
		$.loyaltyValueLbl.visible = true;
		$.loyaltyPointLbl.visible = true;
		$.staticLoyaltyPointLbl.height = Ti.UI.SIZE;
		$.staticLoyaltyPointLbl.top = 5;
		$.staticLoyaltyValLbl.height = Ti.UI.SIZE;
		$.staticLoyaltyValLbl.top = 5;
		$.staticLoyaltyPointLbl.visible = true;
		$.staticLoyaltyValLbl.visible = true;
	} else {
		$.loyaltyPointLbl.textData = loyPoints;
		$.loyaltyValueLbl.textData = loyVal;
		$.loyaltyPointLbl.text = "-" + loyPoints + " Pts.";
		$.loyaltyValueLbl.text = "-$" + toFixed(loyVal).toFixed(2);
		$.loyaltyPointLbl.height = 0;
		$.loyaltyPointLbl.top = 0;
		$.loyaltyValueLbl.height = 0;
		$.loyaltyValueLbl.top = 0;
		$.loyaltyValueLbl.visible = false;
		$.loyaltyPointLbl.visible = false;
		$.staticLoyaltyPointLbl.height = 0;
		$.staticLoyaltyPointLbl.top = 0;
		$.staticLoyaltyValLbl.height = 0;
		$.staticLoyaltyValLbl.top = 0;
		$.staticLoyaltyPointLbl.visible = false;
		$.staticLoyaltyValLbl.visible = false;
	}
}

function removeRowObject(index, id, customLoyaltyID) {

	tableData.splice(index, 1);

	if (selected_item_array.length > 0) {
		for (var i = 0; i < selected_item_array.length; i++) {
			if (id == selected_item_array[i].id) {
				selected_item_array.splice(i, 1);
			}
		}
	}
	//Code for remove previous selected items
	if (add_to_cart_data.length > 0) {
		add_to_cart_data.splice(index, 1);
		parkedOrderArray.splice(index, 1);
	}

	if (customLoyaltyID != "") {
		for (var i = add_to_cart_data.length - 1; i >= 0; i--) {
			if (add_to_cart_data[i].customLoyaltyID == customLoyaltyID) {
				tableData.splice(i, 1);
				add_to_cart_data.splice(i, 1);
				parkedOrderArray.splice(i, 1);
			}
		};
	}

	Alloy.Globals.getTotal(false);
	Alloy.Globals.check_any_row_selected();

	if (customLoyaltyID != "") {
		setTimeout(function() {
			if ($.orderListTable.getData().length > 0) {
				var rows = $.orderListTable.data[0].rows;
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].getChildren()[0].getChildren()[2].customLoyaltyID == customLoyaltyID) {
						//bonjourBrowser.sendData("deleteCart");
						bonjourBrowser.clearBuffer();
						Ti.API.info('********1*********');
						$.orderListTable.deleteRow(rows[i]);
						
					}
				}
			}

		}, 800);
		
	}
	// bonjourBrowser.sendData("deleteCart");
	// bonjourBrowser.clearBuffer();
	


}

/*
 * Function for getting selected sub category
 */
function getSelectedSubCategory(subCat) {
	for (var i = 0; i < selected_subCategory_array.length; i++) {
		for (var j = 0; j < subCat.length; j++) {
			if (subCat[j].id == selected_subCategory_array[i].data.id) {
				selected_itemIds.push(selected_subCategory_array[i]);
			}
		};
	};
	return selected_itemIds;
}

function addCustomerFunc() {

	if ($.loyaltyBtn.image == "/images/Discount_btn_1.png") {
		if (role_permission.indexOf("discount") != -1) {
			if (tableData.length > 0) {
				if(isLoyaltyApplied()){
					Alloy.Globals.Notifier.show("You can't apply any discount because loyalty is already applied");
					return;
				}
				var obj = {};
				obj.from = "overall";
				obj.selectedMenu = [];
				obj.subTotalLbl = $.subTotalLbl;
				obj.grandTotalLbl = $.grandTotalLbl;
				obj.discountLbl = $.discountLbl;
				obj.taxLbl = $.taxLbl.textData;
				var addDiscountWin = Alloy.createController("AddDiscountPopup", obj).getView();
				addDiscountWin.open();
			} else {
				Alloy.Globals.Notifier.show(L("discount_cart_txt"));
			}
		} else {
			Alloy.Globals.Notifier.show(L("validation_discount_permission"));
		}

	} else {
		var objContainer = {
			addCustomerLbl : $.addCustomerLbl,
			profileImage : $.profileImage,
			centerVW : $.centerVW,
			loyaltyBtn : $.loyaltyBtn,
			subTotalLbl : $.subTotalLbl.text,
			discountLbl : $.discountLbl.text,
			taxLbl : $.taxLbl.text,
			grandTotalLbl : $.grandTotalLbl.text,
			loyaltyPointLbl : $.loyaltyPointLbl.text,
			loyaltyValueLbl : $.loyaltyValueLbl.text,
			customerLoyaltyPoints : $.loyaltyLbl.text
		};
		var popover = Alloy.createController('AddUserPopover', objContainer).getView();
		popover.show({
			view : $.loyaltyBtn
		});
	}

}

/*
 * Function for open left drawer menu from home screen
 */
function toggleLeftView() {
	searchBar.blur();
	Alloy.Globals.openLeft();
}

/*
 * Sync Service related functionality
 */
var comeFrom = "";
var navigateToTab = "";
Alloy.Globals.processSync = function(from,navigateTo) {
	comeFrom = from;
	navigateToTab = navigateTo;
	Ti.API.info('navigateTo1 = '+navigateToTab);
	var SERVICE_GET_INITIAL_DATA = Alloy.Globals.Constants.SERVICE_GET_INITIAL_DATA;
	if (Ti.Network.online) {
		var last_updated_date = "";
		if (Ti.App.Properties.getString("last_updated_date")) {
			last_updated_date = Ti.App.Properties.getString("last_updated_date");
			$.lasSyncDateLbl.height = 0;
		} else {
			Alloy.Globals.LoadingScreen.open();
			Alloy.Globals.syncLbl.visible = true;
		}
		$.syncingLbl.text = L("syncing_txt");
		var obj = {
			request_date : last_updated_date,
			store_id : Alloy.Globals.store_id,
			user_id : Alloy.Globals.employee_id,
		};
		if (Ti.App.Properties.getString("order_id")) {
			obj.last_order_id = Ti.App.Properties.getString("order_id");
		} else {
			obj.last_order_id = "";
		}
		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_GET_INITIAL_DATA, processSyncCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_GET_INITIAL_DATA );
	} else {
		show_last_sync();
		renderData();
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

};

/*
 * Getting response of processSync in the callback function and perform all database related stuff
 */
function processSyncCallback(e) {

	if (e.success) {
		try {
			Ti.API.info('response came ');
			var response = JSON.parse(e.response);
			if (response != null) {

				if (response.response_code == '1') {
					Ti.App.Properties.setString("last_updated_date", response.last_updated_date);
					Ti.App.Properties.setString("view_date", response.view_date);
					Alloy.Globals.syncLbl.visible = false;
					Alloy.Globals.DbManager.saveAndUpdate_AllData(response.result);
					show_last_sync();
					renderData();
					Alloy.Globals.totalAmount = response.store_amount;
					Ti.API.info('Alloy.Globals.totalAmount =' + Alloy.Globals.totalAmount);
					Alloy.Globals.totalHousingAmount = response.store_housing_limit;
					//Ti.API.info('Alloy.Globals.totalHousingAmount =' + Alloy.Globals.totalHousingAmount);
					Alloy.Globals.LoadingScreen.close();
					if (comeFrom == "notification") {
						comeFrom = "";
						Ti.API.info('navigateTo2 = '+navigateToTab);
						if (Alloy.Globals.drawer.centerWindow == Alloy.Globals.homeObj.tabgroup) {
							if(navigateToTab == "orderFromKiosk"){
							Alloy.Globals.openSelectedTabFromSlideMenu(1);
							}else{
								Alloy.Globals.openSelectedTabFromSlideMenu(2);
							}
							
						} else {
							Alloy.Globals.drawer.centerWindow = Alloy.Globals.homeObj.tabgroup;
							if(navigateToTab == "orderFromKiosk"){
							Alloy.Globals.openSelectedTabFromSlideMenu(1);
							}else{
								Alloy.Globals.openSelectedTabFromSlideMenu(2);
							}
							//Alloy.Globals.openSelectedTabFromSlideMenu(2);
							Alloy.Globals.currentWindow = Alloy.Globals.homeObj.tabgroup;
						}
						navigateToTab="";
					} else if (comeFrom == "pickUp") {
						
						Alloy.Globals.fetchOrders("pickUp");
						comeFrom = "";
						navigateToTab="";
					} else {
						Alloy.Globals.fetchOrders();
					}

				} else {
					Alloy.Globals.Notifier.show(response.message);
					show_last_sync();
					Alloy.Globals.LoadingScreen.close();
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
				show_last_sync();
				Alloy.Globals.LoadingScreen.close();
			}
		} catch(e) {
			Ti.API.info('Error sync service : ' + e.message);
			show_last_sync();
			Alloy.Globals.LoadingScreen.close();
			tracker.addException({
				description : "Sync POSDashboard4: " + e.message,
				fatal : false
			});
		}
	} else {
		show_last_sync();

		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
		Alloy.Globals.LoadingScreen.close();
		renderData();
	}

}

function renderData(result) {
	try {
		search_data = Alloy.Globals.DbManager.Get_Category_Data_From_DB();
		var newOrderData = Alloy.Globals.DbManager.Get_Sale_From_DB(Alloy.Globals.store_id);
		//Ti.API.info('newOrderData ' + JSON.stringify(newOrderData));
		if (newOrderData != null && newOrderData.length > 0) {
			Ti.App.Properties.setString("order_id", newOrderData[0].id);
		}
		var historyOrderData = Alloy.Globals.DbManager.Get_Sale_From_DB_orderHistory();

		function compare(a, b) {
			var a = a.updated_at.replace(" ", "T");
			var valuea = new Date(a).getTime();
			var b = b.updated_at.replace(" ", "T");
			var valueb = new Date(b).getTime();
			if (valuea > valueb)
				return -1;
			if (valuea < valueb)
				return 1;
			return 0;
		}


		historyOrderData.sort(compare);
		Alloy.Globals.newOrderData = newOrderData;
		Alloy.Globals.historyOrderData = historyOrderData;
		scheduleNotification(newOrderData);
		renderCategoryGrid(search_data);
		discountData = Alloy.Globals.DbManager.getDiscountFromDatabase();
		//Ti.API.info('discountData ' + JSON.stringify(discountData));
		Alloy.Globals.discountData = discountData;
		var registerData = Alloy.Globals.DbManager.getRegisterDetail("");
		//Ti.API.info("registerData = " + JSON.stringify(registerData));
		//for (var i = 0; i < registerData.length; i++) {
		if (registerData != null && registerData.length > 0) {
			if (registerData[0].status == "opened") {
				Ti.App.Properties.setObject("isRegisterOpened", 1);

			} else {
				Ti.App.Properties.setObject("isRegisterOpened", 0);

			}
		} else {
			Ti.App.Properties.setObject("isRegisterOpened", 0);
		}
		//};
		if (Ti.App.Properties.getObject("isRegisterOpened") == 1) {
			Alloy.Globals.openRegisterLbl.text = (L("close_register_txt"));
		} else {
			Alloy.Globals.openRegisterLbl.text = (L("open_registertxt"));
		}

		taxData = Alloy.Globals.DbManager.getTaxDataFromDB();
		//Ti.API.info('taxData ' + JSON.stringify(taxData));
		if (taxData.hasOwnProperty('tax_rate')) {
			tax = parseFloat(taxData.tax_rate);
		} else {
			tax = 0;
		}
		var permission = JSON.parse(Alloy.Globals.DbManager.getPermissionsFromDB())[0];
		if (permission) {
			role_permission = permission.split(',');
		} else {
			role_permission = [];
		}

		//Ti.API.info("*role_permission***   " + JSON.stringify(role_permission));

	} catch(e) {
		Ti.API.info('RenderData Error : ' + e.message);
	}

}

function show_last_sync() {
	if (Ti.App.Properties.getString("view_date")) {
		$.syncingLbl.text = L("lastsync_txt");
		$.lasSyncDateLbl.text = Alloy.Globals.DateTimeUtils.getFormattedDate(Ti.App.Properties.getString("view_date"));
		$.lasSyncDateLbl.visible = true;
		$.lasSyncDateLbl.height = 12;
	} else {
		$.syncingLbl.text = L("lastsync_txt");
		$.lasSyncDateLbl.visible = false;
		$.lasSyncDateLbl.height = 0;
	}
}

function scheduleNotification(orderData) {
	Ti.API.info('in scheduleNotification');
	for ( i = 0; i < orderData.length; i++) {
		if (orderData[i].pickup_type != "asap") {
			if (orderData[i].isSchedule == "1") {
				var obj =	{
					"url" : "http://www.download.com/content/asset.json",
					"type" : "pickUp",
					"order_id" : orderData[i].id,
					"fullname" : orderData[i].fullname 
				};
				Alloy.Globals.scheduledNotification(orderData[i],obj,"Order " + orderData[i].id + " for " + orderData[i].fullname.trim() + " will get pick up in 5 mins. Make sure it is ready");
				var db = Ti.Database.open('GongchaPOS_DB');
				db.execute('UPDATE ospos_sales SET isSchedule=? WHERE id=' + orderData[i].id, "0");
			}
		}
	}
}

// function scheduled(orderData) {
// if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
//     Ti.App.iOS.registerUserNotificationSettings({
//     types: [
//             Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
//             Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
//             Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
//         ]    });
// }
// var pickupdate = orderData.pickup_date.replace(" ", "T");
// Ti.API.info('pickupdate date    = '+ pickupdate);
// var notificationDate = new Date(pickupdate).getTime();
// Ti.API.info('scheduled date    = '+ notificationDate);
// Ti.API.info('scheduled date    = '+ new Date(notificationDate + 3000 * 60).getTime());
// //Ti.API.info('new Date(notificationDate - 5000 * 60) ' + new Date(notificationDate - 5000 * 60));
// if (new Date(pickupdate).getTime() > new Date().getTime()) {
// Ti.API.info('In Timeee');
// //var notificationDate = new Date(date).getTime();
// // The following code snippet schedules an alert to be sent within three seconds
// var notification = Ti.App.iOS.scheduleLocalNotification({
// // Alert will display 'slide to update' instead of 'slide to view'
// // or 'Update' instead of 'Open' in the alert dialog
// alertAction : "update",
// // Alert will display the following message
// alertBody : "Order " + orderData.id + " for " + orderData.fullname + " will get picked up in 5 mins. Make sure it is ready",
// // The badge value in the icon will be changed to 1
// badge : 1,
// // Alert will be sent in three seconds
// date : new Date((notificationDate + (3000 * 60))),
// // The following sound file will be played
// sound : "/alert.wav",
// userInfo : {
// "url" : "http://www.download.com/content/asset.json"
// }
// });
//
// }
// }
// // Fired when the application receives an incoming local notification when it's in the foreground
// Ti.App.iOS.addEventListener('notification', function(e) {
// // Process custom data
// if (e.userInfo && "url" in e.userInfo) {
// //httpGetRequest(e.userInfo.url);
// }
// if (Alloy.Globals.isLogin) {
// Titanium.UI.iOS.setAppBadge(0);
//
// dialog = Ti.UI.createAlertDialog({
// cancel : 1,
// buttonNames : ["Show", "Cancel"],
// message : "Order " ,
// //+ orderData.id + " for " + orderData.fullname + " will get picked up in 5 mins. Make sure it is ready",
// title : "Gongcha POS"
// });
// dialog.addEventListener('click', function(k) {
// if (k.index === k.source.cancel) {
// Ti.API.info('The cancel button was clicked');
// } else {
//
// Alloy.Globals.openSelectedTabFromSlideMenu(2);
//
// }
// });
// dialog.show();
// }
// // Reset the badge value
// if (e.badge > 0) {
// Ti.App.iOS.scheduleLocalNotification({
// date : new Date(new Date().getTime()),
// badge : -1
// });
// }
// });

Alloy.Globals.scheduledNotification = function(orderData,scheduleObj,msg) {
	Ti.API.info('scheduleObj '+JSON.stringify(scheduleObj));
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
		Ti.App.iOS.registerUserNotificationSettings({
			types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
		});

	}
	var pickupdate = orderData.pickup_date.replace(" ", "T");
	var notificationDate = new Date(pickupdate).getTime();
	var splitDate = orderData.pickup_date.split(" ");
	Ti.API.info('orderData.pickup_date ' + splitDate);
	var dateObj = splitDate[0].split("-");
	var timeObj =  splitDate[1].split(":");
	// Ti.API.info("Start");
	// Ti.API.info(JSON.stringify(dateObj));
	// Ti.API.info(dateObj[0] + " " + dateObj[1] + " " + dateObj[2]);
	// Ti.API.info(timeObj[0] + " " + timeObj[1] + " " + timeObj[2]);
	var finalDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
	// Ti.API.info('pickupdate = ' + pickupdate);
	// Ti.API.info('finalDate = ' + finalDate);
	// Ti.API.info('id   ==' + orderData.id);
	// Ti.API.info('finalDate.getTime() =' + finalDate.getTime());
	// Ti.API.info('currentTime = ' + new Date().getTime());
	// Ti.API.info('new Date(finalDate + (2000 *60)) =' + new Date(finalDate.getTime() + (2000 * 60)));
	var time = "";
	if(scheduleObj.type == "pickUp"){
		time = finalDate.getTime() - (5000 * 60);
	}else{
		time = finalDate.getTime() - (30000 * 60);
		//time = (new Date().getTime() + (1000 * 60));
	}
	if (finalDate.getTime() > new Date().getTime()) {
		Ti.API.info('In time');
		// The following code snippet schedules an alert to be sent within three seconds
		var notification = Ti.App.iOS.scheduleLocalNotification({
			// Alert will display 'slide to update' instead of 'slide to view'
			// or 'Update' instead of 'Open' in the alert dialog
			alertAction : "update",
			// Alert will display the following message
			alertBody : msg,
			// The badge value in the icon will be changed to 1
			badge : 1,
			// Alert will be sent in three seconds
			date : new Date(time),
			// The following sound file will be played
			sound : "/pickUp.wav",
			// The following URL is passed to the application
			userInfo : scheduleObj
		});   
	}
	
};

Ti.App.iOS.addEventListener('notification', function(e) {

	try {
		var name = "";
		var id = "";
		// Process custom data
		id = e.userInfo.order_id;
		name = e.userInfo.fullname.trim();
		if (e.userInfo && "url" in e.userInfo) {
			// id = e.userInfo.order_id;
			// name = e.userInfo.fullname;
			//httpGetRequest(e.userInfo.url);
		}
		Ti.API.info('e = ' + JSON.stringify(e));
		if (Alloy.Globals.isLogin) {
			Titanium.UI.iOS.setAppBadge(0);

			dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ["Show", "Hide"],
				message : "Order " + id + " for " + name + " will get pick up in 5 mins. Make sure it is ready",
				title : "Gongcha POS"
			});
			if (e.userInfo.type == "pickUp") {
				dialog.message = "Order #" + id + " for " + name + " will get pick up in 5 mins. Make sure it is ready";
			} else {
				dialog.message = "Order #" + id + " is scheduled to pick up in 30 minutes, please review and update status to preparing"
			}
			dialog.addEventListener('click', function(k) {
				if (k.index === k.source.cancel) {
					Ti.API.info('The cancel button was clicked');
				} else {
					if (e.userInfo.type == "pickUp") {
						Alloy.Globals.openSelectedTabFromSlideMenu(2);
					} else {
						Alloy.Globals.openSelectedTabFromSlideMenu(2);
						Alloy.Globals.fetchOrders("schedule", id);
					}

				}
			});
			dialog.show();
		}
		// Reset the badge value
		if (e.badge > 0) {
			Ti.App.iOS.scheduleLocalNotification({
				date : new Date(new Date().getTime()),
				badge : -1
			});
		}

	} catch(e) {
		Ti.API.info("In catch = " + e.message);

	}

}); 

Ti.App.iOS.addEventListener('remotenotificationaction', function(e) {
    // Switch for categories
   // alert(e);
});
Alloy.Globals.getSpecificParkedOrderDetail = function(id) {
	$.orderListTable.setData([]);
	tableData = [];
	add_to_cart_data = [];
	parkedOrderArray = [];
	var parkedOrderData = Alloy.Globals.DbManager.getParkedOrderDetail(id);
	Ti.API.info('parkedOrderData ' + JSON.stringify(parkedOrderData[0]));
	if (parkedOrderData[0].customer_name != null && parkedOrderData[0].customer_name != "NA") {
		$.addCustomerLbl.visible = false;
		$.profileImage.visible = true;
		$.centerVW.visible = true;
		$.userNameLbl.text = parkedOrderData[0].customer_name;
		$.contactLbl.text = parkedOrderData[0].customer_email;

		$.loyaltyBtn.image = "/images/Discount_btn_1.png";
		Alloy.Globals.customer_id = parkedOrderData[0].customer_id;
		Alloy.Globals.getLoyalyValueService(Alloy.Globals.customer_id);
		Alloy.Globals.name = parkedOrderData[0].customer_name;
		Alloy.Globals.email = parkedOrderData[0].customer_email;
		Alloy.Globals.mobile = parkedOrderData[0].customer_mobile;
		var discountData = JSON.parse(parkedOrderData[0].discount);
		$.loyaltyLbl.text = discountData.user_point + " Pts.";
		loyaltyObj.userPoints = discountData.user_point;
		if (discountData.hasOwnProperty('type')) {

			$.discountLbl.type = discountData.type;
			$.discountLbl.textData = discountData.textData;
			$.discountLbl.discountId = discountData.id;

			if ($.discountLbl.type == "Percentage") {
				$.discountLbl.text = "-$" + $.discountLbl.textData;
			} else if ($.discountLbl.type == "Amount") {
				$.discountLbl.text = "-$" + $.discountLbl.textData;
			} else {
				$.discountLbl.text = "-$" + 0;
				$.discountLbl.textData = 0;
			}
		}
	} else {
		$.addCustomerLbl.visible = true;
		$.profileImage.visible = false;
		$.centerVW.visible = false;
		$.userNameLbl.text = "NA";
		$.contactLbl.text = "NA";
		$.loyaltyLbl.text = "0 Pts.";
		$.loyaltyBtn.image = "/images/Add-customer.png";
		Alloy.Globals.name = "NA";
		Alloy.Globals.email = "NA";
		Alloy.Globals.mobile = 0;
		Alloy.Globals.customer_id = 0;
	}
	for (var i = 0; i < parkedOrderData[0].detail.length; i++) {
		var updateCFD_bool = false;
		if((parkedOrderData[0].detail.length -1) == i){
			updateCFD_bool = true;
		}
		Alloy.Globals.getOrderList(parkedOrderData[0].detail[i], "1", "parked",updateCFD_bool);
	};
};

function winFun(e) {
	if (e.source.name != 'tf') {
		searchBar.blur();

	}
}

// var devicesList = [];
// var storedCFDPeripheral = Ti.App.Properties.getObject("cfdPeripheral");
// function connectToCFD() {
	// if (Ti.App.Properties.getObject("cfdPeripheral")) {
			// Ti.API.info('didDiscoverPeripheral1test');
			// Ti.API.info('centralManager ' + centralManager);
			// centralManager.startScan();
// 
			// centralManager.addEventListener('didDiscoverPeripheral', function(e) {
				// if (e.advertisementData.kCBAdvDataLocalName) {
					// Ti.API.info('didDiscoverPeripheral1');
					// Ti.API.info(e);
// 
					// devicesList.push(e);
					// Ti.API.info('devicesList =' + JSON.stringify(devicesList));
					// connectDevice();
				// }
			// });
// 
		// }
	// }
	
// var devicesList = [];
// var storedPeripheral = Ti.App.Properties.getObject("peripheral");
// function connectToPrinter() {
	// if (Ti.App.Properties.getString("receiptPrinterMode") == "receiptViaNetwork") {
		// if (Ti.App.Properties.getObject("receiptNetworkPrinter")) {
			// var Networkdevice = Ti.App.Properties.getObject("receiptNetworkPrinter");
			// var result = epos.connect(Networkdevice.target);
// 
			// if (result == false) {
				// alert("Failed to print");
			// }
		// }
	// } else {
		// if (Ti.App.Properties.getObject("peripheral")) {
			// Ti.API.info('didDiscoverPeripheral1test');
			// Ti.API.info('centralManager ' + centralManager);
			// centralManager.startScan();
// 
			// centralManager.addEventListener('didDiscoverPeripheral', function(e) {
				// if (e.advertisementData.kCBAdvDataLocalName) {
					// Ti.API.info('didDiscoverPeripheral1');
					// Ti.API.info(e);
// 
					// devicesList.push(e);
					// Ti.API.info('devicesList =' + JSON.stringify(devicesList));
					// connectDevice();
				// }
			// });
// 
		// }
	// }
	// if (Ti.App.Properties.getObject("labelprinterDevice")) {
		// var Networkdevice = Ti.App.Properties.getObject("labelprinterDevice");
		// var result = epos.connect(Networkdevice.target);
// 
		// if (result == false) {
			// alert("Failed to print");
		// }
// 
	// }
// }
// 
// 
// setTimeout(function() {
	// Ti.API.info('Finding');
	// connectToPrinter();
// }, 1000);


// function connectDevice() {
	// try {
		// for (var i = 0; i < devicesList.length; i++) {
			// if (devicesList[i].advertisementData.hasOwnProperty("kCBAdvDataServiceUUIDs")) {
				// if (devicesList[i].advertisementData.kCBAdvDataServiceUUIDs[0] == storedPeripheral[0] && devicesList[i].advertisementData.kCBAdvDataServiceUUIDs[1] == storedPeripheral[1]) {
					// var device = devicesList[i];
					// Ti.API.info('devicesList[i] =' + JSON.stringify(devicesList[i]));
					// centralManager.connectPeripheral(device.peripheral);
					// //centralManager.stopScan();
				// }
// 
			// }
		// }
	// } catch(e) {
		// Ti.API.info("In catch = " + e.message);
// 
	// }
// }

// centralManager.addEventListener('didConnectPeripheral', function(e) {
	// Ti.API.info('didConnectPeripheral');
	// Ti.API.info(e);
	// Ti.API.info('here***********');
// 
	// // Now you can add event listener to the found peripheral.
	// // Make sure to handle event listeners properly and remove them
	// // when you don't need them anymore
 // try{
	// myPeripheral = e.peripheral;
	// Alloy.Globals.myPeripheral = myPeripheral;
	// Alloy.Globals.myPeripheralName = myPeripheral.name;
	// Ti.API.info("Peripheral name = " + myPeripheral.name);
	// Ti.API.info("Peripheral rssi = " + myPeripheral.rssi);
	// Ti.API.info("Peripheral state = " + myPeripheral.state);
	// Ti.API.info("Peripheral services = " + myPeripheral.services);
// 
	// var uuids = [];
// 
	// for (var i = 0; i < devicesList.length; i++) {
		// if (devicesList[i].peripheral == myPeripheral) {
			// devicesList[i].connected = true;
// 
			// Ti.API.info('advertisementData.kCBAdvDataServiceUUIDs = ' + devicesList[i].advertisementData.kCBAdvDataServiceUUIDs.toString());
			// // Ti.API.info("advertisementData.kCBAdvDataServiceUUIDs type of = " + typeof devicesList[i].advertisementData.kCBAdvDataServiceUUIDs);
			// var tempuuids = devicesList[i].advertisementData.kCBAdvDataServiceUUIDs.toString().split(",");
			// for (var i = 0; i < tempuuids.length; i++) {
				// uuids.push(tempuuids[i].toString());
			// };
		// }
	// }
	// Alloy.Globals.myPeripheral.addEventListener('didDiscoverServices', function(e) {
		// Ti.API.info('didDiscoverServices');
		// Ti.API.info(e);
// 
		// Ti.API.info('peripheral has ' + e.peripheral.services.length + ' service(s)');
		// var services = e.peripheral.services;
// 
		// for (var i = 0; i < services.length; i++) {
			// Ti.API.info('service characteristics ' + JSON.stringify(services));
			// e.peripheral.discoverCharacteristicsForService({
				// characteristics : [],
				// service : services[i]
			// });
		// }
	// });
// 
	// Alloy.Globals.myPeripheral.addEventListener('didDiscoverCharacteristicsForService', function(e) {
		// Ti.API.info('didDiscoverCharacteristicsForService');
		// characteristics = e.service.characteristics;
		// var obj = {};
		// Alloy.Globals.characteristics = characteristics;
		// Ti.API.info("End**");
	// });
// 
	// Alloy.Globals.myPeripheral.addEventListener('didUpdateValueForCharacteristic', function(e) {
		// Ti.API.info('didUpdateValueForCharacteristic');
		// Ti.API.info(e);
	// });
// 
	// Ti.API.info("uuids *****************= " + uuids);
	// if (uuids) {
		// Alloy.Globals.myPeripheral.discoverServices("E7810A71-73AE-499D-8C15-FAA9AEF0C3F2");
	// }
 // }catch(e){ 
	// Ti.API.info("Error didConnectPeripheral "+e.message);
 // }
// });
// 
// centralManager.addEventListener('didDisconnectPeripheral', function(e) {
	// Ti.API.info('didDisconnectPeripheral');
	// Ti.API.info(e);
// 
	// for (var i = 0; i < devicesList.length; i++) {
		// if (devicesList[i].peripheral == e.peripheral) {
			// devicesList[i].connected = false;
			// Ti.App.Properties.setObject("peripheral", "");
		// }
	// }
// });

/*
 * Right Menu Grid View creation code
 */

$.loyaltyGrid.init({
	columns : 3,
	space : 12,
	gridBackgroundColor : '"#EDECF2',
	itemHeightDelta : 0,
	itemBackgroundColor : '#fff',
	itemBorderColor : 'transparent',
	itemBorderWidth : 0,
	itemBorderRadius : 0,
	from : "loyalty"
});

var loyaltyTemp = [];


function renderLoyltyGrid(loylty_data) {
	loyaltyTemp = [];
	if (loylty_data.length <= 0) {
		$.loyalyHeaderLbl.text = "No loyalty offers available";
	} else {
		$.loyalyHeaderLbl.text = L('loyalty_txt');
	}

	for (var x = 0; x < loylty_data.length; x++) {
		var view = Ti.UI.createView({
			left : 0,
			right : 0,
			height : Ti.UI.FILL,
			backgroundColor : "white",
			layout : "vertical"
		});

		var title = Ti.UI.createLabel({
			top : 8,
			//left : gridImageViewHeight + 8 + 6,
			width : "94%",
			textAlign : "center",
			font : {
				fontSize : 16,
				//fontWeight:"semibold"
				//fontFamily : "Montserrat-Light"
			},
			text : loylty_data[x].title,
			color : "black",
			height : 20,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		view.add(title);

		var pointText = loylty_data[x].loyalty_points + ' points';
		var attr = Titanium.UI.createAttributedString({
			text : pointText,
			attributes : [{
				type : Titanium.UI.ATTRIBUTE_FONT,
				value : {

					fontSize : 12,
					//fontFamily : "Montserrat-Light"

				},
				range : [pointText.indexOf('points'), ('points').length]
			}]
		});

		var pointsLbl = Ti.UI.createLabel({
			top : 8,
			width : "94%",
			textAlign : "center",
			font : {
				fontSize : 16,
				fontFamily : "Montserrat-Regular"
			},
			attributedString : attr,
			color : "#c32032",
			height : 20,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		view.add(pointsLbl);

		var imgVW = Ti.UI.createView({
			top : 10,
			width : gridImageViewHeight,
			height : gridImageViewHeight,
			//borderWidth : 1,
			//borderColor : "#EDECF2",
		});
		view.add(imgVW);

		var img = Ti.UI.createImageView({
			image : (loylty_data[x].loyalty_image != "") ? loylty_data[x].loyalty_image : "/images/defaultImg.png",
			defaultImage : "/images/defaultImg.png",
			height : "90%"
		});
		imgVW.add(img);

		var bottomVW = Ti.UI.createView({
			top : 10,
			height : Ti.UI.SIZE,

		});
		view.add(bottomVW);
		var qtyLbl = Ti.UI.createLabel({
			width : "46%",
			textAlign : "left",
			font : {
				fontSize : 15,
				fontWeight : "semibold"
				//	fontFamily : "Montserrat-Regular"
			},
			left : 5,
			text : "Qty: " + loylty_data[x].quantity,
			color : "#5D2300",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		bottomVW.add(qtyLbl);

		var valueLbl = Ti.UI.createLabel({
			width : "46%",
			textAlign : "right",
			font : {
				fontSize : 15,
				fontWeight : "semibold"
				//fontFamily : "Montserrat-Regular"
			},
			right : 5,
			text : "Value: $" + loylty_data[x].value,
			color : "#5D2300",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		bottomVW.add(valueLbl);
		//THIS IS THE DATA THAT WE WANT AVAILABLE FOR THIS ITEM WHEN onItemClick OCCURS
		var values = {
			detail : loylty_data[x],
		};

		//NOW WE PUSH TO THE ARRAY THE VIEW AND THE DATA
		loyaltyTemp.push({
			view : view,
			data : values
		});

	};

	$.loyaltyGrid.addGridItems(loyaltyTemp);
	var focus = true;

	$.loyaltyGrid.setOnItemClick(function(e) {
		Ti.API.info(JSON.stringify(e.source.data.detail));
		Ti.API.info(loyaltyObj.userRemainingPoints);
		if ($.discountLbl.discountId == -1 || $.discountLbl.discountId > 0 || isDiscountApply()) {
			Alloy.Globals.Notifier.show("You can't apply loyalty because discount already applied");
			return;
		}
		if (loyaltyObj.userRemainingPoints == -1 || loyaltyObj.userRemainingPoints >= parseInt(e.source.data.detail.loyalty_points)) {
			loyaltyObj.loyaltyID = e.source.data.detail.id;
			loyaltyObj.customLoyaltyID = Math.floor(Math.random() * 50000);
			loyaltyObj.loyaltyPoints = parseFloat(e.source.data.detail.loyalty_points);
			loyaltyObj.loyaltyValue = e.source.data.detail.value;
			loyaltyObj.loyaltyQty = parseInt(e.source.data.detail.quantity);
			if (e.source.data.detail.quantity != "1") {

				setLoyaltyOffer(e.source.data.detail);
				$.addToCartBtn.visible = false;
				$.loyaltyDetailVW.visible = true;
			} else {
				loyaltyObj.loyaltyVW = "";
				$.loyaltyVW.visible = false;
				$.subCategoryVW.visible = false;
				$.categoryVW.visible = true;
			}
		} else {
			//Alloy.Globals.Notifier.show("You have " + loyaltyObj.userRemainingPoints + " remaining loyalty points only");
			Alloy.Globals.Notifier.show(L('loyalty_validation_one'));
		}

	});

}


//function for back to loyalty list screen from category back button
function backFunc() {
	$.loyaltyVW.visible = true;
	$.categoryVW.visible = false;
}

//function for return on Loyalty List screen
function backToLoyaltyFunc() {
	loyaltyObj.customLoyaltyID = "";
	loyaltyObj.loyaltyID = "";
	loyaltyObj.loyaltyVW = "";
	loyaltyObj.loyaltyPoints = 0;
	loyaltyObj.loyaltyQty = 0;
	loyaltyObj.loyaltyArray = [];
	$.loyaltyDetailVW.visible = false;
}

//function for add loyalty selected product in cart
function addToCartLoyaltyFunc() {
	if($.discountLbl.discountId == -1 || $.discountLbl.discountId >0 || isDiscountApply()){
		Alloy.Globals.Notifier.show("You can't apply loyalty because discount already applied");
		return;
	}
	for (var i = 0; i < loyaltyObj.loyaltyArray.length; i++) {
		var updateCFD_bool = false;
		if((loyaltyObj.loyaltyArray.length -1) == i){
			updateCFD_bool = true;
		}
		 
		Alloy.Globals.getOrderList(loyaltyObj.loyaltyArray[i].selectedMenu, "1","",updateCFD_bool);
	};
	$.loyaltyVW.visible = true;
	$.loyaltyDetailVW.visible = false;
	loyaltyObj.customLoyaltyID = "";
	loyaltyObj.loyaltyID = "";
	loyaltyObj.loyaltyVW = "";
	loyaltyObj.loyaltyPoints = 0;
	loyaltyObj.loyaltyQty = 0;
	loyaltyObj.loyaltyArray = [];

	$.addToCartBtn.visible = false;
	// setTimeout(function() {
	// Alloy.Globals.getTotal();
	// }, 1000);
}
function isDiscountApply(){
	var flag = false;
	for (var i = 0; i < add_to_cart_data.length; i++) {
		Ti.API.info('add_to_cart_data[i].discountVW.isDiscountApply '+ add_to_cart_data[i].discountVW.isDiscountApply)
			if(add_to_cart_data[i].discountVW.isDiscountApply){
				flag = true;
			}
	};
	return flag;
}
function isLoyaltyApplied(){
	var flag = false;
	for (var i = 0; i < add_to_cart_data.length; i++) {
			if(add_to_cart_data[i].loyaltyID != "" && add_to_cart_data[i].loyaltyID != "0"){
				flag = true;
				break;
			}
	};
	return flag;
}

function setLoyaltyOffer(detail) {
	$.scrollVWLoyalty.removeAllChildren();
	$.drinkTitleLbl.text = detail.title + " For";
	$.pointsTitleLbl.text = detail.loyalty_points + " points";
	$.drinkQtyLbl.text = "Qty: " + detail.quantity;
	$.drinkValueLbl.text = "Value: $" + detail.value;
	$.drinkImage.image = detail.loyalty_image;

	var k = 1;
	for (var i = 0; i < parseInt(detail.quantity); i++) {
		var vw = Ti.UI.createView({
			top : 15,
			left : 0,
			height : "16%",
			backgroundColor : "white",
			width : "50%",
			borderColor : "#D5D2D4",
			borderWidth : 1,
			index : i,
			detail : detail
		});
		var drinkImgVW = Ti.UI.createView({
			left : 0,
			height : Ti.UI.FILL,
			width : "25%",
			touchEnabled : false,
		});
		vw.add(drinkImgVW);

		var img = Ti.UI.createImageView({

			defaultImage : "/images/cup.png",
			image : detail.loyalty_image,
			touchEnabled : false,
		});
		drinkImgVW.add(img);
		var separatorLine = Ti.UI.createView({
			height : "94%",
			left : "25%",
			width : 2,
			backgroundColor : "#f6f6f6",
			touchEnabled : false,
		});
		vw.add(separatorLine);

		var textLbl = Ti.UI.createLabel({
			font : {
				fontSize : 18,
				fontFamily : "Roboto-Medium"
			},
			color : "#B8B9BB",
			left : "29%",
			right : 6,
			height : "75%",
			text : "Select " + detail.title + " " + (k++),
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			touchEnabled : false,
		});
		vw.add(textLbl);
		vw.addEventListener("click", function(e) {
			if ($.discountLbl.discountId == -1 || $.discountLbl.discountId > 0 || isDiscountApply()) {
				Alloy.Globals.Notifier.show("You can't apply loyalty because discount already applied");
				return;
			}
			if (loyaltyObj.loyaltyID != e.source.detail.id) {
				loyaltyObj.loyaltyID = e.source.detail.id;
				loyaltyObj.customLoyaltyID = Math.floor(Math.random() * 50000);
			}
			loyaltyObj.loyaltyPoints = parseFloat(e.source.detail.loyalty_points);
			loyaltyObj.loyaltyValue = e.source.detail.value;
			loyaltyObj.loyaltyQty = parseInt(e.source.detail.quantity);
			loyaltyObj.selectedDrink = e.source.index;
			loyaltyObj.loyaltyVW = e.source;
			$.loyaltyVW.visible = false;
			$.subCategoryVW.visible = false;
			$.categoryVW.visible = true;
			/*
			 if (e.source.backgroundColor != "#29150F") {

			 } else {
			 Alloy.Globals.Notifier.show("You are already added loyalty for this item");
			 }*/

			Ti.API.info("loyaltyObj1 " + JSON.stringify(loyaltyObj));

		});
		var loyObj = {};
		loyObj.selectedView = vw;
		loyObj.selectedMenu = null;
		loyaltyObj.loyaltyArray.push(loyObj);
		$.scrollVWLoyalty.add(vw);
	};
	Ti.API.info('*** ' + JSON.stringify(loyaltyObj.loyaltyArray));

}


Alloy.Globals.getLoyalyValueService = function(customer_id) {

	var SERVICE_GET_LOYALTY_VALUE_LIST = Alloy.Globals.Constants.SERVICE_GET_LOYALTY_VALUE_LIST;
	if (Ti.Network.online) {
		var obj = {};
		obj.customer_id = customer_id;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_GET_LOYALTY_VALUE_LIST, getLoyalyValueServiceCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_GET_LOYALTY_VALUE_LIST);
	} else {

		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

};

/*
 * Getting response of getLoyalyValueService in the callback function
 */
function getLoyalyValueServiceCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response  ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {

				if (response.response_code == '1') {
					if (response.result.length > 0) {
						$.notificationCountVW.visible = true;
						$.notificationCountLbl.text = response.result.length;
						renderLoyltyGrid(response.result);
					} else {
						renderLoyltyGrid([]);
					}
				} else {
					Alloy.Globals.Notifier.show(response.message);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error getLoyalyValueServiceCallback service : ' + e.message);
			tracker.addException({
				description : "POSDashboard5: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}

//Declared variable checkoutObj for send data to checkout screen
var checkoutObj;
//Web Service for send OTP in case of any discount applied on order and on api success goto checkout screen
function sendOTPForCheckout(checkoutDetail) {
	checkoutObj = checkoutDetail;
	var SERVICE_SEND_OTP_CHECKOUT = Alloy.Globals.Constants.SERVICE_SEND_OTP_CHECKOUT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var obj = {};
		obj.employee_id = Alloy.Globals.employee_id;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		obj.otp_type = 1;
		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_SEND_OTP_CHECKOUT, sendOTPForCheckoutCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_SEND_OTP_CHECKOUT);
	} else {

		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

};

/*
 * Getting response of sendOTPForCheckoutCallback in the callback function
 */
function sendOTPForCheckoutCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response  ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {

				if (response.response_code == '1') {
					checkoutObj.otp = response.result.user_otp;
					var otpScreen = Alloy.createController("AddCustomerOTPDialog", checkoutObj).getView();
					otpScreen.open();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error sendOTPForCheckoutCallback service : ' + e.message);
			tracker.addException({
				description : "POSDashboard6: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}

Alloy.Globals.printOrderLableFun = function(selectedorderDetails, quantity) {
	Ti.API.info('selectedorderDetails = '+ JSON.stringify(selectedorderDetails));
	for (var i = 0; i < selectedorderDetails.length; i++) {
		Ti.API.info('heree in for loop');
		var modifierStr = "";
		var isLastItem = 0;
		var isFirstItem = 0;
		var itemCounterValue = i + 1 + "/" + selectedorderDetails.length;
		var menuDetail = JSON.parse(selectedorderDetails[i].order_details);
		Ti.API.info('menu Detail = ' + JSON.stringify(menuDetail));
		for (var j = 0; j < menuDetail.length; j++) {
			Ti.API.info('menu Detail = ' + menuDetail[j]);
			for (var k = 0; k < menuDetail[j].option.length; k++) {
				if (j == 0 && k == 0) {
					modifierStr = modifierStr + "" + menuDetail[j].option[k].modifier_name;
				} else {
					modifierStr = modifierStr + "," + "" + menuDetail[j].option[k].modifier_name;
				}
			}
		}

		Ti.API.info('modifierStr =' + modifierStr);
		var buffer = Ti.createBuffer({
			length : 3
		});
		buffer[0] = 0x1B;
		buffer[1] = 0x1D;
		buffer[2] = 48;
		var quantity = parseInt(selectedorderDetails[i].quantity_purchased);
		for (var j = 0; j < quantity; j++) {
			if (i + 1 == selectedorderDetails.length && j + 1 == quantity) {
				isLastItem = 1;
			} else {
				isLastItem = -1;
			}
			//Alloy.Globals.PrintLabel.printLabelFun(selectedorderDetails[i].menu_name + " " + selectedorderDetails[i].serving_name.charAt(0), modifierStr, itemCounterValue, isLastItem, selectedorderDetails[i],(selectedorderDetails[i].sale_id).toString());
			if (i == 0 && j == 0) {
				isFirstItem = 1;
			} else {
				isFirstItem = -1;
			}
			Alloy.Globals.PrintLabel.printLabelFun(selectedorderDetails[i].menu_name + " " + selectedorderDetails[i].serving_name.charAt(0), modifierStr, itemCounterValue, isLastItem, selectedorderDetails[i], selectedorderDetails[i].order_token, isFirstItem); 

		}
	}
};



function sendData() {
	 
	// var stringToSend = JSON.stringify(transferStr).substring(sendIndex, sendDataLength);
// 	
	// Ti.API.info('stringToSend = '+stringToSend);
	// Ti.API.info('stringToSend.length = '+stringToSend.length);
	// Ti.API.info('sendDataLength = '+sendDataLength);
	// if (stringToSend.length >= 250) {
// 
	// var stringToSend = JSON.stringify(transferStr).substring(sendIndex, sendDataLength);
		// var buffer = Ti.createBuffer({
			// value : stringToSend
		// });
		// Alloy.Globals.cfdPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), Alloy.Globals.cfdCharacteristics, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		// Ti.API.info('last sendIndex = ' + sendIndex);
		// Ti.API.info('last sendDataLength = ' + sendDataLength);
		// sendIndex = sendIndex + 250;
		// sendDataLength = sendDataLength + 250;
		// Ti.API.info('sendIndex = ' + sendIndex);
		// Ti.API.info('sendDataLength = ' + sendDataLength);
		// Ti.API.info('stringToSend = ' + stringToSend);
	// } else {
		// Ti.API.info('EOM')
		// Ti.API.info('end Time = '+ new Date());
		// stringToSend = JSON.stringify(transferStr).substring(sendIndex, sendDataLength);
		// stringToSend = stringToSend + "EOM";
		// var buffer = Ti.createBuffer({
			// //value : stringToSend
			// value : "Hello World"
		// });
		// Alloy.Globals.cfdPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), Alloy.Globals.cfdCharacteristics, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		// sendIndex = 0;
		// sendDataLength = 250;
	// }
	
	
	
	var buffer = Ti.createBuffer({
			//value : stringToSend
			value : "Hello World"
		});
		Alloy.Globals.cfdPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), Alloy.Globals.cfdCharacteristics, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		
}



// centralManager.addEventListener('didDisconnectPeripheral', function(e) {
	// Ti.API.info('didDisconnectPeripheral');
	// Ti.API.info(e);
// 
	// connectToPrinter();
	// // for (var i = 0; i < devicesList.length; i++) {
		// // if (devicesList[i].peripheral == e.peripheral) {
			// // devicesList[i].connected = false;
			// // connectToCFD();
		// // }
	// // }
// });

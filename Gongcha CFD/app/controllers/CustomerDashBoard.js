// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
// Arguments passed into this controller can be accessed via the `$.args` object directly or:

var finalString = "";
var tableData = [];
var finalJson = [];
var tempJSON = "";
var tax = 0;
var parsable;
var getAdvertismentInterval;

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

/*
 * Window open Function
 */
function winOpenFun() {
	// initializePeripheral();
	bonjourService.publish();
	getAdvertismentImagesService();
	getAdvertismentInterval = setInterval(function(e) {
		getAdvertismentImagesService();
	}, 300000);

}

function init() {
	Titanium.App.idleTimerDisabled = true;
	Ti.API.info('Ti.App.Properties.setObject("loginResponse" ) ' + Ti.App.Properties.getObject("loginResponse").result[0].store_name);
	$.locationAddLbl.text = Ti.App.Properties.getObject("loginResponse").result[0].store_name;
}

init();
/*
 * Function for Load Image in Scrollable view
 */
var tableData = [];
var data = [{
	"id" : 15045,
	"menu_id" : 133,
	"quantity" : 1,
	"menu_name" : "MF PANDA ",
	"menu_image" : "https://www.cdnsolutionsgroup.com/gongcha_st/public/uploads/menu_pics/drink-qq-panda-milk-tea.jpg",
	"category_id" : 90,
	"category_name" : "Panda Series",
	"itemCustomizedPrice" : 0,
	"serving_id" : 29,
	"serving_name" : "Jug",
	"serving_price" : 6,
	"loyaltyID" : "",
	"loyaltyValue" : 0,
	"loyaltyPoints" : 0,
	"customLoyaltyID" : "",
	"customizationOpt" : [{
		"id" : 0,
		"modifier_group_id" : 0,
		"modifier_group_name" : "Cup Size",
		"selection_time" : "Single",
		"is_required" : "1",
		"option" : [{
			"id" : 1234,
			"serving_id" : 29,
			"modifier_group_id" : 0,
			"price" : 6,
			"modifier_price" : 6,
			"serving_name" : "Jug",
			"serving_sort" : 2,
			"quantity" : 1,
			"modifier_name" : "Jug",
			"modifier_prefix_name" : "",
			"modifier_apply_counter" : 1,
			"selection_time" : "Single",
			"selected" : true,
			"count" : 0,
			"enabled" : true
		}]
	}, {
		"id" : 1016,
		"modifier_group_id" : 1016,
		"modifier_group_name" : "Tea Basic",
		"selection_time" : "Multiple",
		"is_required" : "",
		"option" : [{
			"id" : 216,
			"modifier_id" : 216,
			"modifier_name" : "Oolong",
			"modifier_group_id" : 74,
			"modifier_sort" : 0,
			"modifier_apply_counter" : 3,
			"modify_with" : "",
			"count" : 1,
			"modifier_price" : 0.5,
			"modifier_prefix_name" : "",
			"quantity" : 1,
			"selected" : true,
			"enabled" : true,
			"modifier_serving" : [{
				"serving_id" : 27,
				"serving_name" : "Medium",
				"menu_price" : 0.2,
				"price" : 0.2,
				"prefixData" : []
			}, {
				"serving_id" : 28,
				"serving_name" : "Large",
				"menu_price" : 0.3,
				"price" : 0.3,
				"prefixData" : []
			}, {
				"serving_id" : 29,
				"serving_name" : "Jug",
				"menu_price" : 0.5,
				"price" : 0.5,
				"prefixData" : []
			}],
			"modifier_prefix_id" : ""
		}]
	}],
	"discountVW" : {
		"horizontalWrap" : true,
		"visible" : true,
		"touchEnabled" : true,
		"priceObj" : {
			"horizontalWrap" : true,
			"visible" : true,
			"touchEnabled" : true,
			"font" : {
				"fontFamily" : "Montserrat-Regular",
				"fontSize" : 13
			},
			"ellipsize" : 4,
			"color" : "#000000",
			"loyaltyPoints" : 0,
			"textAlign" : "right",
			"right" : 0,
			"height" : "60%",
			"width" : "18%",
			"customLoyaltyID" : "",
			"loyaltyValue" : 0,
			"loyaltyID" : "",
			"modifiertotal" : 0.5,
			"totalPrice" : 6.5,
			"textData" : 6.5,
			"text" : "$6.50"
		},
		"quantity" : 1,
		"discount_type" : 0,
		"serving_name" : "Jug",
		"category_id" : 90,
		"menu_id" : 133,
		"discountId" : -1,
		"menu_name" : "MF PANDA ",
		"apply_option" : -1,
		"right" : "12%",
		"height" : 0,
		"isDiscountApply" : false,
		"width" : "74%",
		"serving_price" : 6,
		"serving_id" : 29,
		"discount_rate" : 0
	}
}];
var images = ["/images/slider_img.png", "/images/slider_img.png", "/images/slider_img.png", "/images/slider_img.png", "/images/slider_img.png", "/images/slider_img.png"];
var Imagedata = [];

function loadImages(imageData) {
	Imagedata = [];
	if (imageData != null) {

		for (var i = 0; i < imageData.length; i++) {
			// Ti.API.info('Images : ' + imageData[i]);
			var view = Ti.UI.createView({
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				top : 0,
				image : imageData[i]
			});

			var img = Ti.UI.createImageView({
				hires : true,
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				//defaultImage : "/images/no_img.png"
			});

			if (images[i] == null) {
				img.image = "/images/slider_img.png";
			} else {
				img.image = imageData[i].ad_image;
			};
			view.add(img);
			Imagedata.push(view);
		}

	} else {
		//Ti.API.info('No IMage ');

		var view = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			backgroundColor : "#3B2D2C"
		});
		var img = Ti.UI.createImageView({
		});

		img.image = "/images/gongchaLogo.png";
		view.add(img);
		Imagedata.push(view);

	}
	$.slideImage.views = Imagedata;

}

var sliderInterval = null;
function openFun() {
	try {

		var ar = $.slideImage.getViews();
		// Ti.API.info("ARAAAA-- " + ar);

		var t = 0;
		if (sliderInterval) {
			clearInterval(sliderInterval);
			sliderInterval = null;
		}
		sliderInterval = setInterval(function(e) {
			t = $.slideImage.getCurrentPage();
			if ((t + 1) >= ar.length) {
				t = 0;

				$.slideImage.scrollToView(t);
			} else {
				$.slideImage.moveNext();
			}

			//t++;

		}, 5000);
	} catch(e) {

	}
}

/*
 * Function for calculate final subTotal including Tax plus discount
 */
var loyPoints = 0;
var loyVal = 0;
Alloy.Globals.isUpdateAvailable = false;
Alloy.Globals.getTotal = function() {
	var total = 0;
	var loyId = 0;
	loyPoints = 0;
	loyVal = 0;
	for (var i = 0; i < tableData.length; i++) {
		Ti.API.info('hereree');
		Ti.API.info('tableData[i].getChildren()[0].getChildren()[2].textData ' + tableData[i].getChildren()[0].getChildren()[2].id);
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
		// if (loyPoints != 0) {
		// loyaltyObj.userRemainingPoints = loyaltyObj.userPoints - loyPoints;
		// } else {
		// loyaltyObj.userRemainingPoints = -1;
		// }
	} else {
		//loyaltyObj.userRemainingPoints = -1;
	}
	//Ti.API.info('loyaltyObj.userRemainingPoints ' + loyaltyObj.userRemainingPoints);

	//checkLoyaltyApplied(loyPoints, loyVal);

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
		$.discountLbl.discountId = -1;
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
	//Alloy.Globals.isUpdateAvailable = true;

};
var rowHeightHeader = Titanium.Platform.displayCaps.platformHeight * 0.078;
var rowHeight = Titanium.Platform.displayCaps.platformHeight * 0.078;
Alloy.Globals.getOrderList = function(finalJson, isNew, from) {
	itemDetail = finalJson.cartDetail;
	tableData = [];
	for (var i = 0; i < itemDetail.length; i++) {
		var row = Ti.UI.createTableViewRow({
			color : 'black',
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
			detail : itemDetail[i],
			height : Ti.UI.SIZE,
		});

		var mainView = Ti.UI.createView({
			id : "1",
			top : 0,
			//left : "4%",
			height : rowHeightHeader,
			width : "96%",
			layout : "horizontal",
		});
		row.add(mainView);

		var title = Ti.UI.createLabel({
			id : "2",
			color : '#000000',
			text : itemDetail[i].menu_name,
			left : 0,
			width : "36%",
			font : {
				fontSize : 16,
				fontFamily : "Montserrat-Regular",
			},
			height : "75%",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
		});
		mainView.add(title);

		var qtyView = Ti.UI.createView({
			id : "3",
			height : Ti.UI.FILL,
			width : "45%",
			left : 3,
		});
		mainView.add(qtyView);

		var qtyText = Ti.UI.createLabel({

			id : "4",
			color : '#000000',
			text : itemDetail[i].quantity,
			width : "30%",
			backgroundColor : "white",
			font : {
				fontSize : 16,
				fontFamily : "Montserrat-Regular",
			},
			height : Ti.UI.FILL,
			textAlign : "center",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
		});
		qtyView.add(qtyText);

		var priceText = Ti.UI.createLabel({
			height : "60%",
			color : '#000000',
			text : "$" + toFixed(Number(itemDetail[i].x) * parseInt(itemDetail[i].quantity)),
			textData : toFixed(itemDetail[i].serving_price * parseInt(itemDetail[i].quantity)),
			width : "18%",
			right : 0,
			font : {
				fontSize : 16,
				fontFamily : "Montserrat-Regular",
			},
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			textAlign : "right",
			modifiertotal : 0,
			customLoyaltyID : itemDetail[i].customLoyaltyID,
			loyaltyID : itemDetail[i].loyaltyID,
			loyaltyValue : itemDetail[i].loyaltyValue,
			loyaltyPoints : itemDetail[i].loyaltyPoints,
		});
		mainView.add(priceText);

		var modifierGroupView = Ti.UI.createView({
			top : rowHeight + 2,
			height : Ti.UI.SIZE,
			layout : "vertical"
		});
		row.add(modifierGroupView);

		for (var j = 0; j < itemDetail[i].customizationOpt.length; j++) {
			for (var k = 0; k < itemDetail[i].customizationOpt[j].option.length; k++) {
				var modifierView = Ti.UI.createView({
					top : 3,
					height : 30,
					width : "96%",
				});
				modifierGroupView.add(modifierView);
				var modifierGropuName = Ti.UI.createLabel({
					color : '#585858',
					left : 0,
					width : "42%",
					font : {
						fontSize : 16,
						fontFamily : "Montserrat-Light",
					},
					height : 15,
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

				});
				if (k == 0) {
					modifierGropuName.text = itemDetail[i].customizationOpt[j].modifier_group_name;
				} else {
					modifierGropuName.text = "";
				}
				modifierView.add(modifierGropuName);
				var modifierName = Ti.UI.createLabel({
					color : '#585858',
					left : "42%",
					width : "33.80%",
					font : {
						fontSize : 16,
						fontFamily : "Montserrat-Light",
					},
					height : 15,
					textAlign : "center",
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
				});
				modifierView.add(modifierName);

				if (itemDetail[i].customizationOpt[j].option[k].modifier_prefix_name != "") {
					modifierName.text = itemDetai[i].customizationOpt[j].option[k].modifier_prefix_name + " " + itemDetail[i].customizationOpt[j].option[k].modifier_name;
				} else {
					modifierName.text = itemDetail[i].customizationOpt[j].option[k].modifier_name;
				}

				var totolModifierprice = Ti.UI.createLabel({
					color : '#585858',
					text : "$" + toFixed(Number(itemDetail[i].customizationOpt[j].option[k].quantity) * Number(itemDetail[i].customizationOpt[j].option[k].modifier_price)).toFixed(2),
					textData : itemDetail[i].customizationOpt[j].option[k].quantity * itemDetail[i].customizationOpt[j].option[k].modifier_price,
					right : 0,
					width : "24%",
					font : {
						fontSize : 16,
						fontFamily : "Montserrat-Light",
					},
					height : 15,
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
					textAlign : "right"
				});
				modifierView.add(totolModifierprice);
				var sepVw = Ti.UI.createView({
					bottom : 0,
					height : 1,
					backgroundColor : "#E9E9E9"
				});
				if (k == itemDetail[i].customizationOpt[j].option.length - 1) {
					modifierView.add(sepVw);
				}
				if (j != 0) {
					priceText.modifiertotal = priceText.modifiertotal + totolModifierprice.textData;
				}
			};
		};

		priceText.totalPrice = priceText.modifiertotal + itemDetail[i].serving_price;
		priceText.textData = priceText.totalPrice * itemDetail[i].quantity;
		priceText.text = "$" + (priceText.textData).toFixed(2);

		var discountVW = Ti.UI.createView({
			width : "96%",
			height : 24,
			isDiscountApply : false,
			category_id : itemDetail.category_id,
			menu_id : itemDetail[i].menu_id,
			serving_id : itemDetail[i].serving_id,
			priceObj : priceText,
			discount_type : 0,
			discount_rate : 0,
			quantity : itemDetail[i].quantity,
			apply_option : -1,
			discountId : -1,
			menu_name : itemDetail[i].menu_name,
			serving_name : itemDetail[i].serving_name,
			serving_price : itemDetail[i].serving_price,
		});

		var discountName = Ti.UI.createLabel({
			color : '#585858',
			top : 5,
			text : "Discount",
			left : 0,

			width : "42%",
			font : {
				fontSize : 16,
				fontFamily : "Montserrat-Light",
			},
			height : 20,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		discountVW.add(discountName);
		var discountPrice = Ti.UI.createLabel({
			color : '#585858',
			top : 5,
			text : "$0",
			textData : 0,
			right : 0,
			width : "24%",
			font : {
				fontSize : 16,
				fontFamily : "Montserrat-Light",
			},
			height : 20,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			textAlign : "right"
		});
		discountVW.add(discountPrice);
		discountPrice.itemPriceAfterDiscount = itemDetail[i].discountVW.priceObj.text;
		priceText.text = discountPrice.itemPriceAfterDiscount;
		discountPrice.text = "-$" + toFixed(priceText.textData / itemDetail[i].quantity - itemDetail[i].discountVW.priceObj.totalPrice).toFixed(2);
		Ti.API.info('discountPrice.text ' + discountPrice.text);

		if (discountPrice.text != "-$0.00" && discountPrice.text != "-$0") {
			modifierGroupView.add(discountVW);
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
			toggle : (itemDetail.toggle == true) ? true : false
		});

		row.add(checkBoxBtn);
		tableData.push(row);

		//$.orderListTable.appendRow(row);

	}
	if (tableData.length > 0) {
		$.no_data_layout_headerVw.height = 0;
	} else {
		$.no_data_layout_headerVw.height = "42%";
	}
	$.orderListTable.setData(tableData);
	setTotalFun(finalJson);

};
function setTotalFun(finalJson) {
	$.subTotalLbl.text = finalJson.subTotal;
	$.discountLbl.text = finalJson.discount;
	$.taxLbl.text = finalJson.tax;
	$.grandTotalLbl.text = finalJson.grandTotal;
	if (finalJson.loyaltyVal != "-$0.00") {
		$.loyaltyPointLbl.height = Ti.UI.SIZE;
		$.loyaltyPointLbl.top = 10;
		$.loyaltyPointLbl.text = finalJson.loyaltyPoint;
		$.loyaltyValueLbl.height = Ti.UI.SIZE;
		$.loyaltyValueLbl.top = 10;
		$.loyaltyValueLbl.text = finalJson.loyaltyVal;
		$.loyaltyValueLbl.visible = true;
		$.loyaltyPointLbl.visible = true;
		$.staticLoyaltyPointLbl.visible = true;
		$.staticLoyaltyValLbl.visible = true;
		$.staticLoyaltyPointLbl.top = 10;
		$.staticLoyaltyValLbl.top = 10;
		$.staticLoyaltyPointLbl.height = Ti.UI.SIZE;
		$.staticLoyaltyValLbl.height = Ti.UI.SIZE;
	} else {
		$.loyaltyPointLbl.height = 0;
		$.loyaltyPointLbl.top = 0;
		$.loyaltyValueLbl.height = 0;
		$.loyaltyValueLbl.top = 0;
		$.loyaltyValueLbl.visible = false;
		$.loyaltyPointLbl.visible = false;
		$.staticLoyaltyPointLbl.visible = false;
		$.staticLoyaltyValLbl.visible = false;
		$.staticLoyaltyPointLbl.top = 0;
		$.staticLoyaltyValLbl.top = 0;
		$.staticLoyaltyPointLbl.height = 0;
		$.staticLoyaltyValLbl.height = 0;
	}
	if (finalJson.customerName != "") {
		$.nameLbl.visible = true;
		$.nameLbl.text = finalJson.customerName;

	} else {
		$.nameLbl.visible = false;
		$.nameLbl.text = finalJson.customerName;
	}

	if (finalJson.customerLoyaltyPoints != "" && finalJson.customerName != "NA") {
		$.loyalityPtsLbl.visible = true;
		$.loyalityPtsLbl.text = finalJson.customerLoyaltyPoints;
	} else {
		$.loyalityPtsLbl.visible = false;
		$.loyalityPtsLbl.text = finalJson.customerLoyaltyPoints;
	}
	$.totalItemLbl.text = itemDetail.length + " Item";
	try {
		$.orderListTable.scrollToIndex((itemDetail.length - 1));
	} catch(e) {
		Ti.API.info('incatch scrollToIndex: ' + JSON.stringify(e));
	}

}

/*
 function initializePeripheral() {
 Ti.API.info('publishing');

 bonjourService = bonjour.createService();

 bonjourService.addEventListener('published', function(e) {
 Ti.API.info('published');
 });
 bonjourService.addEventListener('publishstopped', function(e) {
 Ti.API.info('publishstopped');
 });
 bonjourService.addEventListener('publishFailed', function(e) {
 Ti.API.info('publishFailed');
 });
 bonjourService.addEventListener('connectionestablished', function(e) {
 if (Ti.App.Properties.getBool("Store_check") == false) {
 bonjourService.sendData(Ti.App.Properties.getString("store_id"));
 } else if (Ti.App.Properties.getBool("Store_check") == true) {
 $.connectionStatusLbl.text = "Connected";
 $.connectionStatusLbl.color = "green";
 $.connectionStatusView.backgroundColor = "green";
 }

 Ti.API.info('connectionestablished');
 });
 bonjourService.addEventListener('connectionfailed', function(e) {

 Ti.API.info('connectionfailed');
 $.connectionStatusLbl.text = "Not Connected";
 $.connectionStatusLbl.color = "red";
 $.connectionStatusView.backgroundColor = "red";
 Ti.App.Properties.setBool("Store_check", false);
 deleteCartFunc();
 });
 bonjourService.addEventListener('connectionterminated', function(e) {
 Ti.API.info('connectionterminated');
 $.connectionStatusLbl.text = "Not Connected";
 $.connectionStatusLbl.color = "red";
 $.connectionStatusView.backgroundColor = "red";
 Ti.App.Properties.setBool("Store_check", false);
 deleteCartFunc();
 });
 bonjourService.addEventListener('receiveddata', function(e) {
 Ti.API.info('e = ' + e.data);
 Ti.API.info('count = ' + count);
 count++;

 var receivedData = e;
 try {
 // Ti.API.info('receivedData  ' + JSON.stringify(receivedData));
 // Ti.API.info('Ti.App.Properties.getString("store_id") ' + Ti.App.Properties.getString("store_id"));

 if (Ti.App.Properties.getBool("Store_check") == false) {
 if (receivedData.data == Ti.App.Properties.getString("store_id")) {
 Ti.App.Properties.setBool("Store_check", true);
 $.connectionStatusLbl.text = "Connected";
 $.connectionStatusLbl.color = "green";
 $.connectionStatusView.backgroundColor = "green";
 return;
 } else {
 alert("Connection needs to be terminated different store login detected.");
 }
 }

 if (Ti.App.Properties.getBool("Store_check") == true) {
 if (receivedData == "deleteCart") {
 //
 // var cfdObj = {};
 // var cartDetail = [];
 // cfdObj.subTotal = "0";
 // cfdObj.discount = "0";
 // cfdObj.tax = "0";
 // cfdObj.grandTotal = "0";
 // cfdObj.loyaltyPoint = "0";
 // cfdObj.loyaltyVal = "0";
 // cfdObj.cartDetail = cartDetail;
 // cfdObj.customerName = "";
 // Alloy.Globals.getOrderList(cfdObj);
 //
 // $.no_data_layout_headerVw.height = "60%";
 deleteCartFunc();
 } else {
 finalJson = JSON.parse(receivedData.data);
 //tempJSON =  finalJson;
 parsable = true;
 setTempData(finalJson);
 tempJSON = "";

 }
 } else {
 alert("Store id not matched");
 }

 } catch(e) {
 if (tempJSON.indexOf(receivedData.data) <= -1) {
 parsable = false;
 Ti.API.info('tempJSON = ' + tempJSON);
 Ti.API.info('e.data = ' + receivedData.data);
 tempJSON = tempJSON + receivedData.data;
 Ti.API.info('final tempJSON = ' + tempJSON);
 setTempData(tempJSON);
 } else {
 tempJSON = "";
 }

 Ti.API.info('e catch = ' + e);
 }
 });

 bonjourService.publish();
 }*/

Alloy.Globals.handleConnectionestablished = function(e) {
	if (Ti.App.Properties.getBool("Store_check") == false) {
		bonjourService.sendData(Ti.App.Properties.getString("store_id"));
	} else if (Ti.App.Properties.getBool("Store_check") == true) {
		$.connectionStatusLbl.text = "Connected";
		$.connectionStatusLbl.color = "green";
		$.connectionStatusView.backgroundColor = "green";
	}
};

Alloy.Globals.handleConnectionTermination = function(e) {
	$.connectionStatusLbl.text = "Not Connected";
	$.connectionStatusLbl.color = "red";
	$.connectionStatusView.backgroundColor = "red";
	Ti.App.Properties.setBool("Store_check", false);
	// deleteCartFunc();
	bonjourService.publish();
};

Alloy.Globals.handleReceiveData = function(e) {
	var receivedData = e;
	try {
		// Ti.API.info('receivedData  ' + JSON.stringify(receivedData));
		// Ti.API.info('Ti.App.Properties.getString("store_id") ' + Ti.App.Properties.getString("store_id"));

		if (Ti.App.Properties.getBool("Store_check") == false) {
			if (receivedData.data == Ti.App.Properties.getString("store_id")) {
				Ti.App.Properties.setBool("Store_check", true);
				$.connectionStatusLbl.text = "Connected";
				$.connectionStatusLbl.color = "green";
				$.connectionStatusView.backgroundColor = "green";
				bonjourService.unPublish();
				return;
			} else {
				alert("Connection needs to be terminated different store login detected.");
			}
		}

		if (Ti.App.Properties.getBool("Store_check") == true) {
			if (receivedData == "deleteCart") {
				//
				// var cfdObj = {};
				// var cartDetail = [];
				// cfdObj.subTotal = "0";
				// cfdObj.discount = "0";
				// cfdObj.tax = "0";
				// cfdObj.grandTotal = "0";
				// cfdObj.loyaltyPoint = "0";
				// cfdObj.loyaltyVal = "0";
				// cfdObj.cartDetail = cartDetail;
				// cfdObj.customerName = "";
				// Alloy.Globals.getOrderList(cfdObj);
				//
				// $.no_data_layout_headerVw.height = "60%";
				deleteCartFunc();
			} else {
				finalJson = JSON.parse(receivedData.data);
				//tempJSON =  finalJson;
				parsable = true;
				setTempData(finalJson);
				tempJSON = "";

			}
		} else {
			alert("Store id not matched");
		}

	} catch(e) {
		Ti.API.info('e catch = ' + e);
		if (tempJSON.indexOf(receivedData.data) <= -1) {

			if (receivedData.data == "deleteCart") {
				deleteCartFunc();
				return;
			}

			parsable = false;
			Ti.API.info('tempJSON = ' + tempJSON);
			Ti.API.info('e.data = ' + receivedData.data);
			tempJSON = tempJSON + receivedData.data;
			Ti.API.info('final tempJSON = ' + tempJSON);
			setTempData(tempJSON);
		} else {
			tempJSON = "";
		}

	}

};

function setTempData(tempJSON) {
	if (parsable == true) {

		Alloy.Globals.getOrderList(tempJSON);
		finalJson = [];
		tempJSON = "";
		bonjourService.clearBuffer();
	} else {
		try {
			tempJSON = JSON.parse(tempJSON);
			Alloy.Globals.getOrderList(tempJSON);
			finalJson = [];
			parsable = true;
			tempJSON = "";
			bonjourService.clearBuffer();
		} catch(e) {
			parsable = false;
			Ti.API.info('In second Catch');
		}

	}

}

function outputState(e) {

}

function finalizePeripheral() {
	bonjourService.unPublish();
}

Ti.App.addEventListener('pause', function(e) {

	Ti.API.info('PAUSE EVENT');

});

Ti.App.addEventListener('paused', function(e) {

	Ti.API.info('PAUSED EVENT');

});

Ti.App.addEventListener('resume', function(e) {

	Ti.API.info('RESUME EVENT');

});

Ti.App.addEventListener('resumed', function(e) {

	Ti.API.info('RESUMED EVENT');
	// initializePeripheral();
	bonjourService.publish();
});
/*
 * get advertisment services function
 */
function getAdvertismentImagesService() {
	var data = {};

	data.store_id = Ti.App.Properties.getString("store_id");

	Ti.API.info('DATA ' + JSON.stringify(data));

	var SERVICE_GET_ADVERTISMENT = Alloy.Globals.Constants.SERVICE_GET_ADVERTISMENT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_GET_ADVERTISMENT, getAdvertismentImagesCallback, data);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Callback function for handling get advertisment image service response
 */
function getAdvertismentImagesCallback(e) {
	if (e.success) {
		try {
			// Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {
				if (response.response_code == '1') {
					if (response.result.length > 0) {

						loadImages(response.result);
						openFun();
					} else {
						loadImages(null);
					}
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error getAdvertisment service error :: ' + e.message);

		}

	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}

var logoutFuncHandler = function(e) {
	clearInterval(getAdvertismentInterval);
	clearInterval(sliderInterval);
	sliderInterval = null;
	getAdvertismentInterval = null;
	bonjourService.unPublish();
	$.CustomerDashboard.close();
	Ti.App.Properties.setObject("loginResponse", null);
	var loginObj = Alloy.createController("LoginScreen").getView();
	loginObj.open();
};

function logoutFunc(e) {
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : "Are you sure you want to logout?",
		title : "Gongcha"
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			dialog.hide();
		} else {
			var passData = {
				'onComplete' : logoutFuncHandler
			};
			var _passCodeScreen = Alloy.createController("PassCodeScreen", passData).getView();
			_passCodeScreen.open();

		}
	});
	dialog.show();
}

function deleteCartFunc() {
	var cfdObj = {};
	var cartDetail = [];
	cfdObj.subTotal = "$0.00";
	cfdObj.discount = "-$0.00";
	cfdObj.tax = "+$0.00";
	cfdObj.grandTotal = "$0.00";
	cfdObj.loyaltyPoint = "-0 Pts";
	cfdObj.loyaltyVal = "-$0.00";
	cfdObj.cartDetail = cartDetail;
	cfdObj.customerName = "";
	Alloy.Globals.getOrderList(cfdObj);

	$.no_data_layout_headerVw.height = "42%";
	bonjourService.clearBuffer();
}

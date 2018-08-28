//Imports
var escPosLib = require('ESCPOSLib');

//Private properties
var RECEIPT_NET_PRINTER_TOTAL_SPACE = 42;
var RECEIPT_BLE_PRINTER_TOTAL_SPACE = 48;
var LABEL_NET_PRINTER_TOTAL_SPACE = 40;

exports.generateReceiptBuffer = function(printData) {
	//Generate receipt data
	var printBuffer = Ti.createBuffer();

	//Initialize
	// escPosLib.initializePrinter(printBuffer);
	escPosLib.addLineFeed(printBuffer);

	//Print center aligned brand name
	escPosLib.setJustification(printBuffer, escPosLib.JUSTIFICATION_CENTER);
	escPosLib.addText(printBuffer, printData.brandName);
	escPosLib.addLineFeed(printBuffer);

	//Print center aligned store name if its enabled in print config data
	if (printData.printConfig != null && printData.printConfig.length > 0 && printData.printConfig[0].settings.storename == "1") {
		escPosLib.addText(printBuffer, printData.storeName);
		escPosLib.addLineFeed(printBuffer);
	}

	//Print space of 2 lines
	escPosLib.addMultipleLineFeed(printBuffer, 2);

	//Set left justification
	escPosLib.setJustification(printBuffer, escPosLib.JUSTIFICATION_LEFT);

	//Print order no.
	var leftText = "Order No:";
	var rightText = printData.orderData.order_id.toString();
	var textToAdd = leftText + getSpace(leftText, rightText) + rightText;

	escPosLib.addText(printBuffer, textToAdd);
	escPosLib.addLineFeed(printBuffer);

	//Print order time if its enabled in print config data
	if (printData.printConfig != null && printData.printConfig.length > 0 && printData.printConfig[0].settings.datetime == "1") {
		leftText = "Time:";
		rightText = printData.dateTime;
		textToAdd = leftText + getSpace(leftText, rightText) + rightText;

		escPosLib.addText(printBuffer, textToAdd);
		escPosLib.addLineFeed(printBuffer);
	}

	//Print customer name if its enabled in print config data and if it's available
	if (printData.printConfig != null && printData.printConfig.length > 0 && printData.printConfig[0].settings.customername == "1") {
		if (printData.customerName != null && printData.customerName != "") {
			leftText = "Customer name:";
			rightText = printData.customerName;
			textToAdd = leftText + getSpace(leftText, rightText) + rightText;

			escPosLib.addText(printBuffer, textToAdd);
			escPosLib.addLineFeed(printBuffer);
		}
	}

	//Print space of 2 lines
	escPosLib.addMultipleLineFeed(printBuffer, 2);

	//Print center aligned Order Summary caption
	escPosLib.setJustification(printBuffer, escPosLib.JUSTIFICATION_CENTER);
	escPosLib.addText(printBuffer, "Order Summary");
	escPosLib.addLineFeed(printBuffer);

	//Print separator
	escPosLib.addText(printBuffer, getSeparator());
	escPosLib.addLineFeed(printBuffer);

	//Print menu header
	escPosLib.setJustification(printBuffer, escPosLib.JUSTIFICATION_LEFT);
	escPosLib.addText(printBuffer, getMenuHeader());
	escPosLib.addLineFeed(printBuffer);

	//Print separator
	escPosLib.addText(printBuffer, getSeparator());
	escPosLib.addLineFeed(printBuffer);

	//Print menu
	var menu = printData.orderData.result[0].orderDetails;
	if (menu != null) {
		for (var i = 0; i < menu.length; i++) {
			var menuItem = menu[i];

			//add menu item
			escPosLib.addText(printBuffer, getMenuItem(menuItem));
			escPosLib.addLineFeed(printBuffer);

			//add modifiers
			if (menuItem.customizationOpt != null) {
				for (var j = 1; j < menuItem.customizationOpt.length; j++) {
					for (var k = 0; k < menuItem.customizationOpt[j].option.length; k++) {

						var modifiersDetails = menuItem.customizationOpt[j].option[k];

						escPosLib.addText(printBuffer, getModifierItem(modifiersDetails));
						escPosLib.addLineFeed(printBuffer);

					}
				}
			}
		}
	}

	//Print separator
	escPosLib.addText(printBuffer, getSeparator());
	escPosLib.addLineFeed(printBuffer);

	//Print space of 1 line
	escPosLib.addMultipleLineFeed(printBuffer, 1);

	//Print sub total
	leftText = "Sub-Total:";
	rightText = "$" + parseFloat(printData.orderData.result[0].subTotal).toFixed(2).toString();
	textToAdd = leftText + getSpace(leftText, rightText) + rightText;

	escPosLib.addText(printBuffer, textToAdd);
	escPosLib.addLineFeed(printBuffer);

	//Print discount
	leftText = "Discount:";
	rightText = "$" + parseFloat(printData.orderData.result[0].discount_total_price).toFixed(2).toString();
	textToAdd = leftText + getSpace(leftText, rightText) + rightText;

	escPosLib.addText(printBuffer, textToAdd);
	escPosLib.addLineFeed(printBuffer);

	//Print loyalty details, if available
	if (printData.orderData.result[0].loyalty_point.toString() != "0") {
		//Print loyalty points
		leftText = "Loyalty pts:";
		rightText = printData.orderData.result[0].loyalty_point.toString();
		textToAdd = leftText + getSpace(leftText, rightText) + rightText;

		escPosLib.addText(printBuffer, textToAdd);
		escPosLib.addLineFeed(printBuffer);

		//Print loyalty value
		leftText = "Loyalty value:";
		rightText = "$" + parseFloat(printData.orderData.result[0].loyalty_value).toFixed(2).toString();
		textToAdd = leftText + getSpace(leftText, rightText) + rightText;

		escPosLib.addText(printBuffer, textToAdd);
		escPosLib.addLineFeed(printBuffer);
	}

	//Print tax
	var tax = printData.orderData.result[0].taxValue.toFixed(2).toString();

	leftText = "Tax:";
	rightText = "$" + tax;
	textToAdd = leftText + getSpace(leftText, rightText) + rightText;

	escPosLib.addText(printBuffer, textToAdd);
	escPosLib.addLineFeed(printBuffer);

	//Print space of 1 line
	escPosLib.addMultipleLineFeed(printBuffer, 1);

	//Print total
	var total = printData.orderData.result[0].total.toFixed(2).toString();

	leftText = "Total:";
	rightText = "$" + total;
	textToAdd = leftText + getSpace(leftText, rightText) + rightText;

	escPosLib.addText(printBuffer, textToAdd);
	escPosLib.addLineFeed(printBuffer);

	//Print space of 1 line
	escPosLib.addMultipleLineFeed(printBuffer, 1);

	//Set left justification
	escPosLib.setJustification(printBuffer, escPosLib.JUSTIFICATION_CENTER);

	//Print store address if its enabled in print config data
	if (printData.printConfig != null && printData.printConfig.length > 0 && printData.printConfig[0].settings.storeaddress == "1") {
		escPosLib.addText(printBuffer, printData.storeAddress);
		escPosLib.addLineFeed(printBuffer);
	}

	//Print space of 1 line
	escPosLib.addMultipleLineFeed(printBuffer, 1);

	//Print greeting
	escPosLib.addText(printBuffer, "Have a nice day, Visit us again!");
	escPosLib.addLineFeed(printBuffer);

	//Print space of 8 lines
	escPosLib.addMultipleLineFeed(printBuffer, 8);

	//Cut paper
	escPosLib.cutPaper(printBuffer);

	//Open drawer if payment method is cash
	var isPaymentMethodCash = false;
	for (var x = 0; x < printData.orderData.result['payment_method'].length; x++) {
		var paymentObj = printData.orderData.result['payment_method'][x];
		
		if (paymentObj.paymentMethod == "cash") {
			isPaymentMethodCash = true;
			break;
		}
	}
	Ti.API.info('isPaymentMethodCash = ' + isPaymentMethodCash);
	if(isPaymentMethodCash){
		escPosLib.openDrawer(printBuffer);	
	}

	return printBuffer;
};

//index represents the index of order in the list
//drinkIndex is the counter which is updated based on the quantity of each order item in the list
exports.generateLabelBuffer = function(printData, index, drinkIndex) {
	//Generate label data
	var printBuffer = Ti.createBuffer();

	//Initialize
	escPosLib.initializePrinter(printBuffer);

	//Select page mode
	escPosLib.selectPageMode(printBuffer);

	//Set page area
	escPosLib.setPageAreaForLabel(printBuffer);

	//Set line spacing
	escPosLib.setLineSpacing(printBuffer, 50);

	//Print date, token no, item no.
	var drinksCount = 0;
	for (var a = 0; a < printData.orderData.result[0].orderDetails.length; a++) {
		var orderItem = printData.orderData.result[0].orderDetails[a];

		drinksCount = drinksCount + orderItem.quantity;
	};
	var leftText = printData.dateTime;
	var rightText = "Token #" + printData.orderData.order_token.toString() + ", " + drinkIndex + "/" + drinksCount;
	var textToAdd = leftText + getSpaceForLabel(leftText, rightText) + rightText;

	escPosLib.addText(printBuffer, textToAdd);
	escPosLib.addLineFeed(printBuffer);

	//Print separator
	escPosLib.addText(printBuffer, getSeparatorForLabel());
	escPosLib.addLineFeed(printBuffer);

	//Print menu item name
	var menuItem = printData.orderData.result[0].orderDetails[index];
	var sizeModifier = menuItem.customizationOpt[0].option[0];
	var text = menuItem.menu_name + " " + sizeModifier.modifier_name;
	if (text.length > LABEL_NET_PRINTER_TOTAL_SPACE) {
		text = text.substring(0, LABEL_NET_PRINTER_TOTAL_SPACE);
	}
	escPosLib.addText(printBuffer, text);
	escPosLib.addLineFeed(printBuffer);

	//Print separator
	escPosLib.addText(printBuffer, getSeparatorForLabel());
	escPosLib.addLineFeed(printBuffer);

	//Print modifiers
	var modifiersText = "";
	var modifierGroups = printData.orderData.result[0].orderDetails[index].customizationOpt;
	if (modifierGroups != null) {
		for (var i = 1; i < modifierGroups.length; i++) {
			var modifiers = modifierGroups[i].option;
			if (modifiers != null) {
				for (var j = 0; j < modifiers.length; j++) {
					if (i == 1 && j == 0) {
						modifiersText = modifiersText + modifiers[j].modifier_prefix_name + " " + modifiers[j].modifier_name;
					} else {
						modifiersText = modifiersText + ", " + modifiers[j].modifier_prefix_name + " " + modifiers[j].modifier_name;
					}
				};
			}
		};
	}
	if (modifiersText.length > LABEL_NET_PRINTER_TOTAL_SPACE * 2) {
		modifiersText = modifiersText.substring(0, LABEL_NET_PRINTER_TOTAL_SPACE * 2);
	}
	escPosLib.addText(printBuffer, modifiersText);
	escPosLib.addLineFeed(printBuffer);

	//Print data in page mode
	escPosLib.printInPageMode(printBuffer);

	//Roll back label (reverse feed)
	escPosLib.addFeedToCuttingPosition(printBuffer);

	//Return to standard mode
	escPosLib.selectStandardMode(printBuffer);

	return printBuffer;
};

exports.generateTestReceiptBuffer = function() {
	//Generate label data
	var printBuffer = Ti.createBuffer();
	escPosLib.setJustification(printBuffer, escPosLib.JUSTIFICATION_CENTER);
	escPosLib.addText(printBuffer, "Connected with : " + (Ti.Platform.username != null ? Ti.Platform.username : "iPad"));
	escPosLib.addMultipleLineFeed(printBuffer, 10);
	escPosLib.cutPaper(printBuffer);

	return printBuffer;
};

exports.generateTestLabelBuffer = function() {
	//Generate label data
	var printBuffer = Ti.createBuffer();
	escPosLib.setJustification(printBuffer, escPosLib.JUSTIFICATION_CENTER);
	escPosLib.addText(printBuffer, "Connected with : " + (Ti.Platform.username != null ? Ti.Platform.username : "iPad"));
	escPosLib.addLineFeed(printBuffer);
	escPosLib.addFeedToCuttingPosition(printBuffer);

	return printBuffer;
};

//Calculate space between left and right aligned text
function getSpace(leftText, rightText) {
	var mode = Alloy.Globals.printer.getReceiptPrinterMode();

	var totalSpace = 0;
	if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH) {
		totalSpace = RECEIPT_BLE_PRINTER_TOTAL_SPACE;
	} else if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_NETWORK) {
		totalSpace = RECEIPT_NET_PRINTER_TOTAL_SPACE;
	}

	var requiredSpace = totalSpace - (leftText.length + rightText.length);
	if (requiredSpace < 0) {
		requiredSpace = 0;
	}

	var spaceText = "";
	for (var i = 0; i < requiredSpace; i++) {
		spaceText = spaceText + " ";
	};

	return spaceText;
}

//Calculate space between left and right aligned text
function getSpaceForLabel(leftText, rightText) {
	var totalSpace = LABEL_NET_PRINTER_TOTAL_SPACE;

	var requiredSpace = totalSpace - (leftText.length + rightText.length);
	if (requiredSpace < 0) {
		requiredSpace = 0;
	}

	var spaceText = "";
	for (var i = 0; i < requiredSpace; i++) {
		spaceText = spaceText + " ";
	};

	return spaceText;
}

//Create space text for the number of times, defined by parameter passed
function getFixedSpace(times) {
	var spaceText = "";
	for (var i = 0; i < times; i++) {
		spaceText = spaceText + " ";
	};

	return spaceText;
}

//Create a separator based on total space available
function getSeparator() {
	var mode = Alloy.Globals.printer.getReceiptPrinterMode();

	var totalSpace = 0;
	if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH) {
		totalSpace = RECEIPT_BLE_PRINTER_TOTAL_SPACE;
	} else if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_NETWORK) {
		totalSpace = RECEIPT_NET_PRINTER_TOTAL_SPACE;
	}

	var separatorText = "";
	for (var i = 0; i < totalSpace; i++) {
		separatorText = separatorText + "-";
	};

	return separatorText;
}

//Create a separator based on total space available
function getSeparatorForLabel() {
	var totalSpace = LABEL_NET_PRINTER_TOTAL_SPACE;

	var separatorText = "";
	for (var i = 0; i < totalSpace; i++) {
		separatorText = separatorText + "-";
	};

	return separatorText;
}

//Create menu header based on available space
function getMenuHeader() {
	var mode = Alloy.Globals.printer.getReceiptPrinterMode();

	var col1;
	var col2;
	var col3;
	var col4;

	if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH) {
		col1 = 29;
		col2 = 6;
		col3 = 5;
		col4 = 8;
	} else if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_NETWORK) {
		col1 = 23;
		col2 = 6;
		col3 = 5;
		col4 = 8;
	}

	var header1 = "ITEM";
	var header2 = "PRICE";
	var header3 = "QTY";
	var header4 = "AMOUNT";

	var space1 = col1 - header1.length;
	var space2 = col2 - header2.length;
	var space3 = col3 - header3.length;
	var space4 = col4 - header4.length;

	var menuHeaderText = header1 + getFixedSpace(space1) + getFixedSpace(space2) + header2 + getFixedSpace(space3) + header3 + getFixedSpace(space4) + header4;

	return menuHeaderText;
}

//Create menu item based on available space
function getMenuItem(menuItem) {
	var mode = Alloy.Globals.printer.getReceiptPrinterMode();

	var col1;
	var col2;
	var col3;
	var col4;

	if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH) {
		col1 = 29;
		col2 = 6;
		col3 = 5;
		col4 = 8;
	} else if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_NETWORK) {
		col1 = 23;
		col2 = 6;
		col3 = 5;
		col4 = 8;
	}

	var sizeModifier = menuItem.customizationOpt[0].option[0];

	var item1 = (menuItem.menu_name + " " + sizeModifier.modifier_name).toString().trim();
	var item2 = (parseFloat(menuItem.itemCustomizedPrice / menuItem.quantity).toFixed(2)).toString();
	var item3 = (menuItem.quantity).toString();
	var item4 = (parseFloat(menuItem.itemCustomizedPrice).toFixed(2)).toString();

	if (item1.length > col1) {
		item1 = item1.substring(0, col1);
	}
	if (item2.length > col2) {
		item2 = item2.substring(0, col2);
	}
	if (item3.length > col3) {
		item3 = item3.substring(0, col3);
	}
	if (item4.length > col4) {
		item4 = item4.substring(0, col4);
	}

	var space1 = col1 - item1.length;
	var space2 = col2 - item2.length;
	var space3 = col3 - item3.length;
	var space4 = col4 - item4.length;

	var menuItemText = item1 + getFixedSpace(space1) + getFixedSpace(space2) + item2 + getFixedSpace(space3) + item3 + getFixedSpace(space4) + item4;

	return menuItemText;
}

//Create menu item based on available space
function getModifierItem(modifierItem) {
	var mode = Alloy.Globals.printer.getReceiptPrinterMode();

	var col1;
	var col2;
	var col3;
	var col4;

	if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH) {
		col1 = 29;
		col2 = 6;
		col3 = 5;
		col4 = 8;
	} else if (mode == Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_NETWORK) {
		col1 = 23;
		col2 = 6;
		col3 = 5;
		col4 = 8;
	}

	var item1 = "   " + modifierItem.modifier_name.toString();
	//Space is prepended so that it appears as indented under menu item
	var item2 = (parseFloat(modifierItem.modifier_price).toFixed(2)).toString();
	var item3 = (modifierItem.quantity).toString();
	var item4 = (parseFloat(modifierItem.modifier_price * modifierItem.quantity).toFixed(2)).toString();

	if (item1.length > col1) {
		item1 = item1.substring(0, col1);
	}
	if (item2.length > col2) {
		item2 = item2.substring(0, col2);
	}
	if (item3.length > col3) {
		item3 = item3.substring(0, col3);
	}
	if (item4.length > col4) {
		item4 = item4.substring(0, col4);
	}

	var space1 = col1 - item1.length;
	var space2 = col2 - item2.length;
	var space3 = col3 - item3.length;
	var space4 = col4 - item4.length;

	var modifierItemText = item1 + getFixedSpace(space1) + getFixedSpace(space2) + item2 + getFixedSpace(space3) + item3 + getFixedSpace(space4) + item4;

	return modifierItemText;
}
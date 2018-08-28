function lineFead(characteristic) {
	//line feed
	var buffer = Ti.createBuffer({
		length : 1
	});
	buffer[0] = 0x0A;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function insertMenuHeader(characteristic) {
	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x61;
	buffer[2] = 48;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	//print text
	buffer = Ti.createBuffer({
		value : "Item"
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	//var spaceLength = 48 - (leftText + rightText).length;
	for (var i = 0; i < 26; i++) {
		var buffer1 = Ti.createBuffer({
			length : 1
		});
		buffer1[0] = 0x20;
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	}
	buffer = Ti.createBuffer({
		value : "PRICE"
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer = Ti.createBuffer({
		length : 1
	});
	buffer[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer = Ti.createBuffer({
		length : 1
	});
	buffer[0] = 0x20;

	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	buffer = Ti.createBuffer({
		value : "QTY"
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer = Ti.createBuffer({
		length : 1
	});
	buffer[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer = Ti.createBuffer({
		length : 1
	});
	buffer[0] = 0x20;

	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	buffer = Ti.createBuffer({
		value : "AMOUNT"
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function insertSeperatorSpace(characteristic, leftText, rightText) {
	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x61;
	buffer[2] = 48;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	//print text

	buffer = Ti.createBuffer({
		value : leftText
	});

	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var spaceLength = 48 - (leftText + rightText).length;
	for (var i = 0; i < spaceLength; i++) {
		var buffer1 = Ti.createBuffer({
			length : 1
		});
		buffer1[0] = 0x20;
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	}
	buffer = Ti.createBuffer({
		value : rightText
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function insertOredrDetail(characteristic, itemName, qty, amnt, menu, discount) {

	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x61;
	buffer[2] = 48;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	buffer = Ti.createBuffer({
		value : itemName
	});
	buffer.length = 29;

	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	if (itemName.length < 29) {
		var spaceLength = 29 - itemName.length;
		for (var i = 0; i < spaceLength; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
	}
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	if ((amnt / qty).toString().length < 5) {
		var amntspace = 5 - amnt.toString().length;
		for (var i = 0; i < amntspace; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
	}
	buffer = Ti.createBuffer({
		value : (amnt / qty).toString()
	});
	buffer.length = 5;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	if (qty.toString().length < 3) {
		var qtyspace = 3 - qty.toString().length;
		for (var i = 0; i < qtyspace; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
	}
	buffer = Ti.createBuffer({
		value : qty.toString()
	});
	buffer.length = 3;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	if (amnt.toString().length < 6) {
		var totalspace = 6 - amnt.toString().length;
		for (var i = 0; i < totalspace; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
	}
	buffer = Ti.createBuffer({
		value : amnt.toString()
	});
	buffer.length = 6;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	buffer = Ti.createBuffer({
		length : 1
	});
	buffer[0] = 0x0A;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	for (var i = 0; i < menu.customizationOpt.length; i++) {
		for (var j = 0; j < menu.customizationOpt[i].option.length; j++) {
			modifiersDetails = menu.customizationOpt[i].option;
			insertModifierDetail(characteristic, modifiersDetails[j].modifier_name, modifiersDetails[j].quantity, modifiersDetails[j].modifier_price);

		}
	}
	insertDiscount(characteristic, discount);
}

function insertDiscount(characteristic, discount) {
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x61;
	buffer[2] = 48;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	//print text

	buffer = Ti.createBuffer({
		value : "Discount"
	});

	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var spaceLength = 46 - ("Discount" + discount).length;
	for (var i = 0; i < spaceLength; i++) {
		var buffer1 = Ti.createBuffer({
			length : 1
		});
		buffer1[0] = 0x20;
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	}
	buffer = Ti.createBuffer({
		value : discount
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
}

function insertModifierDetail(characteristic, itemName, qty, amnt) {

	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x61;
	buffer[2] = 48;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	buffer = Ti.createBuffer({
		value : itemName
	});
	buffer.length = 27;

	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	if (itemName.length < 27) {
		var spaceLength = 27 - itemName.length;
		for (var i = 0; i < spaceLength; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
	}
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	if (amnt.toString().length < 5) {
		var amntspace = 5 - amnt.toString().length;
		for (var i = 0; i < amntspace; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
	}
	buffer = Ti.createBuffer({
		value : amnt.toString()
	});
	buffer.length = 5;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	if (qty.toString().length < 3) {
		var qtyspace = 3 - qty.toString().length;
		for (var i = 0; i < qtyspace; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
	}
	buffer = Ti.createBuffer({
		value : qty.toString()
	});
	buffer.length = 3;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	var buffer1 = Ti.createBuffer({
		length : 1
	});
	buffer1[0] = 0x20;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	if ((amnt * qty).toString().length < 6) {
		var totalspace = 6 - (amnt * qty).toString().length;
		for (var i = 0; i < totalspace; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
	}
	buffer = Ti.createBuffer({
		value : (amnt * qty).toString()
	});
	buffer.length = 6;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function leftAlignText(characteristic, text) {
	//left align
	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x61;
	buffer[2] = 48;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	//print text
	buffer = Ti.createBuffer({
		value : text
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function centreAlignText(characteristic, text) {
	//left align
	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x61;
	buffer[2] = 49;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

	//print text
	buffer = Ti.createBuffer({
		value : text
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function rightAlignText() {
	//right align
	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x61;
	buffer[2] = 50;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	//print text
	buffer = Ti.createBuffer({
		value : ""
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function cutRecipt(characteristic) {
	var buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1D;
	buffer[1] = 0x56;
	buffer[2] = 49;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function printSeperatorLine(characteristic) {
	buffer = Ti.createBuffer({
		//value : "----------------------------------------------------------------"
		value : "------------------------------------------------"
	});
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function setLargeTextSize(characteristic) {
	buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x4D;
	buffer[2] = 48;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function setSmallTextSize(characteristic) {
	buffer = Ti.createBuffer({
		length : 3
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x4D;
	buffer[2] = 49;
	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function printTitle(characteristic, text) {
	try {
		buffer = Ti.createBuffer({
			length : 3
		});
		buffer[0] = 0x1B;
		buffer[1] = 0x61;
		buffer[2] = 49;
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

		buffer = Ti.createBuffer({
			value : text
		});
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	} catch(e) {
		Ti.API.info('Printer Error 10 ' + e.message);
	}
}

function openCashDrawer(characteristic) {
	Ti.API.info('here opening cash');
	var buffer = Ti.createBuffer({
		length : 5
	});
	buffer[0] = 0x1B;
	buffer[1] = 0x70;
	buffer[2] = 48;
	buffer[3] = 250;
	buffer[4] = 50;

	Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

}

function printCentreAlignTxt(characteristic, text) {
	try {
		buffer = Ti.createBuffer({
			length : 3
		});
		buffer[0] = 0x1B;
		buffer[1] = 0x61;
		buffer[2] = 49;
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

		buffer = Ti.createBuffer({
			value : text
		});
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	} catch(e) {
		Ti.API.info('Printer Error 8 ' + e.message);
	}
}

exports.printReceiptFun = function(orderDetails, dateTime, name, store_name, store_address) {
	Ti.API.info('orderDetails.order_id =' + orderDetails.order_id);
	var characteristics = Alloy.Globals.characteristics;
	var tax = (orderDetails.result[0].tax * orderDetails.result[0].subTotal) / 100;
	var menu = orderDetails.result[0].orderDetails;
	Ti.API.info('discount =' + orderDetails.result[0].discount_total_price);
	var printerData = Alloy.Globals.DbManager.getPrinterReceiptConfigurationDetailFromDB();
	Ti.API.info('printerData ' + printerData[0].settings.fontsize);

	characteristics.forEach(function(characteristic) {
		var paymentMethod = JSON.parse(orderDetails.result.payment_method);
		var isPaymentMethodCash = false;
		Ti.API.info('paymentMethod == ' + JSON.stringify(paymentMethod));
		if (printerData != null && printerData.length > 0) {
			for (var i = 0; i < paymentMethod.length; i++) {
				if (paymentMethod[i].method == "Cash") {
					Ti.API.info('paymentMethod[i].method = ' + paymentMethod[i].method);
					isPaymentMethodCash = true;
					break;
				}
			};
		}
		Ti.API.info('isPaymentMethodCash = ' + isPaymentMethodCash);

		lineFead(characteristic);
		//setTextSize(characteristic);
		printTitle(characteristic, "GongCha");
		if (isPaymentMethodCash) {
			openCashDrawer(characteristic);
		}
		//openCashDrawer(characteristic);
		lineFead(characteristic);
		if (printerData != null && printerData.length > 0 && printerData[0].settings.storename == "1") {
			centreAlignText(characteristic, store_name);
		}
		lineFead(characteristic);
		lineFead(characteristic);
		insertSeperatorSpace(characteristic, "Order No.:", orderDetails.order_id.toString());
		lineFead(characteristic);
		if (printerData != null && printerData.length > 0 && printerData[0].settings.datetime == "1") {
			insertSeperatorSpace(characteristic, "Time:", dateTime);
		}
		if (printerData != null && printerData.length > 0 && printerData[0].settings.customername == "1") {
			insertSeperatorSpace(characteristic, "Customer name:", name);
		}
		lineFead(characteristic);
		lineFead(characteristic);
		centreAlignText(characteristic, "Order Summary");
		lineFead(characteristic);
		lineFead(characteristic);
		printSeperatorLine(characteristic);
		insertMenuHeader(characteristic);
		lineFead(characteristic);
		printSeperatorLine(characteristic);
		for (var i = 0; i < menu.length; i++) {
			insertOredrDetail(characteristic, menu[i].menu_name, menu[i].quantity, menu[i].itemCustomizedPrice, menu[i], menu[i].discount_price);
		}
		lineFead(characteristic);
		printSeperatorLine(characteristic);
		lineFead(characteristic);
		lineFead(characteristic);
		insertSeperatorSpace(characteristic, "Sub-Total:", "$" + orderDetails.result[0].subTotal.toString());
		lineFead(characteristic);
		insertSeperatorSpace(characteristic, "Discount:", "$" + orderDetails.result[0].discount_total_price.toString());
		lineFead(characteristic);
		if (orderDetails.result[0].loyalty_point.toString() != "0") {
			insertSeperatorSpace(characteristic, "Loyalty pts:", orderDetails.result[0].loyalty_point.toString());
			lineFead(characteristic);
			insertSeperatorSpace(characteristic, "Loyalty value:", "$" + orderDetails.result[0].loyalty_value.toString());
			lineFead(characteristic);
		}
		insertSeperatorSpace(characteristic, "Tax:", "$" + tax.toFixed(2).toString());
		lineFead(characteristic);
		lineFead(characteristic);
		insertSeperatorSpace(characteristic, "Total:", "$" + (orderDetails.result[0].total).toFixed(2).toString());
		lineFead(characteristic);
		lineFead(characteristic);
		if (printerData != null && printerData.length > 0 && printerData[0].settings.storeaddress == "1") {
			centreAlignText(characteristic, store_address);
			lineFead(characteristic);
		}
		centreAlignText(characteristic, "Have a nice day, Visit us again!");
		lineFead(characteristic);
		lineFead(characteristic);
		lineFead(characteristic);
		lineFead(characteristic);
		lineFead(characteristic);
		lineFead(characteristic);
		cutRecipt(characteristic);

	});

};

exports.printGiftCardReceptFun = function(date, time, response, amount, givexNo, storeName, transationTyp) {
	try {
		var characteristics = Alloy.Globals.characteristics;
		characteristics.forEach(function(characteristic) {
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, storeName);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			insertSeperatorSpace(characteristic, "Date: " + date.toLocaleDateString(), "Time: " + time);
			lineFead(characteristic);
			lineFead(characteristic);
			insertSeperatorSpace(characteristic, "User Id: " + response.id, "");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);

			printCentreAlignTxt(characteristic, "Givex Trans Type: " + transationTyp);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Trans. No: " + response.result[2]);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Sequence #: " + response.result[0]);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Givex Serial #: " + givexNo);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Expiry: " + response.result[4]);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Gift Balance: " + response.result[3]);
			lineFead(characteristic);
			if (transationTyp == "Gift Card Increment") {
				printCentreAlignTxt(characteristic, "Increment Amount: " + amount);
			} else if (transationTyp == "Gift Card Activation") {
				printCentreAlignTxt(characteristic, "Activation Amount: " + amount);
			} else {
				printCentreAlignTxt(characteristic, "Redeemtion Amount: " + amount);
			}

			// else {
			// printCentreAlignTxt(characteristic, "Sun Amount: " + amount);
			// }
			// else {
			// printCentreAlignTxt(characteristic, "Redeemtion Amount: " + amount);
			// }
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "<HOSTRESPONSECODE> " + response.result[1]);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, response.result[5]);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Thank You!!");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			cutRecipt(characteristic);
		});
	} catch(e) {
		Ti.API.info('Printer Error 7 ' + e.message);
	}
};

exports.printTimeOutFun = function(date, time, response, amount, givexNo, storeName, transationTyp, randomNumber) {
	try {
		var characteristics = Alloy.Globals.characteristics;
		characteristics.forEach(function(characteristic) {
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, storeName);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			insertSeperatorSpace(characteristic, "Date: " + date.toLocaleDateString(), "Time: " + time);
			lineFead(characteristic);
			lineFead(characteristic);
			insertSeperatorSpace(characteristic, "User Id: " + response.id, "");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);

			printCentreAlignTxt(characteristic, "Givex Trans Type: Gift Card Reversal");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Trans. No: " + response.result[2]);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Sequence #: " + 4592);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Givex Serial #: " + givexNo);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Expiry: " + response.result[5]);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Gift Balance: " + response.result[4]);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Reversal Balance: " + "8.00");
			// if (transationTyp == "Gift Card Increment") {
			// printCentreAlignTxt(characteristic, "Increment Amount: " + amount);
			// } else if (transationTyp == "Gift Card Activation") {
			// printCentreAlignTxt(characteristic, "Activation Amount: " + amount);
			// }else {
			// printCentreAlignTxt(characteristic, "Redeemtion Amount: " + amount);
			// }

			// else {
			// printCentreAlignTxt(characteristic, "Sun Amount: " + amount);
			// }
			// else {
			// printCentreAlignTxt(characteristic, "Redeemtion Amount: " + amount);
			// }
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "<HOSTRESPONSECODE> " + response.result[1]);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, response.result[5]);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Thank You!!");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			cutRecipt(characteristic);
		});
	} catch(e) {
		Ti.API.info('Printer Error 0 ' + e.message);
	}
};
exports.printGiftErrorFun = function(date, time, response, amount, givexNo, storeName, transationTyp) {
	try {
		var characteristics = Alloy.Globals.characteristics;
		var dateStr = characteristics.forEach(function(characteristic) {
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, storeName);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			insertSeperatorSpace(characteristic, "Date: " + date.toLocaleDateString(), "Time: " + time);
			lineFead(characteristic);
			lineFead(characteristic);
			insertSeperatorSpace(characteristic, "User Id: " + response.id, "");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);

			printCentreAlignTxt(characteristic, "Givex Trans Type: " + transationTyp);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Sequence #: " + response.result[0]);
			//printCentreAlignTxt(characteristic, "Sequence #: " + sequenceNo());
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Givex Serial #: " + givexNo);
			lineFead(characteristic);
			if (transationTyp == "Gift Card Increment") {
				printCentreAlignTxt(characteristic, "Increment Amount: " + amount);
			} else if (transationTyp == "Gift Card Activation") {
				printCentreAlignTxt(characteristic, "Activation Amount: " + amount);
			} else {
				printCentreAlignTxt(characteristic, "Redeem Amount: " + amount);
			}
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "<HOSTRESPONSECODE> " + response.result[1]);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, response.result[2]);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Thank You!!");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			cutRecipt(characteristic);
		});
	} catch(e) {
		Ti.API.info('Printer Error 1 ' + e.message);
	}

};
exports.printReceiptViaNetworkFun = function(response, name, store_name, store_address) {
	try {
		Ti.API.info('response ---- = ' + response.result.payment_method);
		var printerData = Alloy.Globals.DbManager.getPrinterReceiptConfigurationDetailFromDB();
		if (Ti.App.Properties.getObject("receiptNetworkPrinter")) {
			var result = epos.connect(Ti.App.Properties.getObject("receiptNetworkPrinter").target);
			var dateStr = Alloy.Globals.DateTimeUtils.getFormattedDate(new Date());
			if (result == false) {
				alert("Failed to print");
				return;
			}

			var buffer = Ti.createBuffer({
				length : 3
			});
			buffer[0] = 0x1B;
			buffer[1] = 0x61;
			buffer[2] = 49;
			var paymentMethod = JSON.parse(response.result.payment_method);
			var isPaymentMethodCash = false;
			for (var i = 0; i < paymentMethod.length; i++) {
				if (paymentMethod[i].method == "Cash") {
					isPaymentMethodCash = true;
					break;
				}
			};
			if (isPaymentMethodCash) {
				buffer = Ti.createBuffer({
					length : 5
				});
				buffer[0] = 0x1B;
				buffer[1] = 0x70;
				buffer[2] = 48;
				buffer[3] = 250;
				buffer[4] = 50;
			} else {
				var buffer = Ti.createBuffer({
					length : 3
				});
				buffer[0] = 0x1B;
				buffer[1] = 0x61;
				buffer[2] = 49;
			}
			epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, JSON.stringify(response), buffer.toBlob(), printerData, name, store_name, store_address);

			//	epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob(),printerData);

			//epos.createReceiptData();

			//epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());

			//cutCommand
			// var buffer = Ti.createBuffer({
			// length : 3
			// });
			// buffer[0] = 0x1D;
			// buffer[1] = 0x56;
			// buffer[2] = 49;
			// epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());
			//
			// var buffer = Ti.createBuffer({
			// length : 1
			// });
			// buffer[0] = 0x0A;
			// epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());
			// var buffer = Ti.createBuffer({
			// length : 3
			// });
			// buffer[0] = 0x1D;
			// buffer[1] = 0x56;
			// buffer[2] = 49;
			// epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());
			//
			// var buffer = Ti.createBuffer({
			// length : 3
			// });
			// buffer[0] = 0x1B;
			// buffer[1] = 0x61;
			// buffer[2] = 50;
			// buffer.value = "Discount";
			// epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());
			//print text
			// var buffer = Ti.createBuffer({
			// length : 5
			// });
			// buffer[0] = 0x1B;
			// buffer[1] = 0x70;
			// buffer[2] = 48;
			// buffer[3] = 250;
			// buffer[4] = 50;
			// epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());
			//
			// var buffer = Ti.createBuffer({
			// value : "Discount"
			// });
			//
			// epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());

			// var spaceLength = 46 - ("Discount" + discount).length;
			// for (var i = 0; i < spaceLength; i++) {
			// var buffer1 = Ti.createBuffer({
			// length : 1
			// });
			// buffer1[0] = 0x20;
			// epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());
			// }
			// var buffer = Ti.createBuffer({
			// value : 28
			// });
			// epos.printOrderReceipt(dateStr, Ti.App.Properties.getObject("receiptNetworkPrinter").target, response, buffer.toBlob());

		}
	} catch(e) {
		Ti.API.info('Printer Error 2 ' + e.message);
	}
};

function sequenceNo() {
	var number = Math.floor(Math.random() * 5000);
	return number;
}

exports.openDrawerFun = function() {
	try {
		if (Ti.App.Properties.getString("receiptPrinterMode") == "receiptViaNetwork") {
			if (Ti.App.Properties.getObject("receiptNetworkPrinter")) {
				var result = epos.connect(Ti.App.Properties.getObject("receiptNetworkPrinter").target);
				var dateStr = Alloy.Globals.DateTimeUtils.getFormattedDate(new Date());
				if (result == false) {
					alert("Failed to print");
					return;
				}
				var buffer = Ti.createBuffer({
					length : 5
				});
				buffer[0] = 0x1B;
				buffer[1] = 0x70;
				buffer[2] = 48;
				buffer[3] = 250;
				buffer[4] = 50;

				epos.openDrawerFun(buffer.toBlob());

			}

		} else {
			if (Ti.App.Properties.getObject("peripheral")) {
				var characteristics = Alloy.Globals.characteristics;

				characteristics.forEach(function(characteristic) {
					openCashDrawer(characteristic);
				});
			}
		}
	} catch(e) {
		Ti.API.info("Printer Error 3 " + e.message);
	}
};

exports.printTransactionReceiptFun = function(store_name, store_address, ph_no, date, time, response) {
	//name , address,contact number,  date , time,
	try {
		var characteristics = Alloy.Globals.characteristics;
		characteristics.forEach(function(characteristic) {
			lineFead(characteristic);
			setLargeTextSize(characteristic);
			printCentreAlignTxt(characteristic, store_name);
			setSmallTextSize(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, store_address);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, ph_no);
			lineFead(characteristic);
			lineFead(characteristic);
			insertSeperatorSmallTextSpace(characteristic, "Date: " + date.toLocaleDateString(), "Time: " + time);
			lineFead(characteristic);
			lineFead(characteristic);
			setLargeTextSize(characteristic);
			printCentreAlignTxt(characteristic, "SALE");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			setSmallTextSize(characteristic);
			insertSeperatorSmallTextSpace(characteristic, "ACCT: ", "************" + response.cardLastFourNumber);
			insertSeperatorSmallTextSpace(characteristic, "APP NAME: ", response.appName);
			insertSeperatorSmallTextSpace(characteristic, "AID: ", response.AID);
			insertSeperatorSmallTextSpace(characteristic, "ARQC: ", response.TC);
			insertSeperatorSmallTextSpace(characteristic, "ENTRY: ", "Swipe");
			insertSeperatorSmallTextSpace(characteristic, "APPROVAL: ", response.authCode);
			//insertSeperatorSmallTextSpace(characteristic, "EXP: ", response.expireDate);
			lineFead(characteristic);
			lineFead(characteristic);
			setLargeTextSize(characteristic);
			insertSeperatorSpace(characteristic, "Total", "$4.00");
			lineFead(characteristic);
			setSmallTextSize(characteristic);
			lineFead(characteristic);

			printCentreAlignTxt(characteristic, "I agree to pay above total amount according to card issuer      agreement.");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "x-------------------------------");
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Signature");
			lineFead(characteristic);
			lineFead(characteristic);
			setLargeTextSize(characteristic);
			printCentreAlignTxt(characteristic, "APPROVED");
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "CUSTOMER COPY");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			cutRecipt(characteristic);
		});
	} catch(e) {
		Ti.API.info('Printer Error 4 ' + e.message);
	}
};

function insertSeperatorSmallTextSpace(characteristic, leftText, rightText) {
	try {
		var buffer = Ti.createBuffer({
			length : 3
		});
		buffer[0] = 0x1B;
		buffer[1] = 0x61;
		buffer[2] = 48;
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

		//print text

		buffer = Ti.createBuffer({
			value : leftText
		});

		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		var spaceLength = 64 - (leftText + rightText).length;
		for (var i = 0; i < spaceLength; i++) {
			var buffer1 = Ti.createBuffer({
				length : 1
			});
			buffer1[0] = 0x20;
			Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer1.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
		}
		buffer = Ti.createBuffer({
			value : rightText
		});
		Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), characteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
	} catch(e) {
		Ti.API.info('Printer Error 5 ' + e.message);
	}
}

exports.printMSRReceiptFun = function(store_name, store_address, ph_no, date, time, response) {
	//name , address,contact number,  date , time,
	//date.toLocaleDateString(), "Time: " + time
	try {
		var characteristics = Alloy.Globals.characteristics;
		characteristics.forEach(function(characteristic) {
			lineFead(characteristic);
			setLargeTextSize(characteristic);
			printCentreAlignTxt(characteristic, store_name);
			setSmallTextSize(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, store_address);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, ph_no);
			lineFead(characteristic);
			lineFead(characteristic);
			insertSeperatorSmallTextSpace(characteristic, "Date: " + date.toLocaleDateString(), "Time: " + time);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			setLargeTextSize(characteristic);
			printCentreAlignTxt(characteristic, "VOID");
			lineFead(characteristic);
			lineFead(characteristic);
			setSmallTextSize(characteristic);
			insertSeperatorSmallTextSpace(characteristic, response.cardType, "");
			insertSeperatorSmallTextSpace(characteristic, "ACCT: ", "************" + response.cardLastFourNumber);
			insertSeperatorSmallTextSpace(characteristic, "EXP: ", response.expireDate);
			insertSeperatorSmallTextSpace(characteristic, "ENTRY: ", response.entryMode);
			insertSeperatorSmallTextSpace(characteristic, "APPROVAL: ", response.authCode);
			// insertSeperatorSmallTextSpace(characteristic, "ENTRY: " , "CHIP");
			// insertSeperatorSmallTextSpace(characteristic, "APPROVAL: " , "123456");
			
			// insertSeperatorSmallTextSpace(characteristic, "ACCT: ", "************" + response.cardLastFourNumber);
			// insertSeperatorSmallTextSpace(characteristic, "APP NAME: ",  response.appName);
			// insertSeperatorSmallTextSpace(characteristic, "AID: ", response.AID);
			// insertSeperatorSmallTextSpace(characteristic, "ARQC: ", response.TC);
			// insertSeperatorSmallTextSpace(characteristic, "ENTRY: " , "CHIP");
			// insertSeperatorSmallTextSpace(characteristic, "APPROVAL: ", response.authCode);
	
			lineFead(characteristic);
			lineFead(characteristic);
			setLargeTextSize(characteristic);
			insertSeperatorSpace(characteristic, "Total", "$7.00");
			lineFead(characteristic);
			setSmallTextSize(characteristic);
			lineFead(characteristic);

			printCentreAlignTxt(characteristic, "I agree to pay above total amount according to card issuer      agreement.");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "x-------------------------------");
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "Signature");
			lineFead(characteristic);
			lineFead(characteristic);
			setLargeTextSize(characteristic);
			printCentreAlignTxt(characteristic, "APPROVED");
			lineFead(characteristic);
			lineFead(characteristic);
			printCentreAlignTxt(characteristic, "CUSTOMER COPY");
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			lineFead(characteristic);
			cutRecipt(characteristic);
		});
	} catch(e) {
		Ti.API.info('Printer Error 6 ' + e.message);
	}
};

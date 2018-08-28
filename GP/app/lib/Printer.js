//Imports
var printDataGenerator = require('PrintDataGenerator');

//Public properties
exports.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH = "receipt_printer_mode_bluetooth";
exports.KEY_RECEIPT_PRINTER_MODE_NETWORK = "receipt_printer_mode_network";

//Private properties
var PRINTER_DEFAULT_PORT = 9100;
var PRINTER_CONNECT_TIMEOUT = 10000;

var KEY_RECIEPT_PRINTER_MODE = "receipt_printer_mode_key";
var KEY_RECIEPT_NETWORK_PRINTER_ID = "receipt_network_printer_ipaddress";
var KEY_RECIEPT_BLUETOOTH_PRINTER_ID = "receipt_bluetooth_printer_udid";
var KEY_RECIEPT_BLUETOOTH_PRINTER_NAME = "receipt_bluetooth_printer_name";
var KEY_LABEL_NETWORK_PRINTER_ID = "label_network_printer_ipaddress";

//private objects
var receiptNetworkPrinter;
var receiptBluetoothPrinter;
var bleCharacteristic;
var labelNetworkPrinter;

var bleCentralManager;
var bluetoothReceiptPrinterConnectCallback;
var bleIdentifier;
var blePrinterConnectTimeoutHandle;

//Public methods
exports.printReceiptViaBluetooth = function(printData, callback) {
	Ti.API.info('Inside printReceiptViaBluetooth');
	if (receiptBluetoothPrinter != null && receiptBluetoothPrinter.state == BLE.PERIPHERAL_STATE_CONNECTED) {

		var printBuffer = printDataGenerator.generateReceiptBuffer(printData);
		var maxBufferSize = 140;

		//Send print command to printer
		try {
			if (printBuffer.length > maxBufferSize) {
				var start = 0;
				var buffLength = maxBufferSize;
				while (start < printBuffer.length) { 
					var buff = Ti.createBuffer();
					buff.append(printBuffer, start, buffLength);
					receiptBluetoothPrinter.writeValueForCharacteristicWithType(buff.toBlob(), bleCharacteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_NO_RESPONSE);
					
					start = start + buffLength;
					buffLength = ((printBuffer.length - start) > maxBufferSize) ? maxBufferSize : (printBuffer.length - start);
				}
			} else {
				receiptBluetoothPrinter.writeValueForCharacteristicWithType(printBuffer.toBlob(), bleCharacteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_NO_RESPONSE);
			}

			//Close connection after successfull print
			// exports.closeBluetoothReceiptPrinter();

			callback(true);
		} catch(e) {
			callback(false);
		}
	} else {
		callback(false);
	}
};

exports.printReceiptViaNetwork = function(printData, callback) {
	if (receiptNetworkPrinter != null && receiptNetworkPrinter.state == Titanium.Network.Socket.CONNECTED) {

		var printBuffer = printDataGenerator.generateReceiptBuffer(printData);

		//Send print command to printer
		Ti.Stream.write(receiptNetworkPrinter, printBuffer, function(e) {
			Ti.API.info('Printer write callback = ' + JSON.stringify(e));
			callback(e.success);

			//Close printer connection after print
			closeNetworkReceiptPrinter();
		});
	} else {
		callback(false);
	}
};

exports.printLabelViaNetwork = function(printData, index, drinkIndex, callback) {
	if (labelNetworkPrinter != null && labelNetworkPrinter.state == Titanium.Network.Socket.CONNECTED) {

		var printBuffer = printDataGenerator.generateLabelBuffer(printData, index, drinkIndex);

		//Send print command to printer
		Ti.Stream.write(labelNetworkPrinter, printBuffer, function(e) {
			Ti.API.info('Printer write callback = ' + JSON.stringify(e));
			callback(e.success);

			//Close printer connection after print
			closeNetworkLabelPrinter();
		});
	} else {
		callback(false);
	}
};

exports.printTestReceiptViaBluetooth = function(callback) {
	if (receiptBluetoothPrinter != null && receiptBluetoothPrinter.state == BLE.PERIPHERAL_STATE_CONNECTED) {
		//Generate test receipt data
		var printBuffer = printDataGenerator.generateTestReceiptBuffer();

		//Send print command to printer
		try {
			receiptBluetoothPrinter.writeValueForCharacteristicWithType(printBuffer.toBlob(), bleCharacteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);

			//Close connection after successfull print
			exports.closeBluetoothReceiptPrinter();

			callback(true);
		} catch(e) {
			callback(false);
		}
	} else {
		callback(false);
	}
};

exports.printTestReceiptViaNetwork = function(callback) {
	if (receiptNetworkPrinter != null && receiptNetworkPrinter.state == Titanium.Network.Socket.CONNECTED) {
		//Generate test receipt data
		var printBuffer = printDataGenerator.generateTestReceiptBuffer();

		//Send print command to printer
		Ti.Stream.write(receiptNetworkPrinter, printBuffer, function(e) {
			Ti.API.info('Printer write callback = ' + JSON.stringify(e));
			callback(e.success);

			//Close printer connection after print
			closeNetworkReceiptPrinter();
		});
	} else {
		callback(false);
	}
};

exports.printTestLabelViaNetwork = function(callback) {
	if (labelNetworkPrinter != null && labelNetworkPrinter.state == Titanium.Network.Socket.CONNECTED) {
		//Generate test receipt data
		var printBuffer = printDataGenerator.generateTestLabelBuffer();
		// var printBuffer = printDataGenerator.generateLabelBuffer();

		//Send print command to printer
		Ti.Stream.write(labelNetworkPrinter, printBuffer, function(e) {
			Ti.API.info('Printer write callback = ' + JSON.stringify(e));
			callback(e.success);

			//Close printer connection after print
			closeNetworkLabelPrinter();
		});
	} else {
		callback(false);
	}
};

exports.saveLabelNetworkPrinterId = function(printerId) {
	Ti.App.Properties.setString(KEY_LABEL_NETWORK_PRINTER_ID, printerId);
};

exports.saveReceiptNetworkPrinterId = function(printerId) {
	Ti.App.Properties.setString(KEY_RECIEPT_NETWORK_PRINTER_ID, printerId);
};

exports.saveReceiptBluetoothPrinterId = function(printerId) {
	Ti.App.Properties.setString(KEY_RECIEPT_BLUETOOTH_PRINTER_ID, printerId);
};

exports.saveReceiptBluetoothPrinterName = function(printerName) {
	Ti.App.Properties.setString(KEY_RECIEPT_BLUETOOTH_PRINTER_NAME, printerName);
};

exports.saveReceiptPrinterMode = function(printerMode) {
	Ti.App.Properties.setString(KEY_RECIEPT_PRINTER_MODE, printerMode);
};

exports.getLabelNetworkPrinterId = function() {
	return Ti.App.Properties.getString(KEY_LABEL_NETWORK_PRINTER_ID);
};

exports.getReceiptNetworkPrinterId = function() {
	return Ti.App.Properties.getString(KEY_RECIEPT_NETWORK_PRINTER_ID);
};

exports.getReceiptBluetoothPrinterId = function() {
	return Ti.App.Properties.getString(KEY_RECIEPT_BLUETOOTH_PRINTER_ID);
};

exports.getReceiptBluetoothPrinterName = function() {
	return Ti.App.Properties.getString(KEY_RECIEPT_BLUETOOTH_PRINTER_NAME);
};

exports.getReceiptPrinterMode = function() {
	return Ti.App.Properties.getString(KEY_RECIEPT_PRINTER_MODE);
};

exports.isReceiptPrinterAvailable = function() {
	var printerAvailable = false;
	var mode = exports.getReceiptPrinterMode();
	Ti.API.info('mode = ' + mode);
	if (mode == exports.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH) {
		var blePrinterId = exports.getReceiptBluetoothPrinterId();
		Ti.API.info('blePrinterId = ' + blePrinterId);
		if (blePrinterId != null && blePrinterId != "") {
			printerAvailable = true;
		}
	} else if (mode == exports.KEY_RECEIPT_PRINTER_MODE_NETWORK) {
		var networkPrinterId = exports.getReceiptNetworkPrinterId();
		Ti.API.info('networkPrinterId = ' + networkPrinterId);
		if (networkPrinterId != null && networkPrinterId != "") {
			printerAvailable = true;
		}
	}

	return printerAvailable;
};

exports.connectBluetoothReceiptPrinter = function(identifier, callback) {
	Ti.API.info('Inside connectBluetoothReceiptPrinter');
	
	if (identifier == bleIdentifier && receiptBluetoothPrinter != null && bleCharacteristic != null) {
		callback(true);
		return;
	}

	bleIdentifier = identifier;
	bluetoothReceiptPrinterConnectCallback = callback;

	//Initialize Bluetooth
	if (bleCentralManager == null) {
		Ti.API.info('BLE manager is null, so creating new object');
		bleCentralManager = BLE.createCentralManager();
		addCentralManagerListeners();
	} else {
		Ti.API.info('BLE manager is not null, so directly scanning for printers');
		scanBluetoothDevices();
	}
};

exports.connectNetworkReceiptPrinter = function(ipAddress, callback) {
	if (receiptNetworkPrinter != null) {
		closeNetworkReceiptPrinter();
	}
	receiptNetworkPrinter = Ti.Network.Socket.createTCP({
		host : ipAddress,
		port : PRINTER_DEFAULT_PORT,
		connected : function(e) {
			Ti.API.info('Socket opened!');
			callback(true);
		},
		error : function(e) {
			Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
			callback(false);
		},
	});
	receiptNetworkPrinter.setTimeout(PRINTER_CONNECT_TIMEOUT);
	receiptNetworkPrinter.connect();
};

exports.connectNetworkLabelPrinter = function(ipAddress, callback) {
	if (labelNetworkPrinter != null) {
		closeNetworkLabelPrinter();
	}
	labelNetworkPrinter = Ti.Network.Socket.createTCP({
		host : ipAddress,
		port : PRINTER_DEFAULT_PORT,
		connected : function(e) {
			Ti.API.info('Socket opened!');
			callback(true);
		},
		error : function(e) {
			Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
			callback(false);
		},
	});
	labelNetworkPrinter.setTimeout(PRINTER_CONNECT_TIMEOUT);
	labelNetworkPrinter.connect();
};

exports.closeBluetoothReceiptPrinter = function() {
	try {
		stopScanningBluetoothDevices();
		bleCentralManager.cancelPeripheralConnection(receiptBluetoothPrinter);
		removeCentralManagerListeners();
	} catch(e) {

	} finally {
		receiptBluetoothPrinter = null;
		bleCharacteristic = null;
		bleCentralManager = null;
	}
};

//Private functions
function closeNetworkReceiptPrinter() {
	try {
		receiptNetworkPrinter.close();
	} catch(e) {

	} finally {
		receiptNetworkPrinter = null;
	}
}

function closeNetworkLabelPrinter() {
	try {
		labelNetworkPrinter.close();
	} catch(e) {

	} finally {
		labelNetworkPrinter = null;
	}
}

function scanBluetoothDevices() {
	Ti.API.info('Inside scanBluetoothDevices');

	if (bleCentralManager.getState() != BLE.MANAGER_STATE_POWERED_ON) {
		bluetoothReceiptPrinterConnectCallback(false, "Please make sure bluetooth of your device is powered on");
		return;
	}

	if (!bleCentralManager.isScanning()) {

		try {
			blePrinterConnectTimeoutHandle = setTimeout(function(e) {
				Ti.API.info('Timing out printer connection');
				stopScanningBluetoothDevices();
				bluetoothReceiptPrinterConnectCallback(false);
			}, 6000);
			bleCentralManager.startScanWithServices(["18F0", "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2"]);
			// bleCentralManager.startScan();
		} catch(e) {
			Ti.API.info('Failed to start scanning: ' + JSON.stringify(e));
		}
	} else {
		Ti.API.info('centralManager.isScanning() = ' + bleCentralManager.isScanning());
	}
}

function stopScanningBluetoothDevices() {
	Ti.API.info('Inside stopScanningBluetoothDevices');

	if (bleCentralManager.isScanning()) {

		try {
			bleCentralManager.stopScan();
		} catch(e) {
			Ti.API.info('Failed to stop scanning: ' + JSON.stringify(e));
		}
	}
}

/*-----------------Central Manager event listeners starts here-----------------*/

var didUpdateState = function(e) {
	Ti.API.info('Inside didUpdateState = ' + JSON.stringify(e));

	switch (e.state) {
	case BLE.MANAGER_STATE_RESETTING:
		Ti.API.info('BLE state = Resetting');
		break;

	case BLE.MANAGER_STATE_UNSUPPORTED:
		Ti.API.info('BLE state = Unsupported');
		break;

	case BLE.MANAGER_STATE_UNAUTHORIZED:
		Ti.API.info('BLE state = Unauthorized');
		break;

	case BLE.MANAGER_STATE_POWERED_OFF:
		Ti.API.info('BLE state = Powered Off testing 123');

		Alloy.Globals.Notifier.show('Please make sure bluetooth of your device is powered on');
		stopScanningBluetoothDevices();

		break;

	case BLE.MANAGER_STATE_POWERED_ON:
		Ti.API.info('BLE state = Powered On');
		scanBluetoothDevices();

		break;

	case BLE.MANAGER_STATE_UNKNOWN:
		Ti.API.info('BLE state = Unknown');
		break;
	default:
		Ti.API.info('BLE state = Unknown');
		break;
	}
};

var didDiscoverPeripheral = function(e) {
	Ti.API.info('Inside didDiscoverPeripheral');

	if (e.peripheral.identifier == bleIdentifier) {
		Ti.API.info('Peripheral matched = ' + e.peripheral.identifier);

		clearTimeout(blePrinterConnectTimeoutHandle);

		bleCentralManager.connectPeripheral(e.peripheral);
	}
};

var didConnectPeripheral = function(e) {
	Ti.API.info('didConnectPeripheral');
	Ti.API.info(e);

	// Now you can add event listener to the found peripheral.
	// Make sure to handle event listeners properly and remove them
	// when you don't need them anymore
	try {
		e.peripheral.addEventListener('didDiscoverServices', didDiscoverServices);
		e.peripheral.addEventListener('didDiscoverCharacteristicsForService', didDiscoverCharacteristicsForService);

		receiptBluetoothPrinter = e.peripheral;
		receiptBluetoothPrinter.discoverServices("E7810A71-73AE-499D-8C15-FAA9AEF0C3F2");
		
		Ti.API.info('After discoverServices call');
	} catch(e) {
		Ti.API.info("In catch = " + e.message);
	}
};

var didDisconnectPeripheral = function(e) {
	Ti.API.info('Inside didDisconnectPeripheral');
};

var didDiscoverServices = function(e) {
	Ti.API.info('didDiscoverServices');
	Ti.API.info(e);
	Ti.API.info("Service uuid = " + e.peripheral.services[0].uuid);
	Ti.API.info('peripheral has ' + e.peripheral.services.length + ' service(s)');

	var services = e.peripheral.services;

	if (services.length > 0) {
		e.peripheral.discoverCharacteristicsForService({
			characteristics : [],
			service : services[0]
		});

		bluetoothReceiptPrinterConnectCallback(true);
	} else {
		bluetoothReceiptPrinterConnectCallback(false);
	}
};

var didDiscoverCharacteristicsForService = function(e) {
	Ti.API.info('didDiscoverCharacteristicsForService');
	Ti.API.info(e);
	Ti.API.info("Service uuid = " + e.service.uuid);
	Ti.API.info("Characteristics length = " + e.service.characteristics.length);

	if (bleCharacteristic == null && e.service.characteristics.length > 0) {
		Ti.API.info("Characteristics uuid = " + e.service.characteristics[0].uuid);

		bleCharacteristic = e.service.characteristics[0];

		bluetoothReceiptPrinterConnectCallback(true);
	} else {
		bluetoothReceiptPrinterConnectCallback(false);
	}
};

function addCentralManagerListeners() {
	bleCentralManager.addEventListener('didUpdateState', didUpdateState);
	bleCentralManager.addEventListener('didDiscoverPeripheral', didDiscoverPeripheral);
	bleCentralManager.addEventListener('didConnectPeripheral', didConnectPeripheral);
	bleCentralManager.addEventListener('didDisconnectPeripheral', didDisconnectPeripheral);
}

function removeCentralManagerListeners() {
	bleCentralManager.removeEventListener('didUpdateState', didUpdateState);
	bleCentralManager.removeEventListener('didDiscoverPeripheral', didDiscoverPeripheral);
	bleCentralManager.removeEventListener('didConnectPeripheral', didConnectPeripheral);
	bleCentralManager.removeEventListener('didDisconnectPeripheral', didDisconnectPeripheral);

	receiptBluetoothPrinter.removeEventListener('didDiscoverServices', didDiscoverServices);
	receiptBluetoothPrinter.removeEventListener('didDiscoverCharacteristicsForService', didDiscoverCharacteristicsForService);

	Ti.API.info('Removed all event listeners');
}

/*-----------------Central Manager event listeners ends here-----------------*/
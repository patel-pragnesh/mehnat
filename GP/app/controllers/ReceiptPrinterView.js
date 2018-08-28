// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var PRINTER_TYPE_BLUETOOTH = 0;
var PRINTER_TYPE_NETWORK = 1;

var currentPrinterType = PRINTER_TYPE_BLUETOOTH;
var bleCentralManager;
var bluetoothDevicesList = [];

//Called when screen is closed
exports.finalize = function() {
	Ti.API.info('Inside ReceiptPrinterView finalize');

	if (bleCentralManager != null) {
		//Remove event listener
		removeCentralManagerListeners();

		//Stop any connection on setting screen
		stopScanningBluetoothDevices();

		//Stop any connection in printer class, because another instance of printer would be running,
		//if user has tested the connection by clicking on Test Connection button.
		Alloy.Globals.printer.closeBluetoothReceiptPrinter();

		bleCentralManager = null;
	}
};

//Called when user switch the tab between bluetooth and network
function selectPrinterTypeFunc(e) {
	if (e.index == PRINTER_TYPE_BLUETOOTH) {

		//Save default printer mode to bluetooth
		Alloy.Globals.printer.saveReceiptPrinterMode(Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH);

		initBluetooth();

	} else if (e.index == PRINTER_TYPE_NETWORK) {

		//Save default printer mode to network
		Alloy.Globals.printer.saveReceiptPrinterMode(Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_NETWORK);

		initNetwork();

		//Stop Bluetooth
		removeCentralManagerListeners();
		stopScanningBluetoothDevices();
		Alloy.Globals.printer.closeBluetoothReceiptPrinter();
		bleCentralManager = null;

	}
}

function initBluetooth() {
	//Switch the view to bluetooth
	$.receiptNetworkPrinterView.visible = false;
	$.devicesTableView.visible = true;
	$.connectedDeviceLbl.text = "Selected Device: N/A";
	$.testConnectionBtn.visible = false;
	currentPrinterType = PRINTER_TYPE_BLUETOOTH;

	//Initialize BLE to search devices
	bleCentralManager = BLE.createCentralManager();
	addCentralManagerListeners();
}

function initNetwork() {
	//Switch the view to network
	$.receiptNetworkPrinterView.visible = true;
	$.devicesTableView.visible = false;
	currentPrinterType = PRINTER_TYPE_NETWORK;

	var networkPrinterId = Alloy.Globals.printer.getReceiptNetworkPrinterId();
	if (networkPrinterId != null && networkPrinterId != "") {
		$.connectedDeviceLbl.text = "Selected Device: " + networkPrinterId;
		$.testConnectionBtn.visible = true;

		$.printerTF.value = networkPrinterId;
	} else {
		$.connectedDeviceLbl.text = "Selected Device: N/A";
		$.testConnectionBtn.visible = false;

		$.printerTF.value = "";
	}
}

var selectedIndex;
//Called when a printer is selected from table view
function connectBluetoothPrinter(e) {
	if (bleCentralManager != null && bluetoothDevicesList.length > 0 && e.index < bluetoothDevicesList.length) {
		if (bluetoothDevicesList[e.index].isConnecting == true || bluetoothDevicesList[e.index].isConnected == true) {
			return;
		}

		try {
			bleCentralManager.connectPeripheral(bluetoothDevicesList[e.index].peripheral);

			selectedIndex = e.index;
			bluetoothDevicesList[selectedIndex].isConnecting = true;
		} catch(e) {
			Ti.API.info('Inside catch: ' + JSON.stringify(e));
		}

		refreshBluetoothDevicesList();
	}
}

//Called when user clicks on save button to save network printer
function saveNetworkPrinter() {
	if ($.printerTF.value != '' && $.printerTF.value.trim().length > 0) {
		if (validateIPAddress($.printerTF.value.trim())) {

			Alloy.Globals.printer.saveReceiptNetworkPrinterId($.printerTF.value.trim());
			$.connectedDeviceLbl.text = "Selected Device: " + $.printerTF.value.trim();
			$.testConnectionBtn.visible = true;

			Alloy.Globals.Notifier.show(L("printer_validation_txt3"));
		} else {
			Alloy.Globals.Notifier.show(L("printer_validation_text2"));
		}
	} else {
		Alloy.Globals.Notifier.show(L("printer_validation_text1"));
	}
}

//Called when window is opened
function onWindowOpen() {
	//Check default printer mode and open view accordingly
	var printerMode = Alloy.Globals.printer.getReceiptPrinterMode();
	if (printerMode == null || printerMode == "") {
		printerMode = Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH;
	}

	switch(printerMode) {
	case Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_BLUETOOTH:
		//Initialize Bluetooth
		initBluetooth();
		$.tabbedBar.index = PRINTER_TYPE_BLUETOOTH;
		break;
	case Alloy.Globals.printer.KEY_RECEIPT_PRINTER_MODE_NETWORK:
		//Initialize Network
		initNetwork();
		$.tabbedBar.index = PRINTER_TYPE_NETWORK;
		break;
	}
}

//Called when window is clicked
function onWindowClick(e) {
	if (e.source.name != "tf") {
		$.printerTF.blur();
	}
}

//Called when BLE central manager is initalized and bluetooth status is powered on
function scanBluetoothDevices() {
	Ti.API.info('Inside scanBluetoothDevices');

	if (bleCentralManager.getState() != BLE.MANAGER_STATE_POWERED_ON) {
		Alloy.Globals.Notifier.show('Please make sure bluetooth of your device is powered on');
		return;
	}

	if (!bleCentralManager.isScanning()) {
		bluetoothDevicesList = [];

		try {
			bleCentralManager.startScanWithServices(["18F0", "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2"]);
			// bleCentralManager.startScan();
		} catch(e) {
			Ti.API.info('Failed to start scanning: ' + JSON.stringify(e));
		}
	} else {
		Ti.API.info('centralManager.isScanning() = ' + bleCentralManager.isScanning());
	}
}

//Called when,
//1. Screen is closed
//2. Tab is changed to Network
//3. Bluetooth is switched off
function stopScanningBluetoothDevices() {
	Ti.API.info('Inside stopScanningBluetoothDevices');

	if (bleCentralManager != null && bleCentralManager.isScanning()) {

		try {
			bleCentralManager.stopScan();
		} catch(e) {
			Ti.API.info('Failed to stop scanning: ' + JSON.stringify(e));
		}
	}

	bluetoothDevicesList = [];
	refreshBluetoothDevicesList();
}

//Called when user clicks on Test Connection button
function testConnection() {
	switch(currentPrinterType) {
	case PRINTER_TYPE_BLUETOOTH:
		Ti.API.info('Testing bluetooth connection');
		testBluetoothPrinterConnection();
		break;
	case PRINTER_TYPE_NETWORK:
		Ti.API.info('Testing network connection');
		testNetworkPrinterConnection();
		break;
	}
}

//Called when user clicks on Test Connection button in Network view
function testNetworkPrinterConnection() {
	//Fetch saved ip address from cache
	var networkPrinterId = Alloy.Globals.printer.getReceiptNetworkPrinterId();

	if (networkPrinterId != null && networkPrinterId != "") {
		$.testConnectionBtn.enabled = false;

		//Check connection with printer
		Alloy.Globals.printer.connectNetworkReceiptPrinter(networkPrinterId, function(status) {
			if (status) {
				Alloy.Globals.Notifier.show(L("printer_connection_success"));

				//Print test receipt
				Alloy.Globals.printer.printTestReceiptViaNetwork(function(success) {
					$.testConnectionBtn.enabled = true;

					//Show a message if failed to print
					if (!success) {
						Alloy.Globals.Notifier.show(L("printer_connection_failed"));
					}
				});
			} else {
				$.testConnectionBtn.enabled = true;
				Alloy.Globals.Notifier.show(L("printer_connection_failed"));
			}
		});
	} else {
		Alloy.Globals.Notifier.show(L("printer_connection_failed"));
	}
}

//Called when user clicks on Test Connection button in Bluetooth view
function testBluetoothPrinterConnection() {
	//Check connection with printer
	var blePrinterId = Alloy.Globals.printer.getReceiptBluetoothPrinterId();
	if (blePrinterId != null && blePrinterId != "") {
		$.testConnectionBtn.enabled = false;

		Alloy.Globals.printer.connectBluetoothReceiptPrinter(blePrinterId, function(status, message) {
			if (status) {
				Alloy.Globals.Notifier.show(L("printer_connection_success"));

				//Print test receipt
				Alloy.Globals.printer.printTestReceiptViaBluetooth(function(success) {
					$.testConnectionBtn.enabled = true;

					//Show a message if failed to print
					if (!success) {
						Alloy.Globals.Notifier.show(L("printer_connection_failed"));
					}
				});
			} else {
				$.testConnectionBtn.enabled = true;

				if (message) {
					Alloy.Globals.Notifier.show(message);
				} else {
					Alloy.Globals.Notifier.show(L('printer_connection_failed'));
				}
			}
		});
	} else {
		Alloy.Globals.Notifier.show(L("printer_connection_failed"));
	}
}

//Called when,
//1. A new device is found by central manager (bluetooth device finder)
//2. User selects a device from list, which initiates the connecting process (To show loader)
//3. Printer connection is either success or failure (To show check icon and hide loader)
function refreshBluetoothDevicesList() {
	var bluetoothDevicesRows = [];

	for (var i = 0; i < bluetoothDevicesList.length; i++) {
		var device = bluetoothDevicesList[i];

		if (device.peripheral != null) {
			if (device.peripheral.name != null && device.peripheral.name != "") {
				var row = Ti.UI.createTableViewRow({
					title : device.advertisementData.kCBAdvDataLocalName,
					height : 45
				});

				if (device == bluetoothDevicesList[selectedIndex]) {
					if (bluetoothDevicesList[selectedIndex].isConnected) {
						row.hasCheck = true;
					} else if (bluetoothDevicesList[selectedIndex].isConnecting) {
						var activityIndicator = Ti.UI.createActivityIndicator({
							style : Ti.UI.ActivityIndicatorStyle.DARK,
							right : 10,
							height : Ti.UI.SIZE,
							width : Ti.UI.SIZE
						});
						row.add(activityIndicator);
						activityIndicator.show();
					}
				}

				bluetoothDevicesRows.push(row);
			}
		}
	};

	if (bluetoothDevicesRows.length == 0) {
		var row = Ti.UI.createTableViewRow({
			title : "No Devices Available",
			color : "#BDBDBD"
		});

		bluetoothDevicesRows.push(row);
	}

	$.devicesTableView.setData(bluetoothDevicesRows);
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
		Ti.API.info('BLE state = Powered Off testing');

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
	//Return if bluetooth printer tab is not selected
	if (currentPrinterType == PRINTER_TYPE_NETWORK) {
		return;
	}

	Ti.API.info('Inside didDiscoverPeripheral');

	if (e.advertisementData.kCBAdvDataLocalName && e.peripheral.identifier) {
		Ti.API.info(e);
		Ti.API.info('Peripheral identifier = ' + e.peripheral.identifier);

		bluetoothDevicesList.push(e);

		var blePrinterId = Alloy.Globals.printer.getReceiptBluetoothPrinterId();
		var blePrinterName = Alloy.Globals.printer.getReceiptBluetoothPrinterName();
		if (e.peripheral.identifier == blePrinterId) {
			selectedIndex = bluetoothDevicesList.length - 1;
			bluetoothDevicesList[selectedIndex].isConnected = true;

			$.connectedDeviceLbl.text = "Selected Device: " + blePrinterName;
			$.testConnectionBtn.visible = true;
		}

		refreshBluetoothDevicesList();
	}
};

var didConnectPeripheral = function(e) {
	Ti.API.info('didConnectPeripheral');
	Ti.API.info(e);

	for (var i = 0; i < bluetoothDevicesList.length; i++) {
		if (bluetoothDevicesList[i].peripheral == e.peripheral) {
			selectedIndex = i;
			bluetoothDevicesList[selectedIndex].isConnected = true;

			Alloy.Globals.myPeripheral = bluetoothDevicesList[selectedIndex].peripheral;
			Alloy.Globals.myPeripheralName = bluetoothDevicesList[selectedIndex].advertisementData.kCBAdvDataLocalName;

			$.connectedDeviceLbl.text = "Selected Device: " + Alloy.Globals.myPeripheralName;
			$.testConnectionBtn.visible = true;

			//Save connected device details in cache
			Alloy.Globals.printer.saveReceiptBluetoothPrinterId(Alloy.Globals.myPeripheral.identifier);
			Alloy.Globals.printer.saveReceiptBluetoothPrinterName(Alloy.Globals.myPeripheralName);
		}
	}

	refreshBluetoothDevicesList();
};

var didDisconnectPeripheral = function(e) {
	Ti.API.info('Inside didDisconnectPeripheral');
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

	Ti.API.info('Removed all event listeners');
}

/*-----------------Central Manager event listeners ends here-----------------*/

//Private utility methods
function validateIPAddress(ipaddress) {
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
		return true;
	}
	return false;
}

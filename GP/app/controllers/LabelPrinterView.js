// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Called when screen is closed
exports.finalize = function() {
	Ti.API.info('Inside LabelPrinterView finalize');
};

function initNetwork() {
	var networkPrinterId = Alloy.Globals.printer.getLabelNetworkPrinterId();
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

//Called when user clicks on save button to save network printer
function saveNetworkPrinter() {
	if ($.printerTF.value != '' && $.printerTF.value.trim().length > 0) {
		if (validateIPAddress($.printerTF.value.trim())) {

			Alloy.Globals.printer.saveLabelNetworkPrinterId($.printerTF.value.trim());
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
	initNetwork();
}

//Called when window is clicked
function onWindowClick(e){
	if (e.source.name != "tf") {
		$.printerTF.blur();
	}
}

//Called when user clicks on Test Connection button in Network view
function testNetworkPrinterConnection() { 
	//Fetch saved ip address from cache
	var networkPrinterId = Alloy.Globals.printer.getLabelNetworkPrinterId();

	if (networkPrinterId != null && networkPrinterId != "") {
		$.testConnectionBtn.enabled = false;
		
		//Check connection with printer
		Alloy.Globals.printer.connectNetworkLabelPrinter(networkPrinterId, function(status) {
			if (status) {
				Alloy.Globals.Notifier.show(L("printer_connection_success"));

				//Print test label
				Alloy.Globals.printer.printTestLabelViaNetwork(function(success) {
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

//Private utility methods
function validateIPAddress(ipaddress) {
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
		return true;
	}
	return false;
}
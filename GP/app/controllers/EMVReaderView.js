// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Called when screen is closed
exports.finalize = function() {
	Ti.API.info('Inside EMVReaderView finalize');
};

function initPax() {
	if (Ti.App.Properties.getString("pax_ip")) {
		$.paxTF.value = Ti.App.Properties.getString("pax_ip");
	} else {
		$.paxTF.value = "";
	}
}

//Called when user clicks on save button to save emv reader
function saveEMVReader() {
	if ($.paxTF.value != '' && $.paxTF.value.trim().length > 0) {
		if (validateIPAddress($.paxTF.value.trim())) {
			Ti.App.Properties.setString("pax_ip", $.paxTF.value.trim());
			Alloy.Globals.Notifier.show(L("pax_validation_txt3"));
		} else {
			Alloy.Globals.Notifier.show(L("ip_validation"));
		}
	} else {
		Alloy.Globals.Notifier.show(L("pax_validation_text1"));
	}
}

//Called when window is opened
function onWindowOpen() {
	initPax();
}

//Called when window is clicked
function onWindowClick(e) {
	if (e.source.name != "tf") {
		$.paxTF.blur();
	}
}

//Private utility methods
function validateIPAddress(ipaddress) {
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
		return true;
	}
	return false;
}
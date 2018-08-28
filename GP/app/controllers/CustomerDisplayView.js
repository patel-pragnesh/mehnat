// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Alloy.Globals.connectedDeviceLbl = $.connectedDeviceLbl;
CurrentWindow = "setting";

//Called when screen is closed
exports.finalize = function() {
	Ti.API.info('Inside CustomerDisplay finalize');
	
	bonjourBrowser.stopSearch();
	CurrentWindow = "";
};

function initCustomerDisplay() {
	Ti.API.info('Ti.App.Properties.getString("cfdName") = ' + Ti.App.Properties.getString("cfdName"));
	bonjourBrowser.startSearch();
	if (Ti.App.Properties.getString("cfdName")) {
		$.connectedDeviceLbl.text = "Selected Device: " + Ti.App.Properties.getString("cfdName");
	} else {
		$.connectedDeviceLbl.text = "Selected Device: N/A";
	}
}

//Called when window is opened
function onWindowOpen() {
	initCustomerDisplay();
}

//Called when item on table view is clicked
function onTableViewClick(e) {
	if (Ti.App.Properties.getString("cfdID") != null && Ti.App.Properties.getString("cfdID") != undefined) {
		if (e.source.id == Ti.App.Properties.getString("cfdID")) {
			return;
		}
	}

	Ti.API.info('e = ' + JSON.stringify(e));
	Ti.API.info('e.index = ' + e.index);
	connectCustomerDisplay(e);
}

var connectingServiceIndex;
//Called when customer display is selected from table view
function connectCustomerDisplay(e) {

	connectingServiceIndex = e.index;
	Alloy.Globals.connectingServiceIndex = e.index;
	Ti.API.info('e.index = ' + e.index);
	Ti.API.info('e = ' + JSON.stringify(e));
	Ti.API.info('e.index id= ' + e.source.id);
	Ti.API.info('e.index name= ' + e.source.title);

	if (Ti.App.Properties.getString("cfdID") != null && Ti.App.Properties.getString("cfdID") != undefined) {
		if (e.source.id != Ti.App.Properties.getString("cfdID")) {
			Ti.App.Properties.setBool("Store_check", false);
		}
	}

	Alloy.Globals.cfdId = e.source.id;
	Alloy.Globals.cfdName = e.source.title;
	Ti.API.info('object at index = ' + JSON.stringify(Alloy.Globals.cfdServicesArr[connectingServiceIndex]));
	try {
		bonjourBrowser.connectToServiceAtIndex(connectingServiceIndex);
	} catch(e) {
		Ti.API.info('connectToServiceAtIndex ' + JSON.stringify(e));
	}
	bonjourBrowser.startSearch();

	if (Ti.App.Properties.getString("cfdName")) {
		$.connectedDeviceLbl.text = "Selected Device: " + Ti.App.Properties.getString("cfdName");
	} else {
		$.connectedDeviceLbl.text = "Selected Device: N/A";
	}
}

var devicesList;
Alloy.Globals.renderServicesListFromSetting = function() {
	var servicesRowsArr = [];
	$.devicesTableView.setData([]);
	devicesList = [];
	Ti.API.info('servicesArr = ' + JSON.stringify(Alloy.Globals.cfdServicesArr));

	for (var i = 0; i < Alloy.Globals.cfdServicesArr.length; i++) {
		var service = Alloy.Globals.cfdServicesArr[i];

		var row = Ti.UI.createTableViewRow({
			title : service.name,
			id : service.id,
			height : 40,
			font : {
				fontSize : 16,
				fontFamily : "Montserrat-Regular"
			}
		});

		// if (service.isConnected) {
		Ti.API.info('Ti.App.Properties.getString(cfdID) ' + Ti.App.Properties.getString("cfdID"));
		Ti.API.info('service.id ' + service.id);
		if (Ti.App.Properties.getString("cfdID") == service.id) {
			row.title = row.title + "(Connected)";
			row.hasCheck = true;
			var sendDataBtn = Ti.UI.createButton({
				title : "Send Data",
				right : 10
			});
		} else if (service.isConnecting) {
			row.title = row.title + "(Connecting...)";
		}

		servicesRowsArr.push(row);
	}
	
	if (servicesRowsArr.length == 0) {
		var row = Ti.UI.createTableViewRow({
			title : "No Devices Available",
			color : "#BDBDBD"
		});

		servicesRowsArr.push(row);
	}
	
	$.devicesTableView.setData(servicesRowsArr);

}; 
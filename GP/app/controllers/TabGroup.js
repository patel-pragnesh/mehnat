// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
// $.tabgroup.open();
Alloy.Globals.isLogin = true;
//CFD variable
Alloy.Globals.cfdServicesArr = [];
Alloy.Globals.connectTimeoutHandle;
CurrentWindow = "fromTab";
Alloy.Globals.connectingServiceIndex;
function openFunc(e) {
	// $.tabgroup.animate({
	// opacity : 1,
	// duration : 200
	// });
}

Alloy.Globals.newOrderTab = $.newOrderTab;
Alloy.Globals.orderHistoryTab = $.orderHistoryTab;
Alloy.Globals.parkedOrderTab = $.parkedOrderTab;
Alloy.Globals.parkedOrderTab.badge = Ti.App.Properties.getString("parkedBadge");
$.tabgroup.setActiveTab($.posTab);
function clickFun(e) {
	Ti.API.info('e.source.id' + e.source.id);

}

Alloy.Globals.openSelectedTabFromSlideMenu = function(value) {
	switch(value) {
	case 0:
		$.tabgroup.setActiveTab($.posTab);
		break;
	case 1:

		$.tabgroup.setActiveTab($.orderHistoryTab);
		break;
	case 2:
		$.tabgroup.setActiveTab($.newOrderTab);

		break;
	case 3:
		$.tabgroup.setActiveTab($.parkedOrderTab);

		break;

	}

};
/*
 Alloy.Globals.initializeCFDCentral = function(from) {
 Ti.API.info('initilizing');
 bonjourBrowser.addEventListener('updatedservices', function(e) {
 Ti.API.info('updatedservices \n' + JSON.stringify(e));

 Alloy.Globals.cfdServicesArr = e.services;
 if (from == "setting") {
 Alloy.Globals.renderServicesListFromSetting();
 }else{
 renderServicesList();
 }
 });
 bonjourBrowser.addEventListener('connectionestablished', function(e) {
 Ti.API.info('connectionestablished' + JSON.stringify(e));

 if (from == "setting") {
 //$.devicesTableView.touchEnabled = true;
 Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnected = true;
 Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnecting = false;
 Alloy.Globals.renderServicesListFromSetting();
 clearTimeout(Alloy.Globals.connectTimeoutHandle);
 }else{
 //renderServicesList();
 }
 });
 bonjourBrowser.addEventListener('connectionfailed', function(e) {
 Ti.API.info('connectionfailed');

 if (from == "setting") {
 //$.devicesTableView.touchEnabled = true;
 Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnected = true;
 Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnecting = false;
 clearTimeout(Alloy.Globals.connectTimeoutHandle);
 Alloy.Globals.renderServicesListFromSetting();
 }else{
 //renderServicesList();
 }
 });
 bonjourBrowser.addEventListener('connectionterminated', function(e) {
 Ti.API.info('connectionterminated');

 if (from == "setting") {
 //$.devicesTableView.touchEnabled = true;
 Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnected = true;
 Alloy.Globals.cfdServicesArr[Alloy.Globals.connectingServiceIndex].isConnecting = false;
 clearTimeout(Alloy.Globals.connectTimeoutHandle);
 Alloy.Globals.renderServicesListFromSetting();
 }else{
 //renderServicesList();
 }
 Alloy.Globals.initializeCFDCentral();

 });
 bonjourBrowser.addEventListener('receiveddata', function(e) {
 Ti.API.info('receiveddata = ' + e.data);
 });
 bonjourBrowser.startSearch();
 };*/

Alloy.Globals.focusFun = function(e) {

	switch(e.index) {
	case 0:
		connectingServiceIndex = "";
		// Alloy.Globals.initializeCFDCentral("fromTab");
		CurrentWindow = "fromTab";
		if(Alloy.Globals.updateConnectedCFD != true){
			bonjourBrowser.startSearch();
			Alloy.Globals.updateConnectedCFD = true;
		}
		// bonjourBrowser.startSearch();		
		break;
	case 1:
		Alloy.Globals.orderHistoryTab.badge = null;
		Alloy.Globals.filterSelectedIndex = 4;
		Alloy.Globals.fetchOrdersHistory();
		CurrentWindow = "fromTab";
		break;
	case 2:
		Alloy.Globals.newOrderTab.badge = null;
		Alloy.Globals.fetchOrders("tab");
		CurrentWindow = "newOrderScreen";
		break;
	case 3:
		Alloy.Globals.parkedOrderTab.badge = null;
		Ti.App.Properties.setString("parkedBadge", null);
		Alloy.Globals.fetchParkedOrderFromDB();
		CurrentWindow = "fromTab";
		break;
	}
	// if (e.index == 3) {
	// Alloy.Globals.fetchParkedOrderFromDB();
	// }

};
//Alloy.Globals.initializeCFDCentral("fromTab");
/*
 function renderServicesList() {
 for (var i = 0; i < Alloy.Globals.cfdServicesArr.length; i++) {
 var service = Alloy.Globals.cfdServicesArr[i];
 if (Ti.App.Properties.getString("cfdID") == Alloy.Globals.cfdServicesArr[i].id) {
 connectWithService(i);
 bonjourBrowser.stopSearch();
 }

 }
 }*/

/*
 function connectWithService(selectedIndex) {
 try{
 Alloy.Globals.connectingServiceIndex = selectedIndex;
 bonjourBrowser.connectToServiceAtIndex(Alloy.Globals.connectingServiceIndex);
 }catch(e){
 Ti.API.info("In catch message= " + e.message);
 }
 }*/



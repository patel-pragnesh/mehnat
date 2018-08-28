// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('TillManagementCenter Screen');
function openWin(){
	var tempScreen = Alloy.createController("TillManagementScreen").getView();
tempScreen.open();
}

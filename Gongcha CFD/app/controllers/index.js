

if (Ti.App.Properties.getObject("loginResponse")) {
	var cfdDashBoard = Alloy.createController("CustomerDashBoard").getView();
	cfdDashBoard.open();
}else {
	var loginObj = Alloy.createController("LoginScreen").getView();
	loginObj.open();
}

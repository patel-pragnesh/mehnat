// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('AddCustomer Screen');

function scanFunc() {
	$.listenLbl.visible = true;
}

function addCustomerFunc() {
	$.popover.hide();
	var popover = Alloy.createController('AddUserPopover', args).getView();
	popover.show({
		view : args.loyaltyBtn
	});
}

function changeFunc(e) {
	Ti.API.info(e.value);
	if (e.value.length > 0) {
		$.popover.hide();
		// args.loyaltyBtn.image = "/images/Discount_btn_1.png";
		// Alloy.Globals.name = e.row.name;
		// Alloy.Globals.customer_id = e.row.customer_id;
		// Alloy.Globals.mobile = e.row.contact;
		// Alloy.Globals.email = e.row.email;
		// if (e.row.loyalty_point != undefined) {
			// Alloy.Globals.loyalty_point = e.row.loyalty_point;
			// loyaltyObj.userPoints = parseInt(e.row.loyalty_point);
			// args.centerVW.getChildren()[2].getChildren()[1].text = e.row.loyalty_point + " Pts.";
		// }
		// loyaltyObj.userRemainingPoints = -1;
		// Alloy.Globals.getLoyalyValueService(e.row.customer_id);
	}

}

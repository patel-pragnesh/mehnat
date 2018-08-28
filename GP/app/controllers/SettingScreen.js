// // Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var ITEM_RECEIPT_PRINTER = 0;
var ITEM_LABEL_PRINTER = 1;
var ITEM_EMV_READER = 2;
var ITEM_CUSTOMER_DISPLAY = 3;

var currentSelectedItem = ITEM_RECEIPT_PRINTER;
var currentSelectedController;

exports.finalize = function() {
	Ti.API.info('Inside Setting finalize');

	if(currentSelectedController != null){
		currentSelectedController.finalize();	
	}
};

function toggleLeftView() {
	Alloy.Globals.openLeft();
}

function settingOptionTableClickFun(e) {
	if (e.itemIndex == currentSelectedItem) {
		return;
	}

	currentSelectedController.finalize();
	var tempControllerObj;

	switch(e.itemIndex) {
	case ITEM_RECEIPT_PRINTER:
		tempControllerObj = Alloy.createController('ReceiptPrinterView');
		$.settingScreen.detailView = tempControllerObj.getView();
		break;
	case ITEM_LABEL_PRINTER:
		tempControllerObj = Alloy.createController('LabelPrinterView');
		$.settingScreen.detailView = tempControllerObj.getView();
		break;
	case ITEM_EMV_READER:
		tempControllerObj = Alloy.createController('EMVReaderView');
		$.settingScreen.detailView = tempControllerObj.getView();
		break;
	case ITEM_CUSTOMER_DISPLAY:
		tempControllerObj = Alloy.createController('CustomerDisplayView');
		$.settingScreen.detailView = tempControllerObj.getView();
		break;
	}

	currentSelectedItem = e.itemIndex;
	currentSelectedController = tempControllerObj;
}

function onWindowOpen() {
	$.settingOptionTable.selectItem(0, 0);
	currentSelectedController = Alloy.createController('ReceiptPrinterView');
	$.settingScreen.detailView = currentSelectedController.getView();
}

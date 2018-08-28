

Alloy.Globals.syncLbl = $.syncLbl;
if (OS_IOS) {
	$.activityIndicator.show();
}

exports.open = function() {

	$.activityIndicatorAnd.show();
};

exports.close = function() {

	$.activityIndicatorAnd.hide();

};


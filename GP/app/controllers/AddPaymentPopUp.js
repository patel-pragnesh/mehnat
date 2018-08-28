// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

/*
 * Getting pin number textfield value on dialpad click
 */
function dialpadbtnfun(e) {
	$.calculateTF.value = $.calculateTF.value.trim() + e.source.name;
}

function enterFunc(e) {
	if ($.calculateTF.value != '' && $.calculateTF.value.trim().length > 0) {
		if (validateNumberAndDot($.calculateTF.value.trim())) {
			Alloy.Globals.splitPaymentCalculation(toFixed($.calculateTF.value));
			$.addPaymentWin.close();
		} else {
			Alloy.Globals.Notifier.show("Please enter valid payment");
		}
	} else {
		Alloy.Globals.Notifier.show("Please enter payment");
	}
}

function validateNumberAndDot(s) {
	var rgx = /^[0-9]*\.?[0-9]*$/;
	return s.match(rgx);
}

function cancleScreenFun(e) {
	$.addPaymentWin.animate({
		duration : 200,
		opacity : 0,
	});
	setTimeout(function() {
		$.addPaymentWin.close();
	}, 200);
}

/*
 * Function for clearing pin number textfield value
 */

function cleardailpadfun() {
	$.calculateTF.value = "";
}

function openFunc(e) {
	$.addPaymentWin.animate({
		duration : 100,
		opacity : 1,
	});
};
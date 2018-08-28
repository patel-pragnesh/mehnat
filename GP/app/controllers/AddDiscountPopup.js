// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('Discount Screen');
var validationArray = new Array(args.selectedMenu.length);

var selectedCoupon = [];
var daysArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
//$.pecentBtn.title = "  " + L("pecent_txt");
//$.dollerBtn.title = "  " + L("dollar_txt");
var discountDBData = [];
function openFunc(e) {
	$.addDiscountWin.animate({
		duration : 100,
		opacity : 1,
	});
	discountDBData = Alloy.Globals.discountData;
	Ti.API.info('discountDBData ' + JSON.stringify(discountDBData));
	gettingCouponCode();
	renderCouponGrid(removeDuplicateUsingFilter(couponCodeArray));

};
function selectTabFunc(e) {
	if (e.index == 0) {
		$.manualVW.visible = true;
		$.couponVW.visible = false;
	} else {
		$.manualVW.visible = false;
		$.couponVW.visible = true;
		//renderCouponGrid();

	}
}

var couponCodeArray = [];
function gettingCouponCode() {
	couponCodeArray = [];
	if (args.from == "normal") {
		for (var h = 0; h < args.selectedMenu.length; h++) {
			if (discountDBData.length > 0) {
				for (var i = 0; i < discountDBData.length; i++) {
					//Condition for apply only for coupon Code
					if (discountDBData[i].apply_option == 1) {

						var checkPriorityOfMenu = false;
						if (discountDBData[i].menu_id != "") {
							var menuArray = discountDBData[i].menu_id.split(',');
							if (menuArray.length > 0) {
								for (var x = 0; x < menuArray.length; x++) {
									if (menuArray[x] == args.selectedMenu[h].row_discount_obj.menu_id) {
										if (discountDBData[i].serving_sizes_id == "") {
											getCouponCode(discountDBData[i]);
											checkPriorityOfMenu = true;
											break;
										} else {
											var servingArray = discountDBData[i].serving_sizes_id.split(',');
											if (servingArray.length > 0) {
												for (var y = 0; y < servingArray.length; y++) {
													if (servingArray[y] == args.selectedMenu[h].row_discount_obj.serving_id) {
														checkPriorityOfMenu = true;
														getCouponCode(discountDBData[i]);
														break;
													}
												}
											}
										}
										break;
									}
								}
							}
						}
						if (checkPriorityOfMenu) {
							continue;
						}
						if (discountDBData[i].category_id != "") {
							var categoryArray = discountDBData[i].category_id.split(',');
							if (categoryArray.length > 0) {
								for (var w = 0; w < categoryArray.length; w++) {
									if (categoryArray[w] == args.selectedMenu[h].row_discount_obj.category_id) {
										if (discountDBData[i].serving_sizes_id == "") {
											getCouponCode(discountDBData[i]);
											break;
										} else {
											var servingArray = discountDBData[i].serving_sizes_id.split(',');
											if (servingArray.length > 0) {
												for (var z = 0; z < servingArray.length; z++) {
													if (servingArray[z] == args.selectedMenu[h].row_discount_obj.serving_id) {
														getCouponCode(discountDBData[i]);
														break;
													}
												}
											}
										}
									}
								}
							}
						}

					}
				};
			}
		};
		if (couponCodeArray.length > 0) {

		}

	} else {
		if (discountDBData.length > 0) {
			for (var i = 0; i < discountDBData.length; i++) {
				//Condition for apply only for coupon Code
				if (discountDBData[i].apply_option == 1) {
					if (discountDBData[i].category_id == '' && discountDBData[i].menu_id == '' && discountDBData[i].serving_sizes_id == '') {

						getCouponCode(discountDBData[i]);
					}
				}
			}
		}
	}
}

function getCouponCode(discountDBData) {
	if (discountDBData.discount_repeat == 0) {
		var startDate = discountDBData.start_date + ' ' + discountDBData.start_time;
		Ti.API.info('startDate ' + startDate);
		// var year = discountDBData.start_date.substr(0, 4);
		// var month = discountDBData.start_date.substr(5, 6);
		// var d = discountDBData.start_date.substr(8, 9);
		// var h = discountDBData.start_time.substr(0, 2);
		// var min = discountDBData.start_time.substr(3, 4);
		// var sec = discountDBData.start_time.substr(6, 7);
		// Ti.API.info(year + "-" + month + "-" + d + ":" + h + ":" + min + ":" + sec)

		var dateObj = discountDBData.start_date.split("-");
		Ti.API.info(dateObj[0] + "-" + dateObj[1] + "-" + dateObj[2]);
		var timeObj = discountDBData.start_time.split(":");
		Ti.API.info(timeObj[0] + "-" + timeObj[1] + "-" + timeObj[2]);
		startDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
		Ti.API.info('startDate ' + startDate.getTime());

		var dateObj1 = discountDBData.end_date.split("-");
		Ti.API.info(dateObj1[0] + "-" + dateObj1[1] + "-" + dateObj1[2]);
		var timeObj1 = discountDBData.end_time.split(":");
		Ti.API.info(timeObj1[0] + "-" + timeObj1[1] + "-" + timeObj1[2]);

		var endDate = new Date(dateObj1[0], dateObj1[1] - 1, dateObj1[2], timeObj1[0], timeObj1[1], timeObj1[2]);

		var currentDate = new Date();
		currentDate = currentDate.getTime();
		endDate = endDate.getTime();
		startDate = startDate.getTime();
		Ti.API.info('currentDate ' + currentDate);
		Ti.API.info('endDate ' + endDate);
		Ti.API.info('startDate ' + startDate);

		if (currentDate >= startDate && currentDate <= endDate) {
			if (discountDBData.discount_type == "Percentage") {
				couponCodeArray.push(discountDBData);
			} else {
				couponCodeArray.push(discountDBData);
			}

		}
	} else if (discountDBData.discount_repeat == 1) {
		var currentDate = new Date();
		var dateObj = discountDBData.start_date.split("-");
		Ti.API.info(dateObj[0] + "-" + dateObj[1] + "-" + dateObj[2]);
		if (discountDBData.discount_start[daysArray[currentDate.getDay()]] == "00:00:00") {
			return;
		}
		var timeObj = discountDBData.discount_start[daysArray[currentDate.getDay()]].split(":");
		Ti.API.info(timeObj[0] + "-" + timeObj[1] + "-" + timeObj[2]);
		startDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
		Ti.API.info('startDate ' + startDate.getTime());

		var dateObj1 = discountDBData.end_date.split("-");
		Ti.API.info(dateObj1[0] + "-" + dateObj1[1] + "-" + dateObj1[2]);
		var timeObj1 = discountDBData.discount_end[daysArray[currentDate.getDay()]].split(":");
		Ti.API.info(timeObj1[0] + "-" + timeObj1[1] + "-" + timeObj1[2]);

		var endDate = new Date(dateObj1[0], dateObj1[1] - 1, dateObj1[2], timeObj1[0], timeObj1[1], timeObj1[2]);

		currentDate = currentDate.getTime();
		endDate = endDate.getTime();
		startDate = startDate.getTime();

		if (currentDate >= startDate && currentDate <= endDate) {
			if (discountDBData.discount_type == "Percentage") {
				couponCodeArray.push(discountDBData);
			}
			// else {
			// couponCodeArray.push(discountDBData);
			// }

		}

	}
}

function validationOnCoupon(coupon) {
	for (var i = 0; i < coupon.length; i++) {
		for (var h = 0; h < args.selectedMenu.length; h++) {

			if (coupon[i].menu_id != "") {
				var menuArray = coupon[i].menu_id.split(',');
				if (menuArray.length > 0) {
					for (var x = 0; x < menuArray.length; x++) {
						if (menuArray[x] == args.selectedMenu[h].row_discount_obj.menu_id) {
							var servingArray = coupon[i].serving_sizes_id.split(',');
							if (servingArray.length > 0) {
								for (var z = 0; z < servingArray.length; z++) {
									if (servingArray[z] == args.selectedMenu[h].row_discount_obj.serving_id) {
										validationArray[h] = args.selectedMenu[h].row_discount_obj;
										break;
									} else {
										validationArray[h] = null;
									}
								}

							}
						}
					}
				}
			}
			if (coupon[i].category_id != "") {
				var categoryArray = coupon[i].category_id.split(',');
				if (categoryArray.length > 0) {
					for (var w = 0; w < categoryArray.length; w++) {
						if (categoryArray[w] == args.selectedMenu[h].row_discount_obj.category_id) {
							var servingArray = coupon[i].serving_sizes_id.split(',');
							if (servingArray.length > 0) {
								for (var z = 0; z < servingArray.length; z++) {
									if (servingArray[z] == args.selectedMenu[h].row_discount_obj.serving_id) {
										validationArray[h] = args.selectedMenu[h].row_discount_obj;
										break;
									} else {
										validationArray[h] = null;
									}
								}

							}
						}
					}

				}
			}
		}

	}

	// Ti.API.info('validationArray ' + JSON.stringify(validationArray));
}

function removeDuplicateUsingFilter(arr) {
	var hashTable = {};

	return arr.filter(function(el) {
		var key = JSON.stringify(el);
		var match = Boolean(hashTable[key]);

		return ( match ? false : hashTable[key] = true);
	});
	//return unique_array;
}

var dis_type = "Percentage";
function percentBtnselectionFun() {
	dis_type = "Percentage";
	$.pecentBtn.image = "images/radio_btn_check.png";
	//$.dollerBtn.image = "images/radio_btn.png";

}

function dollerBtnselectionFun() {
	dis_type = "Amount";
	$.pecentBtn.image = "images/radio_btn.png";
	//$.dollerBtn.image = "images/radio_btn_check.png";
}

function closewinFun() {
	$.addDiscountWin.animate({
		duration : 200,
		opacity : 0,
	});
	setTimeout(function() {
		$.addDiscountWin.close();
	}, 200);

}

function doneFunc() {
	if ($.manualVW.visible == true) {
		if ($.discountamntvalueTf.value != '' && $.discountamntvalueTf.value.trim().length > 0) {

			if ($.discountamntvalueTf.value >= 0) {
				if (dis_type == "Percentage") {
					var val = parseFloat($.discountamntvalueTf.value);
					var max = parseFloat(100);
					if (parseFloat(val.toFixed(8)) > parseFloat(max.toFixed(8))) {
						Alloy.Globals.Notifier.show(L('discount_percent_validation'));
						return;
					}
				}
				if (args.from == "normal") {
					var isCouponApply = false;
					for (var i = 0; i < args.selectedMenu.length; i++) {
						if (args.selectedMenu[i].row_discount_obj.isDiscountApply == false) {
							if (dis_type != "Percentage") {
								if ((args.selectedMenu[i].row_discount_obj.priceObj.totalPrice * args.selectedMenu[i].row_discount_obj.quantity) >= parseFloat($.discountamntvalueTf.value)) {
									isCouponApply = true;
								} else {
									isCouponApply = false;
									Alloy.Globals.Notifier.show(L('discount_exceed_validation'));
									break;
								}
							} else {
								isCouponApply = true;
							}
						} else {
							isCouponApply = false;
							Alloy.Globals.Notifier.show(L("discount_validation_txt"));
							break;
						}
					}
					if (isCouponApply) {
						for (var i = 0; i < args.selectedMenu.length; i++) {
							if (dis_type == "Percentage") {
								args.selectedMenu[i].row_discount_obj.getChildren()[1].text = "-$" + toFixed((args.selectedMenu[i].row_discount_obj.priceObj.totalPrice * parseFloat($.discountamntvalueTf.value)) / 100).toFixed(2);
								args.selectedMenu[i].row_discount_obj.priceObj.totalPrice = toFixed(args.selectedMenu[i].row_discount_obj.priceObj.totalPrice) - toFixed((args.selectedMenu[i].row_discount_obj.priceObj.totalPrice * parseFloat($.discountamntvalueTf.value)) / 100);
								args.selectedMenu[i].row_discount_obj.priceObj.textData = toFixed(args.selectedMenu[i].row_discount_obj.priceObj.textData) - toFixed((args.selectedMenu[i].row_discount_obj.priceObj.textData * parseFloat($.discountamntvalueTf.value)) / 100);
								args.selectedMenu[i].row_discount_obj.priceObj.text = "$" + parseFloat(args.selectedMenu[i].row_discount_obj.priceObj.textData).toFixed(2);

							} else {
								args.selectedMenu[i].row_discount_obj.getChildren()[1].text = "-$" + $.discountamntvalueTf.value;
								args.selectedMenu[i].row_discount_obj.priceObj.totalPrice = args.selectedMenu[i].row_discount_obj.priceObj.totalPrice - toFixed(parseFloat($.discountamntvalueTf.value));
								args.selectedMenu[i].row_discount_obj.priceObj.textData = args.selectedMenu[i].row_discount_obj.priceObj.textData - toFixed(parseFloat($.discountamntvalueTf.value) * args.selectedMenu[i].row_discount_obj.quantity);
								args.selectedMenu[i].row_discount_obj.priceObj.text = "$" + toFixed(args.selectedMenu[i].row_discount_obj.priceObj.textData).toFixed(2);
							}
							args.selectedMenu[i].row_discount_obj.height = 20;
							args.selectedMenu[i].row_discount_obj.isDiscountApply = true;
							args.selectedMenu[i].row_discount_obj.discount_type = dis_type;
							args.selectedMenu[i].row_discount_obj.discount_rate = $.discountamntvalueTf.value;
							args.selectedMenu[i].row_discount_obj.apply_option = 2;
							//apply_option=2(Manual Discount apply)
							args.selectedMenu[i].row_discount_obj.discountId = 0;
							//discountId 0 for identify manual discount apply
							args.selectedMenu[i].row_discount_obj.discountTitle = "";
							//Manual
							Alloy.Globals.getTotal();
							Alloy.Globals.unCheckSelectedRow();
							closewinFun();
						};
					}
				} else if (args.from == "overall") {
					if (dis_type == "Percentage") {
						//args.discountLbl.text = "-%" + $.discountamntvalueTf.value;
						var amt = toFixed((args.subTotalLbl.textData * parseFloat($.discountamntvalueTf.value)) / 100).toFixed(2);
						// if (args.subTotalLbl.textData < Number(amt)) {
						// Alloy.Globals.Notifier.show(L('discount_exceed_subtotal_validation'));
						// return;
						// }
						if ($.discountamntvalueTf.value > 0) {
							args.discountLbl.discountId = -1;
						} else {
							args.discountLbl.discountId = 0;
						}
						args.discountLbl.text = "-$" + amt;
						args.discountLbl.discountId = -1;
						args.discountLbl.textData = parseFloat($.discountamntvalueTf.value);
						args.discountLbl.type = "Percentage";
					} else {
						var amt = parseFloat($.discountamntvalueTf.value);
						if (args.subTotalLbl.textData < amt) {
							Alloy.Globals.Notifier.show(L('discount_exceed_subtotal_validation'));
							return;
						}
						args.discountLbl.text = "-$" + $.discountamntvalueTf.value;
						args.discountLbl.textData = parseFloat($.discountamntvalueTf.value);
						args.discountLbl.type = "Amount";
					}

					Alloy.Globals.getTotal();
					Alloy.Globals.unCheckSelectedRow();
					closewinFun();

				}
			} else {
				Alloy.Globals.Notifier.show(L("discount_valid_amount_validation"));
			}
		} else {
			Alloy.Globals.Notifier.show(L("discount_amount_validation"));
		}
	} else {
		if ($.couponTf.value != '' && $.couponTf.value.trim().length > 0) {
			if (args.from == "normal") {
				//Check validation for selected coupon applicable for all selected item or not
				validationArray = new Array(args.selectedMenu.length);
				validationOnCoupon(selectedCoupon);
				var nameStr = "";
				var check = false;
				if (validationArray.length > 0) {
					for (var i = 0; i < validationArray.length; i++) {
						if (validationArray[i] == null) {
							check = true;
						} else {
							if (nameStr.length > 0) {
								nameStr += ", " + validationArray[i].menu_name + '(' + validationArray[i].serving_name + ')';
							} else {
								nameStr = validationArray[i].menu_name + '(' + validationArray[i].serving_name + ')';
							}
						}
					};
				}
				if (check) {
					Alloy.Globals.Notifier.show(L('discount_applicable_validation') + " " + nameStr);
					return;
				}
				//Check validation for minimum required quantity
				var isCouponApply = false;
				for (var i = 0; i < args.selectedMenu.length; i++) {
					if (args.selectedMenu[i].row_discount_obj.isDiscountApply == false) {
						if ($.couponTf.detail.discount_type != "Percentage") {
							if (args.selectedMenu[i].row_discount_obj.quantity >= $.couponTf.detail.quantity) {
								if ((args.selectedMenu[i].row_discount_obj.priceObj.totalPrice * args.selectedMenu[i].row_discount_obj.quantity) >= parseFloat($.couponTf.detail.discount_rate)) {
									isCouponApply = true;
								} else {
									isCouponApply = false;
									Alloy.Globals.Notifier.show(L('discount_exceed_validation'));
									break;
								}
							} else {
								isCouponApply = false;
								Alloy.Globals.Notifier.show(L('discount_min_qty_validation') + " " + $.couponTf.detail.quantity);
								break;
							}
						} else {
							isCouponApply = true;
						}
					} else {
						isCouponApply = false;
						Alloy.Globals.Notifier.show(L("discount_validation_txt"));
						break;
					}
				}
				if (isCouponApply) {
					for (var i = 0; i < args.selectedMenu.length; i++) {
						if ($.couponTf.detail.discount_type == "Percentage") {
							args.selectedMenu[i].row_discount_obj.getChildren()[1].text = "-$" + toFixed((args.selectedMenu[i].row_discount_obj.priceObj.totalPrice * parseFloat($.couponTf.detail.discount_rate)) / 100).toFixed(2);
							args.selectedMenu[i].row_discount_obj.priceObj.totalPrice = args.selectedMenu[i].row_discount_obj.priceObj.totalPrice - ((args.selectedMenu[i].row_discount_obj.priceObj.totalPrice * parseFloat($.couponTf.detail.discount_rate)) / 100);
							args.selectedMenu[i].row_discount_obj.priceObj.textData = args.selectedMenu[i].row_discount_obj.priceObj.textData - (((args.selectedMenu[i].row_discount_obj.priceObj.textData * parseFloat($.couponTf.detail.discount_rate)) / 100));
							args.selectedMenu[i].row_discount_obj.priceObj.text = "$" + toFixed(args.selectedMenu[i].row_discount_obj.priceObj.textData).toFixed(2);
						} else {
							args.selectedMenu[i].row_discount_obj.getChildren()[1].text = "-$" + $.couponTf.detail.discount_rate;
							args.selectedMenu[i].row_discount_obj.priceObj.totalPrice = args.selectedMenu[i].row_discount_obj.priceObj.totalPrice - parseFloat($.couponTf.detail.discount_rate);
							args.selectedMenu[i].row_discount_obj.priceObj.textData = (args.selectedMenu[i].row_discount_obj.priceObj.textData - (parseFloat($.couponTf.detail.discount_rate) * args.selectedMenu[i].row_discount_obj.quantity));
							args.selectedMenu[i].row_discount_obj.priceObj.text = "$" + toFixed(args.selectedMenu[i].row_discount_obj.priceObj.textData).toFixed(2);
						}
						args.selectedMenu[i].row_discount_obj.height = 20;
						args.selectedMenu[i].row_discount_obj.isDiscountApply = true;
						args.selectedMenu[i].row_discount_obj.discount_type = $.couponTf.detail.discount_type;
						args.selectedMenu[i].row_discount_obj.discount_rate = $.couponTf.detail.discount_rate;
						args.selectedMenu[i].row_discount_obj.apply_option = 1;
						args.selectedMenu[i].row_discount_obj.discountId = $.couponTf.detail.id;
						args.selectedMenu[i].row_discount_obj.discountTitle = $.couponTf.detail.title;
						Alloy.Globals.getTotal();
						Alloy.Globals.unCheckSelectedRow();

						closewinFun();
					}
				}
			} else {

				if ($.couponTf.detail.discount_type == "Percentage") {
					var amt = ((args.subTotalLbl.textData * parseFloat($.couponTf.detail.discount_rate)) / 100);
					if (args.subTotalLbl.textData < amt) {
						Alloy.Globals.Notifier.show(L('discount_exceed_subtotal_validation'));
						return;
					}
					//args.discountLbl.text = "-%" + $.couponTf.detail.discount_rate;
					args.discountLbl.text = "-$" + amt;
					args.discountLbl.discountId = $.couponTf.detail.id;
					args.discountLbl.textData = $.couponTf.detail.discount_rate;
					args.discountLbl.type = "Percentage";
				} else {
					if (args.subTotalLbl.textData < parseFloat($.couponTf.detail.discount_rate)) {
						Alloy.Globals.Notifier.show(L('discount_exceed_subtotal_validation'));
						return;
					}
					args.discountLbl.text = "-$" + $.couponTf.detail.discount_rate;
					args.discountLbl.textData = parseFloat($.couponTf.detail.discount_rate);
					args.discountLbl.type = "Amount";
				}
				Alloy.Globals.getTotal();
				Alloy.Globals.unCheckSelectedRow();
				closewinFun();
			}
		} else {
			Alloy.Globals.Notifier.show("Please select coupon first");
		}
	}

}

/*
 * Right Menu Grid View creation code
 */
var width = Ti.Platform.displayCaps.getPlatformWidth() * 0.70;
width = width * 0.80;
var height = Ti.Platform.displayCaps.getPlatformHeight() * 0.78;
height = height * 0.48;
$.scrollGridVW.height = height;
var previousObj = null;
$.coupGrid.init({
	columns : 4,
	space : 14,
	gridBackgroundColor : '"#EDECF2',
	itemHeightDelta : 0,
	itemBackgroundColor : '#fff',
	itemBorderColor : 'transparent',
	itemBorderWidth : 0,
	itemBorderRadius : 6,
	from : "discount",
	width : width
});

var subCategorryTemp = [];
var selected_subCategory_array = [];
function renderCouponGrid(coupon) {
	subCategorryTemp = [];

	for (var x = 0; x < coupon.length; x++) {

		var view = Ti.UI.createView({
			left : 0,
			right : 0,
			height : Ti.UI.FILL,
			backgroundColor : "white",
		});

		var title = Ti.UI.createLabel({
			textAlign : 'center',
			textAlign : "left",
			font : {
				fontSize : 18,
				fontWeight : "semibold"
			},
			text : coupon[x].coupon_code,
			color : "black",
			height : 20,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		view.add(title);

		//THIS IS THE DATA THAT WE WANT AVAILABLE FOR THIS ITEM WHEN onItemClick OCCURS
		var values = {
			detail : coupon[x],
		};

		//NOW WE PUSH TO THE ARRAY THE VIEW AND THE DATA
		subCategorryTemp.push({
			view : view,
			data : values
		});
	};

	$.coupGrid.addGridItems(subCategorryTemp);
	var focus = true;
	$.coupGrid.setOnItemClick(function(e) {
		if (previousObj) {
			previousObj.backgroundColor = "#fff";
			previousObj.getChildren()[0].color = "black";
		}
		$.couponTf.value = e.source.data.detail.coupon_code;
		$.couponTf.detail = e.source.data.detail;
		e.source.vw.backgroundColor = "#c32032";
		e.source.vw.getChildren()[0].color = "white";
		previousObj = e.source.vw;
		selectedCoupon = [];
		selectedCoupon.push(e.source.data.detail);

	});
}


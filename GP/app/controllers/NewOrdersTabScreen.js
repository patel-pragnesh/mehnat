// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('NewOrderTab Screen');
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
/*
 /*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {

	Alloy.Globals.openLeft();
}

Alloy.Globals.setVisibilityofDeatilVw = function(visibility) {
	$.mainView.visible = visibility;
	$.pickedUpImg.visible = false;
	$.orderReadyLbl.visible = false;
};
// var progressBar = Alloy.createWidget('de.manumaticx.circularprogress');
// $.btmCounterVw.add(progressBar);
$.orderSearch.addEventListener('change', function(e) {
	var searchTxt = e.value;
	var newArr = [];
	$.mainView.visible = false;
	try {
		for (var i = 0; i < Alloy.Globals.newOrderData.length; i++) {
			var rest = Alloy.Globals.newOrderData[i].fullname;

			if (rest.toLowerCase().indexOf(searchTxt.toLowerCase()) != -1) {

				newArr.push(Alloy.Globals.newOrderData[i]);

			} else {

			}
		}
		Alloy.Globals.getNewOrderList(newArr, 1);
	} catch(e) {
		tracker.addException({
			description : "NewOrderScreenTab: " + e.message,
			fatal : false
		});
	}
});

orderType = 0;
Alloy.Globals.setTotalViewNewOrder = function(itemDetail) {
	if (itemDetail.length > 0) {
		clearInterval(pInterval);
		$.mainTotalFooterVw.visible = true;
		$.order_no_value_lbl.text = "#" + itemDetail[0].id;
		Alloy.Globals.newOrderTab.badge = null;
		$.grandTotalLbl.text = "$" + itemDetail[0].subtotal;
		//$.discountLbl.text = "$ " + itemDetail[0].dis_value;
		$.discountLbl.text = "0%";
		$.subTotalLbl.text = "$" + itemDetail[0].subtotal;
		// $.taxLbl.text = "$ " + itemDetail[0].tax;
		$.taxLbl.text = "0%";
		$.pickedUpImg.visible = false;
		$.orderReadyLbl.visible = false;
		orderType = itemDetail[0].order_type;

		Alloy.Globals.SaleId = itemDetail[0].id;
		if (itemDetail[0].order_status == "pending") {
			Ti.API.info('settingFirestView In Pending' + "In Pending");

			$.acceptBtn.visible = true;
			$.declineBtn.visible = true;
			$.btmCounterVw.visible = false;
			$.orderReadyLbl.visible = false;
			$.pickedUpImg.visible = false;
		} else if (itemDetail[0].order_status == "new") {
			Ti.API.info('settingFirestView In New ' + "In New");
			$.acceptBtn.visible = false;
			$.declineBtn.visible = false;
			$.btmCounterVw.visible = true;
			$.orderReadyLbl.visible = false;
			$.pickedUpImg.visible = false;
			fakeProgress(Alloy.Globals.SaleId);
		} else if (itemDetail[0].order_status == "ready") {
			Ti.API.info('settingFirestView In ready ' + "In ready");
			$.acceptBtn.visible = false;
			$.declineBtn.visible = false;
			$.btmCounterVw.visible = false;
			$.orderReadyLbl.visible = true;
			$.pickedUpImg.visible = true;

		} else {
			Ti.API.info('settingFirestView In else ' + "In else");
			$.acceptBtn.visible = false;
			$.declineBtn.visible = false;
			$.btmCounterVw.visible = true;
			$.orderReadyLbl.visible = false;

		}
	}
};

var rowHeight = Titanium.Platform.displayCaps.platformHeight * 0.12;
var orderType = 0;
Alloy.Globals.getNewOrderList = function(itemDetail, selection) {
	var tableData = [];
	Ti.API.info('itemDetail ' + JSON.stringify(itemDetail));
	for (var i = 0; i < itemDetail.length; i++) {

		var row = Ti.UI.createTableViewRow({

			height : rowHeight,
			backgroundColor : "white",
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.GRAY,
			detail : itemDetail[i]
		});
		if (i == 0 && selection == 0) {
			orderType = itemDetail[i].order_type;
			row.backgroundColor = "#bbbbbb";
			priviousObj = row;
		} else if (itemDetail[i].status == "1") {
			row.backgroundColor = "#F2DBDE";
		} else {
			row.backgroundColor = "#fff";
		}

		var mainView = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
		});

		var viewimage = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : "25%",
			left : 0,
		});
		mainView.add(viewimage);

		var userImg = Ti.UI.createImageView({
			height : "66",
			width : "66",
			borderRadius : "33",
			defaultImage : "/images/user_img.png",
			image : itemDetail[i].profile_pic

		});
		viewimage.add(userImg);

		var detailVw = Ti.UI.createView({
			layout : "vertical",
			height : Ti.UI.SIZE,
			left : "25%",
			width : "50%",
		});
		mainView.add(detailVw);
		var progressBarVw = Ti.UI.createView({
			right : 0,
			left : "75%",
			width : "20%"
		});
		var counterLbl = Ti.UI.createLabel({
			color : "black",
			font : {
				fontSize : 16,
			},
			visible : true
		});
		var orderReadyImage = Ti.UI.createImageView({
			image : "/images/order_ready.png",
			visible : true
		});
		progressBarVw.add(counterLbl);
		progressBarVw.add(orderReadyImage);

		if (itemDetail[i].order_status == "new") {
			counterLbl.visible = true;
			orderReadyImage.visible = false;
			fake2Progress(counterLbl, orderReadyImage, itemDetail[i].id);
		} else if (itemDetail[i].order_status == "pending") {
			orderReadyImage.visible = false;
			counterLbl.visible = false;
		} else if (itemDetail[i].order_status == "ready") {
			orderReadyImage.visible = true;
			counterLbl.visible = false;
		}
		// var progressBar = Alloy.createWidget('de.manumaticx.circularprogress').getView();
		// progressBar.show();
		// progressBarVw.add(progressBar);
		mainView.add(progressBarVw);

		var nameLbl = Ti.UI.createLabel({
			color : '#3A322E',
			text : itemDetail[i].fullname,
			left : 0,
			font : {
				fontSize : 18,
			},
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		detailVw.add(nameLbl);
		var pickupLbl = Ti.UI.createLabel({
			color : '#3A322E',
			text : "Pick up : " + itemDetail[i].pickup_date,
			left : 0,
			font : {
				fontSize : 12,
			},
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		detailVw.add(pickupLbl);
		var ttlAmntLbl = Ti.UI.createLabel({
			color : '#3A322E',
			text : "Total Amount : $" + itemDetail[i].subtotal,
			left : 0,
			font : {
				fontSize : 12,
			},
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		row.add(mainView);

		detailVw.add(ttlAmntLbl);
		tableData.push(row);

	};
	$.neworderListTable.setData(tableData);
};
var priviousObj = "";
function newOrdersTableClickFun(e) {
	clearTimeout(clockTimeOut);
	$.mainView.visible = true;
	$.mainTotalFooterVw.visible = true;
	var db = Ti.Database.open('GongchaPOS_DB');
	db.execute('UPDATE ospos_sales SET status=? WHERE id=' + e.row.detail.id, "0");
	$.grandTotalLbl.text = "$ " + e.row.detail.subtotal;
	// $.discountLbl.text = "$ " + e.row.detail.dis_value;
	$.subTotalLbl.text = "$ " + e.row.detail.subtotal;
	// $.taxLbl.text = "$ " + e.row.detail.tax;
	$.discountLbl.text = "0%";
	$.taxLbl.text = "0%";
	$.order_no_value_lbl.text = "# " + e.row.detail.id;
	priviousObj.backgroundColor = "#fff";
	e.row.backgroundColor = "#BBBBBB";
	var orderDetail = Alloy.Globals.DbManager.Get_OrderDetail_From_DB(e.row.detail.id);
	Alloy.Globals.SaleId = e.row.detail.id;
	Ti.API.info("orderDetail----detail" + JSON.stringify(orderDetail));
	orderType = e.row.detail.order_type;
	clearInterval(pInterval);
	Alloy.Globals.getNewOrderDetailList(orderDetail);
	priviousObj = e.row;
	Ti.API.info("e.row.detail.timer " + e.row.detail.timer);

	$.orderReadyLbl.visible = false;
	$.pickedUpImg.visible = false;
	Ti.API.info('Alloy.Globals.orderType ' + Alloy.Globals.orderType);
	Ti.API.info('orderType ' + orderType);

	var progressDetailFromDB = Alloy.Globals.DbManager.Get_Sale_Progress_From_DB(Alloy.Globals.SaleId);
	if (progressDetailFromDB[0].order_status == "pending") {
		$.acceptBtn.visible = true;
		$.declineBtn.visible = true;
		$.btmCounterVw.visible = false;
		$.orderReadyLbl.visible = false;
		$.pickedUpImg.visible = false;
	} else if (progressDetailFromDB[0].order_status == "ready") {
		Ti.API.info('here-------1');
		$.acceptBtn.visible = false;
		$.declineBtn.visible = false;
		$.btmCounterVw.visible = false;
		$.orderReadyLbl.visible = true;
		$.pickedUpImg.visible = true;
	} else if (progressDetailFromDB[0].order_status == "new") {
		$.acceptBtn.visible = false;
		$.declineBtn.visible = false;
		$.btmCounterVw.visible = true;
		$.orderReadyLbl.visible = false;
		$.pickedUpImg.visible = false;
		fakeProgress(progressDetailFromDB[0].id);
	}
};

function findCounterTime(date, timeEnd, id) {
	var hourDiff = timeEnd - date;
	Ti.API.info("hourDiff " + Math.ceil(hourDiff / 60000));
	$.btmCounterVw.visible = true;
	$.acceptBtn.visible = false;
	$.declineBtn.visible = false;
	$.progress.visible = true;
	if (hourDiff >= 0) {

		Alloy.Globals.intervalMin = Math.ceil(hourDiff / 60000) + 1;
		fakeProgress(id);
	} else {

		$.btmCounterVw.visible = false;
		$.orderReadyLbl.visible = true;
		$.pickedUpImg.visible = true;
		$.progress.visible = false;
	}
}

var orderDetailRowHeight = Titanium.Platform.displayCaps.platformHeight * 0.070;
Ti.API.info("row height " + orderDetailRowHeight);

Alloy.Globals.getNewOrderDetailList = function(itemDetail) {

	var tableData = [];
	for (var i = 0; i < itemDetail.length; i++) {

		var row = Ti.UI.createTableViewRow({
			height : 72,
			backgroundColor : "white",
			expand : "no",
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
			detail : itemDetail[i]
		});
		var mainView = Ti.UI.createView({

			top : 0,
			width : Ti.UI.FILL,
			layout : "vertical"
		});
		var orderVw = Ti.UI.createView({
			height : 42,
			width : Ti.UI.FILL,
		});
		mainView.add(orderVw);
		var orderDetails = JSON.parse(itemDetail[i].order_details);
		Ti.API.info('itemDetail historyyy newww ' + JSON.stringify(orderDetails));
		for (var j = 0; j < orderDetails.length; j++) {
			for (var k = 0; k < orderDetails[j].option.length; k++) {
				var orderDetailVw = Ti.UI.createView({
					height : 30,
					width : Ti.UI.FILL,
				});
				mainView.add(orderDetailVw);
				var orderDetailserialNoLbl = Ti.UI.createLabel({
					color : '#3A322E',
					left : "2.5%",
					textAlign : "center",
					maxLines : "1",
					font : {
						fontSize : 16,
					},
					width : "10%",
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

				});
				orderDetailVw.add(orderDetailserialNoLbl);
				var orderdetailNameVw = Ti.UI.createView({
					width : "40%",
					left : "12.5%",
					layout : "horizontal"
				});
				orderDetailVw.add(orderdetailNameVw);
				var orderDetailitemNameLbl = Ti.UI.createLabel({
					color : '#3A322E',
					text : orderDetails[j].option[k].modifier_name,
					textAlign : "left",
					maxLines : "1",
					left : 0,
					font : {
						fontSize : 14,
					},
					width : Ti.UI.SIZE,
					right : 20,
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

				});
				orderdetailNameVw.add(orderDetailitemNameLbl);
				if (j == 0 && orderDetails.length > 1 && k == 0) {
					var dropDownImg = Ti.UI.createImageView({
						height : Ti.UI.SIZE,
						width : Ti.UI.SIZE,
						image : "/images/drop_arrow_new_order.png",
						left : 0,

					});
					orderdetailNameVw.add(dropDownImg);
				}
				if (orderDetails[j].option[k].hasOwnProperty("quantity")) {
					var quantity = orderDetails[j].option[k].quantity;
				} else {
					var quantity = 1;
				}
				if (orderType == "pos") {
					var priceVal = orderDetails[j].option[k].modifier_price;
				} else {
					var priceVal = orderDetails[j].option[k].price;
				}

				var orderDetailquantityLbl = Ti.UI.createLabel({
					color : '#3A322E',
					text : quantity,
					left : "57.5%",
					maxLines : "1",
					textAlign : "center",
					font : {
						fontSize : 14,
					},
					width : "15%",
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

				});
				orderDetailVw.add(orderDetailquantityLbl);
				var orderDetaileachLbl = Ti.UI.createLabel({
					color : '#3A322E',
					text : "$ " + priceVal,
					left : "72.5%",
					maxLines : "1",
					textAlign : "center",
					font : {
						fontSize : 14,
					},
					width : "10%",
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

				});
				orderDetailVw.add(orderDetaileachLbl);
				if (orderDetails[j].option[k].price == " ") {
					orderDetaileachLbl.text = "";

				}
				var orderDetailtotalLbl = Ti.UI.createLabel({
					color : '#3A322E',
					text : "$ " + quantity * priceVal,
					left : "82.5%",
					textAlign : "right",
					maxLines : "1",
					font : {
						fontSize : 14,
					},
					width : "15%",
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

				});

				orderDetailVw.add(orderDetailtotalLbl);
			}
		}
		var serialNoLbl = Ti.UI.createLabel({
			color : '#000',
			text : i + 1,
			left : "2.5%",
			textAlign : "center",
			maxLines : "1",
			font : {
				fontSize : 16,
			},
			width : "10%",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		orderVw.add(serialNoLbl);
		var itemNameLbl = Ti.UI.createLabel({
			color : '#000',
			text : itemDetail[i].menu_name,
			left : "12.5%",
			textAlign : "left",
			maxLines : "1",
			font : {
				fontSize : 16,
			},
			width : "50%",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		orderVw.add(itemNameLbl);
		var quantityLbl = Ti.UI.createLabel({
			color : '#000',
			text : itemDetail[i].quantity_purchased,
			maxLines : "1",
			left : "57.5%",
			textAlign : "center",
			font : {
				fontSize : 16,
			},
			width : "15%",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		orderVw.add(quantityLbl);
		var eachLbl = Ti.UI.createLabel({
			color : '#000',
			text : "$" + itemDetail[i].serving_price,
			left : "72.5%",
			maxLines : "1",
			textAlign : "center",
			font : {
				fontSize : 16,
			},
			width : "10%",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		orderVw.add(eachLbl);
		var totalLbl = Ti.UI.createLabel({
			color : '#000',
			text : "$" + itemDetail[i].quantity_purchased * itemDetail[i].serving_price,
			left : "82.5%",
			maxLines : "1",
			textAlign : "right",
			font : {
				fontSize : 16,
			},
			width : "15%",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		orderVw.add(totalLbl);
		row.add(mainView);
		tableData.push(row);

	};
	$.orderListTable.setData(tableData);
};

function orderDetailTableClickFun(e) {
	var orderDetails = JSON.parse(e.row.detail.order_details);
	Ti.API.info('NEW ORDER  ' + JSON.stringify(orderDetails));
	if (e.row.expand == 'no') {
		var all_modifier_group = [];
		for ( i = 0; i < orderDetails.length; i++) {

			for (var j = 0; j < orderDetails[i].option.length; j++) {
				var menuObj = {
					modifier_name : orderDetails[i].option[j].modifier_name
				};
				all_modifier_group.push(menuObj);
			}

		}
		e.row.expand = 'yes';
		e.row.height = 42 + 30 * all_modifier_group.length;
		if (orderDetails.length > 1) {
			e.row.getChildren()[0].getChildren()[1].getChildren()[1].getChildren()[1].image = "/images/up_arrow_nw_order.png";
		}
	} else {
		if (e.row.expand == 'yes') {
			e.row.expand = 'no';
			if (orderDetails.length > 1) {
				e.row.getChildren()[0].getChildren()[1].getChildren()[1].getChildren()[1].image = "/images/drop_arrow_new_order.png";
			}
			e.row.height = 72;
		}
	}

};

var orderreadyData = [{
	value : "1",
	title : "1 minutes"
}, {
	value : "2",
	title : "2 minutes"
}, {
	value : "15",
	title : "15 minutes"
}, {
	value : "20",
	title : "20 minutes"
}, {
	value : "25",
	title : "25 minutes"
}];
var timeValue;
function openAcceptOrderPopOver() {
	var popoverView = Ti.UI.createView({
		backgroundColor : "white",
		layout : "vertical",
		width : 270,
		height : 300
	});

	var buttonBarView = Titanium.UI.createView({
		top : 0,
		backgroundColor : "white",
		height : "45dp"
	});
	popoverView.add(buttonBarView);

	var toolbarLbl = Titanium.UI.createLabel({
		text : "Order will be ready in",
		height : 30,
		color : "black",
		textAlign : "left",
		font : {
			fontSize : 16,
		}
	});
	var sepVw = Ti.UI.createView({
		width : Ti.UI.FILL,
		backgroundColor : "#bfbfbf",
		height : 1,
		bottom : 0
	});
	buttonBarView.add(sepVw);
	buttonBarView.add(toolbarLbl);
	var footerVw = Ti.UI.createView({
		height : 1,
		backgroundColor : "transparent",

	});
	var tableView = Ti.UI.createTableView({
		backgroundColor : 'white',
		height : Ti.UI.FILL,
		footerView : footerVw,
		tableSeparatorInsets : {
			left : 0,
			right : 0
		}
	});

	popoverView.add(tableView);
	var tableData = [];
	for (var i = 0; i < orderreadyData.length; i++) {
		var popOverRow = Ti.UI.createTableViewRow({
			height : 42,
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
			detail : orderreadyData[i]
		});
		var popOverLbl = Ti.UI.createLabel({
			text : orderreadyData[i].title,
			color : "black",
			font : {
				fontSize : 14
			},
		});
		popOverRow.add(popOverLbl);
		tableData.push(popOverRow);

	};
	tableView.setData(tableData);
	tableView.addEventListener("click", function(e) {
		popover.hide();
		timeValue = e.row.detail.value;
		var date = new Date();
		date.toUTCString();
		updateOrderStatusService(Alloy.Globals.SaleId, 'new', "", date.toUTCString(), timeValue);

	});

	var popover = Ti.UI.iPad.createPopover({

		horizontalWrap : false,
		backgroundColor : "white",
		arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_DOWN,
		contentView : popoverView
	});

	popover.show({
		view : $.acceptBtn
	});
}

function addMinutes(date, minutes) {
	var newTime = date.getTime() + minutes * 60000;
	Ti.API.info("new Date(date.getTime() " + new Date(newTime));
	Ti.API.info("new Date(date.getTime() " + newTime);
	var db = Ti.Database.open('GongchaPOS_DB');
	Ti.API.info("Alloy.Globals.SaleId " + Alloy.Globals.SaleId);
	db.execute('UPDATE ospos_sales SET timer=?,accepted_at=?,order_status=?  WHERE id=' + Alloy.Globals.SaleId, minutes, new Date(), "new");
	var orderList = Alloy.Globals.DbManager.Get_Sale_From_DB(Alloy.Globals.store_id);
	// function compare(a, b) {
	// var a = a.pickup_date.replace(" ", "T");
	// var valuea = new Date(a).getTime();
	// var b = b.pickup_date.replace(" ", "T");
	// var valueb = new Date(b).getTime();
	// if (valuea > valueb)
	// return -1;
	// if (valuea < valueb)
	// return 1;
	// return 0;
	// }
	//
	//
	// orderList.sort(compare);
	Alloy.Globals.getNewOrderList(orderList, 0);
	if (orderList.length > 0) {
		var newOrderDetails = Alloy.Globals.DbManager.Get_OrderDetail_From_DB(orderList[0].id);
		Alloy.Globals.setTotalViewNewOrder(orderList);
		Alloy.Globals.getNewOrderDetailList(newOrderDetails);

	}
	//Alloy.Globals.getNewOrderDetailList(orderList, 0);
	//findCounterTime(new Date().getTime(), newTime, Alloy.Globals.SaleId);
	fakeProgress(Alloy.Globals.SaleId);
}

function openDeclineOrderPopOver() {

	var popoverView = Ti.UI.createView({
		backgroundColor : "white",
		layout : "vertical",
		width : 270,
		height : 300
	});

	var buttonBarView = Titanium.UI.createView({
		top : 0,
		backgroundColor : "#382b20",
		height : "45dp"
	});
	popoverView.add(buttonBarView);
	var title = Ti.UI.createLabel({
		color : "white",
		width : Ti.UI.FILL,
		textAlign : "center",
		text : "Enter Reason",
	});

	var toolbarLbl = Titanium.UI.createLabel({
		text : "Enter Reason",
		height : 30,
		color : "white",
		textAlign : "center",
		font : {
			fontSize : 16,
		},
	});
	buttonBarView.add(toolbarLbl);

	var textAreaVw = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : 150,
		right : 15,
		left : 15,
		borderColor : "#bfbfbf",
		borderRadius : "3",
		top : 25,

	});
	popoverView.add(textAreaVw);
	var declineReasonTxtArea = Ti.UI.createTextArea({
		top : 0,
		maxLength : "125",

		top : 5,
		right : 5,
		left : 5,
		width : Ti.UI.FILL,
		hintTextColor : "#bfbfbf",
		padding : 10,
		hintText : "Enter reason for decline order",
		font : {
			fontSize : 18,
		},
		height : Ti.UI.FILL
	});

	textAreaVw.add(declineReasonTxtArea);

	var doneBtn = Ti.UI.createButton({
		title : "Done",
		width : "40%",
		height : "30",
		color : "white",
		backgroundColor : "#382E2C",
		top : 25,
		bottom : 0

	});
	popoverView.add(doneBtn);
	doneBtn.addEventListener('click', function(e) {
		if (declineReasonTxtArea.value.trim().length > 0) {
			updateOrderStatusService(Alloy.Globals.SaleId, 'cancelled', declineReasonTxtArea.value.trim());
			popover.hide();
		} else {
			Alloy.Globals.Alert("Please enter reason for decline order");
		}
	});

	var popover = Ti.UI.iPad.createPopover({

		horizontalWrap : false,
		backgroundColor : "white",
		arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_DOWN,
		contentView : popoverView
	});

	popover.show({
		view : $.declineBtn
	});
}

var clockTimeOut;
function countdown(minutes) {
	var seconds = 60;
	var mins = minutes;

	function tick() {
		var current_minutes = mins - 1;
		seconds--;
		//$.timeLbl.text = "Order will be ready in " + current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
		//$.timeLbl.text = "Order will be ready in " + current_minutes.toString() + " minutes";
		if (seconds > 0) {
			clockTimeOut = setTimeout(tick, 1000);

		} else {
			if (mins > 1) {
				countdown(mins - 1);
			}
			$.timeLbl.text = "Order is ready for picked up.";
		}
	}

	tick();
}

var pInterval;
function fakeProgress(id) {
	// $.btmCounterVw.visible = true;
	// $.orderReadyLbl.visible = false;
	// $.pickedUpImg.visible = false;
	// $.progress.visible = false;
	// $.acceptBtn.visible = false;
	// $.declineBtn.visible = false;
	var progressDetailFromDB = Alloy.Globals.DbManager.Get_Sale_Progress_From_DB(id);
	var acceptedTime = new Date(progressDetailFromDB[0].accepted_at).getTime();
	// var a = acceptedTime.toString().replace(" ", "T");
	// acceptedTime = new Date(a).getTime();
	Ti.API.info('acceptedTime ' + acceptedTime);
	Ti.API.info('id ' + id);
	Ti.API.info('currentTime ' + new Date().getTime());
	var completionTime = new Date(acceptedTime + progressDetailFromDB[0].timer * 60000);
	Ti.API.info('completionTime ' + completionTime);
	var currentTime = new Date();
	var val = 0;
	var duration = progressDetailFromDB[0].timer * 60;
	Ti.API.info('duration ' + duration);
	$.progress.setValue(val);
	pInterval = setInterval(function() {
		var spentTime = (new Date().getTime() - acceptedTime) / 1000;
		val = (spentTime * 100) / duration;
		Ti.API.info("spentTime = " + spentTime);
		Ti.API.info("val = " + val);
		$.progress.setValue(val);
		if (val >= 100) {
			if (Alloy.Globals.SaleId == id) {
				$.btmCounterVw.visible = false;
				$.orderReadyLbl.visible = true;
				$.pickedUpImg.visible = true;
				$.progress.visible = false;
				$.acceptBtn.visible = false;
				$.declineBtn.visible = false;
			}
			clearInterval(pInterval);
		}
	}, 1000);

	$.progress.formatValue = function(val) {
		var min = ((duration * val) / 100);
		min = (duration - min) / 60;
		min = Math.ceil(min);
		// Ti.API.info("min = " + min);

		return min;
	};

}

// this is how you customize the value text

// or: to specific value at once with animation (does not work on iOS)
$.progress.animate({
	value : 0,
	duration : 50
});

var clockTableTimeOut;
function tablecountdown(minutes, Lbl, orderreadyImage, id) {
	var seconds = 60;
	var mins = minutes;

	function tick() {
		var current_minutes = mins;
		seconds--;

		//if(current_minutes>0){
		Lbl.text = minutes + " Min";
		Lbl.visible = true;
		orderreadyImage.visible = false;
		// }else{
		// Lbl.text = "Order is ready for picked up.";
		// Lbl.visible=false;
		// orderreadyImage.visible=true;
		// }

		//Lbl.text = "Order will be ready in " + current_minutes.toString() + " minutes";
		if (seconds > 0) {
			clockTableTimeOut = setTimeout(tick, 1000);

		} else if (seconds <= 0 || minutes <= 0) {
			Lbl.text = "Order is ready for picked up.";
			Lbl.visible = false;
			orderreadyImage.visible = true;
		} else {
			if (minutes > 1) {
				tablecountdown(minutes - 1, Lbl, orderreadyImage, id);
			}

		}
	}

	tick();
}

function updateOrderStatusService(id, status, comment, accepted_at, selectedtime) {

	var SERVICE_UPDATE_ORDER_STATUS = Alloy.Globals.Constants.SERVICE_UPDATE_ORDER_STATUS;
	if (Ti.Network.online) {
		Ti.API.info('id ' + id);
		var obj = {};
		obj.order_id = id;
		obj.order_status = status;
		obj.comment = comment;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		if (status == "new") {
			obj.timer = selectedtime;
		}
		if (status != "ready") {
			Alloy.Globals.LoadingScreen.open();
		}
		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_UPDATE_ORDER_STATUS, updateOrderStatusServiceCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_UPDATE_ORDER_STATUS);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 * Getting response of placedOrderServiceCallback in the callback function and perform all database related stuff
 */
function updateOrderStatusServiceCallback(e) {
	Ti.API.info('response ' + JSON.stringify(e));
	if (e.success) {
		try {

			Ti.API.info("**updateOrderStatusServiceCallback** : " + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				if (response.response_code == '1') {
					Ti.API.info('response.response_code ' + response.result.status);
					if (response.result.status == "new") {
						addMinutes(new Date(), timeValue);
					} else if (response.result.status == "completed") {
						Alloy.Globals.processSync("interval");

					} else if (response.result.status == "cancelled") {
						Alloy.Globals.processSync("interval");
					}
				} else {
					Alloy.Globals.Notifier.show(response.msg);

				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);

			}
		} catch(e) {
			Ti.API.info('Error updateOrderStatusServiceCallback service : ' + e.message);
			tracker.addException({
				description : "NewOrderScreenTab: " + e.message,
				fatal : false
			});

		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);

	}
	if (response.result.status != "ready") {
		Alloy.Globals.LoadingScreen.close();
	}
}

var intervalarray = [];
var timeInterval = {};

function fake2Progress(Lbl, orderreadyImage, id) {
	var progressDetailFromDB = Alloy.Globals.DbManager.Get_Sale_Progress_From_DB(id);
	var acceptedTime = progressDetailFromDB[0].accepted_at * 1000;
	// var a = acceptedTime.toString().replace(" ", "T");
	// acceptedTime = new Date(a).getTime();
	Ti.API.info('acceptedTime ' + acceptedTime);
	var completionTime = new Date(acceptedTime + progressDetailFromDB[0].timer * 60000);
	var currentTime = new Date();
	var val = 0;
	var duration = progressDetailFromDB[0].timer * 60;
	//$.progress.setValue(val);
	var minInterval = setInterval(function() {

		var spentTime = (new Date().getTime() - acceptedTime) / 1000;
		val = (spentTime * 100) / duration;
		// Ti.API.info("spentTime = " + spentTime);
		// Ti.API.info("val = " + val);
		var min = ((duration * val) / 100);
		min = (duration - min) / 60;
		//Ti.API.info("min = " + min);
		min = Math.ceil(min);
		//Ti.API.info("min with ceil function = " + min);
		Lbl.text = min + " Min";
		orderreadyImage.visible = false;
		Lbl.visible = true;
		//Ti.API.info('minInterval ' + minInterval);
		if (val >= 100) {
			orderreadyImage.visible = true;
			Lbl.visible = false;
			clearInterval(minInterval);

			//updateOrderStatusService(id, "ready", "", "", "");
			// Ti.API.info('this.id ' + this.id);
			// Ti.API.info('minInterval ' + minInterval);

		}
		timeInterval[minInterval] = id;
	}, 1000);

	// var obj ={};
	// obj.id=id;
	// obj.timerobj=minInterval;
	// intervalarray.push(obj);

}

function pickedUpServiceCal() {
	updateOrderStatusService(Alloy.Globals.SaleId, "completed", "", "", "");
}

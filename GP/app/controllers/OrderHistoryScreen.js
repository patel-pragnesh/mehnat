// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('OrderHistory Screen');
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

/*
 * Function for open left drawer menu from pos screen
 */
var orderType = 0;
function toggleLeftView() {

	Alloy.Globals.openLeft();
}

$.orderSearch.addEventListener('change', function(e) {
	var searchTxt = e.value;
	Ti.API.info('****SEARCH LENGTH***1 ' + searchTxt.length);
	var newArr = [];
	$.mainView.visible = false;
	for (var i = 0; i < Alloy.Globals.historyOrderData.length; i++) {
		var rest = Alloy.Globals.historyOrderData[i].fullname;

		if (rest.toLowerCase().indexOf(searchTxt.toLowerCase()) != -1) {

			newArr.push(Alloy.Globals.historyOrderData[i]);

		} else {

		}
	}
	Alloy.Globals.getOrderHistoryList(newArr, 1);

});

var rowHeight = Titanium.Platform.displayCaps.platformHeight * 0.12;

function openFunc(e) {

}

Alloy.Globals.setTotalViewOrderHistory = function(itemDetail) {

	$.grandTotalLbl.text = "$" + itemDetail[0].subtotal;
	// $.discountLbl.text = "$" + itemDetail[0].dis_value;
	$.subTotalLbl.text = "$" + itemDetail[0].subtotal;
	// $.taxLbl.text = "$" + itemDetail[0].tax;
	$.taxLbl.text = "0%";
	$.discountLbl.text = "0%";

	$.order_no_value_lbl.text = "#" + itemDetail[0].id;
	orderType = itemDetail[0].order_type;
};

var priviousObj = "";
Alloy.Globals.getOrderHistoryList = function(itemDetail, selection) {
	var tableData = [];
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
		} else {
			row.backgroundColor = "#fff";
		}

		var mainView = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			layout : "horizontal"
		});
		var viewimage = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : "25%",
		});
		mainView.add(viewimage);

		var userImg = Ti.UI.createImageView({
			height : "66",
			width : "66",
			borderRadius : "33",

			defaultImage : "/images/user_img.png",
			image : "0"

		});
		if (itemDetail[i].profile_pic != null && itemDetail[i].profile_pic != "") {
			userImg.image = itemDetail[i].profile_pic;
		}
		viewimage.add(userImg);

		var detailVw = Ti.UI.createView({
			layout : "vertical",
			height : Ti.UI.SIZE
		});
		mainView.add(detailVw);
		var nameLbl = Ti.UI.createLabel({
			color : '#3A322E',
			text : itemDetail[i].fullname,
			left : 0,
			font : {
				fontSize : 18,
			},
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		var ordernoVw = Ti.UI.createView({
			layout : "horizontal",
			left : 0,
			height : Ti.UI.SIZE,
		});
		var ordernoTxtLbl = Ti.UI.createLabel({
			color : '#3A322E',
			text : "Order no. " + itemDetail[i].id,
			left : 0,
			font : {
				fontSize : 12,
			},
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		ordernoVw.add(ordernoTxtLbl);
		var orderNoValueLbl = Ti.UI.createLabel({
			color : '#c32032',
			//text : itemDetail[i].orderNumber,
			font : {
				fontSize : 12,
			},
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});

		ordernoVw.add(orderNoValueLbl);
		detailVw.add(nameLbl);
		detailVw.add(ordernoVw);

		var pickupLbl = Ti.UI.createLabel({
			color : '#3A322E',
			text : "Pick up : " + itemDetail[i].pickup_date,
			left : 0,
			font : {
				fontSize : 12,
			},
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		if (itemDetail[i].order_type == "pos") {
			pickupLbl.text = "Pick up : NA";
		} else {
			pickupLbl.text = "Pick up : " + itemDetail[i].pickup_date;

		}
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

var orderDetailRowHeight = Titanium.Platform.displayCaps.platformHeight * 0.070;
Ti.API.info("row height " + orderDetailRowHeight);

//Commenting because of sample data

//getOrderDetailList(order_detail_sample_data);

Alloy.Globals.getOrderDetailList = function(itemDetail) {
	Ti.API.info('itemDetail historyyy  ' + JSON.stringify(itemDetail));
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
		var number = 2;
		Ti.API.info("**orderDetails histry in list** " + JSON.stringify(orderDetails));
		Ti.API.info("**length histry in list** " + orderDetails.length());
		row.orderDetails = JSON.parse(itemDetail[i].order_details);
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
				if (orderType == "pos") {
					if (orderDetails[j].option[k].modifier_prefix_name != "") {
						var modifierName = orderDetails[j].option[k].modifier_prefix_name + " " + orderDetails[j].option[k].modifier_name;
					} else {
						var modifierName = orderDetails[j].option[k].modifier_name;
					}

				} else {
					var modifierName = orderDetails[j].option[k].modifier_name;
				}
				var orderDetailitemNameLbl = Ti.UI.createLabel({
					color : '#3A322E',
					text : modifierName,
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
					text : "$" + priceVal,
					left : "72.5%",
					maxLines : "1",
					visible : false,
					textAlign : "center",
					font : {
						fontSize : 14,
					},
					width : "10%",
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

				});
				if (orderDetails[j].option[k].price == " ") {
					orderDetaileachLbl.text = "";

				}

				orderDetailVw.add(orderDetaileachLbl);
				var orderDetailtotalLbl = Ti.UI.createLabel({
					color : '#3A322E',
					text : "$" + quantity * priceVal,
					left : "82.5%",
					textAlign : "right",
					visible: false,
					maxLines : "1",
					font : {
						fontSize : 14,
					},
					width : "15%",
					ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

				});
				// if (orderType == "pos") {
				// orderDetailtotalLbl.text = "$" + orderDetails[j].option[k].modifier_price;
				// } else {
				// if (orderDetails[j].option[k].quantity == "" || orderDetails[j].option[k].price == "") {
				// if (quantity) {
				// orderDetailtotalLbl.text = "$" + orderDetails[j].option[k].price;
				// } else if (orderDetails[j].option[k].price == "") {
				// orderDetailtotalLbl.text = "";
				// }
				// }
				// }

				orderDetailVw.add(orderDetailtotalLbl);
				number++;
				orderDetailVw.value = number;
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
		Ti.API.info('itemDetail[i].quantity_purchased ' + itemDetail[i].quantity_purchased);
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
	Ti.API.info('ORDER HISTORY ' + JSON.stringify(orderDetails));
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
var orderId = 0;
function ordersTableClickFun(e) {
	$.mainView.visible = true;
	var orderDetail = Alloy.Globals.DbManager.Get_OrderDetail_From_DB(e.row.detail.id);
	orderType = e.row.detail.order_type;
	orderId = e.row.detail.id;
	Alloy.Globals.getOrderDetailList(orderDetail);
	Ti.API.info('orderDetail' + JSON.stringify(orderDetail));
	priviousObj.backgroundColor = "#fff";

	$.grandTotalLbl.text = "$" + e.row.detail.subtotal;
	// $.discountLbl.text = "$" + e.row.detail.dis_value;
	$.subTotalLbl.text = "$" + e.row.detail.subtotal;
	// $.taxLbl.text = "$" + e.row.detail.tax;
	$.taxLbl.text = "0%";
	$.discountLbl.text = "0%";

	$.order_no_value_lbl.text = "#" + e.row.detail.id;
	e.row.backgroundColor = "#BBBBBB";

	Ti.API.info('orderType ' + orderType);

	priviousObj = e.row;
};

function refundFunc() {
	if (role_permission.indexOf("refund_order") != -1) {
		refundService(orderId);
	} else {
		Alloy.Globals.Notifier.show(L('validation_refund_order_permission'));
	}
}

function refundService(order_id) {
	var data = {};
	data.order_id = order_id;
	data.refund_status = 1;
	data.user_id = Alloy.Globals.employee_id;
	data.store_id = Alloy.Globals.store_id;
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_REFUND_ORDER = Alloy.Globals.Constants.SERVICE_REFUND_ORDER;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_REFUND_ORDER, refundServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_REFUND_ORDER);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

function refundServiceCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				Ti.API.info('response.action_success = ' + response.response_code);

				if (response.response_code == '1') {
					Alloy.Globals.Notifier.show(response.responseMessage);
					$.refundBtn.enabled = false;
					$.refundBtn.disabledColor = "lightgray";
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error refundServiceCallback :: ' + e.message);
			tracker.addException({
				description : "OrderHistoryScreen: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}

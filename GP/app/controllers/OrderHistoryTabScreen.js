// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('OrderHistoryTab Screen');
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

var ordersHistoryListArray = [];
var selectedOrder;
var selectedOrderDetails;
var selectedIndex = -1;
var tableViewIndex = 0;
var orderId = 0;
var transactionNo = 0;
var totalAmount = 0;

var givex_code = 0;
var givex_num = 0;
var orderType;

/*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {

	Alloy.Globals.openLeft();
}

Alloy.Globals.fetchOrdersHistory = function() {
	Ti.API.info("Inside fetchOrders");
	ordersHistoryListArray = Alloy.Globals.DbManager.Get_Sale_From_DB_orderHistory();
	sortOrderHistoryData();
	selectedIndex = -1;
	tableViewIndex = 0;
	$.filterBtn.enabled = true;
	renderOrdersList(tableViewIndex, selectedIndex);
};

function sortOrderHistoryData() {
	function compare(a, b) {
		var a = a.updated_at.replace(" ", "T");
		var valuea = new Date(a).getTime();
		var b = b.updated_at.replace(" ", "T");
		var valueb = new Date(b).getTime();
		if (valuea > valueb)
			return -1;
		if (valuea < valueb)
			return 1;
		return 0;
	}


	ordersHistoryListArray.sort(compare);
}

function renderOrdersList(tableIndex, selectIndex) {
	selectedIndex = selectIndex;
	tableViewIndex = tableIndex;
	var listViewItems = [];
	Ti.API.info('ordersHistoryListArray table =' + JSON.stringify(ordersHistoryListArray));
	for (var i = 0; i < ordersHistoryListArray.length; i++) {
		var orderData = ordersHistoryListArray[i];
		selectedIndex = 0;

		var listItem = {
			properties : {
				searchableText : orderData.fullname + " " + orderData.id,
				itemId : orderData.id,
			},
			customerPic : {
				image : "0" //To set default image
			},
			customerName : {
				text : orderData.fullname
			},
			pickupDate : {
				text : "Pickup time: " + orderData.pickup_date
			},
			totalAmount : {
				text : "Total Amount: $" + orderData.order_total_price
			},
			orderId : {
				text : "Order #" + orderData.id
			}
		};
		// if (orderData.order_type == "pos") {
		// listItem.pickupDate.text = "Pick up : NA";
		// } else {
		listItem.pickupDate.text = "Date : " + Alloy.Globals.DateTimeUtils.getFormattedDate(orderData.created_at);

		//}
		//if (orderData.profile_pic != null && orderData.profile_pic != "") {
			if (orderData.order_type == "app") {
				listItem.customerPic.image = "/images/mobile-phone3.png";
			} else if (orderData.order_type == "pos") {
				listItem.customerPic.image = "/images/posIcon.png";
			} else if (orderData.order_type == "website") {
				listItem.customerPic.image = "/images/Website.png";
			}else if (orderData.order_type == "kiosk") {
				listItem.customerPic.image = "/images/kiosk.png";
			}
			//listItem.customerPic.image = orderData.profile_pic;
		//}
		listViewItems.push(listItem);
	};

	$.orderHistoryList.setItems(listViewItems);

	if (listViewItems.length > 0 && listViewItems.length > tableViewIndex) {
		$.orderHistoryListView.selectItem(0, tableViewIndex);
		selectedOrder = ordersHistoryListArray[selectedIndex];
		orderIndex = selectedIndex;
	} else {
		selectedOrder = null;
	}
	renderOrderDetails();
}

var orderIndex = 0;
function orderSelected(e) {
	$.listitemSearch.blur();
	for (var i = 0; i < ordersHistoryListArray.length; i++) {
		if (e.itemId == ordersHistoryListArray[i].id) {
			selectedIndex = i;
			break;
		}
	};
	tableViewIndex = e.itemIndex;

	selectedOrder = ordersHistoryListArray[selectedIndex];
	orderIndex = selectedIndex;
	renderOrderDetails();
	Ti.API.info("**********Selected Order***************");
	Ti.API.info(JSON.stringify(selectedOrder));
}

var getSplitPyament = [];
var payMethod;
var orderType;
function renderOrderDetails() {
	if (selectedOrder != null) {
		if (selectedOrder.is_refund == "0") {
			$.refundBtn.enabled = true;
			$.refundBtn.backgroundColor = "#c32032";
			$.refundBtn.disabledColor = "white";
		} else {
			$.refundBtn.enabled = false;
			$.refundBtn.backgroundColor = "lightgray";
			$.refundBtn.disabledColor = "gray";
		}
		orderId = selectedOrder.id;
		transactionNo = selectedOrder.trans_num;
		givex_code = selectedOrder.givex_code;
		givex_num = selectedOrder.givex_num;
		orderType = selectedOrder.order_type;
		totalAmount = selectedOrder.order_total_price;
		orderType = selectedOrder.order_type;
		if (totalAmount == 0 || totalAmount == 0.00) {
			$.refundBtn.enabled = false;
			$.refundBtn.backgroundColor = "lightgray";
			$.refundBtn.disabledColor = "gray";
		}
		Ti.API.info("selectedOrder = " + JSON.stringify(selectedOrder));
		getSplitPyament = [];
		if (selectedOrder.payment_method == "split") {
			payMethod = "split";
			getSplitPyament = Alloy.Globals.DbManager.getPaymentDetailFromDB1(selectedOrder.id);
			// $.orderListTable.bottom = 100;
			// $.paymentVW.visible = true;
			// $.paymentDetailLbl.text = "Payment Summary: " + getSplitPyament.map(function(v) {
			// return v.method+"($"+parseFloat(v.amount).toFixed(2)+")";
			// }).join(', ');
			createGridOfPaymentSummary(getSplitPyament, "split");
		} else {
			payMethod = selectedOrder.payment_method;
			var payObj = {};

			if (selectedOrder.payment_method == "cash" || selectedOrder.payment_method == "zero_payment") {
				payObj.method = "Cash";
			} else if (selectedOrder.payment_method == "housing_management") {
				payObj.method = "Housing Account";
			} else if (selectedOrder.payment_method == "credit_card") {
				payObj.method = "Credit Card";
			} else if (selectedOrder.payment_method == "gift_card") {
				payObj.method = "Gift Card";
			}
			//payObj.method = selectedOrder.payment_method;

			payObj.amount = selectedOrder.order_total_price;
			getSplitPyament.push(payObj);
			createGridOfPaymentSummary(getSplitPyament, "normal");
			//$.orderListTable.bottom = 70;
			// $.paymentVW.visible = false;
		}

		selectedOrderDetails = Alloy.Globals.DbManager.Get_OrderDetail_From_DB(selectedOrder.id);
		Ti.API.info("selectedOrderDetails = " + JSON.stringify(selectedOrderDetails));

		if (selectedOrderDetails != null) {
			$.mainView.visible = true;
			$.order_no_value_lbl.text = "#" + selectedOrder.id;
			$.token_no_value_lbl.text = "#" + selectedOrder.order_token;
			$.date_tim_lbl.text = Alloy.Globals.DateTimeUtils.getFormattedDate(selectedOrder.created_at);
			$.subTotalLbl.text = "$" + parseFloat((selectedOrder.subtotal)).toFixed(2);
			if (selectedOrder.loyality_point == "0") {
				$.layaltypt.height = 0;
				$.loyaltyPtVal.height = 0;
				$.layaltypt.visible = false;
				$.loyaltyPtVal.visible = false;
				$.layaltyvalLbl.height = 0;
				$.loyaltyVal.height = 0;
				$.layaltyvalLbl.visible = false;
				$.loyaltyVal.visible = false;
				$.txtstaticLbl.top = 60;
				$.taxLbl.top = 60;
				$.staticGrandTotalLbl.top = 90;
				$.grandTotalLbl.top = 90;
			} else {
				$.layaltypt.height = 30;
				$.loyaltyPtVal.height = 30;
				$.loyaltyPtVal.text = "-" + selectedOrder.loyality_point + " Pts.";
				$.loyaltyVal.text = "-$" + selectedOrder.loyality_value;
				$.layaltypt.visible = true;
				$.loyaltyPtVal.visible = true;
				$.layaltyvalLbl.height = 30;
				$.loyaltyVal.height = 30;
				$.layaltyvalLbl.visible = true;
				$.loyaltyVal.visible = true;
				$.txtstaticLbl.top = 120;
				$.taxLbl.top = 120;
				$.staticGrandTotalLbl.top = 150;
				$.grandTotalLbl.top = 150;
			}
			//if (selectedOrder.order_type == "pos") {
			//$.discountLbl.text = selectedOrder.discount_total_price;
			//} else {
			$.discountLbl.text = "-$" + parseFloat((selectedOrder.discount_total_price)).toFixed(2);
			//}

			//$.taxLbl.text = "+$" + parseFloat(((selectedOrder.tax * selectedOrder.subtotal) / 100)).toFixed(2);
			$.taxLbl.text = "+$" + (selectedOrder.tax_value).toFixed(2);
			$.grandTotalLbl.text = "$" + parseFloat((selectedOrder.order_total_price)).toFixed(2);

			renderOrderedMenuItems();
			if (selectedOrder.order_status == "cancelled") {
				$.declineReasonVw.visible = true;
				$.refundVw.visible = false;
				$.orderStatusLbl.text = "Order Status: Declined";
				$.reasonLbl.text = "Reason: " + selectedOrder.comment;
			} else {
				$.declineReasonVw.visible = false;
				$.refundVw.visible = true;
			}
		} else {
			$.mainView.visible = false;
			alert("Something wrong happened, please sync your POS with server");
		}
	} else {
		$.mainView.visible = false;
	}
}

function createGridOfPaymentSummary(detail, type) {
	var total = 0;
	$.paymentDetailVW.removeAllChildren();
	for (var i = 0; i < detail.length; i++) {

		var detailRow = Ti.UI.createView({
			top : 0,
			width : Ti.UI.FILL,
			height : 30
		});
		var methodLbl = Ti.UI.createLabel({
			color : '#3A322E',
			left : 10,
			textAlign : "center",
			maxLines : "1",
			text : detail[i].method,
			font : {
				fontSize : 14,
				fontFamily : "Montserrat-Light"
			},

			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		detailRow.add(methodLbl);
		total += detail[i].amount;
		var price = Ti.UI.createLabel({
			color : '#3A322E',
			right : 10,
			textAlign : "center",
			maxLines : "1",
			text : "$" + parseFloat(detail[i].amount).toFixed(2),
			font : {
				fontSize : 14,
				fontFamily : "Montserrat-Light"
			},

			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		detailRow.add(price);
		$.paymentDetailVW.add(detailRow);
	};
	if (type == "split") {
		var separator = Ti.UI.createView({
			top : 0,
			width : Ti.UI.FILL,
			height : 1,
			backgroundColor : "#ECEBF3"
		});
		$.paymentDetailVW.add(separator);
		var totalVW = Ti.UI.createView({
			top : 0,
			width : Ti.UI.FILL,
			height : 30,

		});
		$.paymentDetailVW.add(totalVW);
		var totalStaticprice = Ti.UI.createLabel({
			color : '#3A322E',
			left : 10,
			textAlign : "center",
			maxLines : "1",
			text : "Total",
			font : {
				fontSize : 14,
				fontFamily : "Montserrat-Light"
			},

			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		totalVW.add(totalStaticprice);
		var totalprice = Ti.UI.createLabel({
			color : '#3A322E',
			right : 10,
			textAlign : "center",
			maxLines : "1",
			text : "$" + parseFloat(total).toFixed(2),
			font : {
				fontSize : 14,
				fontFamily : "Montserrat-Light"
			},

			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

		});
		totalVW.add(totalprice);
	}
}

function renderOrderedMenuItems() {
	if (selectedOrderDetails != null) {
		var tableData = [];
		var totalPrice;
		for (var i = 0; i < selectedOrderDetails.length; i++) {
			var row = Ti.UI.createTableViewRow({
				height : 72,
				backgroundColor : "white",
				expand : "yes",
				selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
				detail : selectedOrderDetails[i]
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
			var orderDetails = JSON.parse(selectedOrderDetails[i].order_details);
			Ti.API.info('itemDetail historyyy newww ' + JSON.stringify(orderDetails));
			var totalOrderPrice = 0;
			for (var j = 0; j < orderDetails.length; j++) {
				for (var k = 0; k < orderDetails[j].option.length; k++) {
					var orderDetailVw = Ti.UI.createView({
						height : 30,
						width : Ti.UI.FILL,
					});
					mainView.add(orderDetailVw);
					var orderDetailserialNoLbl = Ti.UI.createLabel({
						color : '#3A322E',
						left : "0.2%",
						textAlign : "center",
						maxLines : "1",
						font : {
							fontSize : 16,
							fontFamily : "Montserrat-Light"
						},
						width : "10%",
						ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

					});
					orderDetailVw.add(orderDetailserialNoLbl);
					var orderdetailNameVw = Ti.UI.createView({
						width : "40%",
						left : "10.5%",

					});
					orderDetailVw.add(orderdetailNameVw);
					var orderDetailitemNameLbl = Ti.UI.createLabel({
						color : '#3A322E',
						text : orderDetails[j].modifier_group_name + " - " + orderDetails[j].option[k].modifier_name,
						textAlign : "left",
						maxLines : "1",
						left : 0,
						font : {
							fontSize : 14,
							fontFamily : "Montserrat-Light"
						},
						width : Ti.UI.SIZE,
						height : Ti.UI.FILL,
						right : 30,
						ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

					});
					orderdetailNameVw.add(orderDetailitemNameLbl);
					if ((j == 0 && (orderDetails.length > 1 || (selectedOrderDetails[i].discount_type != "" ))) && k == 0) {

						Ti.API.info('orderDetails.length****    ' + orderDetails.length);
						Ti.API.info('discount_type    ' + selectedOrderDetails[i].discount_type);
						var dropDownImg = Ti.UI.createImageView({
							height : Ti.UI.SIZE,
							width : Ti.UI.SIZE,
							image : "/images/drop_arrow_new_order.png",
							right : 0,

						});
						//dropDownImg.left = orderDetailitemNameLbl.width+5;
						//imageContaineVw.add(dropDownImg);
						orderdetailNameVw.add(dropDownImg);
					}
					if (orderDetails[j].selection_time == "Multiple") {
						if (j != 0 && (orderDetails[j].option[k].modifier_prefix_name != "" || orderDetails[j].option[k].modifier_prefix_name != 0)) {
							orderDetailitemNameLbl.text = orderDetails[j].modifier_group_name + " - " + orderDetails[j].option[k].modifier_prefix_name + " " + orderDetails[j].option[k].modifier_name + " (x" + orderDetails[j].option[k].quantity + ")";
						} else {
							orderDetailitemNameLbl.text = orderDetails[j].modifier_group_name + " - " + orderDetails[j].option[k].modifier_name + " (x" + orderDetails[j].option[k].quantity + ")";
						}
					} else {
						if (j != 0 && (orderDetails[j].option[k].modifier_prefix_name != "" || orderDetails[j].option[k].modifier_prefix_name != 0)) {
							orderDetailitemNameLbl.text = orderDetails[j].modifier_group_name + " - " + orderDetails[j].option[k].modifier_prefix_name + " " + orderDetails[j].option[k].modifier_name;
						} else {
							orderDetailitemNameLbl.text = orderDetails[j].modifier_group_name + " - " + orderDetails[j].option[k].modifier_name;
						}

					}
					if (orderDetails[j].option[k].hasOwnProperty("quantity")) {
						var quantity = orderDetails[j].option[k].quantity;
					} else {
						var quantity = 1;
					}
					if (selectedOrder.order_type == "pos") {
						var priceVal = orderDetails[j].option[k].modifier_price;
					} else {
						var priceVal = orderDetails[j].option[k].price;
					}
					totalOrderPrice = totalOrderPrice + priceVal;
					var orderDetailquantityLbl = Ti.UI.createLabel({
						color : '#3A322E',
						text : quantity,
						left : "57.5%",
						maxLines : "1",
						visible : false,
						textAlign : "center",
						font : {
							fontSize : 14,
							fontFamily : "Montserrat-Light"
						},
						width : "15%",
						ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

					});
					orderDetailVw.add(orderDetailquantityLbl);
					var orderDetaileachLbl = Ti.UI.createLabel({
						color : '#3A322E',
						text : "$" + toFixed(priceVal).toFixed(2),
						left : "72.5%",
						maxLines : "1",
						textAlign : "right",
						visible : false,
						font : {
							fontSize : 14,
							fontFamily : "Montserrat-Light"
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
						text : "$" + toFixed(quantity * priceVal).toFixed(2),
						left : "82.5%",
						textAlign : "right",
						maxLines : "1",
						visible : true,
						font : {
							fontSize : 14,
							fontFamily : "Montserrat-Light"
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
				left : "0.2%",
				textAlign : "center",
				maxLines : "1",
				font : {
					fontSize : 16,
					fontFamily : "Montserrat-Regular"
				},
				width : "10%",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			orderVw.add(serialNoLbl);
			var itemNameLbl = Ti.UI.createLabel({
				color : '#000',
				text : selectedOrderDetails[i].menu_name,
				left : "10.5%",
				textAlign : "left",
				maxLines : "1",
				font : {
					fontSize : 16,
					fontFamily : "Montserrat-Regular"
				},
				width : "50%",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			orderVw.add(itemNameLbl);
			var quantityLbl = Ti.UI.createLabel({
				color : '#000',
				text : selectedOrderDetails[i].quantity_purchased,
				maxLines : "1",
				left : "57.5%",
				textAlign : "center",
				font : {
					fontSize : 16,
					fontFamily : "Montserrat-Regular"
				},
				width : "15%",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			orderVw.add(quantityLbl);
			var eachLbl = Ti.UI.createLabel({
				color : '#000',
				text : "$" + toFixed(selectedOrderDetails[i].item_coustomized_price / selectedOrderDetails[i].quantity_purchased).toFixed(2),
				left : "72.5%",
				maxLines : "1",
				textAlign : "right",
				font : {
					fontSize : 16,
					fontFamily : "Montserrat-Regular"
				},
				width : "10%",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			orderVw.add(eachLbl);

			var totalLbl = Ti.UI.createLabel({
				color : '#000',
				//text : "$" + selectedOrderDetails[i].quantity_purchased * selectedOrderDetails[i].serving_price,
				text : "$" + selectedOrderDetails[i].item_coustomized_price,
				left : "82.5%",
				maxLines : "1",
				textAlign : "right",
				font : {
					fontSize : 16,
					fontFamily : "Montserrat-Regular"
				},
				width : "15%",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			orderVw.add(totalLbl);
			var discountVw = Ti.UI.createView({
				height : 30,
				width : Ti.UI.FILL
			});
			var discountLbl = Ti.UI.createLabel({
				color : '#3A322E',
				text : "Discount",
				left : "10.5%",
				maxLines : "1",
				textAlign : "left",
				font : {
					fontSize : 14,
					fontFamily : "Montserrat-Light"
				},
				width : "50%",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			discountVw.add(discountLbl);
			var discountValueLbl = Ti.UI.createLabel({
				color : '#3A322E',
				right : "2.5%",
				maxLines : "1",
				textAlign : "right",
				font : {
					fontSize : 14,
					fontFamily : "Montserrat-Light"
				},
				width : "15%",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,

			});
			discountVw.add(discountValueLbl);
			if (selectedOrderDetails[i].discount_type == "" || selectedOrderDetails[i].discount_type == "0" || selectedOrderDetails[i].discount_type == 0) {
				row.height = 72;
				discountVw.height = 0;
			} else {
				//row.height = 102;
				row.height = 72;
				// if (selectedOrder.order_type == "pos") {
				//discountValueLbl.text = selectedOrderDetails[i].discount_price;
				// } else {
				discountValueLbl.text = "-$" + toFixed(selectedOrderDetails[i].discount_price).toFixed(2);
				// }
			}
			// var orderDetails = JSON.parse(row.detail.order_details);
			// var all_modifier_group = [];
			// for ( i = 0; i < orderDetails.length; i++) {
			//
			// for (var j = 0; j < orderDetails[i].option.length; j++) {
			// var menuObj = {
			// modifier_name : orderDetails[i].option[j].modifier_name
			// };
			// all_modifier_group.push(menuObj);
			// }
			//
			// }
			// Ti.API.info('orderDetails.length ' + orderDetails.length);
			//
			// if (orderDetails.length == 0 || (row.detail.discount_type == "" || row.detail.discount_type == "0" || row.detail.discount_type == 0)) {
			// row.height = 42 + 30 * all_modifier_group.length;
			// } else {
			// row.height = 42 + discountVw.height + 30 * all_modifier_group.length;
			// }
			mainView.add(discountVw);
			row.add(mainView);
			var orderDetails = JSON.parse(row.detail.order_details);
			var all_modifier_group = [];
			for (var m = 0; m < orderDetails.length; m++) {

				for (var n = 0; n < orderDetails[m].option.length; n++) {
					var menuObj = {
						modifier_name : orderDetails[m].option[n].modifier_name
					};
					all_modifier_group.push(menuObj);
				}

			}
			Ti.API.info('orderDetails.length ' + orderDetails.length);

			if (orderDetails.length == 0 || (row.detail.discount_type == "" || row.detail.discount_type == "0" || row.detail.discount_type == 0)) {
				row.height = 42 + 30 * all_modifier_group.length;
			} else {
				row.height = 42 + discountVw.height + 30 * all_modifier_group.length;
			}
			tableData.push(row);

		};
		$.orderListTable.setData(tableData);
	} else {
		$.mainView.visible = false;
		alert("Something wrong happened, please sync your POS with server");
	}
}

function orderDetailTableClickFun(e) {
	var orderDetails = JSON.parse(e.row.detail.order_details);
	//Ti.API.info('NEW ORDER  ' + JSON.stringify(orderDetails));
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
		//	Ti.API.info('orderDetails.length ' + orderDetails.length);
		if (orderDetails.length > 1 || e.row.detail.discount_type != "") {
			e.row.getChildren()[0].getChildren()[1].getChildren()[1].getChildren()[1].image = "/images/drop_arrow_new_order.png";
		}
		if (orderDetails.length == 0 || (e.row.detail.discount_type == "" || e.row.detail.discount_type == "0" || e.row.detail.discount_type == 0)) {
			e.row.height = 42 + 30 * all_modifier_group.length;
		} else {
			e.row.height = 42 + e.row.getChildren()[0].getChildren()[2].height + 30 * all_modifier_group.length;
		}
	} else {
		if (e.row.expand == 'yes') {
			e.row.expand = 'no';
			if (orderDetails.length > 1 || e.row.detail.discount_type != "") {
				e.row.getChildren()[0].getChildren()[1].getChildren()[1].getChildren()[1].image = "/images/up_arrow_nw_order.png";
			}
			// if (orderDetails.length == 0) {
			// e.row.height = 72;
			// } else {
			// e.row.height = 72 + e.row.getChildren()[0].getChildren()[2].height;
			// }
			e.row.height = 72;
		}
	}

};

function searchCancel() {
	setTimeout(function() {
		try {
			Ti.API.info("selectedIndex = " + selectedIndex);
			$.filterBtn.enabled = true;
			$.noLbl.visible = false;
			$.orderHistoryListView.selectItem(0, tableViewIndex);
			selectedOrder = ordersHistoryListArray[selectedIndex];
		} catch(e) {
			Ti.API.info("In catch = " + e.message);

			tracker.addException({
				description : "OrderHistoryScreen: " + e.message,
				fatal : false
			});
		}
	}, 100);
}

function refundFunc() {
	if (role_permission.indexOf("refund_order") != -1) {
		dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ["Yes", "No"],
			message : "Are you sure want to refund this order?",
			title : "Gongcha POS"
		});
		dialog.addEventListener('click', function(k) {
			if (k.index === k.source.cancel) {
				Ti.API.info('The cancel button was clicked');
			} else {
				if (Ti.Network.online) {
					sendOTPForCheckout();
				} else {
					Alloy.Globals.Notifier.show(L("internat_connection_message"));
				}
			}
		});
		dialog.show();
	} else {
		Alloy.Globals.Notifier.show(L('validation_refund_order_permission'));
	}
}

Alloy.Globals.refundValidation = function() {
	if (payMethod == "split") {
		if (!isCreditOrGiftTransaction()) {
			refundService(orderId, totalAmount, "");
		}
	} else {
		if (orderType == "pos") {
			if (payMethod == "credit_card") {
				if (Ti.App.Properties.getString("pax_ip")) {
					returnTransactionRequest(totalAmount, transactionNo);
				} else {
					Alloy.Globals.Notifier.show(L('pax_validation_text2'));
				}
			} else if (payMethod == "gift_card") {
				returnGiftTransactionRequest(totalAmount, transactionNo, givex_code, givex_num);
			} else {
				refundService(orderId, totalAmount, "");
			}
		} else {
			refundService(orderId, totalAmount, "");
		}
	}
};
function isCreditOrGiftTransaction() {
	for (var i = 0; i < getSplitPyament.length; i++) {

		if (getSplitPyament[i].payment_method == "credit_card") {
			if (getSplitPyament[i].is_refund == "0" || getSplitPyament[i].is_refund == 0) {
				if (Ti.App.Properties.getString("pax_ip")) {
					returnTransactionRequest(getSplitPyament[i].calculationAmt, getSplitPyament[i].trans_num, i);
				} else {
					Alloy.Globals.Notifier.show(L('pax_validation_text2'));
				}

				return true;
			}

		} else if (getSplitPyament[i].payment_method == "gift_card") {
			if (getSplitPyament[i].is_refund == "0" || getSplitPyament[i].is_refund == 0) {
				Ti.API.info('&&&&&&&&&&&&&& ' + JSON.stringify(getSplitPyament[i]));
				returnGiftTransactionRequest(getSplitPyament[i].amount, getSplitPyament[i].trans_num, getSplitPyament[i].givex_code, getSplitPyament[i].givex_num, i);
				return true;
			}
		}

	};
	return false;
}

function checkPaymentMethod(method) {
	try {
		var flag = false;

		for (var i = 0; i < getSplitPyament.length; i++) {
			Ti.API.info(' getSplitPyament ' + JSON.stringify(getSplitPyament[i]));
			if (getSplitPyament[i].payment_method == method) {
				if (method == "credit_card") {
					var detail = {};
					detail.transNum = getSplitPyament[i].trans_num;
					detail.amt = getSplitPyament[i].amount;
					return detail;
				} else if (method == "gift_card") {
					var detail = {};
					detail.transNum = getSplitPyament[i].trans_num;
					detail.amt = getSplitPyament[i].amount;
					detail.givex_code = getSplitPyament[i].givex_code;
					detail.givex_num = getSplitPyament[i].givex_num;
					return detail;
				}
				return true;
			}
		};

		return false;
	} catch(e) {
		Ti.API.info("Error checkPaymentMethod " + e.message);
		return false;
	}
}

function returnGiftTransactionRequest(amt, transactionCode, givex_code, givex_num, index) {
	ind = index;
	var data = {
		"jsonrpc" : "2.0",
		"method" : "918", //Reversal
		"id" : "437",
		"params" : ["0", transactionCode, "696636", "2164", givex_num, amt]
	};
	Ti.API.info('DATA ' + JSON.stringify(data));

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.postFormData("https://dc-us2.givex.com:50104", returnGiftTransactionRequestCallback, JSON.stringify(data));
		Ti.API.info('https://dc-us2.givex.com:50104');
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

/*
 *Callback function for pre auth gift transaction
 */

function returnGiftTransactionRequestCallback(e) {
	Ti.API.info("returnGiftTransactionRequestCallback response : " + JSON.stringify(e));
	if (e.success) {
		var response = JSON.parse(e.response);
		Ti.API.info("response : " + response);
		if (response.result[1] == "0") {
			if (payMethod == "split") {
				getSplitPyament[ind].is_refund = 1;
				updateSplitRefundTagZeroToOne(orderId, "gift_card");
				if (!isCreditOrGiftTransaction()) {
					updateRefundTagZeroToOne();
					Alloy.Globals.Notifier.show("Your order amount $" + totalAmount + "will be refunded with in 48hours");
					refundService(orderId, totalAmount, "split");
				}
			} else {
				updateRefundTagZeroToOne();
				refundService(orderId, totalAmount, "");
				Alloy.Globals.Notifier.show("Your order amount $" + totalAmount + "will be refunded with in 48hours");
			}

		} else {
			Alloy.Globals.Notifier.show("Return of gift payment has failed. Please try again");

		}
	} else {

		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}

function returnTransactionRequest(amt, transNum, index) {
	ind = index;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var request = Alloy.Globals.PaxCommunicator.voidTransactionRequestHost(amt, transNum);
		Ti.API.info('request ' + request);
		var base64 = Ti.Utils.base64encode(request);
		var paxURL = "http://" + Ti.App.Properties.getString("pax_ip") + ":10009/?" + base64;
		Alloy.Globals.PaxCommunicator.get(paxURL, returnTransactionRequestCallback);
		Ti.API.info('Transaction URL ' + paxURL);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

}

function returnTransactionRequestCallback(e) {
	Ti.API.info('E ' + JSON.stringify(e));
	if (e.success) {
		try {
			var response = e.response;
			Ti.API.info('Response : ' + JSON.stringify(response));
			if (response != null) {
				var res = Alloy.Globals.PaxCommunicator.parserTransactionResponse(e.response, "transaction");
				if (res.resultCode == "000000") {

					if (payMethod == "split") {
						updateSplitRefundTagZeroToOne(orderId, "credit_card");
						if (!isCreditOrGiftTransaction()) {
							updateRefundTagZeroToOne();
							Alloy.Globals.Notifier.show("Your order amount $" + totalAmount + "will be refunded with in 48hours");
							refundService(orderId, totalAmount, "split");
						}
					} else {
						updateRefundTagZeroToOne();
						Alloy.Globals.Notifier.show("Your order amount $" + totalAmount + "will be refunded with in 48hours");
						refundService(orderId, totalAmount, "");
					}
				} else {
					if (res.resultCode == "100021") {
						//updateRefundTagZeroToOne();

					}
					checkTransactionErrorMsg(res.resultCode, res.resultMessage);

					Alloy.Globals.LoadingScreen.close();
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
				Alloy.Globals.LoadingScreen.close();
			}
		} catch(err) {
			Ti.API.info('transactionEMVRequestCallback Error ' + err.message);
			tracker.addException({
				description : "CheckOutScreen2: " + err.message,
				fatal : false
			});
			Alloy.Globals.LoadingScreen.close();
		}
	} else {
		Alloy.Globals.Notifier.show(e.message);
		Alloy.Globals.LoadingScreen.close();

	}

}

var payType = "";
function refundService(order_id, totalAmount, type) {
	payType = type;
	var data = {};
	data.order_id = order_id;
	data.refund_status = 1;
	data.refund_amount = totalAmount;
	data.user_id = Alloy.Globals.employee_id;
	data.store_id = Alloy.Globals.store_id;
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_REFUND_ORDER = Alloy.Globals.Constants.SERVICE_REFUND_ORDER;

	if (Ti.Network.online) {
		if (type != "split") {
			Alloy.Globals.LoadingScreen.open();
		}
		Communicator.post(DOMAIN_URL + SERVICE_REFUND_ORDER, refundServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_REFUND_ORDER);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}
}

function refundServiceCallback(e) {
	Ti.API.info('e ' + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {
				if (response.response_code == '1') {

					$.refundBtn.enabled = false;
					$.refundBtn.backgroundColor = "lightgray";
					$.refundBtn.disabledColor = "gray";

					tracker.addEvent({
						category : "Refund Order",
						action : "Refund order for OrderId: " + orderId,
						label : "",
						value : 1
					});
					if (payType != "split") {
						updateRefundTagZeroToOne();
						updateSplitRefundTagZeroToOne();
						//Alloy.Globals.Notifier.show(response.message);
					}
					if (payMethod == "cash" || payMethod == "housing_management") {
						Alloy.Globals.Notifier.show(response.message);
					}

				} else {
					Alloy.Globals.Notifier.show(response.message);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			tracker.addException({
				description : "OrderHistoryScreenTab: " + e.message,
				fatal : false
			});
			Ti.API.info('Error refundServiceCallback :: ' + e.message);
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();
}

function updateRefundTagZeroToOne() {
	try {
		ordersHistoryListArray[orderIndex].is_refund = "1";
		Alloy.Globals.DbManager.updateRefundTagValue(ordersHistoryListArray[orderIndex].id);
		$.refundBtn.enabled = false;
		$.refundBtn.backgroundColor = "lightgray";
		$.refundBtn.disabledColor = "gray";
	} catch(e) {
		tracker.addException({
			description : "OrderHistoryScreenTab: " + e.message,
			fatal : false
		});
		Ti.API.info('Error updateRefundTagZeroToOne ' + e.message);
	}
}

function updateSplitRefundTagZeroToOne() {
	try {
		ordersHistoryListArray[orderIndex].is_refund = "1";
		Alloy.Globals.DbManager.updateSplitRefundTagValue(ordersHistoryListArray[orderIndex].id);
		$.refundBtn.enabled = false;
		$.refundBtn.backgroundColor = "lightgray";
		$.refundBtn.disabledColor = "gray";
	} catch(e) {
		tracker.addException({
			description : "OrderHistoryScreenTab: " + e.message,
			fatal : false
		});
		Ti.API.info('Error updateRefundTagZeroToOne ' + e.message);
	}
}

function updateSplitRefundTagZeroToOne(orderId, method) {
	try {
		//	ordersHistoryListArray[orderIndex].is_refund = "1";
		Alloy.Globals.DbManager.updateSplitRefundTagValue(ordersHistoryListArray[orderIndex].id, method);

	} catch(e) {
		tracker.addException({
			description : "OrderHistoryScreenTab updateSplitRefundTagZeroToOne: " + e.message,
			fatal : false
		});
		Ti.API.info('Error updateSplitRefundTagZeroToOne ' + e.message);
	}
}

var filterData = [{
	value : 0,
	title : "Today"
}, {
	value : 1,
	title : "Yesterday"
}, {
	value : 7,
	title : "Last 7 days"
}, {
	value : 30,
	title : "Last 30 days"
}, {
	value : "",
	title : "All"
}];
var selectedDuration;
Alloy.Globals.filterSelectedIndex = 4;
function OpenFilterView() {
	$.listitemSearch.blur();
	var popoverView = Ti.UI.createView({
		backgroundColor : "white",
		layout : "vertical",
		width : 270,
		height : 250
	});

	// var buttonBarView = Titanium.UI.createView({
	// top : 0,
	// backgroundColor : "white",
	// height : "45dp"
	// });
	// popoverView.add(buttonBarView);
	//
	// var toolbarLbl = Titanium.UI.createLabel({
	// text : "Order will be ready in",
	// height : 30,
	// color : "black",
	// textAlign : "left",
	// font : {
	// fontSize : 16,
	// }
	// });
	// var sepVw = Ti.UI.createView({
	// width : Ti.UI.FILL,
	// backgroundColor : "#bfbfbf",
	// height : 1,
	// bottom : 0
	// });
	// buttonBarView.add(sepVw);
	// buttonBarView.add(toolbarLbl);
	var footerVw = Ti.UI.createView({
		height : 1,
		backgroundColor : "transparent",

	});
	var tableView = Ti.UI.createTableView({
		backgroundColor : 'white',
		height : Ti.UI.FILL,
		top : 25,
		footerView : footerVw,
		tableSeparatorInsets : {
			left : 0,
			right : 0
		}
	});

	popoverView.add(tableView);
	var tableData = [];
	for (var i = 0; i < filterData.length; i++) {
		var popOverRow = Ti.UI.createTableViewRow({
			height : 45,
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
			detail : filterData[i]
		});
		var popOverLbl = Ti.UI.createLabel({
			text : filterData[i].title,
			color : "black",
			font : {
				fontSize : 14
			},
		});
		if (Alloy.Globals.filterSelectedIndex == i) {
			popOverLbl.color = "#c32032";
		} else {
			popOverLbl.color = "black";
		}
		popOverRow.add(popOverLbl);
		tableData.push(popOverRow);

	};
	tableView.setData(tableData);
	tableView.addEventListener("click", function(e) {
		popover.hide();
		ordersHistoryListArray = Alloy.Globals.DbManager.Get_Sale_From_DB_orderHistory();

		try {
			getFilteredOrderList(e.row.detail.value, e.index);
			Alloy.Globals.filterSelectedIndex = e.index;
		} catch(e) {
			Ti.API.info("In catch = " + e.message);

		}

	});

	var popover = Ti.UI.iPad.createPopover({

		horizontalWrap : false,
		backgroundColor : "white",
		arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_UP,
		contentView : popoverView
	});

	popover.show({
		view : $.filterBtn
	});

}

function getFilteredOrderList(pastDayCount, index) {

	var filteredList = [];

	var date = new Date();
	Ti.API.info('date =' + date);
	Ti.API.info('index =' + index);
	if (ordersHistoryListArray != null && ordersHistoryListArray.length > 0) {
		if (index == 0) {

			for (var i = 0; i < ordersHistoryListArray.length; i++) {
				var createdDate = new Date(ordersHistoryListArray[i].created_at.toString().replace(" ", "T"));
				var offset = createdDate.getTimezoneOffset();
				createdDate = createdDate.setMinutes(createdDate.getMinutes() + offset);
				createdDate = new Date(createdDate);

				if (createdDate.getDate() == date.getDate()) {

					filteredList.push(ordersHistoryListArray[i]);
				}
			};
			ordersHistoryListArray = [];
			ordersHistoryListArray = filteredList;
			Ti.API.info('ordersHistoryListArray =' + JSON.stringify(ordersHistoryListArray));
			renderOrdersList(0, 1);

		} else if (index == 1) {
			date.setDate(date.getDate() - pastDayCount);
			for (var i = 0; i < ordersHistoryListArray.length; i++) {
				var createdDate = new Date(ordersHistoryListArray[i].created_at.toString().replace(" ", "T"));
				var offset = createdDate.getTimezoneOffset();
				createdDate = createdDate.setMinutes(createdDate.getMinutes() + offset);
				createdDate = new Date(createdDate);
				if (createdDate.getDate() == date.getDate()) {
					filteredList.push(ordersHistoryListArray[i]);
				}
			};
			ordersHistoryListArray = [];
			ordersHistoryListArray = filteredList;
			renderOrdersList(0, 1);
		} else if (index == 4) {
			renderOrdersList(0, 1);
		} else {

			date.setDate(date.getDate() - pastDayCount);
			for (var i = 0; i < ordersHistoryListArray.length; i++) {
				var createdDate = new Date(ordersHistoryListArray[i].created_at.toString().replace(" ", "T")).getTime();
				if (createdDate >= date.getTime()) {
					filteredList.push(ordersHistoryListArray[i]);
				}
			};
			ordersHistoryListArray = [];
			ordersHistoryListArray = filteredList;
			renderOrdersList(0, 1);
		}
	}
}

function disableFilterIconOnSearch() {
	$.filterBtn.enabled = false;
}

function enableDisableFilterIconOnSearch() {

	if ($.listitemSearch.value.length > 0) {
		$.filterBtn.enabled = false;

	} else {
		$.filterBtn.enabled = true;

	}
}

//Web Service for send OTP in case of refund
function sendOTPForCheckout() {

	var SERVICE_SEND_OTP_CHECKOUT = Alloy.Globals.Constants.SERVICE_SEND_OTP_CHECKOUT;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		var obj = {};
		obj.employee_id = Alloy.Globals.employee_id;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		obj.otp_type = 3;
		Ti.API.info('obj ' + JSON.stringify(obj));
		Communicator.post(DOMAIN_URL + SERVICE_SEND_OTP_CHECKOUT, sendOTPForCheckoutCallback, obj);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_SEND_OTP_CHECKOUT);
	} else {
		Alloy.Globals.Notifier.show(L("internat_connection_message"));
	}

};

/*
 * Getting response of sendOTPForCheckoutCallback in the callback function
 */

function sendOTPForCheckoutCallback(e) {
	if (e.success) {
		try {
			Ti.API.info('response  ' + e.response);
			var response = JSON.parse(e.response);
			if (response != null) {

				if (response.response_code == '1') {

					var obj = {};
					obj.from = "refund";
					obj.otp = response.result.user_otp;
					var otpPopup = Alloy.createController("AddCustomerOTPDialog", obj).getView();
					otpPopup.open();
				} else {
					Alloy.Globals.Notifier.show(response.responseMessage);
				}

			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error sendOTPForRefundCallback service : ' + e.message);
			tracker.addException({
				description : "Order History SEND OTP: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	Alloy.Globals.LoadingScreen.close();

}
// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('NewOrder Screen');
var newOrdersListArray = [];
var selectedSection = 0;
var selectedOrder;
var selectedOrderDetails;
var selectedIndex = -1;
var tableViewIndex = 0;
var orderDetailInterval;
var orderListIntervals = [];
CurrentWindow = "newOrderScreen";

var ORDER_STATUS_PENDING = "pending";
var ORDER_STATUS_NEW = "new";
var ORDER_STATUS_READY = "ready";
var ORDER_STATUS_COMPLETED = "completed";
var ORDER_STATUS_CANCELLED = "cancelled";
var ORDER_STATUS_PREPARING = "preparing";

var LIST_MODE_RECENT = 0;
var LIST_MODE_ACCEPTED = 1;
var currentListMode = LIST_MODE_RECENT;
/*
 /*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {

	Alloy.Globals.openLeft();
}

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

Alloy.Globals.fetchOrders = function(comeFrom,orderId) {
	$.tabbedBar.touchEnabled = true;
	Ti.API.info("Inside fetchOrders");
	newOrdersListArray = Alloy.Globals.DbManager.Get_Sale_From_DB();
	sortRecentList();
	if (newOrdersListArray != null && newOrdersListArray.length > 0 && newOrdersListArray[0].status == 1) {
		Alloy.Globals.DbManager.updateOrderReadStatus(newOrdersListArray[0].id);
		newOrdersListArray[0].status = 0;
	}
	Ti.API.info('comeFrom = ' + comeFrom);
	if(comeFrom == "schedule"){
		currentListMode = LIST_MODE_ACCEPTED;
		$.tabbedBar.index = 1;
		selectedIndex = -1;
		tableViewIndex = 0;
		selectedSection = 0;
	}else if (comeFrom != "pickUp") {
		currentListMode = LIST_MODE_RECENT;
		$.tabbedBar.index = 0;
		selectedIndex = -1;
		tableViewIndex = 0;
		selectedSection = 0;
	} else if (comeFrom == "pickUp") {
		currentListMode = LIST_MODE_ACCEPTED;
		$.tabbedBar.index = 1;
		selectedIndex = -1;
		tableViewIndex = 0;
		selectedSection = 0;
	}
	renderOrdersList(tableViewIndex, selectedIndex,comeFrom,orderId);
};
Alloy.Globals.fetchOrders();

function renderOrdersList(tableIndex, selectIndex, comeFrom, scheduledId) {
	selectedIndex = selectIndex;
	tableViewIndex = tableIndex;
	var sections = [];
	var listViewItems = [];
	var asaplistViewItems = [];
	var laterlistViewItems = [];
	var asapSection = Ti.UI.createListSection({
		headerTitle : 'Pickup ASAP'
	});
	var laterSection = Ti.UI.createListSection({
		headerTitle : 'Pickup Later'
	});
	Ti.API.info('newOrdersListArray table =' + JSON.stringify(newOrdersListArray));
	for (var i = 0; i < newOrdersListArray.length; i++) {
		var newOrder = newOrdersListArray[i];

		if (currentListMode == LIST_MODE_RECENT) {
			if (newOrder.order_status != ORDER_STATUS_PENDING) {
				continue;
			}
			if (selectedIndex == -1 && newOrder.order_status == ORDER_STATUS_PENDING) {
				selectedIndex = i;
			}
		} else {
			if (newOrder.order_status != ORDER_STATUS_READY && newOrder.order_status != ORDER_STATUS_NEW && newOrder.order_status != ORDER_STATUS_PREPARING) {
				continue;
			}
			if (selectedIndex == -1 && (newOrder.order_status == ORDER_STATUS_READY || newOrder.order_status != ORDER_STATUS_NEW || newOrder.order_status != ORDER_STATUS_PREPARING)) {
				selectedIndex = i;
			}
			if (comeFrom == "schedule") {
				if (newOrder.id == scheduledId) {
					tableViewIndex = i;
					selectedIndex = i;
				}
			}

			if (newOrder.order_status == ORDER_STATUS_PREPARING) {
				//Check if an order timer is finished
				Ti.API.info("accepted_at while rendering list = " + newOrder.accepted_at);

				var acceptedTime;
				if (newOrder.accepted_at instanceof Date) {
					acceptedTime = newOrder.accepted_at.getTime();
				} else if ( typeof (newOrder.accepted_at) == "number") {
					acceptedTime = newOrder.accepted_at * 1000;
				} else {
					var a = newOrder.accepted_at.toString().replace(" ", "T");
					acceptedTime = new Date(a).getTime();
					Ti.API.info('acceptedTime = ' + acceptedTime);

				}

				var duration = newOrder.timer * 60;
				var spentTime = (new Date().getTime() - acceptedTime) / 1000;

				var progressBarVal = (spentTime * 100) / duration;

				Ti.API.info("progressBarVal while rendering list = " + progressBarVal);

				if (progressBarVal > 100) {
					//Update local array and objects
					//newOrdersListArray[i].order_status = ORDER_STATUS_READY;

					//Update db
					//Alloy.Globals.DbManager.updateOrderStatusToReady(newOrder.id);
					$.acceptBtn.visible = false;
					$.declineBtn.visible = false;
					$.btmCounterVw.visible = false;
					$.pickedUpVw.visible = false;
					$.scheduledVw.visible = false;
					$.orderReadyVw.visible = true;
				}
			}
		}

		//Ti.API.info("selectedIndex = " + selectedIndex);

		var listItem = {
			properties : {
				searchableText : newOrder.fullname + " " + newOrder.order_token,
				itemId : newOrder.id
			},
			customerPic : {
				image : "0" //To set default image
			},
			customerName : {
				text : newOrder.fullname
			},
			pickupDate : {
				text : "Pickup time: " + Alloy.Globals.DateTimeUtils.getFormattedDate(newOrder.pickup_date)
			},
			totalAmount : {
				text : "Total Amount: $" + newOrder.order_total_price
			},
			tokenNo : {
				text : "Token no. #" + newOrder.order_token
			},
			orderId : {
				text : "Order Id. #" + newOrder.id
			}
		};
		//if (newOrder.profile_pic != null && newOrder.profile_pic != "") {
			if (newOrder.order_type == "app") {
				listItem.customerPic.image = "/images/mobile-phone3.png";
			}  else if (newOrder.order_type == "website") {
				listItem.customerPic.image = "/images/Website.png";
			}
			//listItem.customerPic.image = newOrder.profile_pic;
		//}
		if (newOrder.order_status == ORDER_STATUS_READY) {
			listItem.statusImg = {
				image : "/images/order_ready.png"
			};
		} else if (newOrder.order_status == ORDER_STATUS_PENDING && newOrder.status == 1) {
			listItem.properties.backgroundColor = "#F2DBDE";
		} else if (newOrder.order_status == ORDER_STATUS_PREPARING) {
			listItem.timer = {
				image : "/images/clock.png"
			};
		}
		if (newOrder.pickup_type == 'asap') {
			asaplistViewItems.push(listItem);
		} else {
			laterlistViewItems.push(listItem);
		}
		//listViewItems.push(listItem);
	};
			
		asapSection.setItems(asaplistViewItems);
		if (asaplistViewItems.length > 0) {
			sections.push(asapSection);
		}
		laterSection.setItems(laterlistViewItems);
		if (laterlistViewItems.length > 0) {
			sections.push(laterSection);
		}

		$.newOrdersListView.sections = sections;
			
		//if (currentListMode == LIST_MODE_RECENT) {
		if (asaplistViewItems.length > 0 && asaplistViewItems.length > tableViewIndex && selectedSection == 0) {
				$.newOrdersListView.selectItem(selectedSection, tableViewIndex);
				selectedOrder = newOrdersListArray[selectedIndex];
			} else if (laterlistViewItems.length > 0 && laterlistViewItems.length > tableViewIndex && selectedSection == 1) {
				$.newOrdersListView.selectItem(selectedSection, tableViewIndex);
				selectedOrder = newOrdersListArray[selectedIndex];
			} else {
				selectedOrder = null;
			}
		//}


	renderOrderDetails();
}


function orderSelected(e) {
	try {
		Ti.API.info('e.index = ' + JSON.stringify(e));
		$.listitemSearch.blur();
		Ti.API.info('orderSelected new order list = ' + JSON.stringify(newOrdersListArray));
		for (var i = 0; i < newOrdersListArray.length; i++) {
			if (e.itemId == newOrdersListArray[i].id) {
				selectedIndex = i;
				break;
			}
		};
		tableViewIndex = e.itemIndex;
		if (e.sectionIndex == 0) {
			selectedSection = 0;
		} else {
			selectedSection = 1;
		}
		if (newOrdersListArray[selectedIndex].status == 1) {
			newOrdersListArray[selectedIndex].status = 0;
			Alloy.Globals.DbManager.updateOrderReadStatus(e.itemId);
			renderOrdersList(tableViewIndex, selectedIndex);
		} else {
			selectedOrder = newOrdersListArray[selectedIndex];
			renderOrderDetails();
		}

		Ti.API.info("**********Selected Order***************");
		Ti.API.info(JSON.stringify(selectedOrder));
	} catch(e) {
		Ti.API.info("In catch = " + e.message);

	}
}


function renderOrderDetails() {
	if (selectedOrder != null) {
		Ti.API.info("selectedOrder = " + JSON.stringify(selectedOrder));
		selectedOrderDetails = Alloy.Globals.DbManager.Get_OrderDetail_From_DB(selectedOrder.id);
		Ti.API.info("selectedOrderDetails = " + JSON.stringify(selectedOrderDetails));

		if (selectedOrderDetails != null) {
			$.mainView.visible = true;

			$.order_no_value_lbl.text = "#" + selectedOrder.id;
			$.token_no_value_lbl.text = "#" + selectedOrder.order_token;
			$.date_tim_lbl.text = Alloy.Globals.DateTimeUtils.getFormattedDate(selectedOrder.created_at);

			$.subTotalLbl.text = "$" + parseFloat(selectedOrder.subtotal).toFixed(2);
			if (selectedOrder.loyality_point == "0") {
				$.layaltypt.height = 0;
				$.loyaltyPtVal.height = 0;
				$.layaltypt.visible = false;
				$.loyaltyPtVal.visible = false;
				$.layaltyvalLbl.height = 0;
				$.loyaltyVal.height = 0;
				$.layaltyvalLbl.visible = false;
				$.loyaltyVal.visible = false;
				$.txtstaticLbl.top = 75;
				$.taxLbl.top = 75;
				$.staticGrandTotalLbl.top = 95;
				$.grandTotalLbl.top = 95;
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
				$.txtstaticLbl.top = 135;
				$.taxLbl.top = 135;
				$.staticGrandTotalLbl.top = 170;
				$.grandTotalLbl.top = 170;
			}
			$.discountLbl.text = "-$" + parseFloat(selectedOrder.discount_total_price).toFixed(2);
			//$.taxLbl.text = "+$" + parseFloat((selectedOrder.tax * selectedOrder.subtotal) / 100).toFixed(2);
			$.taxLbl.text = "+$" + (selectedOrder.tax_value).toFixed(2);
			$.grandTotalLbl.text = "$" + parseFloat(selectedOrder.order_total_price).toFixed(2);

			if (selectedOrder.order_status == ORDER_STATUS_PENDING) {
				$.acceptBtn.visible = true;
				$.declineBtn.visible = true;
				$.btmCounterVw.visible = false;
				$.pickedUpVw.visible = false;
				$.scheduledVw.visible = false;
				$.orderReadyVw.visible = false;
				$.startPreparingVw.visible = false
			} else if (selectedOrder.order_status == ORDER_STATUS_READY) {
				$.acceptBtn.visible = false;
				$.declineBtn.visible = false;
				$.btmCounterVw.visible = false;
				$.pickedUpVw.visible = true;
				$.scheduledVw.visible = false;
				$.orderReadyVw.visible = false;
				$.startPreparingVw.visible = false
			} else if (selectedOrder.order_status == ORDER_STATUS_NEW) {
				var splitDate = selectedOrder.pickup_date.split(" ");
				var dateObj = splitDate[0].split("-");
				var timeObj =  splitDate[1].split(":");
				var finalDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
				Ti.API.info('finalDate.getTime() - new Date().getTime() ='+(finalDate.getTime() - new Date().getTime())/60000)
				if((finalDate.getTime() - new Date().getTime())/60000 <30 ){
					$.startPreparingVw.visible = true;
					$.scheduledVw.visible = false;
				}else{
					$.startPreparingVw.visible = false
					$.scheduledVw.visible = true;
					$.scheduledLbl.text = "This order is scheduled to prepare at "+ Alloy.Globals.DateTimeUtils.getFormattedDate(new Date(finalDate.getTime() - 1800000)) +", we will remind you before 30 minutes" 
					
				}
				$.acceptBtn.visible = false;
				$.declineBtn.visible = false;
				$.btmCounterVw.visible = false;
				$.pickedUpVw.visible = false;
				$.orderReadyVw.visible = false;
				//setCounterForOrderDetail();
			} else if (selectedOrder.order_status == ORDER_STATUS_PREPARING) {
				$.acceptBtn.visible = false;
				$.declineBtn.visible = false;
				$.btmCounterVw.visible = true;
				$.pickedUpVw.visible = false;
				$.scheduledVw.visible = false;
				$.orderReadyVw.visible = false;
				$.startPreparingVw.visible = false
				setCounterForOrderDetail();
			}

			renderOrderedMenuItems();
		} else {
			$.mainView.visible = false;
			alert("Something wrong happened, please sync your POS with server");
		}
	} else {
		$.mainView.visible = false;
	}
}

function renderOrderedMenuItems() {
	if (selectedOrderDetails != null) {
		var tableData = [];
		var totalPrice;
		for (var i = 0; i < selectedOrderDetails.length; i++) {
			var row = Ti.UI.createTableViewRow({
				height : 102,
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
						width : "80%",
						left : "10.5%",
						layout : "horizontal"
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
						text : "$" + priceVal,
						left : "72.5%",
						maxLines : "1",
						visible : false,
						textAlign : "right",
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
						text : "$" + quantity * priceVal,
						left : "82.5%",
						textAlign : "right",
						maxLines : "1",
						visible : false,
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
				text : "$" + (selectedOrderDetails[i].item_coustomized_price / selectedOrderDetails[i].quantity_purchased),
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
				height : 0,
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
			// if (selectedOrderDetails[i].discount_type == "" || selectedOrderDetails[i].discount_type == "0" || selectedOrderDetails[i].discount_type == 0) {
			// row.height = 72;
			// discountVw.height = 0;
			// } else {
			// //row.height = 102;
			// row.height = 72;
			// //if (selectedOrder.order_type == "pos") {
			// //discountValueLbl.text = selectedOrderDetails[i].discount_price;
			// //} else {
			// discountValueLbl.text = "-$" + selectedOrderDetails[i].discount_price;
			//
			// //}
			// }
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
			mainView.add(discountVw);
			row.add(mainView);
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
		Ti.API.info('orderDetails.length ' + orderDetails.length);
		if (orderDetails.length > 1) {
			e.row.getChildren()[0].getChildren()[1].getChildren()[1].getChildren()[1].image = "/images/drop_arrow_new_order.png";
		}
		if (orderDetails.length == 0 || (e.row.detail.discount_type == "" || e.row.detail.discount_type == "0" || e.row.detail.discount_type == 0)) {
			e.row.height = 42 + 30 * all_modifier_group.length;
		} else {
			//e.row.height = 42 + e.row.getChildren()[0].getChildren()[2].height + 30 * all_modifier_group.length;
			e.row.height = 42 + 30 * all_modifier_group.length;

		}
	} else {
		if (e.row.expand == 'yes') {
			e.row.expand = 'no';
			if (orderDetails.length > 1) {
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

function listModeChanged(e) {
	var index;
	if (e.index == 0) {//list mode recent
		currentListMode = LIST_MODE_RECENT;
		selectedSection = 0;
		sortRecentList();
		for (var i = 0; i < newOrdersListArray.length; i++) {
			if (newOrdersListArray[i].order_status == ORDER_STATUS_PENDING) {
				index = i;
				break;
			}
		};

	} else {//list mode accepted
		currentListMode = LIST_MODE_ACCEPTED;
		selectedSection = 0;
		sortAcceptedList();
		for (var i = 0; i < newOrdersListArray.length; i++) {
			if (newOrdersListArray[i].order_status == ORDER_STATUS_READY || newOrdersListArray[i].order_status == ORDER_STATUS_NEW || newOrdersListArray[i].order_status == ORDER_STATUS_PREPARING) {
				index = i;
				break;
			}
		};

	}
	Ti.API.info('list mode changesd index = '+ i);

	renderOrdersList(0, index);
}

function sortRecentList() {
	var pickUpDateNowArray = [];
	var pickUpDateLaterArray = [];
	for (var i = 0; i < newOrdersListArray.length; i++) {
		if (newOrdersListArray[i].pickup_type == "asap") {
			pickUpDateNowArray.push(newOrdersListArray[i]);
		} else{
			pickUpDateLaterArray.push(newOrdersListArray[i]);
		}
	};
	function compare(a, b) {
		var a = a.pickup_date.replace(" ", "T");
		var valuea = new Date(a).getTime();
		var b = b.pickup_date.replace(" ", "T");
		var valueb = new Date(b).getTime();
		if (valuea > valueb)
			return -1;
		if (valuea < valueb)
			return 1;
		return 0;
	}
	pickUpDateNowArray.sort(compare);
	pickUpDateLaterArray.sort(compare);
	newOrdersListArray = [];
	newOrdersListArray = pickUpDateNowArray.concat(pickUpDateLaterArray);

	//newOrdersListArray.sort(compare);
	Ti.API.info('newOrdersListArray ===' + JSON.stringify(newOrdersListArray));
}

function sortAcceptedList() {
	var pickUpDateNowArray = [];
	var pickUpDateLaterArray = [];
	var orderReadyArray = [];
	var orderNewArray = [];
	for (var i = 0; i < newOrdersListArray.length; i++) {
		if (newOrdersListArray[i].pickup_type == "asap") {
			pickUpDateNowArray.push(newOrdersListArray[i]);
		} else{
			pickUpDateLaterArray.push(newOrdersListArray[i]);
		}
	};
	for (var i = 0; i < pickUpDateNowArray.length; i++) {
		if (pickUpDateNowArray[i].order_status == ORDER_STATUS_NEW || pickUpDateNowArray[i].order_status == ORDER_STATUS_PENDING || pickUpDateNowArray[i].order_status == ORDER_STATUS_PREPARING) {
			orderReadyArray.push(pickUpDateNowArray[i]);
		} else if (pickUpDateNowArray[i].order_status == ORDER_STATUS_READY) {
			orderNewArray.push(pickUpDateNowArray[i]);
		}
	};
	function compare(a, b) {
		var a = a.pickup_date.replace(" ", "T");
		var valuea = new Date(a).getTime();
		var b = b.pickup_date.replace(" ", "T");
		var valueb = new Date(b).getTime();
		if (valuea < valueb)
			return -1;
		if (valuea > valueb)
			return 1;
		return 0;
	}


	orderReadyArray.sort(compare);
	orderNewArray.sort(compare);
	pickUpDateNowArray = orderReadyArray.concat(orderNewArray);
	
	orderReadyArray = [];
	orderNewArray = [];
	
	for (var i = 0; i < pickUpDateLaterArray.length; i++) {
		if (pickUpDateLaterArray[i].order_status == ORDER_STATUS_NEW || pickUpDateLaterArray[i].order_status == ORDER_STATUS_PENDING || pickUpDateLaterArray[i].order_status == ORDER_STATUS_PREPARING) {
			orderReadyArray.push(pickUpDateLaterArray[i]);
		} else if (pickUpDateLaterArray[i].order_status == ORDER_STATUS_READY) {
			orderNewArray.push(pickUpDateLaterArray[i]);
		}
	};
	orderReadyArray.sort(compare);
	orderNewArray.sort(compare);
	pickUpDateLaterArray = orderReadyArray.concat(orderNewArray);
	newOrdersListArray = [];
	newOrdersListArray = pickUpDateNowArray.concat(pickUpDateLaterArray);
	Ti.API.info('newOrdersListArray accepted= ' + JSON.stringify(newOrdersListArray));

}

function searchCancel() {
	setTimeout(function() {
		try {
			//Ti.API.info("selectedIndex = " + selectedIndex);
			$.newOrdersListView.selectItem(selectedSection, tableViewIndex);
			selectedOrder = newOrdersListArray[selectedIndex];
			$.tabbedBar.touchEnabled = true;
		} catch(e) {
			Ti.API.info("In catch = " + e.message);
			tracker.addException({
				description : "NewOrderScreen: " + e.message,
				fatal : false
			});
		}
	}, 100);
}

function acceptBtnClickFun() {
	if (selectedOrder.pickup_type == "asap") {
		openAcceptOrderPopOver();
	} else {
		updateOrderStatusService(selectedOrder.id,"new","");
	}
}


function scheduled() {
	var scheduleObj = {
				"url" : "http://www.download.com/content/asset.json",
				"type" : "schedule",
				"order_id" :  selectedOrder.id,
		};
		var msg = "Order #"+selectedOrder.id+" is scheduled to pick up in 30 minutes, please review and update status to preparing"
		 
	Alloy.Globals.scheduledNotification(selectedOrder,scheduleObj,msg)
	/*
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
			Ti.App.iOS.registerUserNotificationSettings({
				types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
			});
	
		}
		var pickupdate = selectedOrder.pickup_date.replace(" ", "T");
		var notificationDate = new Date(pickupdate).getTime();
		var splitDate = selectedOrder.pickup_date.split(" ");
		//Ti.API.info('orderData.pickup_date ' + splitDate);
		var dateObj = splitDate[0].split("-");
		var timeObj =  splitDate[1].split(":");
		Ti.API.info("Start");
		Ti.API.info(JSON.stringify(dateObj));
		Ti.API.info(dateObj[0] + " " + dateObj[1] + " " + dateObj[2]);
		Ti.API.info(timeObj[0] + " " + timeObj[1] + " " + timeObj[2]);
		var finalDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
		Ti.API.info('pickupdate = ' + pickupdate);
		Ti.API.info('finalDate = ' + finalDate);
		Ti.API.info('id   ==' + selectedOrder.id);
		Ti.API.info('finalDate.getTime() =' + finalDate.getTime());
		Ti.API.info('currentTime = ' + new Date().getTime());
		Ti.API.info('new Date(finalDate + (2000 *60)) =' + new Date(finalDate.getTime() - (30000 * 60)));
		if (finalDate.getTime() > new Date().getTime()) {
			Ti.API.info('In time');
			// The following code snippet schedules an alert to be sent within three seconds
			var notification = Ti.App.iOS.scheduleLocalNotification({
				// Alert will display 'slide to update' instead of 'slide to view'
				// or 'Update' instead of 'Open' in the alert dialog
				alertAction : "update",
				// Alert will display the following message
				alertBody : "New content available! Update now?",
				// The badge value in the icon will be changed to 1
				badge : 1,
				// Alert will be sent in three seconds
				date : new Date(finalDate.getTime() - (30000 * 60)),
				// The following sound file will be played
				sound : "/schedule.wav",
				// The following URL is passed to the application
				userInfo : {
					"url" : "http://www.download.com/content/asset.json",
					"type" : "schedule",
					"order_id" :  selectedOrder.id,
				}
			});   
		}*/
	
	 
}

var orderreadyData = [{
	value : "5",
	title : "5 minute"
}, {
	value : "10",
	title : "10 minutes"
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
var selectedDuration;

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
		if (validateRegisterIsCloseOrOpen()) {
			popover.hide();
			selectedDuration = e.row.detail.value;
			var date = new Date();
			date.toUTCString();
			// updateOrderStatusService(Alloy.Globals.SaleId, 'new', "", date.toUTCString(), selectedDuration);
			updateOrderStatusService(selectedOrder.id, ORDER_STATUS_PREPARING, "");
		}
	});

	var popover = Ti.UI.iPad.createPopover({

		horizontalWrap : false,
		backgroundColor : "white",
		arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_DOWN,
		contentView : popoverView
	});
	if (role_permission.indexOf("accept_order") != -1) {
		popover.show({
			view : $.acceptBtn
		});
	} else {
		Alloy.Globals.Notifier.show(L('validation_accept_order_permission'));
	}
}


function updateStatusFromPendingToNew(selectedDuration) {
	//Update local array and objects
	newOrdersListArray[selectedIndex].order_status = ORDER_STATUS_NEW;
	newOrdersListArray[selectedIndex].accepted_at = new Date();
	

	//Update db
	Alloy.Globals.DbManager.updateOrderStatusToNew(selectedOrder.id);
	if (newOrdersListArray.length > 0) {
		Alloy.Globals.fetchOrders();
	}
	//Update GUI
	for (var i = 0; i < newOrdersListArray.length; i++) {
		if (newOrdersListArray[i].order_status == ORDER_STATUS_PENDING) {
			renderOrdersList(0, i);
			break;
		}
	};
}

function updateStatusFromPendingToPreparing(selectedDuration) {
	//Update local array and objects
	newOrdersListArray[selectedIndex].order_status = ORDER_STATUS_PREPARING;
	newOrdersListArray[selectedIndex].accepted_at = new Date();
	newOrdersListArray[selectedIndex].timer = selectedDuration;

	//Update db
	Alloy.Globals.DbManager.updateOrderStatusToPreparing(selectedOrder.id, selectedDuration, new Date());
	if (newOrdersListArray.length > 0) {
		Alloy.Globals.fetchOrders();
	}
	//Update GUI
	for (var i = 0; i < newOrdersListArray.length; i++) {
		if (newOrdersListArray[i].order_status == ORDER_STATUS_PENDING) {
			renderOrdersList(0, i);
			break;
		}
	};
}

function updateStatusFromPreparingToReady(orderId) {
	Ti.API.info("Inside updateStatusFromPreparingToReady: order id = " + orderId);
	//find index for given order id
	for (var i = 0; i < newOrdersListArray.length; i++) {
		if (newOrdersListArray[i].id == orderId && newOrdersListArray[i].order_status == ORDER_STATUS_PREPARING) {
			//Update local array and objects
			newOrdersListArray[i].order_status = ORDER_STATUS_READY;

			//Update db
			Alloy.Globals.DbManager.updateOrderStatusToReady(orderId);

			//Update GUI
			renderOrdersList(tableViewIndex, selectedIndex);
			break;
		}
	};
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
		maxLength : "100",

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
		if (validateRegisterIsCloseOrOpen()) {
			if (declineReasonTxtArea.value.trim().length > 0) {
				updateOrderStatusService(selectedOrder.id, 'cancelled', declineReasonTxtArea.value.trim());
				popover.hide();
			} else {
				Alloy.Globals.Notifier.show("Please enter reason for declining the order");
			}
		}
	});

	var popover = Ti.UI.iPad.createPopover({

		horizontalWrap : false,
		backgroundColor : "white",
		arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_DOWN,
		contentView : popoverView
	});
	if (role_permission.indexOf("declined_order") != -1) {
		popover.show({
			view : $.declineBtn
		});
	} else {
		Alloy.Globals.Notifier.show(L('validation_declined_order_permission'));
	}
}

function validateRegisterIsCloseOrOpen() {
	var registerData = Alloy.Globals.DbManager.getRegisterDetail("");

	Ti.API.info('registerData on checkout = ' + JSON.stringify(registerData));

	if (registerData.length > 0) {
		if (registerData[0].status != "closed") {
			var openedDate = new Date(registerData[0].updated_date);
			Ti.API.info('openedDate.getDate() = ' + openedDate.getDate());
			Ti.API.info('new Date().getDate() = ' + new Date().getDate());
			//if (openedDate.getDate() == new Date().getDate()) {
				return true;
			//} else {
			//	Alloy.Globals.Notifier.show("Please close register for present day");
			//}
		} else {
			Alloy.Globals.Notifier.show("Please open register");
		}
	} else {
		Alloy.Globals.Notifier.show("Please open register for the day");
	}
	return false;
} 

function setCounterForOrderDetail() {
	clearInterval(orderDetailInterval);
	$.progress.setValue(0);
	$.progress.setText("");

	Ti.API.info("selectedOrder.accepted_at = " + selectedOrder.accepted_at);

	var acceptedTime;
	if (selectedOrder.accepted_at instanceof Date) {
		acceptedTime = selectedOrder.accepted_at.getTime();
	} else if ( typeof (selectedOrder.accepted_at) == "number") {

		acceptedTime = selectedOrder.accepted_at * 1000;
		Ti.API.info('selectedOrder.accepted_at instanceof Number =' + acceptedTime);
	} else {
		var a = selectedOrder.accepted_at.toString().replace(" ", "T");
		acceptedTime = new Date(a).getTime();
		Ti.API.info(' acceptedTime ' + acceptedTime);
			// var splitDate = selectedOrder.accepted_at.split(" ");
	// var dateObj = splitDate[0].split("-");
	// var timeObj =  splitDate[1].split(":");
	// var finalDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
	// acceptedTime = finalDate.getTime();
	
	}
	Ti.API.info('final acceptedTime '+acceptedTime);
	var duration = selectedOrder.timer * 60;
	var spentTime = (new Date().getTime() - acceptedTime) / 1000;
	var orderId = selectedOrder.id;

	var progressBarVal = (spentTime * 100) / duration;
	Ti.API.info('progressBarVal value ='+progressBarVal);
	if (progressBarVal > 100) {
		Ti.API.info('progressBarVal 2');
		$.orderReadyVw.visible = true;
		$.acceptBtn.visible = false;
		$.declineBtn.visible = false;
		$.btmCounterVw.visible = false;
		$.pickedUpVw.visible = false;
		$.scheduledVw.visible = false;
		//updateStatusFromNewToReady(selectedOrder.id);
	} else {
		$.progress.formatValue = function(val) {
			var min = ((duration * val) / 100);
			min = (duration - min) / 60;
			min = Math.ceil(min);
			// Ti.API.info("min = " + min);

			return min;
		};

		var min = ((duration * progressBarVal) / 100);
		min = (duration - min) / 60;
		min = Math.ceil(min);
		$.progress.setText(min + "\nMin");
		$.progress.setValue(progressBarVal);

		orderDetailInterval = setInterval(function() {
			spentTime = spentTime + 1;
			var progressBarVal = (spentTime * 100) / duration;
			if (progressBarVal > 100) {
				clearInterval(orderDetailInterval);
				$.orderReadyVw.visible = true;
				$.acceptBtn.visible = false;
				$.declineBtn.visible = false;
				$.btmCounterVw.visible = false;
				$.pickedUpVw.visible = false;
				$.scheduledVw.visible = false;
				//updateStatusFromPreparingToReady(orderId);
			} else {
				$.progress.setValue(progressBarVal);
			}
		}, 1000);
	}

}

function updateOrderStatusService(id, status, comment) {

	var SERVICE_UPDATE_ORDER_STATUS = Alloy.Globals.Constants.SERVICE_UPDATE_ORDER_STATUS;
	if (Ti.Network.online) {
		Ti.API.info('id ' + id);
		var obj = {};
		obj.order_id = id;
		obj.order_status = status;
		obj.comment = comment;
		obj.user_id = Alloy.Globals.employee_id;
		obj.store_id = Alloy.Globals.store_id;
		if (status == "preparing") {
			obj.timer = toFixed(selectedDuration);
		}

		Alloy.Globals.LoadingScreen.open();
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
					if (response.result.status == "preparing") {
						Alloy.Globals.printOrderLableFun(selectedOrderDetails, selectedOrderDetails);
						if(selectedOrder.pickup_type == "asap"){
							updateStatusFromPendingToPreparing(selectedDuration);
						}else{
							updateStatusFromNewToPreparing(selectedOrder.id,selectedDuration);
						}

					} else if (response.result.status == "new") {
						scheduled()
						updateStatusFromPendingToNew(selectedDuration);

					} else if (response.result.status == "completed") {
						updateStatusFromReadyToCompleted(selectedOrder.id);
						Alloy.Globals.processSync("pickUp");
					} else if (response.result.status == "cancelled") {
						updateStatusFromPendingToCancelled(selectedOrder.id);
						Alloy.Globals.processSync();
					}else if (response.result.status == "ready") {
						updateStatusFromPreparingToReady(selectedOrder.id);
						
					}
					selectedDuration="";
				} else {
					Alloy.Globals.Notifier.show(response.msg);

				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);

			}
		} catch(e) {
			Ti.API.info('Error updateOrderStatusServiceCallback service : ' + e.message);
			tracker.addException({
				description : "NewOrderScreen: " + e.message,
				fatal : false
			});

		}
	} else {
		Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_STATUS_CODE);

	}
	Alloy.Globals.LoadingScreen.close();

}

function changeStatusReadyToCompleted() {
	if (role_permission.indexOf("picked_up_order") != -1) {
		updateOrderStatusService(selectedOrder.id, ORDER_STATUS_COMPLETED, "");
	} else {
		Alloy.Globals.Notifier.show(L('validation_pick_up_order_permission'));
	}
}

function updateStatusFromPendingToCancelled(orderId) {
	Ti.API.info("Inside updateStatusFromNewToReady: order id = " + orderId);
	//find index for given order id
	for (var i = 0; i < newOrdersListArray.length; i++) {
		if (newOrdersListArray[i].id == orderId && newOrdersListArray[i].order_status == ORDER_STATUS_PENDING) {
			//Update local array and objects
			newOrdersListArray[i].order_status = ORDER_STATUS_CANCELLED;

			//Update db
			Alloy.Globals.DbManager.updateOrderStatusCancelled(orderId);

			//Update GUI
			Alloy.Globals.fetchOrders();
			break;
		}
	};
}

function updateStatusFromReadyToCompleted(orderId) {

	Ti.API.info("Inside updateStatusFromNewToReady: order id = " + orderId);
	//find index for given order id
	for (var i = 0; i < newOrdersListArray.length; i++) {
		if (newOrdersListArray[i].id == orderId && newOrdersListArray[i].order_status == ORDER_STATUS_READY) {
			//Update local array and objects
			newOrdersListArray[i].order_status = ORDER_STATUS_COMPLETED;

			//Update db
			Alloy.Globals.DbManager.updateOrderStatusCompleted(orderId);

			//Update GUI
			Alloy.Globals.fetchOrders("pickUp");
			break;
		}
	};
}

Ti.App.addEventListener('pause', function(e) {

	Ti.API.info('PAUSE EVENT');

});





// Ti.App.addEventListener('resumed', function(e) {
// 
	// Ti.API.info('RESUMED EVENT');
	// renderOrdersList(tableViewIndex, selectedIndex);
// });


Alloy.Globals.renderNewOrderList = function(e){
	renderOrdersList(tableViewIndex, selectedIndex);
}

function updateOrderStatusToReady(){
	updateOrderStatusService(selectedOrder.id, "ready","");
}


function updateOrderStatusToPreparing() {
	var splitDate = selectedOrder.pickup_date.split(" ");
	var dateObj = splitDate[0].split("-");
	var timeObj =  splitDate[1].split(":");
	var finalDate = new Date(dateObj[0], dateObj[1] - 1, dateObj[2], timeObj[0], timeObj[1], timeObj[2]);
	// if (finalDate.getTime() - new Date().getTime() < 30) {
		// $.startPreparingVw.visible = true;
		// $.scheduledVw.visible = false;
	// } else {
		// $.startPreparingVw.visible = false
		// $.scheduledVw.visible = true;
	// }
	if(finalDate.getTime() < new Date().getTime()){
		selectedDuration= 0;
	}else{
		Ti.API.info('Selected duration = '+selectedDuration);
		selectedDuration = (finalDate.getTime() - new Date().getTime())/60000;
	}
	//selectedDuration = (finalDate.getTime() - new Date().getTime())/60000;
	Ti.API.info('finalDate'+finalDate);
	Ti.API.info('new Date()'+new Date());
	Ti.API.info('selectedDuration'+selectedDuration/60000);
	updateOrderStatusService(selectedOrder.id, "preparing", "");
}

function updateStatusFromNewToPreparing(orderId,selectedDuration) {
	Ti.API.info("Inside updateStatusFromNewToPreparing: order id = " + orderId);
	//Update local array and objects
	newOrdersListArray[selectedIndex].accepted_at = new Date();
	newOrdersListArray[selectedIndex].timer = selectedDuration;

	//Update db
	
	for (var i = 0; i < newOrdersListArray.length; i++) {
		Ti.API.info('newOrdersListArray[i] ='+ JSON.stringify(newOrdersListArray));
		if (newOrdersListArray[i].id == orderId && newOrdersListArray[i].order_status == ORDER_STATUS_NEW) {
			Ti.API.info('newOrdersListArray**************   '+orderId);
			//Update local array and objects
			newOrdersListArray[i].order_status = ORDER_STATUS_PREPARING;

			//Update db
			Alloy.Globals.DbManager.updateOrderStatusToPreparing(selectedOrder.id, selectedDuration, new Date());

			//Update GUI
			renderOrdersList(tableViewIndex, selectedIndex);
			break;
		}
	};
}
function disableTabbedBarOnSearch() {
	$.tabbedBar.touchEnabled = false;
}
function enableDisableTabbedBar(){
	if($.listitemSearch.value.length > 0){
		$.tabbedBar.touchEnabled = false;
	}else{
		$.tabbedBar.touchEnabled = true;
	}
}

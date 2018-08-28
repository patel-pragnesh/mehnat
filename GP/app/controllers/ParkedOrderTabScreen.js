// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('ParkedOrderTab Screen');
/*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {

	Alloy.Globals.openLeft();
}


function renderParkedOrder(detail) {
	var tableData = [];
	for (var i = 0; i < detail.length; i++) {

		var row = Ti.UI.createTableViewRow({
			backgroundColor : "white",
			height : Ti.UI.SIZE,
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
			detail : detail[i]
		});

		var detailView = Ti.UI.createView({
			width : Ti.UI.FILL,

			top : 25,
			bottom : 25,
			height : Ti.UI.SIZE,
			layout : "horizontal"
		});
		row.add(detailView);

		var dateLbl = Ti.UI.createLabel({
			//top : 20,
			left : "2%",
			width : "25%",
			text : Alloy.Globals.DateTimeUtils.getFormattedDate(detail[i].parkedDate),
			color : "#372E2C",
			height : Ti.UI.SIZE,
			font : {
				fontSize : 18,
				fontFamily : "Montserrat-Light"
			},
		});
		detailView.add(dateLbl);

		var itemLbl = Ti.UI.createLabel({
			//top : 20,
			textAlign : "center",
			text : detail[i].detail.length,
			color : "#372E2C",
			width : "25%",
			height : Ti.UI.SIZE,
			left : 0,
			font : {
				fontSize : 18,
				fontFamily : "Montserrat-Light"
			},
		});
		detailView.add(itemLbl);

		var amountLbl = Ti.UI.createLabel({
			//top : 20,
			text : "$" + toFixed(detail[i].total_amount).toFixed(2),
			color : "#372E2C",
			height : Ti.UI.SIZE,
			left : 0,
			width : "25%",
			textAlign : "right",
			font : {
				fontSize : 18,
				fontFamily : "Montserrat-Light"
			},
		});
		detailView.add(amountLbl);

		var resumeBtn = Ti.UI.createButton({
			right : 25,
			backgroundColor : "#239C3D",
			height : 45,
			width : "14%",
			name : "resumeBtn",
			title : L('resume_txt'),
			color : "#ffffff",
			font : {
				fontSize : 20,
				fontFamily : "Montserrat-Bold"
			},
		});
		row.add(resumeBtn);

		tableData.push(row);

	};
	$.parkedOrderTable.setData(tableData);
}

Alloy.Globals.fetchParkedOrderFromDB = function() {
	var parkedOrderData = Alloy.Globals.DbManager.getParkedOrderDetail("");
	Ti.API.info('Coming to get parked order ' + JSON.stringify(parkedOrderData));
	renderParkedOrder(parkedOrderData);
	if (parkedOrderData != null && parkedOrderData.length > 0) {
		$.topHeaderVw.visible = true;
		$.noDataVw.visible = false;
	} else {
		$.noDataVw.visible = true;
		$.topHeaderVw.visible = false;
	}
};

function parkedOrderTableClickFunc(e) {
	if (e.source.name == "resumeBtn") {
		if (Alloy.Globals.isCartEmpty) {
			Alloy.Globals.openSelectedTabFromSlideMenu(0);
			Alloy.Globals.parkedOrderId = e.row.detail.id;
			Alloy.Globals.getSpecificParkedOrderDetail(e.row.detail.id);
			Alloy.Globals.DbManager.deleteParkedOrderDetail(e.row.detail.id);
			$.parkedOrderTable.deleteRow(e.index);
		} else {
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Yes', 'No'],
				message : 'Cart has some item. Do you want to park your current order?',
				title : 'Gongcha POS'
			});
			dialog.addEventListener('click', function(k) {
				if (k.index === k.source.cancel) {
					dialog.hide();
					Alloy.Globals.openSelectedTabFromSlideMenu(0);
					Alloy.Globals.parkedOrderId = e.row.detail.id;
					Alloy.Globals.getSpecificParkedOrderDetail(e.row.detail.id);
					Alloy.Globals.DbManager.deleteParkedOrderDetail(e.row.detail.id);
					$.parkedOrderTable.deleteRow(e.index);
				} else {
					Alloy.Globals.saveParkedOrderDataInDB();
					Alloy.Globals.openSelectedTabFromSlideMenu(0);
					Alloy.Globals.parkedOrderId = e.row.detail.id;
					Alloy.Globals.getSpecificParkedOrderDetail(e.row.detail.id);
					Alloy.Globals.DbManager.deleteParkedOrderDetail(e.row.detail.id);
					$.parkedOrderTable.deleteRow(e.index);
				}

			});
			dialog.show();
		}
		

	}

}


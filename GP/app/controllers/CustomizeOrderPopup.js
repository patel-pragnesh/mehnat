// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('CustomizedOrder Popup');
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

var selectedOption = [];
var previousObj = null;
var categoryName = null;
var groupObj = [];
var initialData = [];
var modifierGroupArray = args.modifier_group;

$.itemNameLbl.text = args.menu_name;
$.itemVarientLbl.text = args.menu_description;
$.qtyLbl.text = args.qty;
$.menuImg.image = (args.menu_image != "") ? args.menu_image : "/images/defaultImg.png";
var selected_serving_id,
    selected_serving_name;
if (args.from == 'edit') {
	selected_serving_id = args.serving_id;
	selected_serving_name = args.serving_name;
	args.menu_price = args.serving_price;
	$.addToCartBtn.title = L("save_txt");
}

if (loyaltyObj.loyaltyID != "") {
	$.qtyVW.visible = false;
}
function openFunc(e) {
	// $.customOrderdialogWin.animate({
	// opacity : 1,
	// duration : 100
	// });
	Alloy.Globals.LoadingScreen.close();
	createSelectionLbl();
	createOption();

}

function plusBtnFunc(e) {
	$.qtyLbl.text = parseInt($.qtyLbl.text) + 1;
}

function minusBtnFunc(e) {
	if (parseInt($.qtyLbl.text) > 1) {
		$.qtyLbl.text = parseInt($.qtyLbl.text) - 1;
	}
}

function cancelFunc(e) {
	$.customOrderdialogWin.animate({
		duration : 200,
		opacity : 0,
	});
	setTimeout(function() {
		$.customOrderdialogWin.close();
	}, 200);
}

function startOverFunc(e) {
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : L('start_over_txt'),
		title : L('sure_txt')
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			Ti.API.info('The cancel button was clicked');
		} else {
			for (var i = 0; i < modifierGroupArray.length; i++) {
				for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {
					modifierGroupArray[i].modifiers[j].quantity = 1;
					modifierGroupArray[i].modifiers[j].count = 0;
					modifierGroupArray[i].modifiers[j].selected = false;
					modifierGroupArray[i].modifiers[j].enabled = false;
					modifierGroupArray[i].modifiers[j].showItem = true;
					modifierGroupArray[i].modifiers[j].modifier_prefix_name = "";
					if (i != 0) {
						modifierGroupArray[i].modifiers[j].modifier_price = 0;
					}
					modifierGroupArray[i].modifiers[j].modifier_prefix_id = "";
				}
			}

			$.scrollBar.removeAllChildren();
			$.selectedModifierVW.removeAllChildren();
			selectedOption = [];
			groupObj = [];

			createSelectionLbl();
			createOption("startover");
		}
	});

	dialog.show();

}

function addToCartFunc(e) {
	if (validate()) {
		var obj = {};
		obj.menu_id = args.menu_id;
		obj.quantity = parseInt($.qtyLbl.text);
		obj.menu_name = args.menu_name;
		obj.menu_image = args.menu_image;
		obj.category_id = args.category_id;
		obj.category_name = args.category_name;
		obj.itemCustomizedPrice = 0;
		obj.serving_id = selected_serving_id;
		obj.serving_name = selected_serving_name;
		obj.serving_price = args.menu_price;
		obj.toggle = args.toggle;

		var getFinalValue = modifierGroupArray;
		var selectedModifierGroup = [];
		var selectedModifiers = [];
		var modifierGroupObj = {};
		for (var i = 0; i < modifierGroupArray.length; i++) {
			selectedModifiers = [];
			for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {
				if (modifierGroupArray[i].modifiers[j].selected == true) {

					if (modifierGroupArray[i].modifiers[j].count != 0) {
						modifierGroupArray[i].modifiers[j].quantity = modifierGroupArray[i].modifiers[j].count;
					}
					selectedModifiers.push(modifierGroupArray[i].modifiers[j]);
				}
			}
			if (selectedModifiers.length > 0) {
				modifierGroupObj = {};
				modifierGroupObj.id = modifierGroupArray[i].id;
				modifierGroupObj.modifier_group_id = modifierGroupArray[i].id;
				modifierGroupObj.modifier_group_name = modifierGroupArray[i].modifier_group_name;
				modifierGroupObj.selection_time = modifierGroupArray[i].selection_time;
				modifierGroupObj.is_required = modifierGroupArray[i].is_required;
				modifierGroupObj.option = selectedModifiers;
				selectedModifierGroup.push(modifierGroupObj);
			}
		}

		obj.customizationOpt = selectedModifierGroup;
		obj.modifier_group = modifierGroupArray;

		if (args.from == 'add') {
			obj.loyaltyID = loyaltyObj.loyaltyID;
			obj.customLoyaltyID = loyaltyObj.customLoyaltyID;
			obj.loyaltyValue = loyaltyObj.loyaltyValue;
			obj.loyaltyPoints = loyaltyObj.loyaltyPoints;
			obj.loyaltyQty = loyaltyObj.loyaltyQty;
			obj.id = Math.floor(Math.random() * 50000);
			//This condition for check if loyalty exist and greater than over than product should not add to cart, its just hold for process
			if (loyaltyObj.loyaltyID != "" && loyaltyObj.loyaltyQty > 1) {
				checkLoyaltyForMoreThanOneQty(obj);
				return;
			}
			//This condition apply when loyalty not exist and after adding product into cart, Category page will show
			if (loyaltyObj.loyaltyID == "") {
				Alloy.Globals.navwin.remove(args.searchBar);
				args.subCategoryVW.visible = false;
				args.categoryVW.visible = true;
				Alloy.Globals.categorySubcategorytype = 1;
			}
			Alloy.Globals.getOrderList(obj, "1");
		} else {
			obj.id = args.id;
			obj.loyaltyID = args.loyaltyID;
			obj.customLoyaltyID = args.customLoyaltyID;
			obj.loyaltyValue = args.loyaltyValue;
			obj.loyaltyPoints = args.loyaltyPoints;
			obj.loyaltyQty = args.loyaltyQty;
			obj.discountVW = args.discountVW;
			Alloy.Globals.getOrderList(obj, "0");
		}

		$.customOrderdialogWin.close();
		Ti.API.info('getFinalValue : ' + JSON.stringify(obj));
		var finalValue = JSON.stringify(obj);
		// var demo ="dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text dummy text  testtttttt";
// 		
				// var buffer = Ti.createBuffer({
						// value : finalValue.toString()
						// //value : obj
						// //value : demo
					// });
					// Alloy.Globals.myPeripheral.writeValueForCharacteristicWithType(buffer.toBlob(), Alloy.Globals.cfdCharacteristic, BLE.CHARACTERISTIC_PROPERTY_WRITE_WITH_RESPONSE);
				
	} else {
		Alloy.Globals.Notifier.show(L("ALERT_SELECT_REQUIRED_OPTIONS"));
	}
}

function checkLoyaltyForMoreThanOneQty(obj) {
	loyaltyObj.loyaltyArray[loyaltyObj.selectedDrink].selectedMenu = obj;
	if (isAllLoyaltyApplied()) {
		args.addToCartBtn.visible = true;
	}
	loyaltyObj.loyaltyArray[loyaltyObj.selectedDrink].selectedView.backgroundColor = "#29150F";
	loyaltyObj.loyaltyArray[loyaltyObj.selectedDrink].selectedView.getChildren()[0].getChildren()[0].image = (obj.menu_image != "") ? obj.menu_image : "/images/defaultImg.png";
	loyaltyObj.loyaltyArray[loyaltyObj.selectedDrink].selectedView.getChildren()[2].text = obj.menu_name;
	args.loyaltyVW.visible = true;
	args.loyaltyDetailVW.visible = true;
	args.subCategoryVW.visible = false;
	args.categoryVW.visible = false;
	$.customOrderdialogWin.close();
}

function isAllLoyaltyApplied() {
	for (var i = 0; i < loyaltyObj.loyaltyArray.length; i++) {
		if (loyaltyObj.loyaltyArray[i].selectedMenu == null) {

			return false;

		}
	};
	return true;
}

//Validation function for check any required feild is not missing
function validate() {
	var isValid = false;
	for (var i = 0; i < modifierGroupArray.length; i++) {
		if (modifierGroupArray[i].is_required == "1") {
			for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {
				if (modifierGroupArray[i].modifiers[j].selected == true) {
					isValid = true;
					break;
				} else {
					isValid = false;
				}
			};
			if(!isValid){
				return false;
			}
			
		}
	}
	return isValid;
}

//Function for creating modifiers Group
function createOption(from) {
	for (var i = 0; i < modifierGroupArray.length; i++) {
		var charLen = (modifierGroupArray[i].modifier_group_name).length;
		//Ti.API.info(charLen);
		//Below if condition for set width of text length because managing space
		if (charLen <= 10) {
			var customeWidth = "15%";
		} else if (charLen >= 10 && charLen <= 20) {
			var customeWidth = "20%";
		} else if (charLen >= 20 && charLen <= 30) {
			var customeWidth = "26%";
		} else if (charLen >= 30 && charLen <= 40) {
			var customeWidth = "30%";
		} else if (charLen >= 40 && charLen <= 50) {
			var customeWidth = "36%";
		}
		var frameView = Ti.UI.createView({
			width : customeWidth,
			height : Ti.UI.FILL,
			id : modifierGroupArray[i].modifier_group_name,
			detail : modifierGroupArray[i],
			index : i,
			backgroundColor : "white",
		});
		var redVW = Ti.UI.createView({
			width : "100%",
			height : 5,
			backgroundColor : "#c32032",
			top : 0,
		});
		frameView.add(redVW);

		categoryName = Ti.UI.createView({
			height : Ti.UI.FILL,
			color : "black",
			index : i,
			detail : modifierGroupArray[i],
			backgroundColor : "#EEEEEE",
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
		});
		frameView.add(categoryName);

		var titleVW = Ti.UI.createView({
			touchEnabled : false,
			height : 25,
			width : Ti.UI.SIZE,
			index : i,
			detail : modifierGroupArray[i],
			layout : "horizontal"

		});

		categoryName.add(titleVW);

		var title = Ti.UI.createLabel({
			touchEnabled : false,
			width : Ti.UI.SIZE,
			color : "black",
			index : i,
			left : 2,
			font : {
				fontSize : 20,
			},
			height : 25,
			text : modifierGroupArray[i].modifier_group_name,
			detail : modifierGroupArray[i],

			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
		});

		titleVW.add(title);
		var astrick = Ti.UI.createLabel({
			left : 5,
			touchEnabled : false,
			height : Ti.UI.FILL,
			width : Ti.UI.SIZE,
			color : "red",
			index : i,
			font : {
				fontSize : 14,
			},
			height : 25,
			verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
			text : "*",
			detail : modifierGroupArray[i],

		});
		if (modifierGroupArray[i].is_required == "1") {
			titleVW.add(astrick);
		}

		var blankLbl = Ti.UI.createLabel({
			left : 0,
			height : Ti.UI.FILL,
			width : 1,
			text : "",
			detail : modifierGroupArray[i],

		});

		titleVW.add(blankLbl);
		if (i == 0) {
			if (args.from == "add") {
				// selected_serving_id = modifierGroupArray[0].modifiers[0].serving_id;
				// selected_serving_name = modifierGroupArray[0].modifiers[0].serving_name;
				// args.menu_price = modifierGroupArray[0].modifiers[0].price;
				// renderModifierGrid(modifierGroupArray[0], 0, false);
			} else {
				// if (from == "startover") {
				// selected_serving_id = modifierGroupArray[0].modifiers[0].serving_id;
				// selected_serving_name = modifierGroupArray[0].modifiers[0].serving_name;
				// args.menu_price = modifierGroupArray[0].modifiers[0].price;
				// renderModifierGrid(modifierGroupArray[0], 0, true);
				// } else {
				// renderModifierGrid(modifierGroupArray[0], 0, false);
				// }

			}
			renderModifierGrid(modifierGroupArray[0], 0, false);
			categoryName.backgroundColor = "transparent";
			previousObj = categoryName;
		}
		groupObj.push(categoryName);
		categoryName.addEventListener("click", function(e) {
			if (previousObj) {
				if (previousObj.index == e.source.index) {
					return;
				}
				previousObj.backgroundColor = "#EEEEEE";
			}

			renderModifierGrid(e.source.detail, e.source.index, false);
			e.source.backgroundColor = "transparent";
			previousObj = e.source;
		});

		var separatorView = Ti.UI.createView({
			width : 1,
			height : Ti.UI.FILL,
			id : modifierGroupArray[i].modifier_group_name,
			backgroundColor : "#E7E7E7"
		});
		$.scrollBar.add(frameView);
		$.scrollBar.add(separatorView);
	}
}

$.optionGrid.init({
	columns : 5,
	space : 14,
	gridBackgroundColor : '"#EDECF2',
	itemHeightDelta : 0,
	itemBackgroundColor : '#fff',
	itemBorderColor : 'transparent',
	itemBorderWidth : 0,
	itemBorderRadius : 6,
	from : "custom"
});

var gridHeight = Ti.Platform.displayCaps.getPlatformHeight() * 0.10;
var gridImageViewHeight = gridHeight * 0.94;

var categoryTemp = [];
var previousModifierObj = null;
var previousId,
    previousGroupIndex = null;
//Function for creating modiers on params detail(hold modifierGroup detail), modifierGroupIndex and isInitiallize
function renderModifierGrid(detail, modifierGroupindex, isInitialize) {

	categoryTemp = [];
	var modifierDetail = modifierGroupArray[modifierGroupindex].modifiers;
	previousModifierObj = null;
	previousId = null;
	//Ti.API.info('**** '+JSON.stringify(modifierDetail));
	for (var x = 0; x < modifierDetail.length; x++) {
		var view = Ti.UI.createView({
			left : 0,
			right : 0,
			height : Ti.UI.FILL,
			backgroundColor : "#EEEEEE",

		});

		var title = Ti.UI.createLabel({

			textAlign : "center",
			font : {
				fontSize : 18 ,
			},
			text : modifierDetail[x].modifier_name,
			color : "black",
			height : 24,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		view.add(title);

		if (detail.selection_time == "Multiple") {
			var counterText = Ti.UI.createLabel({
				right : 5,
				top : 5,
				backgroundColor : "white",
				height : 24,
				width : 24,
				borderRadius : 12,

				textAlign : "center",
				font : {
					fontSize : 12 ,
				},
				text : modifierDetail[x].count,
				color : "#c32032",
				ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
				wordWrap : false,
				visible : false
			});
			view.add(counterText);
		}
		if (modifierDetail[x].selected == true) {
			title.color = "white";
			view.backgroundColor = "#c32032";
			previousModifierObj = view;
			previousId = modifierDetail[x].id;
			if (detail.selection_time == "Multiple") {
				counterText.visible = true;
				if (modifierDetail[x].count == 0) {
					modifierDetail[x].count = 1;
					counterText.text = modifierDetail[x].count;
				} else {
					counterText.text = modifierDetail[x].count;
				}

			}

		} else if (modifierGroupindex == 0 && isInitialize == true) {
			if (x == 0) {
				title.color = "white";
				view.backgroundColor = "#c32032";
				if (modifierDetail[x].modifier_prefix_name != "") {
					selectedOption[x].selectedLbl.text = modifierDetail[x].modifier_prefix_name + " " + modifierDetail[x].modifier_name;
				} else {
					selectedOption[x].selectedLbl.text = modifierDetail[x].modifier_name;
				}
				selectedOption[x].selectedLbl.text = modifierDetail[x].modifier_name;
				modifierDetail[x].selected = true;
				previousModifierObj = view;
				previousId = modifierDetail[x].id;

			}

		}
		var values = {
			title : modifierDetail[x].modifier_name,
			modifierData : modifierDetail[x],
			// modifierGroupName : detail.selection_time,
			modifierGroupData : detail,
			modifierGroupIndex : modifierGroupindex,
			selected : modifierDetail[x].count,
			index : x,
			id : modifierDetail[x].id,
			maxCounter : modifierDetail[x].modifier_apply_counter,
			sub_modifier : modifierDetail[x].modifier_serving
		};
		//checkModifyWith(modifierDetail[x], modifierDetail, modifierGroupindex);

		//NOW WE PUSH TO THE ARRAY THE VIEW AND THE DATA

		if (modifierGroupindex == 0) {
			categoryTemp.push({
				view : view,
				data : values,
				enabled : true
			});
		} else {
			var isServingExist = false;
			if (modifierDetail[x].hasOwnProperty('modifier_serving')) {
				for (var i = 0; i < modifierDetail[x].modifier_serving.length; i++) {
					if (modifierDetail[x].modifier_serving[i].serving_id == selected_serving_id) {
						var subModifier = modifierDetail[x].modifier_serving[i].prefixData;
						isServingExist = true;
						break;
					}
				};
				if (isServingExist) {
					if (modifierDetail[x].enabled == true) {
						if (modifierDetail[x].selected == true) {
							title.color = "white";
						} else {
							title.color = "black";
						}
					} else {
						title.color = "gray";
					}
					categoryTemp.push({
						view : view,
						data : values,
						enabled : (modifierDetail[x].enabled == true) ? true : false
					});
				} else {
					title.color = "gray";
					categoryTemp.push({
						view : view,
						data : values,
						enabled : false
					});
				}
			} else {
				title.color = "gray";
				categoryTemp.push({
					view : view,
					data : values,
					enabled : false
				});

			}
		}

	};
	$.optionGrid.addGridItems(categoryTemp);
	$.optionGrid.setOnItemLongPress(function(e) {

		if (e.source.data.modifierGroupData.selection_time == "Multiple") {
			//if (selectedOption[e.source.data.modifierGroupIndex].selectedLbl.text.length > 0) {
			if (e.source.data.modifierData.selected == true) {
				e.source.vw.backgroundColor = "#EEEEEE";
				e.source.vw.getChildren()[0].color = "#000";
				e.source.vw.getChildren()[1].visible = false;
				e.source.vw.getChildren()[1].text = 0;
				for (var i = 0; i < selectedOption[e.source.data.modifierGroupIndex].array.length; i++) {
					var mainString = selectedOption[e.source.data.modifierGroupIndex].array[i];
					//searchString = mainString.indexOf(e.source.data.title);
					if (modifierGroupArray[e.source.data.modifierGroupIndex].modifiers[e.source.data.index].modifier_prefix_name != "") {
						var n = modifierGroupArray[e.source.data.modifierGroupIndex].modifiers[e.source.data.index].modifier_prefix_name + " " + modifierGroupArray[e.source.data.modifierGroupIndex].modifiers[e.source.data.index].modifier_name;
						//var searchString = mainString.indexOf(n);
					} else {
						var n = modifierGroupArray[e.source.data.modifierGroupIndex].modifiers[e.source.data.index].modifier_name;
						// var searchString = mainString.indexOf(modifierGroupArray[i].modifiers[j].modifier_name);
					}
					if (mainString == n) {
						selectedOption[e.source.data.modifierGroupIndex].array.splice(i, 1);
						break;
					}
				};
				updateSelectionLbl(selectedOption[e.source.data.modifierGroupIndex].array, e.source.data.modifierGroupIndex);
				setSelectedValue("", e.source.data.id, 0, "Multiple");
				updatePriceAndName("", e.source.data.id, "", 0, "");
				checkModifyWith(e.source.data.modifierGroupData, e.source.data.id, e.source.data.modifierGroupIndex);
			}
		}
	});
	$.optionGrid.setOnItemClick(function(e) {
		subModifier = [];
		if (e.source.data.modifierGroupData.selection_time == "Multiple") {
			if (parseInt(e.source.vw.getChildren()[1].text) == 0) {
				if (e.source.data.sub_modifier != undefined && e.source.data.sub_modifier != null && e.source.data.sub_modifier.length > 0) {
					if (e.source.data.modifierData.hasOwnProperty("modifier_serving")) {
						for (var i = 0; i < e.source.data.modifierData.modifier_serving.length; i++) {
							if (e.source.data.modifierData.modifier_serving[i].serving_id == selected_serving_id) {
								updatePriceAndName(e.source.data.id, "", "", e.source.data.modifierData.modifier_serving[i].price, "");
								subModifier = e.source.data.modifierData.modifier_serving[i].prefixData;
								if (subModifier.length > 0) {
									openSubModifier(e.source.vw, e.source.data, subModifier);
								}
							}
						};
					}
				}
			}

			e.source.vw.backgroundColor = "#c32032";
			e.source.vw.getChildren()[0].color = "#fff";
			Ti.API.info(e.source.vw.getChildren()[1].text + "  " + e.source.data.maxCounter);
			if (e.source.vw.getChildren()[1].text < e.source.data.maxCounter) {
				// if (e.source.vw.getChildren()[1].text > 1) {
				// return;
				// }
				e.source.vw.getChildren()[1].text = parseInt(e.source.vw.getChildren()[1].text) + 1;

			} else {
				//Alloy.Globals.Notifier.show(L('validation_count_txt'));
				if (e.source.data.modifierData.selected == true) {

					e.source.vw.backgroundColor = "#EEEEEE";
					e.source.vw.getChildren()[0].color = "#000";
					e.source.vw.getChildren()[1].visible = false;
					e.source.vw.getChildren()[1].text = 0;
					removeTopSelectedLblInMultipleCase(e.source.data.modifierGroupIndex, e.source.data.index);
					updateSelectionLbl(selectedOption[e.source.data.modifierGroupIndex].array, e.source.data.modifierGroupIndex);
					setSelectedValue("", e.source.data.id, 0, "Multiple");
					updatePriceAndName("", e.source.data.id, "", 0, "");
					checkModifyWith(e.source.data.modifierGroupData, e.source.data.id, e.source.data.modifierGroupIndex);
					return;
				}
			}

			e.source.vw.getChildren()[1].visible = true;
			setTopSelectionLableInMultipleCase(e.source.data.modifierGroupIndex, e.source.data.index);

			setSelectedValue(e.source.data.id, "", e.source.vw.getChildren()[1].text, "Multiple");
			//Ti.API.info("e.source.data.id  " + e.source.data.id);
			if (subModifier.length <= 0) {
				checkModifyWith(e.source.data.modifierGroupData, e.source.data.id, e.source.data.modifierGroupIndex);
			}
		} else {
			if (previousModifierObj != null) {
				if (previousId == e.source.data.id) {
					if (e.source.data.modifierData.selected == true) {
						if (e.source.data.modifierGroupIndex == 0) {
							selected_serving_id = 0;
							resetSelectionAccordingSelectedServing();
							$.selectedModifierVW.removeAllChildren();
							selectedOption = [];
							createSelectionLbl();
						}
						e.source.vw.backgroundColor = "#EEEEEE";
						e.source.vw.getChildren()[0].color = "#000";
						removeTopSelectedLblInSingleCase(e.source.data.modifierGroupIndex, e.source.data.title);
						setSelectedValue("", e.source.data.id, 0, "Single");
						updatePriceAndName("", e.source.data.id, "", 0, "");
						checkModifyWith(e.source.data.modifierGroupData, e.source.data.id, e.source.data.modifierGroupIndex);
						previousModifierObj = null;
						previousId = null;

					}
					return;
				}

				previousModifierObj.getChildren()[0].color = "#000";
				previousModifierObj.backgroundColor = "#EEEEEE";
				setSelectedValue("", previousId, 0, "Single");
			}
			e.source.vw.backgroundColor = "#c32032";
			e.source.vw.getChildren()[0].color = "#fff";
			selectedOption[e.source.data.modifierGroupIndex].selectedLbl.text = " " + e.source.data.title;
			selectedOption[e.source.data.modifierGroupIndex].selectedLbl.selected = true;

			setSelectedValue(e.source.data.id, "", 0, "Single");

			if (e.source.data.modifierGroupIndex == 0) {
				selected_serving_id = e.source.data.modifierData.serving_id;
				selected_serving_name = e.source.data.modifierData.serving_name;
				args.menu_price = e.source.data.modifierData.price;
				modifierGroupArray[0].modifiers[e.source.data.index].modifier_price =e.source.data.modifierData.price; 
				// for (var i = 1; i < modifierGroupArray.length; i++) {
				// for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {
				// modifierGroupArray[i].modifiers[j].selected = false;
				// modifierGroupArray[i].modifiers[j].count = 0;
				// modifierGroupArray[i].modifiers[j].quantity = 1;
				// }
				// }
				resetSelectionAccordingSelectedServing();

				//$.selectedModifierVW.removeAllChildren();

				// selectedOption = [];

				// createSelectionLbl();

				selectedOption[e.source.data.modifierGroupIndex].selectedLbl.text = " " + e.source.data.title;
				selectedOption[e.source.data.modifierGroupIndex].selectedLbl.selected = true;
				previousModifierObj = e.source.vw;
				previousId = e.source.data.id;
				previousGroupIndex = e.source.data.modifierGroupIndex;

				//Code for switch modifierGroup after select the modifier
				setTimeout(function(k) {
					if (groupObj.length > e.source.data.modifierGroupIndex + 1) {
						groupObj[e.source.data.modifierGroupIndex].backgroundColor = "#eeeeee";
						groupObj[e.source.data.modifierGroupIndex + 1].backgroundColor = "transparent";
						renderModifierGrid(groupObj[e.source.data.modifierGroupIndex + 1].detail, groupObj[e.source.data.modifierGroupIndex + 1].index, false);
						previousObj = groupObj[e.source.data.modifierGroupIndex + 1];
					}
				}, 50);

			} else {
				subModifier = [];
				if (e.source.data.modifierData.hasOwnProperty("modifier_serving")) {
					for (var i = 0; i < e.source.data.modifierData.modifier_serving.length; i++) {
						if (e.source.data.modifierData.modifier_serving[i].serving_id == selected_serving_id) {
							//e.source.data.modifierData.modifier_price = e.source.data.modifierData.modifier_serving[i].price;
							updatePriceAndName(e.source.data.id, "", "", e.source.data.modifierData.modifier_serving[i].price, "");
							var subModifier = e.source.data.modifierData.modifier_serving[i].prefixData;
							if (subModifier.length > 0) {
								openSubModifier(e.source.vw, e.source.data, subModifier);
								previousModifierObj = e.source.vw;
							} else {
								setTimeout(function(k) {
									if (groupObj.length > e.source.data.modifierGroupIndex + 1) {
										groupObj[e.source.data.modifierGroupIndex].backgroundColor = "#eeeeee";
										groupObj[e.source.data.modifierGroupIndex + 1].backgroundColor = "transparent";
										renderModifierGrid(groupObj[e.source.data.modifierGroupIndex + 1].detail, groupObj[e.source.data.modifierGroupIndex + 1].index, false);
										previousObj = groupObj[e.source.data.modifierGroupIndex + 1];
									}
								}, 100);
							}
						}
					};
				}
				previousId = e.source.data.id;
				previousGroupIndex = e.source.data.modifierGroupIndex;
			}
			if (subModifier.length <= 0) {
				checkModifyWith(e.source.data.modifierGroupData, e.source.data.id, e.source.data.modifierGroupIndex);
			}
		}

	});
}

function setTopSelectionLableInMultipleCase(modifierGroupIndex, index) {
	if (modifierGroupArray[modifierGroupIndex].modifiers[index].modifier_prefix_name != "") {
		var n = modifierGroupArray[modifierGroupIndex].modifiers[index].modifier_prefix_name + " " + modifierGroupArray[modifierGroupIndex].modifiers[index].modifier_name;
	} else {
		var n = modifierGroupArray[modifierGroupIndex].modifiers[index].modifier_name;
	}
	if (selectedOption[modifierGroupIndex].selectedLbl.text.length > 0) {
		var isSelectionTextExist = false;
		for (var i = 0; i < selectedOption[modifierGroupIndex].array.length; i++) {
			if (selectedOption[modifierGroupIndex].array[i] == n) {
				isSelectionTextExist = true;
				break;
			}
		};
		if (isSelectionTextExist == false) {
			selectedOption[modifierGroupIndex].selectedLbl.text += ", " + n;
			selectedOption[modifierGroupIndex].array.push(n);
		}
	} else {
		selectedOption[modifierGroupIndex].selectedLbl.text = n;
		selectedOption[modifierGroupIndex].array.push(n);

	}
	updateSelectionLbl(selectedOption[modifierGroupIndex].array, modifierGroupIndex);
}

function removeTopSelectedLblInMultipleCase(modifierGroupIndex, index) {
	if (modifierGroupArray[modifierGroupIndex].modifiers[index].modifier_prefix_name != "") {
		var n = modifierGroupArray[modifierGroupIndex].modifiers[index].modifier_prefix_name + " " + modifierGroupArray[modifierGroupIndex].modifiers[index].modifier_name;
	} else {
		var n = modifierGroupArray[modifierGroupIndex].modifiers[index].modifier_name;
	}
	for (var i = 0; i < selectedOption[modifierGroupIndex].array.length; i++) {
		var mainString = selectedOption[modifierGroupIndex].array[i];
		if (mainString == n) {
			selectedOption[modifierGroupIndex].array.splice(i, 1);
			break;
		}

	};
	updateSelectionLbl(selectedOption[modifierGroupIndex].array, modifierGroupIndex);
}

function removeTopSelectedLblInSingleCase(modifierGroupIndex, title) {
	for (var i = 0; i < selectedOption[modifierGroupIndex].array.length; i++) {
		var mainString = selectedOption[modifierGroupIndex].array[i];
		//searchString = mainString.indexOf(e.source.data.title);
		if (mainString == title) {
			selectedOption[modifierGroupIndex].array.splice(i, 1);
		}
	};
	updateSelectionLbl(selectedOption[modifierGroupIndex].array, modifierGroupIndex);
}

function resetSelectionAccordingSelectedServing() {
	for (var i = 1; i < modifierGroupArray.length; i++) {
		for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {

			var isServingExist = false;
			if (modifierGroupArray[i].modifiers[j].hasOwnProperty('modifier_serving')) {
				for (var k = 0; k < modifierGroupArray[i].modifiers[j].modifier_serving.length; k++) {
					if (modifierGroupArray[i].modifiers[j].modifier_serving[k].serving_id == selected_serving_id) {
						isServingExist = true;
						break;
					}
				};
				if (isServingExist == false) {
					if (modifierGroupArray[i].modifiers[j].selected == true) {
						for (var l = 0; l < selectedOption[i].array.length; l++) {
							var mainString = selectedOption[i].array[l];
							if (modifierGroupArray[i].modifiers[j].modifier_prefix_name != "") {
								var n = modifierGroupArray[i].modifiers[j].modifier_prefix_name + " " + modifierGroupArray[i].modifiers[j].modifier_name;
								//var searchString = mainString.indexOf(n);
							} else {
								var n = modifierGroupArray[i].modifiers[j].modifier_name;
								// var searchString = mainString.indexOf(modifierGroupArray[i].modifiers[j].modifier_name);
							}

							if (mainString == n) {
								selectedOption[i].array.splice(l, 1);
							}
						};
						updateSelectionLbl(selectedOption[i].array, i);
					}

					modifierGroupArray[i].modifiers[j].selected = false;
					modifierGroupArray[i].modifiers[j].count = 0;
					modifierGroupArray[i].modifiers[j].modifier_prefix_name = "";
					modifierGroupArray[i].modifiers[j].modifier_prefix_id = 0;
					modifierGroupArray[i].modifiers[j].modifier_price = 0;
					modifierGroupArray[i].modifiers[j].quantity = 1;
				}

			} else {
				if (modifierGroupArray[i].modifiers[j].selected == true) {
					for (var l = 0; l < selectedOption[i].array.length; l++) {
						var mainString = selectedOption[i].array[l];
						if (modifierGroupArray[i].modifiers[j].modifier_prefix_name != "") {
							var n = modifierGroupArray[i].modifiers[j].modifier_prefix_name + " " + modifierGroupArray[i].modifiers[j].modifier_name;
						} else {
							var n = modifierGroupArray[i].modifiers[j].modifier_name;
						}

						if (mainString == n) {
							selectedOption[i].array.splice(l, 1);
						}
					};
					updateSelectionLbl(selectedOption[i].array, i);
				}
				modifierGroupArray[i].modifiers[j].selected = false;
				modifierGroupArray[i].modifiers[j].modifier_prefix_name = "";
				modifierGroupArray[i].modifiers[j].modifier_prefix_id = 0;
				modifierGroupArray[i].modifiers[j].modifier_price = 0;
				modifierGroupArray[i].modifiers[j].count = 0;
				modifierGroupArray[i].modifiers[j].quantity = 1;
			}
		}
	}
	setPriceIfServingChange();
}

function setPriceIfServingChange() {
	for (var i = 1; i < modifierGroupArray.length; i++) {
		for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {
			if (modifierGroupArray[i].modifiers[j].hasOwnProperty('modifier_serving')) {
				//Ti.API.info('Error ' + JSON.stringify(modifierGroupArray[i].modifiers[j]));
				for (var k = 0; k < modifierGroupArray[i].modifiers[j].modifier_serving.length; k++) {
					if (modifierGroupArray[i].modifiers[j].modifier_serving[k].serving_id == selected_serving_id) {
						if (modifierGroupArray[i].modifiers[j].selected == true) {
							if (modifierGroupArray[i].modifiers[j].modifier_prefix_name != "") {
								for (var x = 0; x < modifierGroupArray[i].modifiers[j].modifier_serving[k].prefixData.length; x++) {
									Ti.API.info(modifierGroupArray[i].modifiers[j].modifier_serving[k].prefixData[x].prefix_id + "    " + modifierGroupArray[i].modifiers[j].modifier_prefix_id);
									var isPrefixUpdatePrice = true;
									if (modifierGroupArray[i].modifiers[j].modifier_serving[k].prefixData[x].prefix_id == modifierGroupArray[i].modifiers[j].modifier_prefix_id) {
										Ti.API.info(modifierGroupArray[i].modifiers[j].modifier_serving[k].prefixData[x].prefix_id + "    " + modifierGroupArray[i].modifiers[j].modifier_prefix_id);
										updatePriceAndName(modifierGroupArray[i].modifiers[j].id, "", modifierGroupArray[i].modifiers[j].modifier_serving[k].prefixData[x].prefix_name, modifierGroupArray[i].modifiers[j].modifier_serving[k].prefixData[x].prefix_price, modifierGroupArray[i].modifiers[j].modifier_serving[k].prefixData[x].prefix_id, modifierGroupArray[i].modifiers[j].modifier_serving[k].prefixData[x].override_modifier);
										isPrefixUpdatePrice = false;
										break;
									}
								};
								if (isPrefixUpdatePrice) {
									updatePriceAndName(modifierGroupArray[i].modifiers[j].id, "", "", modifierGroupArray[i].modifiers[j].modifier_serving[k].price, 0, "");
								}

							} else {
								updatePriceAndName(modifierGroupArray[i].modifiers[j].id, "", "", modifierGroupArray[i].modifiers[j].modifier_serving[k].price, 0, "");
							}

						}
					}
				}
			}
		}
	}
}

function updatePriceAndName(selectedItemId, deselectedItemId, prefix_name, modifier_price, pre_id, isOverride) {
	for (var i = 0; i < modifierGroupArray.length; i++) {
		for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {
			if (modifierGroupArray[i].modifiers[j].id == selectedItemId) {

				modifierGroupArray[i].modifiers[j].modifier_prefix_name = prefix_name;
				if (isOverride != "No") {
					modifierGroupArray[i].modifiers[j].modifier_price = modifier_price;
				}
				modifierGroupArray[i].modifiers[j].modifier_prefix_id = pre_id;

			} else if (modifierGroupArray[i].modifiers[j].id == deselectedItemId) {
				modifierGroupArray[i].modifiers[j].modifier_prefix_name = "";
				modifierGroupArray[i].modifiers[j].modifier_price = 0;
				modifierGroupArray[i].modifiers[j].modifier_prefix_id = pre_id;

			}

		};
	};
}

function setSelectedValue(selectedItemId, deselectedItemId, count, isMultiple) {
	for (var i = 0; i < modifierGroupArray.length; i++) {
		for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {
			if (modifierGroupArray[i].modifiers[j].id == selectedItemId) {
				modifierGroupArray[i].modifiers[j].selected = true;
				modifierGroupArray[i].modifiers[j].count = count;
				modifierGroupArray[i].modifiers[j].count = count;

			} else if (modifierGroupArray[i].modifiers[j].id == deselectedItemId) {
				modifierGroupArray[i].modifiers[j].selected = false;
				modifierGroupArray[i].modifiers[j].count = 0;

			}

		};
	};
}

//This function used in case for multiple selection when user remove the option on long press
function updateSelectionLbl(modifier, index) {
	if (modifier.length > 0) {
		for (var i = 0; i < modifier.length; i++) {

			if (i != 0) {
				selectedOption[index].selectedLbl.text += ", " + modifier[i];
			} else {
				selectedOption[index].selectedLbl.text = modifier[i];
			}
		};
	} else {
		selectedOption[index].selectedLbl.text = "";
	}

}

//Function for open sub-modifiers or prefix popover
function openSubModifier(view, data, subModifier) {
	//Ti.API.info('subModifier4 ' + JSON.stringify(subModifier));
	var pickerView = Ti.UI.createView({
		backgroundColor : "white",
		layout : "vertical",
		width : 270,
		height : Ti.UI.SIZE
	});

	var buttonBarView = Titanium.UI.createView({
		top : 0,
		//backgroundColor : "#da500e",
		height : "45dp"
	});
	pickerView.add(buttonBarView);

	var cancel = Titanium.UI.createButton({
		//title : 'Cancel',
		color : "white",
		backgroundImage : "none",
		image : "/images/cross.png"
		// style : Titanium.UI.iOS.SystemButtonStyle.CANCEL
	});
	var spacer = Titanium.UI.createButton({
		systemButton : Titanium.UI.iOS.SystemButton.FLEXIBLE_SPACE
	});
	var done = Titanium.UI.createButton({
		title : 'Done',
		color : "white",
		backgroundImage : "none",
		//style : Titanium.UI.iOS.SystemButtonStyle.DONE
	});

	var toolbar = Titanium.UI.createToolbar({
		items : [spacer, spacer, cancel],
		barColor : "#382b20",

	});
	buttonBarView.add(toolbar);

	var datePicker = Ti.UI.createPicker({
		top : 0,
		type : Titanium.UI.PICKER_TYPE_PLAIN,
		selectionIndicator : true,

	});

	var value = "";
	var pre_price = 0;
	var pre_id = 0;
	var isOverride;

	var footerVw = Ti.UI.createView({
		height : 1,
		backgroundColor : "transparent",

	});
	var tableView = Ti.UI.createTableView({
		backgroundColor : 'white',
		height : Ti.UI.SIZE,
		footerView : footerVw,
		tableSeparatorInsets : {
			left : 0,
			right : 0
		}
	});

	var rowData = [];
	for (var i = 0; i < subModifier.length; i++) {
		var popOverRow = Ti.UI.createTableViewRow({
			height : 50,
			selectionStyle : Titanium.UI.iOS.TableViewCellSelectionStyle.NONE,
			detail : subModifier[i]
		});
		var popOverLbl = Ti.UI.createLabel({
			text : subModifier[i].prefix_name,
			color : "black",
			textAlign : "center",
			font : {
				fontSize : 16
			},
		});
		popOverRow.add(popOverLbl);
		rowData.push(popOverRow);

	};
	tableView.setData(rowData);
	tableView.addEventListener("click", function(e) {
		var getValue = selectedOption[data.modifierGroupIndex].selectedLbl.text;
		var searchValue = getValue.indexOf(data.title);
		if (searchValue != -1) {
			for (var i = 0; i < selectedOption[data.modifierGroupIndex].array.length; i++) {
				if (selectedOption[data.modifierGroupIndex].array[i] == data.title) {
					selectedOption[data.modifierGroupIndex].array[i] = (e.row.detail.prefix_name + " " + data.title);
				}
			};
			selectedOption[data.modifierGroupIndex].selectedLbl.text = getValue.replace(data.title, (e.row.detail.prefix_name + " " + data.title));
		}
		updatePriceAndName(data.id, "", e.row.detail.prefix_name, e.row.detail.prefix_price, e.row.detail.prefix_id, e.row.detail.override_modifier);

		if (data.modifierGroupData.selection_time == 'Single') {
			if (groupObj.length > data.modifierGroupIndex + 1) {
				groupObj[data.modifierGroupIndex].backgroundColor = "#eeeeee";
				groupObj[data.modifierGroupIndex + 1].backgroundColor = "transparent";
				//Ti.API.info('groupObj[data.modifierGroupIndex + 1].detail '+ JSON.stringify(groupObj[data.modifierGroupIndex + 1].detail));
				//Ti.API.info('groupObj[data.modifierGroupIndex + 1].index '+ groupObj[data.modifierGroupIndex + 1].index);
				renderModifierGrid(groupObj[data.modifierGroupIndex + 1].detail, groupObj[data.modifierGroupIndex + 1].index, false);
				previousObj = groupObj[data.modifierGroupIndex + 1];
			}
		} else {
			checkModifyWith(data.modifierGroupData, data.id, data.modifierGroupIndex);
		}

		popover.hide();

	});
	pickerView.add(tableView);

	/*
	 for (var i = 0; i < subModifier.length; i++) {
	 var row = Ti.UI.createPickerRow({
	 title : subModifier[i].prefix_name,
	 price : subModifier[i].prefix_price,
	 pre_id : subModifier[i].prefix_id,
	 isOverride : subModifier[i].override_modifier,
	 });
	 datePicker.add(row);
	 };
	 datePicker.setSelectedRow(0, 0, false);
	 pickerView.add(datePicker);
	 datePicker.addEventListener("change", function(e) {
	 Ti.API.info(e.row.price);
	 value = e.row.title;
	 pre_price = e.row.price;
	 pre_id = e.row.pre_id;
	 isOverride = e.row.isOverride;
	 });
	 done.addEventListener('click', function(e) {

	 var getValue = selectedOption[data.modifierGroupIndex].selectedLbl.text;
	 var searchValue = getValue.indexOf(data.title);
	 if (searchValue != -1) {
	 for (var i = 0; i < selectedOption[data.modifierGroupIndex].array.length; i++) {
	 if (selectedOption[data.modifierGroupIndex].array[i] == data.title) {
	 selectedOption[data.modifierGroupIndex].array[i] = (value + " " + data.title);
	 }
	 };
	 selectedOption[data.modifierGroupIndex].selectedLbl.text = getValue.replace(data.title, (value + " " + data.title));
	 }
	 updatePriceAndName(data.id, "", value, pre_price, pre_id, isOverride);
	 if (data.modifierGroupData.selection_time == 'Single') {
	 if (groupObj.length > data.modifierGroupIndex + 1) {
	 groupObj[data.modifierGroupIndex].backgroundColor = "#eeeeee";
	 groupObj[data.modifierGroupIndex + 1].backgroundColor = "transparent";
	 renderModifierGrid(groupObj[data.modifierGroupIndex + 1].detail, groupObj[data.modifierGroupIndex + 1].index, false);
	 previousObj = groupObj[data.modifierGroupIndex + 1];
	 }
	 }
	 popover.hide();

	 });*/

	cancel.addEventListener('click', function(e) {

		popover.hide();
		if (data.modifierGroupData.selection_time == 'Single') {
			if (groupObj.length > data.modifierGroupIndex + 1) {
				groupObj[data.modifierGroupIndex].backgroundColor = "#eeeeee";
				groupObj[data.modifierGroupIndex + 1].backgroundColor = "transparent";
				renderModifierGrid(groupObj[data.modifierGroupIndex + 1].detail, groupObj[data.modifierGroupIndex + 1].index, false);
				previousObj = groupObj[data.modifierGroupIndex + 1];
			}
		} else {
			checkModifyWith(data.modifierGroupData, data.id, data.modifierGroupIndex);
		}

	});
	var popover = Ti.UI.iPad.createPopover({

		horizontalWrap : false,
		backgroundColor : "white",
		//arrowDirection : Titanium.UI.iPad.POPOVER_ARROW_DIRECTION_UP,
		contentView : pickerView
	});

	popover.show({
		view : view
	});
}

function createSelectionLbl() {
	for (var i = 0; i < modifierGroupArray.length; i++) {
		var staticLbl = Ti.UI.createLabel({

			textAlign : "center",
			font : {
				fontSize : 16,
				fontWeight : "semibold"
			},
			text : modifierGroupArray[i].modifier_group_name + ": ",
			color : "black",
			height : 24,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false
		});
		$.selectedModifierVW.add(staticLbl);
		var selectedLbl = Ti.UI.createLabel({

			textAlign : "center",
			font : {
				fontSize : 16 ,
			},
			text : "",
			array : [],
			color : "black",
			height : 24,
			ellipsize : Titanium.UI.TEXT_ELLIPSIZE_TRUNCATE_END,
			wordWrap : false,
			selected : false
		});
		$.selectedModifierVW.add(selectedLbl);
		var slash = Ti.UI.createLabel({
			textAlign : "center",
			font : {
				fontSize : 16 ,
			},
			text : " /  ",
			color : "black",
			height : 24
		});
		if ((modifierGroupArray.length - 1 != i)) {
			$.selectedModifierVW.add(slash);
		}

		if (args.from == 'add') {
			var obj = {
				selectedLbl : selectedLbl,
				array : []
			};
		} else {

			var arrayContainer = [];
			for (var j = 0; j < modifierGroupArray[i].modifiers.length; j++) {
				if (modifierGroupArray[i].modifiers[j].selected == true) {
					if (selectedLbl.text.length == 0) {
						if (modifierGroupArray[i].modifiers[j].modifier_prefix_name != "") {
							var n = modifierGroupArray[i].modifiers[j].modifier_prefix_name + " " + modifierGroupArray[i].modifiers[j].modifier_name;
							selectedLbl.text = modifierGroupArray[i].modifiers[j].modifier_prefix_name + " " + modifierGroupArray[i].modifiers[j].modifier_name;
						} else {
							var n = modifierGroupArray[i].modifiers[j].modifier_name;
							selectedLbl.text = modifierGroupArray[i].modifiers[j].modifier_name;
						}
					} else {
						if (modifierGroupArray[i].modifiers[j].modifier_prefix_name != "") {
							var n = modifierGroupArray[i].modifiers[j].modifier_prefix_name + " " + modifierGroupArray[i].modifiers[j].modifier_name;
							selectedLbl.text += ", " + modifierGroupArray[i].modifiers[j].modifier_prefix_name + " " + modifierGroupArray[i].modifiers[j].modifier_name;
						} else {
							var n = modifierGroupArray[i].modifiers[j].modifier_name;
							selectedLbl.text += ", " + modifierGroupArray[i].modifiers[j].modifier_name;
						}
					}
					arrayContainer.push(n);
				}
			}
			var obj = {
				selectedLbl : selectedLbl,
				array : arrayContainer
			};
		}
		selectedOption.push(obj);
	};
}

function checkModifyWith(modifierDetail, modifierObj, index) {
	try {
		for (var h = 1; h < modifierGroupArray.length; h++) {
			for (var i = 0; i < modifierGroupArray[h].modifiers.length; i++) {

				if (modifierGroupArray[h].modifiers[i].enabled == false) {
					modifierGroupArray[h].modifiers[i].enabled = true;
					modifierGroupArray[h].modifiers[i].showItem = true;
				}
			}
		}
		for (var h = 1; h < modifierGroupArray.length; h++) {
			for (var i = 0; i < modifierGroupArray[h].modifiers.length; i++) {

				if (modifierGroupArray[h].modifiers[i].selected == true) {
					for (var j = 1; j < modifierGroupArray.length; j++) {
						for (var k = 0; k < modifierGroupArray[j].modifiers.length; k++) {
							if (isModifyWithExist(modifierGroupArray[j].modifiers[k], modifierGroupArray[h].modifiers[i].id)) {
								if (modifierGroupArray[j].modifiers[k].selected == true || modifierGroupArray[j].modifiers[k].showItem == false) {
									continue;
								}

								modifierGroupArray[j].modifiers[k].enabled = true;

							} else {
								//Ti.API.info("NO  " + modifierGroupArray[j].modifiers[k].showItem + "  " + modifierGroupArray[j].modifiers[k].modifier_name);
								if (modifierObj == modifierGroupArray[j].modifiers[k].id) {
									continue;
								}
								if (modifierGroupArray[j].modifiers[k].selected == true) {
									for (var i = 0; i < selectedOption[j].array.length; i++) {
										var mainString = selectedOption[j].array[i];
										if (modifierGroupArray[j].modifiers[k].modifier_prefix_name != "") {
											var n = modifierGroupArray[j].modifiers[k].modifier_prefix_name + " " + modifierGroupArray[j].modifiers[k].modifier_name;
										} else {
											var n = modifierGroupArray[j].modifiers[k].modifier_name;
										}
										if (mainString == n) {
											selectedOption[j].array.splice(i, 1);
										}

									};
									updateSelectionLbl(selectedOption[j].array, j);
									modifierGroupArray[j].modifiers[k].quantity = 1;
									modifierGroupArray[j].modifiers[k].count = 0;
									modifierGroupArray[j].modifiers[k].modifier_prefix_name = "";
									modifierGroupArray[j].modifiers[k].modifier_price = 0;
									modifierGroupArray[j].modifiers[k].modifier_prefix_id = "";

								}
								modifierGroupArray[j].modifiers[k].enabled = false;
								modifierGroupArray[j].modifiers[k].showItem = false;
								modifierGroupArray[j].modifiers[k].selected = false;

							}
						}
					}
				}
			}
		}
		//Ti.API.info('modifierDetail ' + JSON.stringify(modifierDetail));
		renderModifierGrid(modifierDetail, index, false);
		//previousObj = index;
	} catch(e) {
		Ti.API.info('checkModifyWith Error :' + e.message);
		tracker.addException({
			description : "CustomizeOrderPopup: " + e.message,
			fatal : false
		});
	}
}

function isModifyWithExist(modifier, modifier_id) {
	if (modifier.id == modifier_id) {
		return true;
	}
	var modify_with_array = [];

	if (modifier.modify_with != "") {
		modify_with_array = modifier.modify_with.split(',');
		//Ti.API.info('modify_with_array ' + JSON.stringify(modify_with_array));
		//Ti.API.info('modifier_id ' + modifier_id);
		if (modify_with_array.length > 0) {
			for (var i = 0; i < modify_with_array.length; i++) {

				if (modify_with_array[i] == modifier_id) {
					return true;
				}
			}
		}
		return false;
	} else {
		return true;
	}

}

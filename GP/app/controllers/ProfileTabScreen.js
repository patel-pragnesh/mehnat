// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
tracker.addScreenView('ProfileTab Screen');
args = Ti.App.Properties.getObject("profileData");
Ti.API.info('PROFILE : ' + JSON.stringify(args));
var teamPickerViewplanstart = null;


var genderValue;
var selectedImage = null;
	var profileData;
/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
/*
 * Picker animations
 */
var slideIn = Titanium.UI.createAnimation({
	bottom : 0,
	duration : 300
});
var slideOut = Titanium.UI.createAnimation({
	bottom : -262,
	duration : 300
});

exports.finalize = function(){
	Ti.API.info('Inside Profile finalize');
};

/*
 * set profiledata on fields initially
 */
Alloy.Globals.setProfileDataToGUI = function() {
	profileData = Ti.App.Properties.getObject("profileData");
	$.fullnametf.value = profileData.first_name + " " + profileData.last_name;
	$.emailtf.value = profileData.email;
	$.mobnotf.value = profileData.phone_number;
	formateMobNoFun($.mobnotf);
	$.addresstf.value = profileData.address;
	$.zipcodetf.value = profileData.zip;
	$.citytf.value = profileData.city;
	$.statetf.value = profileData.state;
	$.roletf.value = profileData.role;
	$.profileImgVW.image = (profileData.profile_pic != "")?profileData.profile_pic:"/images/user_img.png";
	if (profileData.gender == 1) {
		genderValue = 1;
		$.femaleBtn.image = "/images/radio_btn.png";
		$.maleBtn.image = "/images/radio_btn_check.png";
		
	} else {
		genderValue = 0;
		$.femaleBtn.image = "/images/radio_btn_check.png";
		$.maleBtn.image = "/images/radio_btn.png";
	}
};

Alloy.Globals.setProfileDataToGUI();
/*
 * Function for open left drawer menu from pos screen
 */
function toggleLeftView() {

	Alloy.Globals.openLeft();
}

/*
 * Function for updating profile
 */


function editProfileFun() {
	// if ($.editBtn.profileEditable == false) {
	// setfieldsEnable(true);
	// $.editBtn.title = "SUBMIT";
	// $.fullnametf.focus();
	// $.editBtn.profileEditable = true;
	// } else {

	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : 'Are you sure want to update profile?',
		title : 'Gongcha POS'
	});
	dialog.addEventListener('click', function(k) {
		if (k.index === k.source.cancel) {
			dialog.hide();
		} else {
			validateCustomerDetails();
		}
	});
	dialog.show();
	//}

}



function maleBtnselectionFun() {
	genderValue = 1;
	$.maleBtn.image = "images/radio_btn_check.png";
	$.femaleBtn.image = "images/radio_btn.png";

}

function femaleBtnselectionFun() {
	genderValue = 0;
	$.maleBtn.image = "images/radio_btn.png";
	$.femaleBtn.image = "images/radio_btn_check.png";
}

function setfieldsEnable(enable) {
	$.fullnametf.editable = enable;
	$.mobnotf.editable = enable;
	$.addresstf.editable = enable;
	$.zipcodetf.editable = enable;
	$.citytf.editable = enable;
	$.statetf.editable = enable;
	$.maleBtn.touchEnabled = enable;
	$.femaleBtn.touchEnabled = enable;
	$.profilePicVW.touchEnabled = enable;
	$.profilePicVW.focusable = enable;
	$.editPicLbl.visible = enable;
}

function validateCustomerDetails() {
	if (teamPickerViewplanstart != null) {
		teamPickerViewplanstart.animate(slideOut);
	}
	if ($.fullnametf.value != '' && $.fullnametf.value.trim().length > 0) {
		if ($.emailtf.value != '' && $.emailtf.value.trim().length > 0) {
			if ($.mobnotf.value != '' && $.mobnotf.value.trim().length > 0) {
				if ($.mobnotf.value.trim().length == 12) {
					profileService();
				} else {
					Alloy.Globals.Notifier.show("Please enter valid mobile number");
				}
			} else {
				Alloy.Globals.Notifier.show("Please enter mobile number");
			}
		} else {
			Alloy.Globals.Notifier.show("Please enter customer email id");
		}
	} else {
		Alloy.Globals.Notifier.show("Please enter customer fullname");
	}
}





// Check City and State of Zipcode
function checkZipCodeFunc(e) {
	$.citytf.value = "";
		$.statetf.value = "";
	if (e.value.length == 5) {
		Ti.API.info('e.value : ' + e.value);
		// try {
		// var hills = zipcodes.lookup(e.value);
		// Ti.API.info('hills : ' + JSON.stringify(hills));
		// if (hills != null && hills != undefined) {
		// var cityByZip = hills.city;
		// var stateByZip = zipcodes.states.abbr[hills.state];
		// $.cityNameTxt.value = cityByZip;
		// $.stateNameTxt.value = stateByZip;
		// } else {
		// Alloy.Globals.toast(L("ENTER_PROPER_ZIPCODE"));
		// }
		//
		// } catch(e) {
		// Ti.API.info('error in zipcodes');
		// }

		Alloy.Globals.LoadingScreen.open();
		//var url = 'https://nominatim.openstreetmap.org/search?postalcode=' + e.value + '&format=json&limit=5&addressdetails=1&countrycodes=us&accept-language=en-US';
		var url = 'https://nominatim.openstreetmap.org/search?q=' + e.value + '&format=json&limit=5&addressdetails=1&countrycodes=us&accept-language=en-US&postalcode=' + e.value;
		Ti.API.info('url getCategories : ' + url);

		//requestedUtils.post(url, a, function(e) {
		Alloy.Globals.Communicator.get(url, function(e) {
			try {
				if (e.success) {

					var responseData = JSON.parse(e.response);
					Ti.API.info('responseData ' + JSON.stringify(responseData));
					if (responseData != undefined && responseData != null && responseData.length > 0) {
						Ti.API.info('responseData ' + JSON.stringify(responseData));
						Alloy.Globals.LoadingScreen.close();
						openStateCityPicker(responseData);
					} else {

						Alloy.Globals.LoadingScreen.close();
						Alloy.Globals.Notifier.show(L("ENTER_PROPER_ZIPCODE"));
					}
				} else {

					Alloy.Globals.LoadingScreen.close();
					Alloy.Globals.Notifier.show(e.message);
				}
			} catch(e) {

				Alloy.Globals.LoadingScreen.close();
				Ti.API.info('in catch Zipcode Function' + JSON.stringify(e));
			}

		});

	}
}
// Method to create and handle State-city Picker
function openStateCityPicker(zipcodeResp) {
	blurAllTf();
	Ti.API.info('openStateCityPicker ');
	
		 teamPickerViewplanstart = Ti.UI.createView({
			height : 262,
			bottom : -262,
			width : "100%",
			backgroundColor:'ffffff',
			layout : 'vertical'
		});
		var spacer = Titanium.UI.createButton({
			systemButton : Titanium.UI.iOS.SystemButton.FLEXIBLE_SPACE
		});
		var cancel = Titanium.UI.createButton({
			title : L('CANCEL'),
			color : '#fff',
			backgroundImage : 'none',
			style : Titanium.UI.iOS.SystemButtonStyle.BORDERED,
			font : {
				fontSize : 20,
				fontFamily : "Montserrat-Light"
			},
		});
		var done = Titanium.UI.createButton({
			title : L('DONE'),
			color : '#fff',
			backgroundImage : 'none',
			style : Titanium.UI.iOS.SystemButtonStyle.BORDERED,
			font : {
				fontSize : 20,
				fontFamily : "Montserrat-Light"
			},
		});

		var toolbar = Ti.UI.iOS.createToolbar({
			top : 0,
			barColor : '#b3b3b3',
			translucent : true,
			opacity : '0.9',
			items : [cancel, spacer, done]
		});
		teamPickerViewplanstart.add(toolbar);

		var stateCityPicker = Ti.UI.createPicker({
			top : 0,
			selectionIndicator : true,
		font : {
				fontSize : 24,
				fontFamily : "Montserrat-Regular"
			}
		});
		stateCityPicker.setSelectedRow(0,0);
		var rows = createStateCityAry(zipcodeResp);
		// rows.font = {
				// fontSize : 12,
				// fontFamily : "Montserrat-Light"
			// }
		if (rows.length <= 0) {
			Alloy.Globals.Notifier.show(L("ENTER_PROPER_ZIPCODE"));
			return;
		}
		stateCityPicker.add(rows);
		teamPickerViewplanstart.add(stateCityPicker);

		var value;
		var timeInMs;

		stateCityPicker.addEventListener('change', function(e) {
			Ti.API.info("Date Picker Change : " + e.row.title + " ");
			value = e.row.title;
		});
		done.addEventListener('click', function() {
Ti.API.info("Date Picker Change value : " + value);
			// if (value == null) {
				// // value =
				// Ti.API.info('countryPicker ;' + stateCityPicker.getSelectedRow(0).title + " " + stateCityPicker.getSelectedRow(0).id);
				// value = countryPicker.getSelectedRow(0).title;
				// // selectedCountryId = countryPicker.getSelectedRow(0).id;
			// }
	 // if (value == null) {
			// $.statetf.value = value.split(", ")[1];
			// $.citytf.value = value.split(", ")[2];
// }
// value = null;

			if (value != null) {
				$.zipcodetf.value = value.split(", ")[0];
				$.statetf.value = value.split(", ")[1];
				$.citytf.value = value.split(", ")[2];
			}

			teamPickerViewplanstart.animate(slideOut);
		});
		cancel.addEventListener('click', function() {
			teamPickerViewplanstart.animate(slideOut);
		});
		$.profileWin.add(teamPickerViewplanstart);
		teamPickerViewplanstart.animate(slideIn);

	
}

function ValidateEmail(emailvalue) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailvalue)) {
		return (true);
	}
	return (false);
}

function profileService() {

	var data = {};
	data.user_id  = profileData.employee_id;
	data.store_id = Alloy.Globals.store_id;
	data.fullname = $.fullnametf.value.trim();
	data.gender = genderValue;
	data.address = $.addresstf.value.trim();
	data.city = $.citytf.value.trim();
	data.state = $.statetf.value.trim();
	data.phone_number = $.mobnotf.value.trim();
	data.zip = $.zipcodetf.value.trim();
	data.device_type = "pos";
	
	if (selectedImage) {
		data.profile_pic = selectedImage;
	} else {
		data.profile_pic = "";
	}
	
	

	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_EMPLOY_PROFILE_UPDATE = Alloy.Globals.Constants.SERVICE_EMPLOY_PROFILE_UPDATE;

	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_EMPLOY_PROFILE_UPDATE, profileServiceCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_EMPLOY_PROFILE_UPDATE);

	} else {
		Alloy.Globals.Notifier.show("No internet connection");
	}
}

/*
 * Callback function for clockin and clock out
 */
function profileServiceCallback(e) {
	Ti.API.info("profileCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = JSON.parse(e.response);

			if (response != null) {

				Ti.API.info('response.action_success = ' + response.response_code);

				if (response.response_code == '1') {
					setfieldsEnable(false);
					//Alloy.Globals.employee_id = response.result[0].employee_id;
					//Alloy.Globals.store_id = response.result[0].store_id;
					Alloy.Globals.fullname = response.result[0].fullname;
					Alloy.Globals.userimage = response.result[0].profile_pic;
					Alloy.Globals.store_name = response.result[0].store_name;
					$.editBtn.title = "EDIT";
					$.editBtn.profileEditable = false;
					Ti.App.Properties.setObject("profileData", response.result[0]);
					Alloy.Globals.Notifier.show(response.message);
				} else {
					Alloy.Globals.Notifier.show(response.message);
				}
			} else {
				Alloy.Globals.Notifier.show(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {
			Ti.API.info('Error social Login List :: ' + e.error);
			tracker.addException({
				description : "ProfileTabScreen: " + e.message,
				fatal : false
			});
		}
	} else {
		Alloy.Globals.Notifier.show("No internet connection");
	}
	Alloy.Globals.LoadingScreen.close();
}


function updateUserImgFun(e) {
	
		$.fullnametf.blur();
		$.emailtf.blur();
		$.mobnotf.blur();
		$.addresstf.blur();
		$.zipcodetf.blur();
		$.citytf.blur();
		$.statetf.blur();
		var opts = {
			title : 'Choose Photo'
		};
		opts.options = ['Gallery', 'Camera', 'Cancel'];
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.show();
		try {
			dialog.addEventListener('click', function(e) {
				if (e.index == 0) {
					// from gallery

					Titanium.Media.openPhotoGallery({

						success : function(event) {
   
							if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
								try {
									var newBlob = Alloy.Globals.ImageFactory.compress((event.media), 0.25);
									var galleryImg = Alloy.Globals.ImageFactory.imageAsResized(newBlob, {
										width : 300,
										height : 300
									});

									$.profileImgVW.image = galleryImg;
									var img = Titanium.Utils.base64encode($.profileImgVW.image);
									selectedImage = "" + Titanium.Utils.base64encode($.profileImgVW.image);
									Ti.API.info("selectedImage " + selectedImage);
								} catch(k) {
									//Ti.API.info <http://ti.api.info>(k.message);
									//Alloy.Globals.Alloy.Globals.Alert("Network is down. Please try again later");
								}

							}
						},
						cancel : function() {
						},
						mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
						saveToPhotoGallery : false,
						allowEditing : true,
					});

				} else if (e.index == 1) {
					Titanium.Media.showCamera({
						success : function(event) {
							var image = event.media;
							// called when media returned from the camera
							//Ti.API.debug('Our type was: ' + event.media);
							if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {

								if (image.length >= 512000) {

									var newBlob = Alloy.Globals.ImageFactory.compress(image, 0.25);

									var blob = newBlob.imageAsResized(300, 300);
									$.profileImgVW.image = blob;

								} else {

									$.profileImgVW.image = (event.media).imageAsResized(300, 300);
								}
								selectedImage = Titanium.Utils.base64encode($.profileImgVW.image);
							} else {
								alert("got the wrong type back =" + event.mediaType);
							}
						},
						error : function(error) {
							var a = Titanium.UI.createAlertDialog({
								title : 'Camera'
							});
							if (error.code == Titanium.Media.NO_CAMERA) {
								a.setMessage('Please run this test on device');
							} else {
								a.setMessage('Unexpected error: ' + error.code);
							}
							a.show();
						},
						saveToPhotoGallery : false,
						allowEditing : true,
						mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
					});
				}
			});
		} catch(e) {
			tracker.addException({
				description : "ProfileTabScreen2: " + e.message,
				fatal : false
			});
		}
	
}

function returnmobFun(e) {
	$.mobnotf.focus();
}

function returnaddress(e) {
	$.addresstf.focus();
}

function returnzip(e) {
	$.zipcodetf.focus();
}

function returncity(e) {
	$.citytf.focus();
}

function returnstate(e) {
	$.statetf.focus();
}


function returnblurstate(e) {
	$.statetf.blur();
}

/*
 * Functions For Keyboard Type
 */
function focusFunc(){
	try{
		if (teamPickerViewplanstart != null) {
	
			teamPickerViewplanstart.animate(slideOut);
		}
	}catch(e){
		Ti.API.info('e');
	}
}

function winkeybordFun(e) {
if (e.source.name != 'tf') {
		$.fullnametf.blur();
		$.emailtf.blur();
		$.mobnotf.blur();
		$.addresstf.blur();
		$.zipcodetf.blur();
		$.citytf.blur();
		$.statetf.blur();
	} 
}


// create state-city row data
function createStateCityAry(zipcodeResp) {
	Ti.API.info('zipcodeResp  ' + zipcodeResp.length);
	var data = [];
	for (var i = 0; i < zipcodeResp.length; i++) {
		Ti.API.info('zipcodeResp  ' + zipcodeResp[i].address);

		if (zipcodeResp[i].address.postcode == undefined || zipcodeResp[i].address.postcode == null || zipcodeResp[i].address.postcode == "") {
			continue;
		}

		if (zipcodeResp[i].address.state == undefined || zipcodeResp[i].address.state == null || zipcodeResp[i].address.state == "") {
			continue;
		}

		if (zipcodeResp[i].address.city == undefined || zipcodeResp[i].address.city == null || zipcodeResp[i].address.city == "") {
			continue;
		}

		
			var row = Ti.UI.createPickerRow({
				title : zipcodeResp[i].address.postcode + ", " + zipcodeResp[i].address.state + ", " + zipcodeResp[i].address.city,
				// id : countryJson.countries[i].id
			});
		

		data.push(row);
	}

Ti.API.info('data----------'+data);

	return data;
}

function blurAllTf(){
	$.fullnametf.blur();
		$.emailtf.blur();
		$.mobnotf.blur();
		$.addresstf.blur();
		$.zipcodetf.blur();
		$.citytf.blur();
		$.statetf.blur();
}
function formateMobNoFun(){
	var numbers = $.mobnotf.value.replace(/\D/g, ''),
        char = {0:'',3:'-',6:'-'};
    $.mobnotf.value = '';
    for (var i = 0; i < numbers.length; i++) {
       $.mobnotf.value += (char[i]||'') + numbers[i];
    }
}

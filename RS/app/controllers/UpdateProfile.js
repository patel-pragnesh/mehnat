var args = arguments[0] || {};

if (args != "") {
	Ti.API.info("GALAT");
	Ti.API.info("ARGS : " + JSON.stringify(args));
	$.userPic.image = args.user_img;

	$.nameTF.value = args.name;
	$.emailTF.value = args.email;
	$.contactTF.value = args.contact;
	Ti.API.info("$.nameTF.value " + $.nameTF.value);
	if (OS_IOS) {
		if ($.nameTF.value.length > 0) {
			$.nameLbl.visible = false;
		}
		if ($.emailTF.value.length > 0) {
			$.emailLbl.visible = false;
		}
		if ($.contactTF.value.length > 0) {
			$.contactLbl.visible = false;
		}
	}
	if ($.nameTF.value == undefined) {
		$.nameTF.value = "";
	}
	if ($.emailTF.value == undefined) {
		$.nameTF.value = "";
	}
	if ($.contactTF.value == undefined) {
		$.nameTF.value = "";
	}
} else {
	Ti.API.info("GALAT");
	$.nameTF.value = "";
	$.emailTF.value = "";
	$.contactTF.value = "";
}
function androidRetrunFun(e) {
	$.contactTF.focus();
}

function nameReturnFun(e) {
	$.contactTF.focus();
}

/*
 * Variable defined for the services
 */
var ImageFactory = require('fh.imagefactory');
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
var selectedImage = null;
var id = Ti.App.Properties.getString("id");
var exifTags = {
	'Date/time' : ImageFactory.TAG_DATETIME,
	'Flash' : ImageFactory.TAG_FLASH,
	'GPS altitude' : ImageFactory.TAG_GPS_ALTITUDE,
	'GPS altitude ref' : ImageFactory.TAG_GPS_ALTITUDE_REF,
	'GPS date stamp' : ImageFactory.TAG_GPS_DATESTAMP,
	'GPS latitude' : ImageFactory.TAG_GPS_LATITUDE,
	'GPS latitude ref' : ImageFactory.TAG_GPS_LATITUDE_REF,
	'GPS longitude' : ImageFactory.TAG_GPS_LONGITUDE,
	'GPS longitude ref' : ImageFactory.TAG_GPS_LONGITUDE_REF,
	'GPS processing method' : ImageFactory.TAG_GPS_PROCESSING_METHOD,
	'GPS timestamp' : ImageFactory.TAG_GPS_TIMESTAMP,
	'Image length' : ImageFactory.TAG_IMAGE_LENGTH,
	'Image width' : ImageFactory.TAG_IMAGE_WIDTH,
	'Camera make' : ImageFactory.TAG_MAKE,
	'Camera model' : ImageFactory.TAG_MODEL,
	'Orientation' : ImageFactory.TAG_ORIENTATION,
	'White balance' : ImageFactory.TAG_WHITEBALANCE
};
function closeProfileFun(e) {
	$.UpdateProfile.close();
}

function editFun(e) {
	$.nameTF.editable = true;
	$.emailTF.editable = true;
	$.contactTF.editable = true;
}

function uploadPhoto(e) {
	var opts = {
		title : 'Choose Photo'
	};
	opts.options = ['Gallery', 'Camera', 'Cancel'];
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.show();
	try {
		dialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				// 			from gallery

				Titanium.Media.openPhotoGallery({

					success : function(event) {
						//var image = event.media;
						if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
							//we may create image view with contents from image variable
							//or simply save path to image
							try {

								Ti.API.info('height-------.' + (event.media).height);

								var newBlob = Alloy.Globals.ImageFactory.compress((event.media), 0.25);

								var galleryImg = Alloy.Globals.ImageFactory.imageAsResized(newBlob, {
									width : 300,
									height : 300
								});
								$.userPic.image = galleryImg;
								selectedImage = "" + Titanium.Utils.base64encode(galleryImg);

							} catch(e) {

								Ti.API.info("Error" + e.message);
								// $.mainImagesView.remove(view);
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
						var nativePath = event.media.nativePath;

						if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
							try {

								var exifInformation = 'Exif information:' + "\n";
								for (tag in exifTags) {
									exifInformation += "\n" + tag + ': ' + ImageFactory.getExifTag(nativePath, exifTags[tag]);
								}
								var maximumSize = 800;
								var jpegQuality = 70;
								ImageFactory.rotateResizeImage(nativePath, maximumSize, jpegQuality);
								//$.userPic.opacity = 0;
								$.userPic.image = nativePath;
								
								// $.userPic.addEventListener("load", function(e) {
									// var size = Alloy.Globals.getImageSizeWithAspectRatio(e.source, 85, 85);
									// e.source.width = size.width;
									// e.source.height = size.height;
									// e.source.opacity = 1;
								// });
								var file = Ti.Filesystem.getFile(nativePath);
								var blob = file.read();

								if (image.length >= 200000) {

									var cameraImg = Alloy.Globals.ImageFactory.compress(blob, 0.25);

									//cameraImg = newBlob.imageAsResized(300, 300);
									//$.userPic.image = blob1;

								} else {

									cameraImg = blob;
								}
								selectedImage = "" + Titanium.Utils.base64encode(cameraImg);

							} catch(event) {
								Ti.API.info(e.message);

							}
						}
					},
					cancel : function() {
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

			} else if (e.index == 2) {
			}
		});
	} catch(e) {
	}
}

function contactChangeFun(e) {

	if ($.contactTF.value.length > 0) {
		$.contactLbl.visible = false;
	} else {
		$.contactLbl.visible = true;
	}
}

function emailChangeFun(e) {

	if ($.emailTF.value.length > 0) {
		$.emailLbl.visible = false;
	} else {
		$.emailLbl.visible = true;
	}
}

function nameChangeFun(e) {

	if ($.nameTF.value.length > 0) {
		$.nameLbl.visible = false;
	} else {
		$.nameLbl.visible = true;
	}
}

function contactChangeFun(e) {

	if ($.contactTF.value.length > 0) {
		$.contactLbl.visible = false;
	} else {
		$.contactLbl.visible = true;
	}
}

function winClickFun(e) {
	Ti.API.info(e.source.name);
	if (e.source.name != "tf") {
		$.emailTF.blur();
		$.nameTF.blur();
		$.contactTF.blur();
	}
}

function updateProfileFun(e) {

	if (args) {
		var isValidate = validateProfile();
		Ti.API.info("isValidate " + isValidate);
		if (isValidate) {
			updateProfileService();
		}
	}

}

function updateProfileService() {
	var data = {};
	data.id = id;
	data.name = $.nameTF.value;
	data.email = $.emailTF.value;
	data.contact = $.contactTF.value;
	data.device_id = Ti.Platform.id;
	data.device_type = Titanium.Platform.osname;
	if (selectedImage) {
		data.user_img = selectedImage;
	} else {
		data.user_img = "";
	}
	Ti.API.info('Data : ' + JSON.stringify(data));
	var SERVICE_UPDATE_PROFILE = Alloy.Globals.Constants.SERVICE_UPDATE_PROFILE;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		Alloy.Globals.LoadingScreen.open();
		Communicator.post(DOMAIN_URL + SERVICE_UPDATE_PROFILE, updateProfileServiceCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_UPDATE_PROFILE);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function updateProfileServiceCallback(e) {
	Ti.API.info("updateProfileServiceCallback response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {
					$.UpdateProfile.close();
					Alloy.Globals.profileObj.exgetProfileService();
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error updateProfileServiceCallback :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	Alloy.Globals.LoadingScreen.close();

}

Ti.API.info('Alloy.Globals.isFbLogin ' + Alloy.Globals.isFbLogin);
if (Alloy.Globals.isFbLogin) {

	$.emailTF.editable = true;
	$.emailTF.focusable = true;
	$.emailTF.touchEnabled = true;
}
function validateProfile() {
	Ti.API.info("ALERT0");
	if ($.nameTF.value != '' && $.nameTF.value.trim().length > 0) {
		if (Alloy.Globals.isFbLogin) {
			if ($.emailTF.value != '' && $.emailTF.value.trim().length > 0) {
				var validEmail = checkemail($.emailTF.value.trim());
				if (validEmail) {
					var isContact = contactValidate();
					Ti.API.info("isContact " + isContact);
					return isContact;
				} else {

					Alloy.Globals.Alert("Please enter valid email-id");
					return false;
				}
			} else {

				Alloy.Globals.Alert("Please enter your email-id");
				return false;
			}
		} else {
			var isContact = contactValidate();
			Ti.API.info("isContact " + isContact);
			return isContact;
		}

	} else {

		Alloy.Globals.Alert("Please enter your name");
		return false;
	}

}

function contactValidate() {
	Ti.API.info("ALERT");
	if ($.contactTF.value != '' && $.contactTF.value.trim().length > 0) {
		if ($.contactTF.value.trim().length >= 8 && $.contactTF.value.trim().length <= 15) {
			if ($.contactTF.value > 0) {
				Ti.API.info("ALERT2");
				return true;
			} else {
				Alloy.Globals.Alert("Please enter valid contact number");
				return false;
			}
		} else {
			Alloy.Globals.Alert("Phone number can not less 8 characters and exceed 15 characters in length");

			return false;
		}
	} else {

		Alloy.Globals.Alert("Please enter contact number");

		return false;
	}
}

/*
 * Function for email validation
 */

function checkemail(emailAddress) {
	var str = emailAddress;
	var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (filter.test(str)) {
		testresults = true;
	} else {
		testresults = false;
	}
	return (testresults);
};
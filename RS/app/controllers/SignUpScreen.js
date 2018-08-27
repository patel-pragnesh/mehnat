var args = arguments[0] || {};
Ti.API.info("DETAIL :: " + JSON.stringify(args));

var selectedImage = null;
var ImageFactory = require('fh.imagefactory');
//
// The list of all currently supported Exif tags (API level <= 10)
//
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
if (args != 0) {
	$.nameTF.value = args.name;
	if (OS_IOS) {
		if ($.nameTF.value.length > 0) {
			$.nameLbl.visible = false;
		}
	}

}

function closeFun(e) {

	if (OS_IOS) {
		$.SignUpScreen.close({
			transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
	} else {
		$.SignUpScreen.close();
	}
}

function winClickFun(e) {
	//Ti.API.info(e.source.name);
	if (e.source.name != "tf") {
		$.nameTF.blur();
		$.emailTF.blur();
		$.contactTF.blur();
		$.passwordTF.blur();
		$.confirmPwdTF.blur();

	}
}

function nameReturnFun(e) {
	$.emailTF.focus();
}

function emailReturnFun(e) {
	$.contactTF.focus();
}

function contactReturnFun(e) {
	$.passwordTF.focus();
}

function pwdReturnFun(e) {
	$.confirmPwdTF.focus();
}

function emailChangeFun(e) {

	if ($.emailTF.value.length > 0) {
		$.usernameLbl.visible = false;
	} else {
		$.usernameLbl.visible = true;
	}
}

function nameChangeFun(e) {

	if ($.nameTF.value.length > 0) {
		$.nameLbl.visible = false;
	} else {
		$.nameLbl.visible = true;
	}
}

function emailChangeFun(e) {

	if ($.emailTF.value.length > 0) {
		$.emailLbl.visible = false;
	} else {
		$.emailLbl.visible = true;
	}
}

function contactChangeFun(e) {

	if ($.contactTF.value.length > 0) {
		$.contactLbl.visible = false;
	} else {
		$.contactLbl.visible = true;
	}
}

function pwdChangeFun(e) {

	if ($.passwordTF.value.length > 0) {
		$.passwordLbl.visible = false;
	} else {
		$.passwordLbl.visible = true;
	}
}

function confirmpwdChangeFun(e) {

	if ($.confirmPwdTF.value.length > 0) {
		$.confirmPwdLbl.visible = false;
	} else {
		$.confirmPwdLbl.visible = true;
	}
}

function uploadPhoto(e) {
	$.nameTF.blur();
	$.emailTF.blur();
	$.contactTF.blur();
	$.passwordTF.blur();
	$.confirmPwdTF.blur();
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

						if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
							try {
								var newBlob = Alloy.Globals.ImageFactory.compress((event.media), 0.25);
								var galleryImg = Alloy.Globals.ImageFactory.imageAsResized(newBlob, {
									width : 300,
									height : 300
								});

								$.userPic.image = galleryImg;
								selectedImage = "" + Titanium.Utils.base64encode($.userPic.image);

							} catch(k) {
								Ti.API.info(k.message);
								////Alloy.Globals.Alert("Network is down. Please try again later");
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

								$.userPic.image = nativePath;
								// $.userPic.opacity = 0;
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

function signup_Via_Return_KeypadFun(e) {
	$.signupBtn.fireEvent("click");
}

function signupFun(e) {
	if (Ti.Network.online) {
		if ($.signupBtn.focusable == false) {
			return;
		}
		$.signupBtn.focusable = false;

		var ifValidate = validateSignup();

		if (ifValidate) {
			Alloy.Globals.LoadingScreen.open();
			if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {

				doSignup();
			} else {
				Alloy.Globals.registerPushNotification(function(e) {
					Ti.API.info("deviceToken1 " + e);
					Alloy.Globals.deviceToken = e;
					Ti.App.Properties.setString("token", Alloy.Globals.deviceToken);
					doSignup();
				});
			}

		} else {
			$.signupBtn.focusable = true;
		}
	} else {
		$.signupBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function validateSignup() {
	if (selectedImage) {
		if ($.nameTF.value != '' && $.nameTF.value.trim().length > 0) {
			var isSpecialChar = isValid($.nameTF.value.trim());
			Ti.API.info("isSpecialChar " + isSpecialChar);
			if (isSpecialChar) {
				if ($.emailTF.value != '' && $.emailTF.value.trim().length > 0) {
					var validEmail = checkemail($.emailTF.value.trim());
					if (validEmail) {
						if ($.contactTF.value != '' && $.contactTF.value.trim().length > 0) {
							if ($.contactTF.value > 0) {
								if ($.contactTF.value.trim().length >= 8 && $.contactTF.value.trim().length <= 15) {
									if ($.passwordTF.value != '' && $.passwordTF.value.trim().length > 0) {
										if ($.passwordTF.value.trim().length >= 6 && $.passwordTF.value.trim().length <= 15) {
											if ($.confirmPwdTF.value != '' && $.confirmPwdTF.value.trim().length > 0) {
												if ($.confirmPwdTF.value == $.passwordTF.value) {
													return true;
												} else {
													Alloy.Globals.Alert("Password and confirm password should be same");
													return false;
												}
											} else {
												Alloy.Globals.Alert("Please enter confirm password");
												return false;
											}
										} else {
											Alloy.Globals.Alert("Password can not be less than 6 characters and exceed 15 characters in length");
											return false;
										}
									} else {
										Alloy.Globals.Alert("Please enter password");
										return false;
									}
								} else {

									Alloy.Globals.Alert("Phone number can not less 8 characters and exceed 15 characters in length");
									return false;
								}
							} else {
								Alloy.Globals.Alert("Please enter valid contact number");
								return false;
							}
						} else {
							Alloy.Globals.Alert("Please enter contact number");
							return false;
						}
					} else {

						Alloy.Globals.Alert("Please enter valid email-id");
						return false;
					}
				} else {
					Alloy.Globals.Alert("Please enter your email-id");
					return false;
				}
			} else {
				Alloy.Globals.Alert("Please enter valid name");
				return false;
			}
		} else {
			Alloy.Globals.Alert("Please enter name");
			return false;
		}
	} else {
		Alloy.Globals.Alert("Please select the user profile image");
	}
	$.signupBtn.touchEnabled = true;
}

function isValid(str) {
	Ti.API.info("STRING : " + !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@]/g.test(str));
	return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@]/g.test(str);
}

function doSignup() {
	var data = {};
	data.name = $.nameTF.value;
	data.email = $.emailTF.value;
	data.contact = $.contactTF.value;
	data.password = $.passwordTF.value;
	data.confirmpassword = $.confirmPwdTF.value;
	data.device_id = Alloy.Globals.deviceToken;
	data.device_type = Titanium.Platform.osname;
	data.user_img = selectedImage;

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;
	var SERVICE_SIGNUP = Alloy.Globals.Constants.SERVICE_SIGNUP;
	Ti.API.info('Data : ' + JSON.stringify(data));

	if (Ti.Network.online) {

		Communicator.post(DOMAIN_URL + SERVICE_SIGNUP, signupCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_SIGNUP);
	} else {
		Alloy.Globals.LoadingScreen.close();
		//Alloy.Globals.Alert("Please check your internet connection and try again");
		$.signupBtn.focusable = true;
	}
}

function signupCallback(e) {
	Ti.API.info("Signup response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				Ti.API.info('response.action_success = ' + response.action_success);
				if (response.action_success == 'true') {
					Ti.App.Properties.setString("id", response.id);
					Ti.API.info("ID0  " + Ti.App.Properties.getString("id"));
					Alloy.Globals.openHomeScreen();
					Alloy.Globals.loginScreen.close();
					Alloy.Globals.loginScreen = null;
					$.SignUpScreen.close();
					Alloy.Globals.islocationMarker = response.is_location_mark;
					Alloy.Globals.isContact = response.is_chk_contact;
					Ti.App.Properties.setString('password', $.passwordTF.value);
					Ti.App.Properties.setString("email", $.emailTF.value);

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
			}
		} catch(e) {

			Ti.API.info('Error signup List :: ' + e.error);
			$.SignUpScreen.close();
			Alloy.Globals.Alert("You have registered successfully for road safety");

		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}
	$.signupBtn.focusable = true;
	Alloy.Globals.LoadingScreen.close();

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
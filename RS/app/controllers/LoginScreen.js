var args = arguments[0] || {};
//var f1 = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'crashing.txt');
var device_type = Titanium.Platform.osname;
var device_id = Titanium.Platform.id;
Alloy.Globals.isLogin = true;

if (Alloy.Globals.fb == null) {
	Alloy.Globals.fb = require('facebook');
	Alloy.Globals.fb.permissions = ["public_profile"];
}
Alloy.Globals.loginScreen = $.LoginScreen;

/*
 * Variable defined for the google+ access
 */

var GOOGLE = {};
var Google = require('GoogleService').GoogleService;
var ggParams = {
	clientId : '877820861860-qi0rq7aa94qn4re5gogqclk1a6f752mg.apps.googleusercontent.com',
	clientSecret : '',
	redirectUri : 'urn:ietf:wg:oauth:2.0:oob',
	devKey : '',
};

/*
 * Variable defined for the services
 */
var Communicator = Alloy.Globals.Communicator;
var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

/*
 * All XML defined function
 */

if (OS_ANDROID) {

	$.LoginScreen.fbProxy = Alloy.Globals.fb.createActivityWorker({
		lifecycleContainer : $.LoginScreen
	});

	if (Ti.Platform.displayCaps.platformWidth == 480) {
		$.logoImg.top = 10;
		$.containerView.bottom = 0;
		$.loginBtn.top = 20;
		$.fbLoginBtn.top = 10;
		$.separatorView.top = 0;
	}
} else {
	if (Ti.Platform.displayCaps.platformHeight == 480) {
		$.logoImg.top = 20;
		$.containerView.bottom = 0;
		$.loginBtn.top = 20;
		$.fbLoginBtn.top = 10;
		$.separatorView.top = 0;
	}
}

function autoLoginFun(e) {

	// f1.write("First Cal : \n\n",true);
	$.forgotPasswordBtn.focusable = true;
	if (Ti.App.Properties.getString('email') != null && Ti.App.Properties.getString('password') != null) {
		// f1.write("Normal Login : \n\n",true);
		$.emailTF.value = Ti.App.Properties.getString('email');
		$.passwordTF.value = Ti.App.Properties.getString('password');
		loginFun();
	}
	// else if (Ti.App.Properties.getString('autoGoogle') == 1) {
	// // f1.write("Gmail Login : \n\n",true);
	// loginGmail();
	// } else if (Ti.App.Properties.getString('autoFB') == 1) {
	// // f1.write("Facebook Login : \n\n",true);
	// $.fbLoginBtn.focusable = false;
	// $.gmailLoginBtn.focusable = false;
	// $.loginBtn.focusable = false;
	// $.forgotPasswordBtn.focusable = false;
	// $.signUpBtn.focusable = false;
	// Ti.API.info("$.fbLoginBtn.focusable1234 " + $.fbLoginBtn.focusable);
	// loginFacebook1();
	// Ti.API.info("$.fbLoginBtn.focusable5678 " + $.fbLoginBtn.focusable);
	// } else {
	// Ti.API.info("No result ");
	// $.fbLoginBtn.focusable = true;
	// $.gmailLoginBtn.focusable = true;
	// $.loginBtn.focusable = true;
	// $.forgotPasswordBtn.focusable = true;
	// $.signUpBtn.focusable = true;
	// }
}

function emailfocusFun(e) {
	if ($.emailTF.value.length > 0) {
		$.usernameLbl.visible = false;
	} else {
		$.usernameLbl.visible = true;
	}
}

function winClickFun(e) {
	Ti.API.info(e.source.name);
	if (e.source.name != "tf") {
		$.emailTF.blur();
		$.passwordTF.blur();
	}
}

function emailChangeFun(e) {
	if ($.emailTF.value.length > 0) {
		$.usernameLbl.visible = false;
	} else {
		$.usernameLbl.visible = true;
	}
}

function returnFun(e) {
	$.passwordTF.focus();
}

function pwdChangeFun(e) {
	if ($.passwordTF.value.length > 0) {
		$.passwordLbl.visible = false;
	} else {
		$.passwordLbl.visible = true;
	}
}

function openForgotPassword() {
	Ti.API.info("$.forgotPasswordBtn.focusable " + $.forgotPasswordBtn.focusable);
	if ($.forgotPasswordBtn.focusable == false) {
		return;
	}
	$.emailTF.value = "";
	$.passwordTF.value = "";
	$.forgotPasswordBtn.focusable = false;
	var forgotPassword = Alloy.createController("ForgotPasswordScreen").getView();
	if (OS_IOS) {
		forgotPassword.open({
			transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
		});
	} else {
		forgotPassword.open();
	}
	setTimeout(function() {
		$.forgotPasswordBtn.focusable = true;
	}, 2000);

}

function loginFun(e) {
	//var isToken = checkDeviceToken();
	///if (isToken) {

	if ($.loginBtn.focusable == false) {
		return;
	}
	$.loginBtn.focusable = false;
	$.fbLoginBtn.focusable = false;
	$.gmailLoginBtn.focusable = false;
	$.forgotPasswordBtn.focusable = false;
	$.signUpBtn.focusable = false;
	var ifValidate = validateLogin();
	Ti.API.info("ifValidate " + ifValidate);

	if (ifValidate) {
		if (Titanium.Network.online) {
			Alloy.Globals.LoadingScreen.open();
			Ti.API.info("TOken " + Alloy.Globals.deviceToken);
			if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {

				var detail = {};
				detail.name = "";
				detail.id = "";
				fetchLoginInfo(detail, "Normal");
			} else {
				Alloy.Globals.registerPushNotification(function(e) {
					Ti.API.info("deviceToken1 " + e);
					Alloy.Globals.deviceToken = e;
					Ti.App.Properties.setString("token", Alloy.Globals.deviceToken);
					if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {
						var detail = {};
						detail.name = "";
						detail.id = "";
						fetchLoginInfo(detail, "Normal");
					} else {
						$.fbLoginBtn.focusable = true;
						$.gmailLoginBtn.focusable = true;
						$.loginBtn.focusable = true;
						$.forgotPasswordBtn.focusable = true;
						$.signUpBtn.focusable = true;
						//alert("Network is down, Please try again");
						Alloy.Globals.LoadingScreen.close();
					}
				});
			}

		} else {
			$.loginBtn.focusable = true;
			$.fbLoginBtn.focusable = true;
			$.gmailLoginBtn.focusable = true;
			$.forgotPasswordBtn.focusable = true;
			$.signUpBtn.focusable = true;
			Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_NO_NETWORK);
		}

	}
	//}

}

function signUpFun(e) {
	if ($.signUpBtn.focusable == false) {
		return;
	}
	$.emailTF.value = "";
	$.passwordTF.value = "";
	$.loginBtn.focusable = false;
	$.forgotPasswordBtn.focusable = false;
	$.fbLoginBtn.focusable = false;
	$.gmailLoginBtn.focusable = false;
	$.signUpBtn.focusable = false;
	var signupWin = Alloy.createController("SignUpScreen", "0").getView();

	if (OS_IOS) {
		signupWin.open({
			transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
		});
	} else {
		signupWin.open();
	}
	setTimeout(function() {
		$.signUpBtn.focusable = true;
		$.loginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
	}, 2000);
}

function login_Via_Return_KeypadFun(e) {
	$.loginBtn.fireEvent("click");

}

var fbLoginEvent = function(e) {
	Ti.API.info("1 " + JSON.stringify(e));

	if (Ti.Network.online) {
		if (e.success) {

			Ti.App.Properties.setString("facebookAccessToken", e.source.accessToken);
			Ti.API.info("Facebook ID : " + Ti.App.Properties.getString("facebookAccessToken"));
			var fbData = {};
			fbData.id = e.source.uid;
			fbData.accessToken = e.source.accessToken;
			Ti.API.info("TOken " + Alloy.Globals.deviceToken);
			if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {
				FBLogin(fbData);
			} else {
				Alloy.Globals.registerPushNotification(function(k) {

					Alloy.Globals.deviceToken = k;
					Ti.App.Properties.setString("token", Alloy.Globals.deviceToken);
					Ti.API.info("deviceToken1 " + k);

					if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {
						FBLogin(fbData);
					} else {
						$.fbLoginBtn.focusable = true;
						$.gmailLoginBtn.focusable = true;
						$.loginBtn.focusable = true;
						$.forgotPasswordBtn.focusable = true;
						$.signUpBtn.focusable = true;
						Alloy.Globals.Alert("Network is down, Please try again");
						Alloy.Globals.LoadingScreen.close();
					}

				});
			}

		} else if (e.error) {
			$.fbLoginBtn.focusable = true;
			$.gmailLoginBtn.focusable = true;
			$.loginBtn.focusable = true;
			$.forgotPasswordBtn.focusable = true;
			$.signUpBtn.focusable = true;
			Ti.API.info("e.error : " + e.error);
			Alloy.Globals.LoadingScreen.close();

		} else if (e.cancelled) {
			$.fbLoginBtn.focusable = true;
			$.gmailLoginBtn.focusable = true;
			$.loginBtn.focusable = true;
			$.forgotPasswordBtn.focusable = true;
			$.signUpBtn.focusable = true;
			Ti.API.info("e.cancelled : " + e.cancelled);
			Alloy.Globals.LoadingScreen.close();

		}
		Alloy.Globals.fb.removeEventListener('login', fbLoginEvent);
	} else {
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.loginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
		Alloy.Globals.fb.removeEventListener('login', fbLoginEvent);
		Alloy.Globals.LoadingScreen.close();
	}
};

function loginFacebook(e) {
	Ti.API.info("$.fbLoginBtn.focusable111 " + $.fbLoginBtn.focusable);
	if (Ti.Network.online) {

		if ($.fbLoginBtn.focusable == false) {
			return;
		}
		$.loginBtn.focusable = false;
		$.forgotPasswordBtn.focusable = false;
		$.fbLoginBtn.focusable = false;
		$.gmailLoginBtn.focusable = false;
		$.signUpBtn.focusable = false;

		if (Alloy.Globals.fb.loggedIn) {
			Alloy.Globals.LoadingScreen.open();
			Alloy.Globals.fb.requestWithGraphPath("me", null, "GET", function(e) {
				Ti.API.info("GRAPH API RESPONSE : " + JSON.stringify(e));
				if (e.success) {
					//Ti.API.info("2 " + JSON.stringify(e));
					Ti.API.info("TOken " + Alloy.Globals.deviceToken);
					if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {

						FBLogin(JSON.parse(e.result));
					} else {
						Alloy.Globals.registerPushNotification(function(k) {
							Ti.API.info("deviceToken1 " + k);

							Alloy.Globals.deviceToken = k;
							Ti.App.Properties.setString("token", Alloy.Globals.deviceToken);
							if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {
								FBLogin(JSON.parse(e.result));
							} else {
								$.fbLoginBtn.focusable = true;
								$.gmailLoginBtn.focusable = true;
								$.loginBtn.focusable = true;
								$.forgotPasswordBtn.focusable = true;
								$.signUpBtn.focusable = true;
								Alloy.Globals.LoadingScreen.close();
								//alert("Network is down, Please try again");
							}

						});
					}
				} else {
					Ti.API.info("GRAPH API RESPONSE ERROR : " + JSON.stringify(e));
					try {
						Alloy.Globals.fb.addEventListener('login', fbLoginEvent);
						Alloy.Globals.fb.authorize();
					} catch(e) {
						Ti.API.info('Error Authorization : ' + e.error);
						$.fbLoginBtn.focusable = true;
						$.gmailLoginBtn.focusable = true;
						$.loginBtn.focusable = true;
						$.forgotPasswordBtn.focusable = true;
						$.signUpBtn.focusable = true;
						Alloy.Globals.LoadingScreen.close();
					}
				}
			});
		} else {
			try {
				Alloy.Globals.LoadingScreen.open();
				Alloy.Globals.fb.addEventListener('login', fbLoginEvent);
				Alloy.Globals.fb.authorize();
			} catch(e) {

				Ti.API.info('Error Authorization : ' + e.error);
				$.fbLoginBtn.focusable = true;
				$.gmailLoginBtn.focusable = true;
				$.loginBtn.focusable = true;
				$.forgotPasswordBtn.focusable = true;
				$.signUpBtn.focusable = true;
				Alloy.Globals.LoadingScreen.close();
			}
		}

	} else {
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.loginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function loginGmail() {
	if (Ti.Network.online) {

		if ($.gmailLoginBtn.focusable == false) {
			return;
		}
		$.loginBtn.focusable = false;
		$.forgotPasswordBtn.focusable = false;
		$.fbLoginBtn.focusable = false;
		$.gmailLoginBtn.focusable = false;
		$.signUpBtn.focusable = false;

		Alloy.Globals.google = new Google(ggParams);
		//Ti.API.info('Google Response ');
		//Alloy.Globals.google.logout();

		Alloy.Globals.google.login(function(e) {
			Ti.API.info('Token: ' + Alloy.Globals.google.accessToken());

			var params = {
				params : [],
				call : 'userinfo',
				method : 'GET'
			};

			Alloy.Globals.google.callMethod(params, function(e) {
				Ti.API.info('Google Response ');
				Ti.API.info(e.data);

				if (e.data != null) {
					var gmailDetail = JSON.parse(e.data);
					Ti.API.info('json.id ' + gmailDetail);
					if (Ti.Network.online) {
						Alloy.Globals.LoadingScreen.open();
						Ti.API.info("TOken " + Alloy.Globals.deviceToken);
						if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {

							getBlob(gmailDetail.picture, gmailDetail, "google");
						} else {
							Alloy.Globals.registerPushNotification(function(e) {
								Ti.API.info("deviceToken1 " + e);
								Alloy.Globals.deviceToken = e;
								Ti.App.Properties.setString("token", Alloy.Globals.deviceToken);
								if (Alloy.Globals.deviceToken != undefined && Alloy.Globals.deviceToken != null) {
									getBlob(gmailDetail.picture, gmailDetail, "google");
								} else {
									$.fbLoginBtn.focusable = true;
									$.gmailLoginBtn.focusable = true;
									$.loginBtn.focusable = true;
									$.forgotPasswordBtn.focusable = true;
									$.signUpBtn.focusable = true;
									//alert("Network is down, Please try again");
									Alloy.Globals.LoadingScreen.close();
								}
							});
						}
					} else {
						$.gmailLoginBtn.focusable = true;
						$.loginBtn.focusable = true;
						$.fbLoginBtn.focusable = true;
						$.forgotPasswordBtn.focusable = true;
						$.signUpBtn.focusable = true;
						Alloy.Globals.LoadingScreen.close();
						//Alloy.Globals.Alert("Please check your internet connection and try again");
					}

					//fetchLoginInfo(gmailDetail, "google");

				} else {
					$.loginBtn.focusable = true;
					$.fbLoginBtn.focusable = true;
					$.gmailLoginBtn.focusable = true;
					$.forgotPasswordBtn.focusable = true;
					$.signUpBtn.focusable = true;
				}

			}, null);
		});
	} else {
		$.loginBtn.focusable = true;
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}

}

/*
 * Function for FB and Google+ login
 */
var chkSocialLogin;
function socialLogin(detail, isFacebook) {
	var data = {};

	data.name = detail.name;
	data.password = "";
	data.email = detail.email;
	data.device_id = Alloy.Globals.deviceToken;

	data.device_type = Titanium.Platform.osname;
	if (isFacebook == "facebook") {
		data.loginType = "1";
		data.user_img = detail.image;
		chkSocialLogin = "facebook";

	} else if (isFacebook == "google") {
		data.loginType = "2";
		data.user_img = detail.image;
		chkSocialLogin = "google";
	}

	data.loginDetail = detail.id;
	Ti.API.info('DATA ' + JSON.stringify(data));
	var SERVICE_FANS_REGISTRATION = Alloy.Globals.Constants.SERVICE_FANS_REGISTRATION;

	if (Ti.Network.online) {

		Communicator.post(DOMAIN_URL + SERVICE_FANS_REGISTRATION, socialLoginCallback, data);
		Ti.API.info('URL ' + DOMAIN_URL + SERVICE_FANS_REGISTRATION);

	} else {
		Alloy.Globals.LoadingScreen.close();
		//Alloy.Globals.Alert("Please check your internet connection and try again");
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.loginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;
	}
}

/*
 * Callback gunction for FB and Google+ login
 */

function socialLoginCallback(e) {
	Ti.API.info("Signup response : " + JSON.stringify(e));
	if (e.success) {
		try {

			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				if (response.action_success == 'true') {
					Alloy.Globals.isFbLogin = true;
					Ti.App.Properties.setString("id", response.id);
					Alloy.Globals.openHomeScreen();
					Alloy.Globals.islocationMarker = response.is_location_mark;
					Alloy.Globals.isContact = response.is_chk_contact;
					$.LoginScreen.close();
					if (chkSocialLogin == "facebook") {
						Ti.App.Properties.setString('autoFB', 1);
					} else if (chkSocialLogin == "google") {
						Ti.App.Properties.setString('autoGoogle', 1);
					}

				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_NO_DATA);
			}
		} catch(e) {

			Ti.API.info('Error social Login List :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_STATUS_CODE);
	}
	$.fbLoginBtn.focusable = true;
	$.gmailLoginBtn.focusable = true;
	$.loginBtn.focusable = true;
	$.forgotPasswordBtn.focusable = true;
	$.signUpBtn.focusable = true;
	Alloy.Globals.LoadingScreen.close();

}

function emailBlurFun(e) {
	$.passwordTF.focus();
}

/*
 * Login service function
 */

function fetchLoginInfo(detail, isFacebook) {

	var data = {};
	data.name = detail.name;
	data.email = $.emailTF.value.trim();
	data.password = $.passwordTF.value;
	data.device_id = Alloy.Globals.deviceToken;
	//data.device_id = "APA91bEyTC4eZmQw2sw_fIad0xiX6CYnQ2Tu--ZnoatIoDLUrv-tZh3l7cuD6MIAz7DtRwp5zHkXo5xy7QP-kgJ2Fsxz9aFza7w_bPfaqst2sD_ES0TnrpfuDKR0oO31D_ywOBWcbu3D";
	data.device_type = device_type;

	if (isFacebook == "facebook") {
		data.loginDetail = detail.id;
		data.loginType = "1";
	} else if (isFacebook == "google") {
		data.loginDetail = detail.id;
		data.loginType = "2";
	} else {
		//data.loginType = "0";
	}
	var passData = data;
	var SERVICE_USER_LOGIN = Alloy.Globals.Constants.SERVICE_USER_LOGIN;

	Ti.API.info('Data : ' + JSON.stringify(data));

	if (Ti.Network.online) {

		Communicator.post(DOMAIN_URL + SERVICE_USER_LOGIN, loginCallback, data);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_USER_LOGIN);
	} else {
		$.loginBtn.focusable = true;
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;
		Alloy.Globals.LoadingScreen.close();
		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

function loginCallback(e) {
	Ti.API.info("Login Alert : " + JSON.stringify(e));
	if (e.success) {
		try {
			//Ti.API.info('responses : ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {
				if (response.action_success == 'true') {
					if (Alloy.Globals.isHome == 0) {

						Ti.App.Properties.setString("id", response.id);
						Ti.API.info("ID0  " + Ti.App.Properties.getString("id"));
						Alloy.Globals.isFbLogin = false;

						Alloy.Globals.openHomeScreen();
						Alloy.Globals.islocationMarker = response.is_location_mark;
						Alloy.Globals.isContact = response.is_chk_contact;
						//Ti.API.info("Alloy.Globals.isContact " + Alloy.Globals.isContact);
						Ti.App.Properties.setString("email", $.emailTF.value);
						Ti.App.Properties.setString("password", $.passwordTF.value);

						$.LoginScreen.close();
					}
				} else {
					Alloy.Globals.Alert(response.response_message);
				}
			} else {
				Alloy.Globals.Alert('No data received from server');
			}
		} catch(e) {
			Alloy.Globals.isHome = 0;
			Ti.API.info('Error Login Screen :: ' + e.error);
			//Alloy.Globals.Alert(e.error);
		}
	} else {
		Alloy.Globals.isHome = 0;
		//Alloy.Globals.Alert("Network is down. Please try again later");
	}

	Alloy.Globals.LoadingScreen.close();
	$.fbLoginBtn.focusable = true;
	$.gmailLoginBtn.focusable = true;
	$.loginBtn.focusable = true;
	$.forgotPasswordBtn.focusable = true;
	$.signUpBtn.focusable = true;
}

/*
 * All the function related to validation
 */

/*
 * Function for Login validation
 */

function validateLogin() {
	if ($.emailTF.value != '' && $.emailTF.value.trim().length > 0) {
		var validEmail = checkemail($.emailTF.value.trim());
		if (validEmail) {
			if ($.passwordTF.value != '' && $.passwordTF.value.trim().length > 0) {
				if ($.passwordTF.value.trim().length >= 6 && $.passwordTF.value.trim().length <= 15) {
					return true;
				} else {
					$.loginBtn.focusable = true;
					$.fbLoginBtn.focusable = true;
					$.gmailLoginBtn.focusable = true;
					$.forgotPasswordBtn.focusable = true;
					$.signUpBtn.focusable = true;
					Alloy.Globals.Alert("Password can not be less than 6 characters and exceed 15 characters in length");
					return false;
				}

			} else {
				$.loginBtn.focusable = true;
				$.fbLoginBtn.focusable = true;
				$.gmailLoginBtn.focusable = true;
				$.forgotPasswordBtn.focusable = true;
				$.signUpBtn.focusable = true;
				Alloy.Globals.Alert("Please enter your password");

				return false;
			}
		} else {
			$.loginBtn.focusable = true;
			$.fbLoginBtn.focusable = true;
			$.gmailLoginBtn.focusable = true;
			$.forgotPasswordBtn.focusable = true;
			$.signUpBtn.focusable = true;
			Alloy.Globals.Alert("Please enter valid email-id");
			return false;
		}
	} else {
		$.loginBtn.focusable = true;
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;
		Alloy.Globals.Alert("Please enter your email-id");
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

Alloy.Globals.openHomeScreen = function() {
	if (OS_IOS) {
		var homeScreen = Alloy.createController("HomeScreen");
		var NappSlideMenu = require('dk.napp.slidemenu');
		var ledge = 80;
		if (OS_IOS) {
			if (Ti.Platform.displayCaps.platformHeight == 568)
				ledge = 80;
			else if (Ti.Platform.displayCaps.platformHeight == 736)
				ledge = 103;
			else if (Ti.Platform.displayCaps.platformHeight == 667)
				ledge = 94;
			else if (Ti.Platform.displayCaps.platformHeight == 480)
				ledge = 80;
		}

		Alloy.Globals.drawer = NappSlideMenu.createSlideMenuWindow({
			centerWindow : homeScreen.navWindow,
			leftWindow : homeScreen.leftWindow,
			//rightWindow : homeScreen.rightWindow,
			// leftLedge : 80,
			rightLedge : ledge,
			backgroundColor : "#ffffff"
		});

		Alloy.Globals.openLeft = function() {
			Alloy.Globals.drawer.toggleLeftView();
			Alloy.Globals.drawer.setCenterhiddenInteractivity("TouchEnabled");
		};

		// Alloy.Globals.openRight = function() {
		// window.toggleRightView();
		// };

		Alloy.Globals.drawer.open({
			transition : Titanium.UI.iPhone.AnimationStyle.CURL_UP
		});

		Alloy.Globals.LoadingScreen.close();
		//open the app
	} else {

		var homeScreen = Alloy.createController("HomeScreen").getView();

		var NappDrawerModule = require('dk.napp.drawer');
		Alloy.Globals.drawer = NappDrawerModule.createDrawer({
			fullscreen : false,
			leftWindow : homeScreen.getChildren()[1],
			centerWindow : homeScreen.getChildren()[0],
			fading : 0.2, // 0-1
			parallaxAmount : 0.2, //0-1
			exitOnClose : true,
			shadowWidth : "40dp",
			leftDrawerWidth : "280dp",
			animationMode : NappDrawerModule.ANIMATION_ZOOM,
			closeDrawerGestureMode : NappDrawerModule.CLOSE_MODE_MARGIN,
			openDrawerGestureMode : NappDrawerModule.OPEN_MODE_ALL,
			orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
		});

		Alloy.Globals.drawer.addEventListener("didChangeOffset", function(e) {
			//Ti.API.info("didChangeOffset: " + e.offset);
		});
		Alloy.Globals.drawer.addEventListener("android:back", function(e) {
			Ti.API.info("didChangeOffset: " + e.offset);
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Yes', 'No'],
				message : 'Are you sure want to quit?',
				title : 'Road Safety'
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Ti.API.info('The cancel button was clicked');
				} else {
					if (Alloy.Globals.drawer) {
						Alloy.Globals.drawer.close();
						Alloy.Globals.drawer = null;
					}

				}

			});
			dialog.show();
		});

		Alloy.Globals.drawer.addEventListener("windowDidOpen", function(e) {
			if (e.window == NappDrawerModule.LEFT_WINDOW) {
				Ti.API.info("windowDidOpen - LEFT DRAWER");
			} else if (e.window == NappDrawerModule.RIGHT_WINDOW) {
				Ti.API.info("windowDidOpen - RIGHT DRAWER");
			}

		});
		Alloy.Globals.drawer.addEventListener("windowDidClose", function(e) {
			Ti.API.info("windowDidClose");
		});

		// lets open it
		Alloy.Globals.drawer.open();
		Alloy.Globals.LoadingScreen.close();
	}
	$.LoginScreen.close();
};

function FBLogin(detail) {

	var fbID = detail.id;
	var accessToken = Ti.App.Properties.getString("facebookAccessToken");

	if (Ti.Network.online) {

		Communicator.get("https://graph.facebook.com/" + fbID + "?fields=name,picture,email&access_token=" + accessToken, FBCallback);
		Ti.API.info('URL ' + "https://graph.facebook.com/" + fbID + "?fields=name,picture,email&access_token=" + accessToken);

	} else {
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.loginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;

		//Alloy.Globals.Alert("Please check your internet connection and try again");
	}
}

/*
 * Callback gunction for FB and Google+ login
 */

function FBCallback(e) {
	//	/("FBCallback: Success :\n\n",true);
	Ti.API.info("Signup response : " + JSON.stringify(e));
	if (e.success) {
		try {
			//Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);

			if (response != null) {

				getBlob(response.picture.data.url, response, "facebook");

			} else {
				Alloy.Globals.LoadingScreen.close();
				Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_NO_DATA);
				$.fbLoginBtn.focusable = true;
				$.gmailLoginBtn.focusable = true;
				$.loginBtn.focusable = true;
				$.forgotPasswordBtn.focusable = true;
				$.signUpBtn.focusable = true;
			}
		} catch(e) {

			Ti.API.info('Error News List :: ' + e.error);
			Alloy.Globals.Alert(e.error);
			Alloy.Globals.LoadingScreen.close();
			$.fbLoginBtn.focusable = true;
			$.gmailLoginBtn.focusable = true;
			$.loginBtn.focusable = true;
			$.forgotPasswordBtn.focusable = true;
			$.signUpBtn.focusable = true;
		}
	} else {
		Alloy.Globals.LoadingScreen.close();
		Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_STATUS_CODE);
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.loginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;
	}

}

function getBlob(url, data, type) {
	Ti.API.info('response.getBlob = ' + JSON.stringify(data));
	var httpClient = Ti.Network.createHTTPClient({
		withCredentials : true
	});
	httpClient.setTimeout(30000);

	httpClient.onload = function(e) {

		Titanium.API.info("Loaded! Status: " + JSON.stringify(e));

		if (e.success) {
			try {
				if (this.responseText != null && this.responseText.trim().length > 0) {

					Ti.API.info('Success GET methode responce :' + this.responseData + '\n');
					var obj = {};
					obj.id = data.id;
					obj.name = data.name;
					obj.email = data.email;
					obj.image = "" + Titanium.Utils.base64encode(this.responseData);
					socialLogin(obj, type);

				} else {
					Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_NO_DATA);
					$.fbLoginBtn.focusable = true;
					$.gmailLoginBtn.focusable = true;
					$.loginBtn.focusable = true;
					$.forgotPasswordBtn.focusable = true;
					$.signUpBtn.focusable = true;
					Alloy.Globals.LoadingScreen.close();
				}
			} catch(e) {
				Ti.API.info("Error FB Google Image : " + e.message);
				$.fbLoginBtn.focusable = true;
				$.gmailLoginBtn.focusable = true;
				$.loginBtn.focusable = true;
				$.forgotPasswordBtn.focusable = true;
				$.signUpBtn.focusable = true;
				Alloy.Globals.LoadingScreen.close();

			}

		} else {
			//Ti.API.info("Not success " + e.message);
			Alloy.Globals.LoadingScreen.close();
		}
	};
	httpClient.onerror = function(e) {

		Alloy.Globals.Alert(Alloy.Globals.Constants.MSG_STATUS_CODE);
		$.fbLoginBtn.focusable = true;
		$.gmailLoginBtn.focusable = true;
		$.loginBtn.focusable = true;
		$.forgotPasswordBtn.focusable = true;
		$.signUpBtn.focusable = true;
		Alloy.Globals.LoadingScreen.close();

	};

	httpClient.open("GET", url);
	httpClient.send();

};

Alloy.Globals.closeCallback = function() {
	Ti.API.info("CLOSE");
	$.fbLoginBtn.focusable = true;
	$.gmailLoginBtn.focusable = true;
	$.loginBtn.focusable = true;
	$.forgotPasswordBtn.focusable = true;
	$.signUpBtn.focusable = true;
};

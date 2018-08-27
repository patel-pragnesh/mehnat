var args = arguments[0] || {};

var id = Ti.App.Properties.getString("id");

var timer = 10;
var pInterval;
function checkCloseFun() {
	Ti.API.info('slkdjflsjdfljsdfjsdfldsfsd');
	clearInterval(pInterval);
	if (audioPlayer) {
		audioPlayer.stop();
	}
	if (timer > 0) {
		$.progress.animate({
			value : 0.01,
			duration : 500,
			callback : function() {
				$.progress.setValue(0);
				$.lbl.text = 10 + '';
			}
		});
		timer = 10;
	}
}

function closeFun(e) {
	clearInterval(pInterval);
	if (audioPlayer) {
		audioPlayer.stop();
	}
	if (timer > 0) {
		$.progress.animate({
			value : 0.01,
			duration : 500,
			callback : function() {
				$.progress.setValue(0);
				$.lbl.text = 10 + '';
			}
		});
		timer = 10;
	}
	$.PanicScreen.close();
}

function callImmediateFun(e) {
	if ($.callImmedialtBtn.focusable == false) {
		return;
	}
	$.callImmedialtBtn.focusable = false;
	panicService();

}

function startTimerFun(e) {
	fakeProgress();
}

var audioPlayer = null;
function fakeProgress() {
	audioPlayer = null;
	var file = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'timer1.mp3').nativePath;
	Ti.API.info('File : ' + JSON.stringify(file) + "   " + file);
	audioPlayer = Ti.Media.createSound({
		url : file,
		//preload: true
	});
	audioPlayer.play();
	var val = 0;
	pInterval = setInterval(function() {
		$.progress.setValue(++val);
		if (val % 10 == 0) {
			Ti.Media.vibrate([0, 10]);
			timer--;
			$.lbl.text = timer + '';
			if (timer == 0) {
				Ti.Media.vibrate([0, 100]);
			}
		}
		if (val >= 100) {
			clearInterval(pInterval);
			panicService();
			audioPlayer.stop();
			//	Alloy.Globals.Alert("Call Immediate");

		}

	}, 100);

}

function cancelPanicFun() {
	if (audioPlayer) {
		audioPlayer.stop();
	}
	clearInterval(pInterval);

	if (timer > 0) {
		$.progress.animate({
			value : 0.01,
			duration : 500,
			callback : function() {
				$.progress.setValue(0);
				$.lbl.text = 10 + '';
			}
		});
		timer = 10;
	}
	$.PanicScreen.close();
}

function panicService() {

	var Communicator = Alloy.Globals.Communicator;
	var DOMAIN_URL = Alloy.Globals.Constants.DOMAIN_URL;

	var SERVICE_GET_PANIC_ALERT = Alloy.Globals.Constants.SERVICE_GET_PANIC_ALERT;
	var PARAMS = "&id=" + id;
	if (Ti.Network.online) {
		//Alloy.Globals.LoadingScreen.open();
		Communicator.get(DOMAIN_URL + SERVICE_GET_PANIC_ALERT + PARAMS, panicServiceCallback);
		Ti.API.info("URL : " + DOMAIN_URL + SERVICE_GET_PANIC_ALERT + PARAMS);
	} else {
		//Alloy.Globals.Alert("Please check your internet connection and try again");
		$.callImmedialtBtn.focusable = true;
	}
};
function panicServiceCallback(e) {
	Ti.API.info("panicService response : " + JSON.stringify(e));
	if (e.success) {
		try {
			Ti.API.info('response ' + e.response);
			var response = Alloy.Globals.handleServerError(e.response);
			if (response != null) {
				if (response.action_success == 'true') {

					clearInterval(pInterval);

					if (timer > 0) {
						$.progress.animate({
							value : 0.01,
							duration : 500,
							callback : function() {
								$.progress.setValue(0);
								$.lbl.text = 10 + '';
							}
						});
						timer = 10;
					}

					if (OS_ANDROID) {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_CALL,
							data : "tel:" + response.data[0].contact
						});
						Ti.Android.currentActivity.startActivity(intent);

						Ti.API.info(response.data[0].contact);
						

					} else {
						Ti.API.info(response.data[0].contact);
						Titanium.Platform.openURL("tel:" + response.data[0].contact);

					}

					$.callImmedialtBtn.focusable = true;
					$.PanicScreen.close();
				} else {
					Alloy.Globals.Alert(response.response_message);
					$.callImmedialtBtn.focusable = true;
				}
			} else {
				Alloy.Globals.Alert("No data received from server");
				$.callImmedialtBtn.focusable = true;
			}
		} catch(e) {

			Ti.API.info('Error getProfileServiceCallback :: ' + e.error);
		}
	} else {
		//Alloy.Globals.Alert("Network is down. Please try again later");
		$.callImmedialtBtn.focusable = true;

	}
	if (audioPlayer) {
		audioPlayer.stop();
	}
	//Alloy.Globals.LoadingScreen.close();

}

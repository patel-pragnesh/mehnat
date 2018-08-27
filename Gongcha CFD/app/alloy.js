// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
(function() {
	var ACS = require('ti.cloud'),
	    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
	    username = Ti.App.Properties.getString('acs-username-' + env),
	    password = Ti.App.Properties.getString('acs-password-' + env);

	// if not configured, just return
	if (!env || !username || !password) {
		return;
	}
	/**
	 * Appcelerator Cloud (ACS) Admin User Login Logic
	 *
	 * fires login.success with the user as argument on success
	 * fires login.failed with the result as argument on error
	 */
	ACS.Users.login({
		login : username,
		password : password,
	}, function(result) {
		if (env === 'development') {
			Ti.API.info('ACS Login Results for environment `' + env + '`:');
			Ti.API.info(result);
		}
		if (result && result.success && result.users && result.users.length) {
			Ti.App.fireEvent('login.success', result.users[0], env);
		} else {
			Ti.App.fireEvent('login.failed', result, env);
		}
	});

})();
//Function for trim num at decimal two places
function toFixed(num) {
	try {
		var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
		//return parseFloat(Number(num).toFixed(2));
		return parseFloat(Number(with2Decimals).toFixed(2));

	} catch(e) {
		Ti.API.info('Error toFixed ' + e.message);
		return parseFloat(Number(num).toFixed(2));
	}
}

Alloy.Globals.Communicator = require('Communicator');
Alloy.Globals.Constants = require('Constants');
Alloy.Globals.LoadingScreen = Alloy.createWidget('Loader').getView();

Alloy.Globals.Notifier = Alloy.createWidget('ti.notifications', {
	message : 'Notification Test', // the message to display.
	duration : 3500, // time after go away. Valid for iOS7+ and Android
	//icon: '/images/logo.png', // icon to display on the left
	style : 'notification', // 'info', 'success', 'error', 'warn',  notification background blue, green, red or amber.
	elasticity : 0, // iOS7+ only
	pushForce : 30, // iOS7+ only
	usePhysicsEngine : true, // disable if you don't want on iOS7+
	animationDuration : 200, // animation sliding duration
});
/*
 * Function For Validating Email
 */

function checkemail(emailvalue) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailvalue)) {
		return (true);
	}
	return (false);
}

var bonjour = require('com.cdnsol.bonjour');
var bonjourService;
var count = 0;

bonjourService = bonjour.createService();

bonjourService.addEventListener('published', function(e) {
	Ti.API.info('published');
});
bonjourService.addEventListener('publishstopped', function(e) {
	Ti.API.info('publishstopped');
});
bonjourService.addEventListener('publishFailed', function(e) {
	Ti.API.info('publishFailed');
});
bonjourService.addEventListener('connectionestablished', function(e) {
	Ti.API.info('connectionestablished');
	if (Alloy.Globals.handleConnectionestablished != undefined && Alloy.Globals.handleConnectionestablished != null) {
		Alloy.Globals.handleConnectionestablished();
	}
	
});
bonjourService.addEventListener('connectionfailed', function(e) {
	Ti.API.info('connectionfailed');
	if (Alloy.Globals.handleConnectionTermination != undefined && Alloy.Globals.handleConnectionTermination != null) {
		Alloy.Globals.handleConnectionTermination();
	}
});
bonjourService.addEventListener('connectionterminated', function(e) {
	Ti.API.info('connectionterminated');
	if (Alloy.Globals.handleConnectionTermination != undefined && Alloy.Globals.handleConnectionTermination != null) {
		Alloy.Globals.handleConnectionTermination();
	}
});
bonjourService.addEventListener('receiveddata', function(e) {
	Ti.API.info('e = ' + e.data);
	Ti.API.info('count = ' + count);
	count++;

	if (Alloy.Globals.handleReceiveData != undefined && Alloy.Globals.handleReceiveData != null) {
		Alloy.Globals.handleReceiveData(e);
	}

});

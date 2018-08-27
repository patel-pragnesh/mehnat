/*global require: true, console: true, process: true */

(function (messageId, callback) {
	Ti.API.info("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
	var _GCM = require('gcm').GCM,
	//GCM = new _GCM('AIzaSyBrmNuT7ZchKQvj4B04zcUgSchDKTx1Nbw'); // API KEY at Google APIs Console
	GCM = new _GCM('AIzaSyDRREFphDp6njaY95zFYhfFg-P7NB6Kz58');

	var message = {
		registration_id: 'USER_REGISTRATION_ID',
		'data.title': 'shephard: what lies in the shadow of the statue?',
		'data.message': '4 8 15 16 23 42',
		'data.sound': 'blacksmoke.mp3',
		collapse_key: messageId
	};

	GCM.send(message, function (err, messageId) {
		if (err) {
			console.error('error!');
		}
		callback(0);
	});
})((new Date()).getTime() + '', process.exit);
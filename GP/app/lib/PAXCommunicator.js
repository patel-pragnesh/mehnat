/**
 * Communicator.js
 *
 * This file handles all the complexity related to network communication. It connects to the server and returns the response.
 * It also checks for the internet connection, errors in response and handles them gracefully.
 */

/**
 * This is a generic function for performing GET requests
 */
exports.get = function(url, callback) {
	if (Titanium.Network.online) {
		// Create an HTTPClient.
		var httpClient = Ti.Network.createHTTPClient();
		httpClient.setTimeout(40000);

		// Define the callback.
		httpClient.onload = function(e) {
			if (e.success) {
				if (this.status == 200) {
					if (this.responseText != null && this.responseText.trim().length > 0) {
						var result = {};
						result.success = true;
						result.response = this.responseText;

						//Ti.API.info("result.response = " + result.response);
						callback(result);
					} else {
						var result = {};
						result.success = false;
						var MSG_NO_DATA = Alloy.Globals.Constants.MSG_NO_DATA;
						result.message = MSG_NO_DATA;
						callback(result);
					}
				} else {
					var result = {};
					result.success = false;
					var MSG_STATUS_CODE = Alloy.Globals.Constants.MSG_STATUS_CODE;
					result.message = MSG_STATUS_CODE + this.status;
					callback(result);
				}
			} else {
				var result = {};
				result.success = false;
				result.message = e.error;
				callback(result);
			}
		};
		httpClient.onerror = function(e) {
			var result = {};
			result.success = false;
			result.message = e.error;
			callback(result);
		};

		// Send the request data.
		try {
			httpClient.open('GET', url);
			httpClient.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			httpClient.send();
		} catch(e) {
			Alloy.Globals.Alert(e.message);
			tracker.addException({
				description : "Communicator1: " + e.message,
				fatal : false
			});
		}

	} else {
		var result = {};
		result.success = false;
		var MSG_NO_NETWORK = Alloy.Globals.Constants.MSG_NO_NETWORK;
		result.message = MSG_NO_NETWORK;
		callback(result);
	}
};

//Hex to ASCII Converter
exports.hex2AscII = function(hexx) {
	var hex = hexx.toString();
	//force conversion
	var str = '';
	for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	return str;
};

//String to Hex Converter
exports.hexEncode = function(str) {
	var hex,
	    i;
	var result = "";
	for ( i = 0; i < str.length; i++) {
		hex = str.charCodeAt(i).toString(16);
		result += ("000" + hex).slice(-4);
	}
	return result;
};

//GET LRC Value
exports.getLRC = function(hexstring) {
	var s = hexstring.match(/../g);
	var lrc = 0;
	s.forEach(function(hexbyte) {
		var n = 1 * ('0x' + hexbyte);
		lrc ^=n;
	});

	lrc = lrc.toString(16);
	if (lrc.length % 2)
		lrc = '0' + lrc;
	return lrc;
};

//Create object for defining initial value for creating request
exports.initPaxObj = {
	"initailizeMethod" : "A00",
	"transactionMethod" : "T00",
	"swipeGiftCardMethod" : "A30",
	"safMODE" : "A54",
	"giftCardMethod" : "T06",
	"authorizationMethod" : "A40",
	"batchCloseMethod" : "B00",
	"rebootMethod" : "A26",
	"logMethod" : "R02",
	"hostLogMethod" : "R06",
	"version" : 1.37,
	"transactionType" : "01", //Test Transaction mode 05(Forced), Live Transaction mode 01(Live)
	"transactionAuthType" : "03",
	"transactionPostAuthType" : "04",
	"authCardTransactionType" : "0",
	"returnTransactionType" : "02",
	"swipeTransactionType" : "00",
	"traceInformation" : "3243",
	"voidTransactionType" : "16",
	"transactionNumber" : "027",
	"edcType" : "01",
	"edcLogType" : "01",
	"STX" : exports.hex2AscII("02"), //The start of the transaction message request or response
	"FS" : exports.hex2AscII("1c"), //The field separator that used to separate the data segments
	"ETX" : exports.hex2AscII("03"), //The end of the transaction message request or response
	"ACK" : exports.hex2AscII("06"), //The acknowledge symbol informs that the message is received correctly
	"NAK" : exports.hex2AscII("15"), //The not acknowledge symbol informs that the message is not received correctly
	"ENQ" : exports.hex2AscII("05"),
	"EOT" : exports.hex2AscII("04"), //The end of transmission symbol informs that the transaction is complete
	"COMMA" : exports.hex2AscII("2c"),
	"COLON" : exports.hex2AscII("3a"),
	"US" : exports.hex2AscII("1f"), //The Unit separator that used to separate certain sub-fields In Extend Data
	"GS" : exports.hex2AscII("1d"), //The Group separator that used to separate a group filed
	"RS" : exports.hex2AscII("1e"), //Record Separator.
	"HREF" : "72826970",
	"equal" : "61"
};
//Create object for defining initial value for LRC related calculation
exports.initLRCObj = {
	"initailizeMethod" : exports.hexEncode("A00"),
	"transactionMethod" : exports.hexEncode("T00"),
	"safMODE" : exports.hexEncode("A54"),
	"swipeGiftCardMethod" : exports.hexEncode("A30"),
	"giftCardMethod" : exports.hexEncode("T06"),
	"authorizationMethod" : exports.hexEncode("A40"),
	"batchCloseMethod" : exports.hexEncode("B00"),
	"rebootMethod" : exports.hexEncode("A26"),
	"logMethod" : exports.hexEncode("R02"),
	"hostLogMethod" : exports.hexEncode("R06"),
	"version" : exports.hexEncode("1.37"),
	"transactionType" : exports.hexEncode("01"), //Test Transaction mode 05(Forced), Live Transaction mode 01(Live)
	"transactionAuthType" : exports.hexEncode("03"),
	"transactionPostAuthType" : exports.hexEncode("04"),
	"authCardTransactionType" : exports.hexEncode("01"),
	"returnTransactionType" : exports.hexEncode("02"),
	"voidTransactionType" : exports.hexEncode("16"),
	"swipeTransactionType" : exports.hexEncode("00"),
	"traceInformation" : exports.hexEncode("3243"),
	"transactionNumber" : exports.hexEncode("027"),
	"edcType" : exports.hexEncode("01"),
	"edcLogType" : exports.hexEncode("01"),
	"HREF" : "48524546",
	"equal" : "3D",
	"STX" : "02",
	"FS" : "1c",
	"ETX" : "03",
	"ACK" : "06",
	"NAK" : "15",
	"ENQ" : "05",
	"EOT" : "04",
	"COMMA" : "2c",
	"COLON" : "3a",
	"US" : "1f",
	"GS" : "1d",
	"RS" : "1e",

};
exports.setSAFMode = function() {
	var lrc = exports.initLRCObj.safMODE + exports.initLRCObj.FS + exports.hexEncode("1.37") + exports.initLRCObj.FS + exports.hexEncode("3")+ exports.initLRCObj.FS+ exports.initLRCObj.FS+ exports.initLRCObj.FS+ exports.initLRCObj.FS+ exports.initLRCObj.FS+ exports.initLRCObj.FS+ exports.initLRCObj.FS+ exports.initLRCObj.FS+ exports.initLRCObj.FS+ exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.safMODE + exports.initPaxObj.FS + 1.37 + exports.initPaxObj.FS + 3 + exports.initPaxObj.FS+ exports.initPaxObj.FS+ exports.initPaxObj.FS+ exports.initPaxObj.FS+ exports.initPaxObj.FS+ exports.initPaxObj.FS+ exports.initPaxObj.FS+ exports.initPaxObj.FS+ exports.initPaxObj.FS+ exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};

exports.hostLogRequest = function() {
	var lrc = exports.initLRCObj.hostLogMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.ETX;
	Ti.API.info('LRC ' + lrc);
	var request = exports.initPaxObj.STX + exports.initPaxObj.hostLogMethod + exports.initPaxObj.FS + exports.initPaxObj.version + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	Ti.API.info('REQUEST ' + request);
	return request.toString();
};

exports.voidTransactionRequestHost = function(amount, hostRef) {
	var amount = toFixed(amount) * 100;
	amount = parseInt(amount.toFixed(2));
	var HREF = "HREF=" + hostRef;
	var lrc = exports.initLRCObj.transactionMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.voidTransactionType + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.traceInformation + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.hexEncode(HREF) + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.transactionMethod + exports.initPaxObj.FS + 1.37 + exports.initPaxObj.FS + exports.initPaxObj.voidTransactionType + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.traceInformation + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + HREF + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};
exports.createTransactionRequest = function(amount) {
	var amount = toFixed(amount) * 100;
	amount = parseInt(amount.toFixed(2));
	var lrc = exports.initLRCObj.transactionMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.transactionType + exports.initLRCObj.FS + exports.hexEncode(amount.toString()) + exports.initLRCObj.FS + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.hexEncode("1") + exports.initLRCObj.FS + exports.initLRCObj.traceInformation + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.transactionMethod + exports.initPaxObj.FS + 1.37 + exports.initPaxObj.FS + exports.initPaxObj.transactionType + exports.initPaxObj.FS + amount + exports.initPaxObj.FS + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + "1" + exports.initPaxObj.FS + exports.initPaxObj.traceInformation + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};
exports.createAuthTransactionRequest = function(amount) {
	Ti.API.info('Amount ' + amount);
	var amount = Number(amount) * 100;
	amount = parseInt(amount.toFixed(2));
	var lrc = exports.initLRCObj.transactionMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.transactionAuthType + exports.initLRCObj.FS + exports.hexEncode(amount.toString()) + exports.initLRCObj.FS + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.hexEncode("1") + exports.initLRCObj.FS + exports.initLRCObj.traceInformation + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.transactionMethod + exports.initPaxObj.FS + 1.37 + exports.initPaxObj.FS + exports.initPaxObj.transactionAuthType + exports.initPaxObj.FS + amount + exports.initPaxObj.FS + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + "1" + exports.initPaxObj.FS + exports.initPaxObj.traceInformation + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};

exports.createPostTransactionRequest = function(amount, transactionNumber) {
	var amount = toFixed(amount) * 100;
	amount = parseInt(amount.toFixed(2));
	var lrc = exports.initLRCObj.transactionMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.transactionPostAuthType + exports.initLRCObj.FS + exports.hexEncode(amount.toString()) + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.traceInformation + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.hexEncode(transactionNumber.toString()) + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.transactionMethod + exports.initPaxObj.FS + 1.37 + exports.initPaxObj.FS + exports.initPaxObj.transactionPostAuthType + exports.initPaxObj.FS + amount + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.traceInformation + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + transactionNumber + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};
exports.voidTransactionRequest = function(amount, transactionNumber) {
	var amount = toFixed(amount) * 100;
	amount = parseInt(amount.toFixed(2));
	var lrc = exports.initLRCObj.transactionMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.voidTransactionType + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.traceInformation + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.hexEncode(transactionNumber.toString()) + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.transactionMethod + exports.initPaxObj.FS + 1.37 + exports.initPaxObj.FS + exports.initPaxObj.voidTransactionType + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.traceInformation + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + transactionNumber + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};

exports.returnTransactionRequest = function(amount, transactionNumber) {
	var amount = toFixed(amount) * 100;
	amount = parseInt(amount.toFixed(2));
	var lrc = exports.initLRCObj.transactionMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.returnTransactionType + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.traceInformation + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.transactionMethod + exports.initPaxObj.FS + 1.37 + exports.initPaxObj.FS + exports.initPaxObj.returnTransactionType + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.traceInformation + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));

	return request.toString();
};

exports.authorizationRequest = function(amount) {
	var amount = toFixed(amount) * 100;
	amount = parseInt(amount.toFixed(2));
	var lrc = exports.initLRCObj.authorizationMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.authCardTransactionType + exports.initLRCObj.FS + exports.hexEncode(amount.toString()) + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.hexEncode("1") + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	Ti.API.info('LRC ' + lrc);
	var request = exports.initPaxObj.STX + exports.initPaxObj.authorizationMethod + exports.initPaxObj.FS + exports.initPaxObj.version + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.authCardTransactionType + exports.initPaxObj.FS + amount + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + "1" + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	Ti.API.info('REQUEST ' + request);
	return request.toString();
};
exports.logRequest = function() {
	var lrc = exports.initLRCObj.logMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.edcLogType + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	Ti.API.info('LRC ' + lrc);
	var request = exports.initPaxObj.STX + exports.initPaxObj.logMethod + exports.initPaxObj.FS + exports.initPaxObj.version + exports.initPaxObj.FS + exports.initPaxObj.edcLogType + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	Ti.API.info('REQUEST ' + request);
	return request.toString();
};

//OPEN this method at the time of live because it uses duplicate transaction code
// exports.createTransactionRequest = function(amount) {
// var amount = Number(amount) * 100;
// var lrc = exports.initLRCObj.transactionMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.transactionType + exports.initLRCObj.FS + exports.hexEncode(amount.toString()) + exports.initLRCObj.FS + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.initLRCObj.US + exports.hexEncode("1") + exports.initLRCObj.FS + exports.initLRCObj.traceInformation + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
// var request = exports.initPaxObj.STX + exports.initPaxObj.transactionMethod + exports.initPaxObj.FS + exports.initPaxObj.version  + exports.initPaxObj.FS + exports.initPaxObj.transactionType + exports.initPaxObj.FS + amount + exports.initPaxObj.FS + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + exports.initPaxObj.US + "1" + exports.initPaxObj.FS + exports.initPaxObj.traceInformation + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
// return request.toString();
// };

exports.initializeRequest = function() {
	var lrc = exports.initLRCObj.initailizeMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.initailizeMethod + exports.initPaxObj.FS + 1.28 + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};

exports.swipeGiftCardRequest = function() {
	var lrc = exports.initLRCObj.swipeGiftCardMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.hexEncode("1") + exports.initLRCObj.FS + exports.hexEncode("1") + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.hexEncode("1") + exports.initLRCObj.FS + exports.hexEncode("300") + exports.initLRCObj.FS + exports.hexEncode("0") + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.hexEncode("04") + exports.initLRCObj.FS + exports.hexEncode("01") + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.swipeGiftCardMethod + exports.initPaxObj.FS + exports.initPaxObj.version + exports.initPaxObj.FS + "1" + exports.initPaxObj.FS + "1" + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + "1" + exports.initPaxObj.FS + 300 + exports.initPaxObj.FS + "0" + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + "04" + exports.initPaxObj.FS + "01" + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};

exports.giftCardRequest = function() {
	var lrc = exports.initLRCObj.giftCardMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.swipeTransactionType + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.traceInformation + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.giftCardMethod + exports.initPaxObj.FS + exports.initPaxObj.version + exports.initPaxObj.FS + "00" + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.FS + "123456" + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};

exports.batchCloseRequest = function() {

	var lrc = exports.initLRCObj.batchCloseMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.FS + exports.initLRCObj.FS + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.batchCloseMethod + exports.initPaxObj.FS + 1.28 + exports.initPaxObj.FS + exports.initPaxObj.FS + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};
exports.rebootRequest = function() {

	var lrc = exports.initLRCObj.rebootMethod + exports.initLRCObj.FS + exports.initLRCObj.version + exports.initLRCObj.ETX;
	var request = exports.initPaxObj.STX + exports.initPaxObj.rebootMethod + exports.initPaxObj.FS + 1.28 + exports.initPaxObj.ETX + exports.hex2AscII(exports.getLRC(lrc));
	return request.toString();
};
exports.parserInitializeResponse = function(response, methodName) {

	var x = response.replace(/\u001c/g, "#");
	x = x.replace(/\u0003/g, "<E>");
	x = x.replace(/\u00020/g, "<S>");
	x = x.replace(/\u001f/g, "#");
	x = x.replace(/<E>/g, "#");
	x = x.split("#");
	Ti.API.info('Response x :: ' + JSON.stringify(x));
	if (x[3] == "000000") {
		var obj = {};
		obj.method = x[1];
		obj.version = x[1];
		obj.resultCode = x[3];
		obj.resultMessage = x[4];
		obj.serialNumber = x[5];
		obj.modalName = x[6];
		obj.osVersion = x[7];
		obj.macAddress = x[8];
		return obj;
	} else {
		var obj = {};
		obj.method = x[1];
		obj.resultCode = x[3];
		obj.resultMessage = x[4];
		Ti.API.info('1 :: ' + JSON.stringify(obj));
		Ti.API.info('2 :: ' + obj.resultCode);
		return obj;
	}

};

exports.parserTransactionResponse = function(response, methodName) {
	var x = response.replace(/\u001c/g, "#");
	x = x.replace(/\u0003/g, "<E>");
	x = x.replace(/\u00020/g, "<S>");
	x = x.replace(/\u001f/g, "#");
	x = x.replace(/<E>/g, "#");
	x = x.split("#");
	Ti.API.info('Response x :: ' + JSON.stringify(x));
	if (x[3] == "000000") {
		var y = response.replace(/\u001c/g, "");
		y = y.replace(/\u0003/g, "<E>");
		y = y.replace(/\u00020/g, "<S>");
		y = y.replace(/\u001f/g, "#");
		y = y.replace(/<E>/g, "#");
		y = y.split("#");
		Ti.API.info('Response y :: ' + JSON.stringify(y));
		var obj = {};
		obj.method = x[1];
		obj.version = x[1];
		obj.resultCode = x[3];
		obj.resultMessage = x[4];
		obj.authCode = x[7];
		obj.referenceNumber = x[8];
		obj.ECRreferenceNumber = x[32];
		obj.cardLastFourNumber = x[20];
		obj.entryMode = getEntryMode(x[21]);
		obj.expireDate = x[22];
		obj.cardType = getCardName(x[26]);
		obj.cardHolder = x[27];
		obj.transactionNumber = y[22];
		obj.hostReferenceNumber = x[39].split("HRef=")[1];
		if (x.length > 42) {

			obj.transactionNumber = y[22];
			obj.AID = x[43].split("AID=")[1];
			obj.TC = x[41].split("TC=")[1];
			obj.appName = x[47].split("APPPN=")[1];
		}
		Ti.API.info('2 :: ' + JSON.stringify(obj));
		return obj;

	} else {
		var obj = {};
		obj.method = x[1];
		obj.resultCode = x[3];
		obj.resultMessage = x[4];
		Ti.API.info('1 :: ' + JSON.stringify(obj));
		Ti.API.info('2 :: ' + obj.resultCode);
		return obj;
	}

};
function getEntryMode(code) {
	if (code == "0") {
		return "Manual";
	} else if (code == "1") {
		return "Swipe";
	} else if (code == "2") {
		return "Chip";
	} else if (code == "3") {
		return "Contactless";
	} else if (code == "4") {
		return "Scan";
	} else if (code == "5") {
		return "Check Reader";
	} else {
		return "NA";
	}
}

function getCardName(code) {
	if (code == "01") {
		return "Visa";
	} else if (code == "02") {
		return "MasterCard";
	} else if (code == "03") {
		return "AMEX";
	} else if (code == "04") {
		return "Discover";
	} else if (code == "05") {
		return "Diner Club";
	} else if (code == "06") {
		return "enRoute";
	} else if (code == "07") {
		return "JCB";
	} else if (code == "08") {
		return "RevolutionCard";
	} else if (code == "09") {
		return "VisaFleet";
	} else if (code == "10") {
		return "MasterCardFleet";
	} else {
		return "OTHER";
	}
}

exports.parserSwipCardResponse = function(response, methodName) {
	//alert(response);
	// Ti.API.info('response 1:: ' + response);
	// Ti.API.info('response 2:: ' + JSON.stringify(response));
	//var response = "\u00020\u001cT01\u001c1.37\u001c000000\u001cOK\u001c00\u001fAPPROVAL\u001f021417\u001f815614699977\u001f\u001f\u001c01\u001c1\u001f0\u001f0\u001f0\u001f0\u001f0\u001f\u001f\u001c1581\u001f4\u001f1021\u001f\u001f\u001f\u001f02\u001fINSTA DEBIT CARD         /\u001f\u001f\u001f0\u001c1\u001f123456\u001f20180605031742\u001c0\u001fAVS Not Requested.\u001c\u001c\u001cCARDBIN=536132\u001fHRef=1776874924\u001fSN=53236566\u001fTC=28CA0A09A361C4C0\u001fTVR=0000008000\u001fAID=A0000000041010\u001fTSI=E800\u001fATC=007A\u001fAPPLAB=Debit MasterCard\u001fAPPPN=Debit MasterCard\u001fIAD=01106090012400001F9800000000000000FF\u001fARC=00\u001fCID=40\u001fCVM=6\u0003-";
	var x = response.replace(/\u001c/g, "#");
	x = x.replace(/\u0003/g, "<E>");
	x = x.replace(/\u00020/g, "<S>");
	x = x.replace(/\u001f/g, "#");
	x = x.replace(/<E>/g, "#");
	x = x.split("#");
	Ti.API.info('Response x :: ' + JSON.stringify(x));
	if (x[3] == "000000") {
		var obj = {};
		obj.method = x[1];
		obj.version = x[2];
		obj.resultCode = x[3];
		obj.resultMessage = x[4];
		obj.cardNumber = x[7];
		Ti.API.info('2 :: ' + JSON.stringify(obj));
		return obj;

	} else {
		var obj = {};
		obj.method = x[1];
		obj.resultCode = x[3];
		obj.resultMessage = x[4];
		Ti.API.info('1 :: ' + JSON.stringify(obj));
		Ti.API.info('2 :: ' + obj.resultCode);
		return obj;
	}

};

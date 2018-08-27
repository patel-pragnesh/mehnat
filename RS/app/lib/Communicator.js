/**
 * Communicator.js
 *
 * This file handles all the complexity related to network communication. It connects to the server and returns the response.
 * It also checks for the internet connection, errors in response and handles them gracefully.
 */

//var Constants = Alloy.Globals.Constants;

/**
 * This is a generic function for performing GET requests
 */
exports.get = function(url, callback) {
	if (Titanium.Network.online) {
		// Create an HTTPClient.
		var httpClient = Ti.Network.createHTTPClient();
		httpClient.setTimeout(30000);

		// Define the callback.
		httpClient.onload = function(e) {
			if (e.success) {
				if (this.status == 200) {
					if (this.responseText != null && this.responseText.trim().length > 0) {
						var result = {};
						result.success = true;
						result.response = this.responseText;
						//Ti.API.info("result.response = " + result.response);
						// Alloy.Globals.Alert("result.response");
						//Ti.API.info(result);
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
			httpClient.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
			httpClient.send();
		} catch(e) {
			//Alloy.Globals.Alert("Network is down. Please try again later");
		}

	} else {
		var result = {};
		result.success = false;
		var MSG_NO_NETWORK = Alloy.Globals.Constants.MSG_NO_NETWORK;
		result.message = MSG_NO_NETWORK;
		callback(result);
	}
};

/**
 * This is a generic function for performing POST requests
 */
exports.post = function(url, callback, data) {
	if (Titanium.Network.online) {
		// Create an HTTPClient.
		var httpClient = Ti.Network.createHTTPClient();
		httpClient.setTimeout(30000);

		// Define the callback.
		httpClient.onload = function(e) {
			if (e.success) {
				if (this.status == 200) {
					if (this.responseText != null && this.responseText.trim().length > 0) {
						var result = {};
						result.success = true;
						result.response = this.responseText;
						//Ti.API.info("result.response = " + result.response);
						// Alloy.Globals.Alert("result.response");
						// Alloy.Globals.Alert(result.response);
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
			httpClient.open('POST', url);
			httpClient.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			httpClient.send(data);
		} catch(e) {
			//Alloy.Globals.Alert("Network is down. Please try again later");
		}

	} else {
		var result = {};
		result.success = false;
		var MSG_NO_NETWORK = Alloy.Globals.Constants.MSG_NO_NETWORK;
		result.message = MSG_NO_NETWORK;
		callback(result);
	}
};

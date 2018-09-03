/**
 * Communicator.js
 *
 * This file handles all the complexity related to network communication. It connects to the server and returns the response.
 * It also checks for the internet connection, errors in response and handles them gracefully.
 */

/**
 * This is a generic function for performing GET requests
 */
exports.httpClient;
exports.get = function(url, callback) {
	if (Titanium.Network.online) {
		// Create an exports.httpClient.
		exports.httpClient = Ti.Network.createHTTPClient();
		exports.httpClient.setTimeout(30000);

		// Define the callback.
		exports.httpClient.onload = function(e) {
			try {
				if (e.success) {
					if (this.status == 200) {
						if (this.responseText != null && this.responseText.trim().length > 0) {
							var result = {};
							result.success = true;
							result.response = this.responseText;

							if (JSON.parse(result.response).response_code == 2) {
								Alloy.Globals.logout();
								Alloy.Globals.Notifier.show(JSON.parse(result.response).responseMessage);
								return;
							}
							Ti.API.info("result.response = " + result.response);
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
			} catch(e) {
				Ti.API.info('GET Communicator ' + e.message);
				Alloy.Globals.LoadingScreen.close();
			}
		};
		exports.httpClient.onerror = function(e) {
			var result = {};
			result.success = false;
			result.message = e.error;
			callback(result);
		};

		// Send the request data.
		try {
			exports.httpClient.open('GET', url);
			exports.httpClient.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
			exports.httpClient.send();
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

/**
 * This is a generic function for performing POST requests
 */
exports.post = function(url, callback, data) {
	if (Titanium.Network.online) {
		// Create an HTTPClient.
		exports.httpClient = Ti.Network.createHTTPClient();
		exports.httpClient.setTimeout(50000);

		// Define the callback.
		exports.httpClient.onload = function(e) {
			try {
				if (e.success) {
					if (this.status == 200) {
						if (this.responseText != null && this.responseText.trim().length > 0) {
							var result = {};
							result.success = true;
							result.response = this.responseText;
							if (JSON.parse(result.response).response_code == 2) {
								Alloy.Globals.Notifier.show(JSON.parse(result.response).responseMessage);
								Alloy.Globals.logout();
								return;
							}
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
			} catch(e) {
				Alloy.Globals.LoadingScreen.close();
				Ti.API.info('POST Communicator ' + e.message);
			}
		};
		exports.httpClient.onerror = function(e) {
			var result = {};
			result.success = false;
			result.message = e.error;
			callback(result);
		};

		// Send the request data.
		try {
			exports.httpClient.open('POST', url);
			// exports.httpClient.setRequestHeader("Content-Type", "application/json");
			exports.httpClient.send(data);
		} catch(e) {
			Alloy.Globals.Alert(e.message);
			tracker.addException({
				description : "Communicator2: " + e.message,
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
exports.postFormData = function(url, callback, data) {
	if (Titanium.Network.online) {
		// Create an exports.httpClient.
		exports.httpClient = Ti.Network.createHTTPClient();
		exports.httpClient.setTimeout(10000);

		// Define the callback.
		exports.httpClient.onload = function(e) {
			try {
				if (e.success) {
					if (this.status == 200) {
						if (this.responseText != null && this.responseText.trim().length > 0) {
							var result = {};
							result.success = true;
							result.response = this.responseText;
							Ti.API.info("result.response = " + result.response);
							if (JSON.parse(result.response).response_code == 2) {
								Alloy.Globals.Notifier.show(JSON.parse(result.response).responseMessage);
								Alloy.Globals.logout();
								return;
							}

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
			} catch(e) {
				Ti.API.info('postFormData Communicator ' + e.message);
				Alloy.Globals.LoadingScreen.close();
			}
		};
		exports.httpClient.onerror = function(e) {
			var result = {};
			result.success = false;
			result.message = e.error;
			callback(result);
		};

		// Send the request data.
		try {
			exports.httpClient.open('POST', url);
			exports.httpClient.setRequestHeader("Content-Type", "application/json");
			exports.httpClient.send(data);
		} catch(e) {
			Alloy.Globals.Alert(e.message);
		}

	} else {
		var result = {};
		result.success = false;
		var MSG_NO_NETWORK = Alloy.Globals.Constants.MSG_NO_NETWORK;
		result.message = MSG_NO_NETWORK;
		callback(result);
	}
};

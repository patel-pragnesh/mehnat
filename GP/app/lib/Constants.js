/**
 * Constants.js
 *
 * This file contains all the constants used in the app.
 */

/**********************************Server Details*************************************/
exports.DOMAIN_URL = 'https://www.cdnsolutionsgroup.com/gongcha/services/';
//exports.DOMAIN_URL = 'https://www.cdnsolutionsgroup.com/gongcha_st/services/';

exports.SERVICE_LOGIN = 'user/posLogin';
exports.SERVICE_FORGOT_PASSWORD = 'user/forgetPassword';
exports.SERVICE_USER_CLOCK_IN_OUT = 'user/clockInClockOut';

exports.SERVICE_GET_INITIAL_DATA = 'user/processSync';
exports.SERVICE_ADD_USER = 'user/addUser';
exports.SERVICE_GET_CUSTOMER_LIST = 'user/getCoustomerList';
exports.SERVICE_EMPLOY_PROFILE_UPDATE = 'user/updateUserProfile';
exports.SERVICE_PLACE_ORDER = 'user/placeOrder';
exports.SERVICE_UPDATE_ORDER_STATUS = 'user/updateOrderStatus';
exports.SERVICE_SEARCH_CUSTOMER = 'user/searchCoustomer';
exports.SERVICE_VERIFY_OTP = 'user/verifyOTP';
exports.SERVICE_RESEND_OTP = 'user/resendOTP';
exports.SERVICE_REVERSE_SYNC = 'user/reverseSync';
exports.SERVICE_REFUND_ORDER = 'user/refundOrder';
exports.SERVICE_GET_NOTIFICATION = 'user/getSentNotification';
exports.SERVICE_GET_LOYALTY_VALUE_LIST = 'user/getLoyalityPointValueList';
exports.SERVICE_LOGOUT = 'user/logout';
exports.SERVICE_SEND_OTP_CHECKOUT = 'user/sendOTP';
exports.SERVICE_VERIFY_OTP_CEHCKOUT = 'user/verifyStoreManagerOTP';
exports.SERVICE_SEND_APP_LINK = 'user/sendAppLink';
exports.SERVICE_RESET_BADGE = 'customer/resetBadge';

exports.SERVICE_CANCEL_OTP = 'pos/deleteUserOnCancel';

//PAX Service
exports.SERVICE_INITIALIZE = 'A00';
/**********************************Message Constants*************************************/
exports.MSG_NO_NETWORK = "Please check your internet connection and try again";
exports.MSG_STATUS_CODE = "Network is down. Please try again later";
exports.MSG_NO_DATA = "No data received from server";
exports.MSG_RECORD_NOT_FOUND = "No records found";

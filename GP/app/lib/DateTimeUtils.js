var moment = require('/alloy/moment');

exports.getFormattedDate = function(date) {
	var day = moment(date);
	day = day.format("MM/DD/YYYY, hh:mm a");
	return day;
	// if ( date instanceof String) {
	// Ti.API.info('String');
	// var day = moment(date, "yyyy-MM-dd HH:mm:ss");
	// return day.format("dd/MM/yyyy, hh:mm a");
	// } else if ( date instanceof Date) {
	// Ti.API.info('Date');
	// var day = moment(date);
	// return d.toString("MM/dd/yyyy, hh:mm a");
	// }
	// return day;
};

exports.printLabelFun = function(menuName, modifierStr, itemCounterValue, isLastItem, response, orderId, isFirstItem) {
	Ti.API.info('Ti.App.Properties.getObject("labelprinterDevice") ====' + Ti.App.Properties.getObject("labelprinterDevice"));
	if (Ti.App.Properties.getObject("labelprinterDevice")) {
		var dateStr = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + (new Date().getFullYear());
		var result = epos.connect(Ti.App.Properties.getObject("labelprinterDevice").target);
		if (result == false) {
			Ti.API.info('Failed to print');
			return;
		}
		var buffer = Ti.createBuffer({
			length : 7
		});
		//1D 42 n
		//1D 56
		//m
		//1C 28 4C 02 00 43 m
		buffer[0] = 0x1C;
		buffer[1] = 0x28;
		buffer[2] = 0x4C;
		buffer[3] = 0x02;
		buffer[4] = 0x00;
		buffer[5] = 43;
		buffer[6] = 49;

		epos.printData(menuName, modifierStr, dateStr, itemCounterValue, Ti.App.Properties.getObject("labelprinterDevice").target, isLastItem, orderId, buffer.toBlob(), isFirstItem);
	}
};

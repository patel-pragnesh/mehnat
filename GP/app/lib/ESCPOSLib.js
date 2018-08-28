//Private ESC POS commands
var COMMAND_ESC = 0x1B;
var COMMAND_GS = 0x1D;
var COMMAND_FS = 0x1C;
var COMMAND_LF = 0x0A;
var COMMAND_FF = 0x0C;

var COMMAND_INITIALIZE = 0x40;
var COMMAND_DEFAULT_LINE_SPACING = 0x32;
var COMMAND_LINE_SPACING = 0x33;
var COMMAND_JUSTIFICATION = 0x61;
var COMMAND_CHARACTER_SIZE = 0x21;
var COMMAND_PAPER_LF = 0x4A;
var COMMAND_LINES_LF = 0x64;
var COMMAND_PULSE = 0x70;
var COMMAND_CUT_PAPER = 0x56;
var COMMAND_PAGE_MODE = 0x4C;
var COMMAND_PAGE_AREA = 0x57;
var COMMAND_STANDARD_MODE = 0x53;

//Public ESC POS commands
exports.JUSTIFICATION_LEFT = 0;
exports.JUSTIFICATION_CENTER = 1;
exports.JUSTIFICATION_RIGHT = 2;
exports.CHARACTER_SIZE_NORMAL = 0x00;
exports.CHARACTER_SIZE_DOUBLE = 0x11;

exports.initializePrinter = function(buffer) {
	var initializeBuffer = Ti.createBuffer({
		length : 2
	});

	initializeBuffer[0] = COMMAND_ESC;
	initializeBuffer[1] = COMMAND_INITIALIZE;

	buffer.append(initializeBuffer);
};

exports.selectPageMode = function(buffer) {
	var pageModeBuffer = Ti.createBuffer({
		length : 2
	});

	pageModeBuffer[0] = COMMAND_ESC;
	pageModeBuffer[1] = COMMAND_PAGE_MODE;

	buffer.append(pageModeBuffer);
};

exports.selectStandardMode = function(buffer) {
	var standardModeBuffer = Ti.createBuffer({
		length : 2
	});

	standardModeBuffer[0] = COMMAND_ESC;
	standardModeBuffer[1] = COMMAND_STANDARD_MODE;

	buffer.append(standardModeBuffer);
};

exports.setPageAreaForLabel = function(buffer) {
	var pageAreaBuffer = Ti.createBuffer({
		length : 10
	});

	pageAreaBuffer[0] = COMMAND_ESC;
	pageAreaBuffer[1] = COMMAND_PAGE_AREA;
	pageAreaBuffer[2] = 20;
	pageAreaBuffer[3] = 0;
	pageAreaBuffer[4] = 0;
	pageAreaBuffer[5] = 0;
	pageAreaBuffer[6] = 200;
	pageAreaBuffer[7] = 1;
	pageAreaBuffer[8] = 30;
	pageAreaBuffer[9] = 1;

	buffer.append(pageAreaBuffer);
};

exports.printInPageMode = function(buffer) {
	var printInPageModeBuffer = Ti.createBuffer({
		length : 2
	});

	printInPageModeBuffer[0] = COMMAND_ESC;
	printInPageModeBuffer[1] = COMMAND_FF;

	buffer.append(printInPageModeBuffer);
};

exports.setUTF8Encoding = function(buffer) {
	var setEncodingBuffer = Ti.createBuffer({
		length : 7
	});

	setEncodingBuffer[0] = COMMAND_FS;
	setEncodingBuffer[1] = 0x28;
	setEncodingBuffer[2] = 0x43;
	setEncodingBuffer[3] = 0x02;
	setEncodingBuffer[4] = 0x00;
	setEncodingBuffer[5] = 0x30;
	setEncodingBuffer[6] = 49;

	buffer.append(setEncodingBuffer);
};

exports.addText = function(buffer, text) {

	var textBuffer = Ti.createBuffer({
		length : text.length
	});
	for (var i = 0; i < text.length; i++) {
		var hex = text.charCodeAt(i).toString(16);
		textBuffer[i] = parseInt('0x' + hex);
	};

	Ti.API.info('textBuffer = ' + textBuffer.toString());

	buffer.append(textBuffer);
};

exports.setLineSpacing = function(buffer, lineSpacing) {
	var lineSpacingBuffer = Ti.createBuffer({
		length : 3
	});

	lineSpacingBuffer[0] = COMMAND_ESC;
	lineSpacingBuffer[1] = COMMAND_LINE_SPACING;
	lineSpacingBuffer[2] = lineSpacing;

	buffer.append(lineSpacingBuffer);
};

exports.setDefaultLineSpacing = function(buffer) {
	var lineSpacingBuffer = Ti.createBuffer({
		length : 2
	});

	lineSpacingBuffer[0] = COMMAND_ESC;
	lineSpacingBuffer[1] = COMMAND_DEFAULT_LINE_SPACING;

	buffer.append(lineSpacingBuffer);
};

exports.setJustification = function(buffer, justification) {
	var justificationBuffer = Ti.createBuffer({
		length : 3
	});

	justificationBuffer[0] = COMMAND_ESC;
	justificationBuffer[1] = COMMAND_JUSTIFICATION;
	justificationBuffer[2] = justification;

	buffer.append(justificationBuffer);
};

exports.setCharacterSize = function(buffer, characterSize) {
	var characterSizeBuffer = Ti.createBuffer({
		length : 3
	});

	characterSizeBuffer[0] = COMMAND_GS;
	characterSizeBuffer[1] = COMMAND_CHARACTER_SIZE;
	characterSizeBuffer[2] = characterSize;

	buffer.append(characterSizeBuffer);
};

exports.addLineFeed = function(buffer) {
	var lineFeedBuffer = Ti.createBuffer({
		length : 1
	});

	lineFeedBuffer[0] = COMMAND_LF;

	buffer.append(lineFeedBuffer);
};

exports.addPaperFeed = function(buffer, motionUnit) {
	var lineFeedBuffer = Ti.createBuffer({
		length : 3
	});

	lineFeedBuffer[0] = COMMAND_ESC;
	lineFeedBuffer[1] = COMMAND_PAPER_LF;
	lineFeedBuffer[2] = motionUnit;

	buffer.append(lineFeedBuffer);
};

exports.addMultipleLineFeed = function(buffer, lines) {
	var lineFeedBuffer = Ti.createBuffer({
		length : 3
	});

	lineFeedBuffer[0] = COMMAND_ESC;
	lineFeedBuffer[1] = COMMAND_LINES_LF;
	lineFeedBuffer[2] = lines;

	buffer.append(lineFeedBuffer);
};

exports.addFeedToCuttingPosition = function(buffer) {
	var feedBuffer = Ti.createBuffer({
		length : 7
	});

	feedBuffer[0] = COMMAND_FS;
	feedBuffer[1] = 0x28;
	feedBuffer[2] = 0x4C;
	feedBuffer[3] = 0x02;
	feedBuffer[4] = 0x00;
	feedBuffer[5] = 0x41;
	feedBuffer[6] = 49;

	buffer.append(feedBuffer);
};

exports.openDrawer = function(buffer) {
	var drawerBuffer = Ti.createBuffer({
		length : 5
	});

	drawerBuffer[0] = COMMAND_ESC;
	drawerBuffer[1] = COMMAND_PULSE;
	drawerBuffer[2] = 0;
	drawerBuffer[3] = 2;
	drawerBuffer[4] = 20;

	buffer.append(drawerBuffer);
};

exports.cutPaper = function(buffer) {
	var cutPaperBuffer = Ti.createBuffer({
		length : 3
	});

	cutPaperBuffer[0] = COMMAND_GS;
	cutPaperBuffer[1] = COMMAND_CUT_PAPER;
	cutPaperBuffer[2] = 49;

	buffer.append(cutPaperBuffer);
};

var args = arguments[0] || {};
var count = "0";
var buttonsExpanded = false;
var countDown;

var my_timer;
function animateFun() {
	if (args != null) {
		$.view.animate({
			height : "50%",
			width : "90%"
		});
		my_timer.start();
	}
}

function cancleFun(e) {
	$.AdvertisementScreen.close();
	Alloy.Globals.advertiseWin = null;
	if (my_timer) {
		my_timer.stop();
	}
}

function openLink(e) {
	Ti.API.info("args.length "+ args.length);
	if (args.length > 0) {
		var isOpen = Ti.Platform.openURL(args[0].advertise_url);
		
		Ti.API.info("isOpen "+ isOpen);
	}

}

var Imagedata = [];
advertisementView(args);
$.lbl.text = args[0].advertise_Title;
function advertisementView(args) {
	Imagedata = [];
	if (args != null) {
		for (var i = 0; i < args.length; i++) {
			var view1 = Ti.UI.createView({
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				top : 0,
			});
			var img = Ti.UI.createImageView({

				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				image : args[i].advertise_images,
				//hires:true
			});
			view1.add(img);
			Imagedata.push(view1);
		}

	} else {

		var view1 = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			image : ""
		});
		var img = Ti.UI.createImageView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			//hires : true,
			image : "/images/no_img.png"
		});

		view1.add(img);
		Imagedata.push(view1);

	}

	$.scrollabelVW.views = Imagedata;

	if (OS_ANDROID) {

		/*
		 * Scrollable view for multiple images if there in android
		 */
		var scrollableView = $.scrollabelVW;
		var pageController = pagingControl(scrollableView);
		pageController.setBottom(0);
		//$.scrollabelVW.add(pageController);
		function pagingControl(scrollableView) {
			var container = Titanium.UI.createView({
				height : '20dp',
				backgroundColor : "#2C529B",
				opacity : 0.6
			});
			var viewLeftArrow = Ti.UI.createView({
				height : '15dp',
				width : '10dp',
				left : '10dp',
				selected : false
			});
			var imageLeftArrow = Ti.UI.createImageView({
				image : '/leftGrayArrow.png',
				height : '8dp',
				width : '8dp',
			});
			//viewLeftArrow.add(imageLeftArrow);
			//container.add(viewLeftArrow);
			var bulletContainer = Ti.UI.createView({
				height : '10dp',
				width : Ti.UI.SIZE,

			});
			//container.add(bulletContainer);
			var viewRightArrow = Ti.UI.createView({
				height : '15dp',
				width : '10dp',
				right : '15dp',
				selected : true
			});
			var imageRightArrow = Ti.UI.createImageView({
				image : '/rightBlueArrow.png',
				height : '8dp',
				width : '8dp',
			});
			//viewRightArrow.add(imageRightArrow);
			/////////////container.add(viewRightArrow);
			var pages = [];
			if (args != null) {

				for (var i = 0; i < args.length; i++) {
					var page = Titanium.UI.createView({
						borderRadius : 7,
						width : '5dp',
						height : '5dp',
						left : 25 * i,
						backgroundColor : "#fff",
					});
					//pages.push(page);
					// Add it to the container
					//bulletContainer.add(page);
				}
			} else {

				var page = Titanium.UI.createView({
					borderRadius : 7,
					width : '5dp',
					height : '5dp',
					left : 25 * 0,
					backgroundColor : "#fff",
				});
				//pages.push(page);
				// Add it to the container
				//bulletContainer.add(page);

			}

			// Mark the initial selected page
			if (pages.length > 0) {
				pages[scrollableView.getCurrentPage()].setBackgroundColor("#000000");
			}

			if (pages.length == 1) {
				imageLeftArrow.image = '/leftGrayArrow.png';
				imageRightArrow.image = '/rightGrayArrow.png';
				viewLeftArrow.selected = false;
				viewRightArrow.selected = false;
			} else {
				imageLeftArrow.image = '/leftGrayArrow.png';
				imageRightArrow.image = '/rightBlueArrow.png';
				viewLeftArrow.selected = false;
				viewRightArrow.selected = true;
			}
			viewLeftArrow.addEventListener('click', function(e) {
				if (this.selected) {
					scrollableView.currentPage -= 1;
				}
			});
			viewRightArrow.addEventListener('click', function(e) {
				if (this.selected) {
					scrollableView.currentPage += 1;
				}
			});
			// Callbacks
			onScroll = function(event) {

			};

			onScrollEnd = function(event) {
				Ti.API.info("GET :" + event);
				if (event) {
					//imageShare = event.view.image;
					Ti.API.info("PAGE : " + JSON.stringify(event.currentPage));
					if (event.currentPage || event.currentPage == 0) {
						// Go through each and reset it's color
						if (args != null) {

							pages[count].setBackgroundColor("#fff");

						} else {
							pages[0].setBackgroundColor("#fff");
						}

						// Bump the Color of the new current page
						if (pages.length > 0) {
							pages[event.currentPage].setBackgroundColor("#000000");
						}
						count = event.currentPage;
					}
				} else {
					Ti.API.info("NOT GET :" + JSON.stringify(event));
				}
			};
			/////////// Attach the scroll event to this scrollableView, so we know when to update things
			/////////scrollableView.addEventListener("scroll", onScroll);
			/////////scrollableView.addEventListener("scrollend", onScrollEnd);
			return container;
		};

	}

}

countDown = function(h, m, s, fn_tick, fn_end) {
	return {
		total_sec : h * 60 * 60 + m * 60 + s,
		timer : this.timer,
		set : function(m, s) {
			this.total_sec = parseInt(h) * 60 * 60 + parseInt(m) * 60 + parseInt(s);
			this.time = {
				h : h,
				m : m,
				s : s
			};
			return this;
		},
		start : function() {
			var self = this;
			this.timer = setInterval(function() {
				if (self.total_sec) {
					self.total_sec--;
					var min = (self.total_sec - (parseInt(h * (60 * 60))) - (self.total_sec % 60)) / 60;
					self.time = {
						h : parseInt(self.total_sec / (60 * 60)),

						m : parseInt(min),
						s : (self.total_sec % 60)
					};

					fn_tick();
				} else {
					self.stop();
					fn_end();
				}
			}, 1000);
			return this;
		},

		stop : function() {
			clearInterval(this.timer);
			this.time = {
				h : 0,
				m : 0,
				s : 0
			};
			this.total_sec = 0;
			return this;
		}
	};
};
if (args != null) {
	my_timer = new countDown(0, 0, args[0].second, function() {
		//$.hoursLbl.text = my_timer.time.h;
		//$.minLbl.text = my_timer.time.m;

		$.secLbl.text = my_timer.time.s;

		// if ($.hoursLbl.text == 0) {
		// if ($.minLbl.text == 0) {
		if ($.secLbl.text == 0) {
			$.AdvertisementScreen.close();
			Alloy.Globals.advertiseWin = null;
			my_timer.stop();

		}
		// }
		// }

	}, function() {

		my_timer.stop();

	});
}

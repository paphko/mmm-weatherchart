Module.register("mmm-weatherchart", {

	defaults: {
		country: 'Germany',
		area: 'North_Rhine-Westphalia',
		city: 'Duisburg',
		updateInterval: 60 * 60 * 1000, // every hour
		hideBorder: true,
		negativeImage: true,
		retryDelay: 2500,
		domain: "www.yr.no",
		path: "/place/",
		mmDirectory: "/home/pi/MagicMirror/", // not sure whether it is possible to ask MM for this path?
		hoursToShow: -1
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		var img = document.createElement("img");
		if (this.config.hideBorder || this.config.hoursToShow > 0) {
			var width = 824;
			wrapper.style.overflow = "hidden";
			wrapper.style.position = "relative";
			img.style.position = "absolute";

			if (this.config.hoursToShow > 0 && this.config.hoursToShow < 48) {
				width = 26 + 16 * this.config.hoursToShow;
			}

			if (this.config.hideBorder) {
				wrapper.style.height = "241px";
				img.style.left = "-7px";
				img.style.top = "-25px";
				if (width == 824) {
					width -= 14;
				} else { // If hoursToShow is set, we've already cut off the right-side border
					width -= 7;
				}
			} else {
				img.style.left = "0px";
				wrapper.style.height = "272px";
			}
			wrapper.style.width = width + "px";
		}
		if (this.config.negativeImage) {
			img.style["-webkit-filter"] = "invert(100%) grayscale(100%)";
		}
		img.src = this.srcMap;
		wrapper.appendChild(img);
		return wrapper;
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		this.loaded = false;
		this.scheduleUpdate(3); // wait some 3 secs and run initial update
		this.updateTimer = null;
	},

	getWeatherMap: function() {
		var self = this;
		var mapLocal = this.config.path + this.config.country + "/" + this.config.area + "/" + this.config.city + "/meteogram.png";
		var payload = {
			domain: this.config.domain,
			path: mapLocal,
			mmDir: this.config.mmDirectory
		};
		self.sendSocketNotification("FETCH_MAP", payload);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "MAPPED"){
			this.srcMap = payload;
			if (typeof this.srcMap !== "undefined") {
				this.loaded = true;
				this.updateDom();
			}
			this.scheduleUpdate();
		}
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function() {
			self.getWeatherMap();
		}, nextLoad);
	},
});


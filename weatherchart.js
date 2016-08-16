Module.register("weatherchart", {
        defaults: {
                country: 'Germany',
                area: 'North_Rhine-Westphalia',
                city: 'Dortmund',
		hideBorder: true,
        },
        getDom: function() {
                // add current timestamp to avoid old cached image
                var src = "http://www.yr.no/place/" + this.config.country + "/" + this.config.area + "/" + this.config.city + "/meteogram.png#" + new Date().getTime();

                // invert and grayscale image via css
                var style = "-webkit-filter: invert(100%) grayscale(100%);";
		if (this.config.hideBorder)
			style = "position: absolute; left: -7px; top: -25px; " + style;
                var img = "<img src='" + src + "' style='" + style + "'>";

                var wrapper = document.createElement("div");
		if (this.config.hideBorder) {
			wrapper.style.width = "810px";
			wrapper.style.height = "241px";
			wrapper.style.overflow = "hidden";
			wrapper.style.position = "relative";
		}
                wrapper.innerHTML = img;
                return wrapper;
        }
});


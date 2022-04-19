var http = require('https');
var fs = require('fs');
var del = require('del');
var request = require('request'); 
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	start: function() {
		console.log("Starting node helper: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
		console.log("Downloading weather map with signal: " + notification + " From URL: " + payload.domain + payload.path);
		if (notification === "FETCH_MAP"){
			var self = this;
			var options = {
				host: payload.domain,
				path: payload.path
			};
			
			http.get(options, function (response) {
				var svgFiles = payload.mmDir + 'modules/mmm-weatherchart/cache/*.svg';
				del.sync([svgFiles]);
				
				var cachedFile = 'modules/mmm-weatherchart/cache/map-' + new Date().getTime() + '.svg';
				var newImage = fs.createWriteStream(payload.mmDir + cachedFile);
				response.on('data', function(chunk){
					newImage.write(chunk);
				});
				response.on('end', function(){
					newImage.end();
					self.sendSocketNotification("MAPPED", cachedFile);
				});
			});
		}
	},
});

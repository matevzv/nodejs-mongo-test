var async = require("async");
var request = require('request');

exports.forwardMeasurements = function forwardMeasurements (urls, req, callback) {
	process.nextTick(function() {
		if (urls.length > 0) {
			async.each(urls, function(url, callback) {
				request.post({
					headers: {'Content-Type' : 'application/json'},
					url:     url,
					body:    JSON.stringify(req.body)
				}, function(err, response, body) {
					if (err)
						console.log(err);					
				});
				callback();			
			}, function(err) {
	  			console.log('Measurements forwarded!');
			});
		} else
			console.log('No urls!');
		callback();
	});
}

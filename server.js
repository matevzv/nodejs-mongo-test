// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); 		// call express
var app = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');

var Measurement = require('./app/models/measurement');
var business = require('./app/business/business');

// measurements forwarding endpoints
var urls = [];

// connect to our database
mongoose.connect('mongodb://localhost/sms');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json({limit: '10mb'}));

// set our port
var port = 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {	
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

router.route('/measurements')
	// add measurements (accessed at POST http://localhost:8080/api/measurements)
	.post(function(req, res) {
		Measurement.collection.insert(req.body, function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Measurements added!' });
		});
		
		business.forwardMeasurements(urls, req, function() {
			console.log('Finished forwarding!');
		});
			
		console.log('Done!');	
	})
	
	// get all the measurements (accessed at GET http://localhost:8080/api/measurements)
	.get(function(req, res) {
		Measurement.find(function(err, measurements) {
			if (err)
				res.send(err);

			res.json(measurements);
		});
	});

router.route('/measurements/:measurement_id')

	// get the measurement with that id
	// accessed at GET http://localhost:8080/api/measurement/:measurement_id
	.get(function(req, res) {
		Measurement.findById(req.params.measurement_id, function(err, measurement) {
			if (err)
				res.send(err);
			res.json(measurement);
		});
	})
	
	// update the measurement with this id
	// accessed at PUT http://localhost:8080/api/measurement/:measurement_id
	.put(function(req, res) {

		// use our measurement model to find the measurement we want
		Measurement.findById(req.params.measurement_id, function(err, measurement) {
			if (err)
				res.send(err);

			measurement.contextDescription = req.body.contextDescription; 	// update the measurement info

			// save the measurement
			measurement.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Measurement updated!' });
			});

		});
	})
		
	// delete the measurement with this id
	// accessed at DELETE http://localhost:8080/api/measurement/:measurement_id
	.delete(function(req, res) {
		Measurement.remove({ _id: req.params.measurement_id }, function(err, measurement) {
			if (err)
				res.send(err);
			else if (measurement)
				res.json({ message: 'Successfully deleted!' });
			else
				res.json({ message: 'Measurement not found!' });
		});
	});		

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);

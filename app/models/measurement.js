// app/models/measurements.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MeasurementSchema   = new Schema({
	nodeName: String,
	sensorName: String,
	quantityName: String,
	unitName: String,
	contextDescription: String,
	latitude: Number,
	longitude: Number,
	timestamp: { type: Date, default: Date.now },
	value: Number
});

module.exports = mongoose.model('Measurement', MeasurementSchema);

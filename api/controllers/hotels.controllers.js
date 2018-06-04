 /* var dbconn = require('../data/dbconnect.js');
   var ObjectId = require('mongodb').ObjectId;
   var hotelData = require('../data/hotel-data.json');
  */

 var mongoose = require('mongoose');
 var Hotel = mongoose.model('Hotel');

 var runGeoQuery = function (req, res) {

 	var lng = parseFloat(req.query.lng);
 	var lat = parseFloat(req.query.lat);

 	//a geoJSON pt
 	if (isNan(lng) || isNan(lat)) {
 		res
 			.status(400)
 			.json({
 				"message": "If supplied in querystring, lat and lng should be numbers"
 			});
 		return;
 	}

 	var point = {
 		type: "Point",
 		coordinates: [lng, lat]
 	};

 	var geoOptions = {
 		spherical: true,
 		maxDistance: 2000,
 		num: 5 //records to return
 	};

 	Hotel
 		.geoNear(point, geoOptions, function (err, results, stats) {
 			var response = {
 				status: 200,
 				message: results
 			};

 			if (err) {
 				console.log("Error finding GeoPoint");
 				response.status = 500;
 				response.message = err;
 			}

 			console.log('Geo results', results);
 			console.log('Geo stats', stats);

 			res
 				.status(response.status)
 				.json(response.message);;
 		});
 };


 module.exports.hotelsGetAll = function (req, res) {
 	console.log('Requested by: ' + req.user);
 	console.log('GET the hotels');
 	console.log(req.query);

 	//defaults
 	var offset = 0;
 	var count = 5;
 	var maxCount = 10;

 	if (req.query && req.query.lat && req.query.lng) {
 		runGeoQuery(req, res);
 		return;
	 }
	 
 	// change offset, count if query has values
 	if (req.query && req.query.offset) {
 		offset = parseInt(req.query.offset, 10);
	 }
	 
 	if (req.query && req.query.offset) {
 		count = parseInt(req.query.count, 10);
 	}

 	if (isNan(offset) || isNan(count)) {
 		res
 			.status(400)
 			.json({
 				"message": "If supplied in querystring, count and offset should be numbers"
 			});
 		return;
 	}

 	if (count > maxCount) {
 		res
 			.status(400)
 			.json({
 				"message": "Count limit of " + maxCount + "exceeded"
 			});
 		return; // needed so we dont keep sending again
 	}
 	//collection
 	Hotel
 		.find()
 		.skip(offset)
 		.limit(count)
 		.exec(function (err, hotels) {
 			if (err) {
 				console.log("Error finding hotels");
 				res
 					.status(500)
 					.json(err);
 			} else {
 				console.log("Found hotels", hotels.length);
 				res
 					//.status(200)
 					.json(hotels);
 			}
 		});


 	//console.log("db", db);
 	//console.log("GET the hotels");
 	//console.log(req.query);

 	// var returnData = hotelData.slice(offset,offset+count);

 	// res
 	// 	.status(200)
 	// 	.json( returnData ); 
 };

 module.exports.hotelsGetOne = function (req, res) {
 	var hotelID = req.params.hotelID;
 	//var thisHotel = hotelData[hotelID];
 	console.log("GET hotelID", hotelID);

 	Hotel
 		.findById(hotelID)
 		.exec(function (err, doc) {
 			var response = {
 				status: 200,
 				message: doc
 			};

 			if (err) {
 				console.log("Error finding hotel");
 				response.status = 500;
 				response.message = err;
 			} else if (!doc) {
 				response.status = 404;
 				response.message = {
 					"message": "Hotel ID not found"
 				};
 			}
 			res
 				.status(response.status)
 				.json(response.message);
 		});
 };

 //split array or return empty array
 var _splitArray = function (input) {
 	var output;
 	if (input && input.length > 0) {
 		output = input.split(";");
 	} else {
 		output = [];
 	}
 	return output;
 };

 module.exports.hotelsAddOne = function (req, res) {
 	Hotel
 		.create({
 			name: req.body.name,
 			description: req.body.description,
 			stars: parseInt(req.body.stars, 10),
 			services: _splitArray(req.body.services),
 			photos: _splitArray(req.body.photos),
 			currency: req.body.currency,
 			location: {
 				address: req.body.address,
 				coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
 			}
 		}, function (err, hotel) {
 			if (err) {
 				console.log("Error creating hotel");
 				res
 					.status(400)
 					.json(err);
 			} else {
 				console.log("Hotel created", hotel);
 				res
 					.status(201)
 					.json(hotel);
 			}
 		});

 };

 module.exports.hotelsUpdateOne = function (req, res) {
 	var hotelID = req.params.hotelID;
 	//var thisHotel = hotelData[hotelID];
 	console.log("GET hotelID", hotelID);

 	Hotel
 		.findById(hotelID)
 		.select("-reviews -rooms") // exclusions
 		.exec(function (err, doc) {
 			var response = {
 				status: 200,
 				message: doc
 			};

 			if (err) {
 				console.log("Error finding hotel");
 				response.status = 500;
 				response.message = err;
 			} else if (!doc) {
 				response.status = 404;
 				response.message = {
 					"message": "Hotel ID not found"
 				};
 			}
 			if (response.status !== 200) {
 				res
 					.status(response.status)
 					.json(response.message);
 			} else {
 				doc.name = req.body.name;
 				doc.description = req.body.description;
 				doc.stars = parseInt(req.body.stars, 10);
 				doc.services = _splitArray(req.body.services);
 				doc.photos = _splitArray(req.body.photos);
 				doc.currency = req.body.currency;
 				doc.location = {
 					address: req.body.address,
 					coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
 				};

 				doc.save(function (err, hotelUpdated) {
 					if (err) {
 						res
 							.status(500)
 							.json(err);
 					} else {
 						res
 							.status(204)
 							.json();
 					}
 				});
 			}
 		});
 };

 module.exports.hotelsDeleteOne = function (req, res) {
 	var hotelID = req.params.hotelID;

 	Hotel
 		.findByIdAndRemove(hotelID)
 		.exec(function (err, hotel) {
 			if (err) {
 				res
 					.status(404)
 					.json(err);
 			} else {
 				console.log("Hotel deleted	, id:", hotelID);
 				res
 					.status(204)
 					.json();
 			}
 		});
 }
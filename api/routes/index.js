
//instantiate router, export it
var express = require('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');

//attach method to route
router
	.route('/hotels')
	.get(ctrlUsers.authenticate, ctrlHotels.hotelsGetAll)
	.post(ctrlHotels.hotelsAddOne);

router
	.route('/hotels/:hotelID')
	.get(ctrlHotels.hotelsGetOne)
	.put(ctrlHotels.hotelsUpdateOne)
	.delete(ctrlHotels.hotelsDeleteOne);
	
//review routes
router
	.route('/hotels/:hotelID/reviews')
	.get(ctrlReviews.reviewsGetAll)
	.post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);

router
	.route('/hotels/:hotelID/reviews/:reviewID')
	.get(ctrlReviews.reviewsGetOne)
	.put(ctrlReviews.reviewsUpdateOne)
	.delete(ctrlReviews.reviewsDeleteOne);

//Authentication
router
	.route('/users/register')
	.post(ctrlUsers.register);

router
	.route('/users/login')
	.post(ctrlUsers.login);

module.exports = router;


var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res) {
    var ID = req.params.hotelID;
	//var thisHotel = hotelData[hotelID];
	console.log("GET reviewID", ID);

    Hotel
		.findById(ID)
        .select('reviews')
		.exec( function(err, doc) {
			var response = {
				status : 200,
				message : doc
			};
			if (err) {
				console.log("Error finding hotel");
				response.status = 500;
				response.message = err;

			} else if (!doc) {
				response.status = 404;
				response.message = {
						"message" : "Hotel ID not found"
					};
			}
			console.log("returned doc", doc);
			response.message = doc.reviews;
			if (response.message === null) 
				response.message = {"message" : "No reviews, sorry!"
			};
			
		res
			.status(response.status)
			.json(response.message); 
		});
}

module.exports.reviewsGetOne = function(req, res) {
	var hotelID = req.params.hotelID;
 	var reviewID = req.params.reviewID;
	//var thisHotel = hotelData[hotelID];
	console.log("GET reviewID" + reviewID + "for hotelID" + hotelID);

    Hotel
		.findById(hotelID)
        .select('reviews')
		.exec(function(err, hotel) {
			var response = {
				status : 200,
				message : hotel.reviews.id(reviewID)
			};

			if (err) {
				console.log("Error finding review");
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				response.status = 404;
				response.message = {
						"message" : "hotel ID not found!"		
			};
 
		}
			if (response.message === null) 
				response.message = {"message" : "No reviews, sorry!"
			};

			res
				.status(response.status)
				.json(response.message);
		});
}

var _addReview = function(req, res, hotel) {

	hotel.reviews.push({
		name : req.body.name,
		rating : parseInt(req.body.rating, 10),
		review : req.body.review
	});


	hotel.save(function(err, hotelUpdated) {
		if (err) {
			console.log("Server error");
			res
				.status(500)
				.json(err);
		} else {
			res
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
		}
	});

};

module.exports.reviewsAddOne = function(req, res) {
	var hotelID = req.params.hotelID;
	//var thisHotel = hotelData[hotelID];
	console.log("GET hotelID", hotelID);

    Hotel
		.findById(hotelID)
        .select('reviews')
		.exec( function(err, doc) {
			var response = {
				status : 200,
				message : []
			};
			if (err) {
				console.log("Error finding review");
				response.status = 500;
				response.message = err;
			} else if (!doc) {
				response.status = 404;
				response.message = {
						"message" : "hotel ID not found!" + id	
			};
			}
			if (doc) { 
				_addReview(req, res, doc);
			} else {
				res
					.status(response.status)
					.json(response.message);
		};
	});
}

module.exports.reviewsUpdateOne = function(req, res) {
	var hotelID = req.params.hotelID;
 	var reviewID = req.params.reviewID;
	
	console.log("Update reviewID" + reviewID + "for hotelID" + hotelID);
	
	Hotel
		.findById(hotelID)
		.select("reviews") // exclusion
		.exec( function(err, doc) {
			var response = {
				status : 200,
				message : doc
			};
			//error traps
			if (err) {
				console.log("Error finding hotel");
				response.status = 500;
				response.message = err;
			} else if (!doc) {
				response.status = 404;
				response.message = {
						"message" : "Hotel ID not found" + hotelID
					};
			}  

			var rev = hotel.reviews.id(reviewID)
			if (!rev) {
         		 response.status = 404;
         		 response.message = {
            	"message" : "Review ID not found " + reviewId
          		};
        	}
			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message); 
			} else {
				//adds if review doesn't exist
				//if (doc & !doc.review) {
				//	_addReview(req, res, doc);
		
				//update review fields, save
				var rev = hotel.reviews.id(reviewID)
				rev.name = req.body.name;
				rev.rating = parseInt(req.body.rating, 10),
				rev.review = req.body.review
				
				doc.save(function(err, hotelUpdated) {
				if (err) {
					res
						.status(500)
						.json(err);
				} else {
					res
						.status(204) //no content
						.json();
				}
				});
				}
				 
		});
};

module.exports.reviewsDeleteOne = function(req, res) {

  var hotelID = req.params.hotelID;
  var reviewID = req.params.reviewID;
  console.log('PUT reviewId ' + reviewID + ' for hotelId ' + hotelID);

  Hotel
    .findById(hotelID)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewID);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewID
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
				hotel.reviews.id(reviewID).remove();
        hotel.save(function(err, hotelUpdated) {
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
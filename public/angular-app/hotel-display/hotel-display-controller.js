angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($window, hotelDataFactory, AuthFactory, jwtHelper, $routeParams, $route) {
    var vm = this;
    vm.title = 'MEAN Hotel App';
    var id = $routeParams.id;
    
    hotelDataFactory.hotelDisplay(id).then(function (response) {
        console.log(response);
        vm.hotels = response.data;
        vm.stars = _getStarRating(response.data.stars);
    });

    function _getStarRating(stars) {
        return new Array(stars);
    }

    vm.addReview = function () {

        var token = jwtHelper.decodeToken($window.sessionStorage.token);
        var username = token.username;

        var postData = {
            name: username,
            rating: vm.rating,
            review: vm.review
        };

        if (vm.reviewForm.$valid) {
            hotelDataFactory.postReview(id, postData).then(function (response) {
                if (response.status === 200) {
                    $route.reload();
                }
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            vm.isSubmitted = true;
        }
    }

}
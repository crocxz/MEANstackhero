/* angular.module('meanhotel').directive('hotelRating', hotelRating);

//custom directive for rating
function hotelRating() {
    return {
        restrict: 'E', //restrict as element, attribute, etc
        template: '<span ng-repeat="star in vm.stars track by $index"> class="glyphicon glyphicon-star">{{ star }}</span>',
        bindToController: true,
        controller: 'HotelController',
        controllerAs: 'vm',
        scope: {
            stars: '@' // = for access by value, for object/array @, & functions
        }
    }
} */

angular.module('meanhotel').component('hotelRating', {
    bindings: {
        stars: '='
    },
    template: '<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{ star }}</span>',
    controller: 'HotelController',
    controllerAs: 'vm'
});


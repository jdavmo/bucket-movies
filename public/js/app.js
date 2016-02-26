//Declaration module bucketMovies
var bucketMovies = angular.module('bucketMovies', ['ngAria',
                                 'ngMaterial',
                                 'ngAnimate',
                                 'ui.router',
                                 'ct.ui.router.extras',
                                 'anim-in-out',
                                 'angular-loading-bar',
                                 'angular-carousel',
                                 'bucketMovie.globals',
                                 'bucketMovie.movies'
                                 ]);

bucketMovies.config(function($mdThemingProvider, $stateProvider, $urlRouterProvider) 
{
    /*theme default material angular*/
    $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey', {
      'default': '500'
    }).accentPalette('pink');

    /**/
    var i = 1;

    $urlRouterProvider.otherwise('/');
    
    //state route application
    $stateProvider
        .state('home', {
            url: '/',
            cache: false,
            templateUrl: "templates/main/main.html?i="+i,
            controller: function($scope, $state, $stateParams, $filter) {
                //scope for directive list-movies               
                $scope.listMovies = {template: $filter('url')('listMovies').url, page: 0, pages: 0, search: '', sortActor: true, sortMovieActor: true, actorMovies: ''};                
            }      
        });
});        
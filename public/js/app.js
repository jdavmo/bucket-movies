//Declaration module bucketMovies
var bucketMovies = angular.module('bucketMovies', ['ngAria',
                                 'ngMaterial',
                                 'ngAnimate',
                                 'ngSanitize',
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
                $scope.listMovies = {template: $filter('url')('listMovies').url, 
                                     page: 0, 
                                     pages: 0, 
                                     search: '',
                                     searchBy: 'person',
                                     searchPlaceholder: 'Search by person',
                                     sortActor: true, 
                                     sortMovie: true
                                    };                
            }      
        })        
        .state('home.movie', {
            url: 'movie/:id',
            views: {
                'detail': {
                    templateUrl: 'templates/movie/movie.html?i='+i,
                    controller: function($scope, $state, $stateParams, $filter) {
                        $scope.viewTransitionDetail = 'detailFullScreen';
                        $scope.movie = {template: $filter('url')('movieContent').url, id: $stateParams.id, sortBy: 'chronological', sort: false};                
                    } 
                }
            }
        })
        .state('home.person', {
            url: 'person/:id',
            views: {
                'detail': {
                    templateUrl: 'templates/person/person.html?i='+i,
                    controller: function($scope, $state, $stateParams, $filter) {
                        $scope.viewTransitionDetail = 'detailFullScreen';
                        $scope.person = {template: $filter('url')('personContent').url, id: $stateParams.id, sortBy: 'year', sort: true};
                    } 
                }
            }
        })
});
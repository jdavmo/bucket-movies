var bucketMovies = angular.module('bucketMovies', ['ngAria',
                                 'ngMaterial',
                                 'ngRoute',
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

    $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey', {
      'default': '500'
    })
    .accentPalette('pink');

    var i = 1;

    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        .state('home', {
            url: '/home',
            cache: false,
            templateUrl: "templates/main/main.html?i="+i,
            controller: function($scope, $state, $stateParams, $filter) {                
                $scope.listMovies = {template: $filter('url')('listMovies').url, page: 0, pages: 0, search: '', sort: ''};                
            }      
        });
        /*.state('laboratorio.admin', {
            url: '/admin/:menuID',
            views: {
                'detail': {
                    templateUrl: 'templates/laboratorio/admin/admin.html?i='+i,
                    controller: function($scope, $state, $stateParams, $filter) {
                        $scope.varGlobalAdminMenuItems  = {search: '', template: $filter('url')('listMenuItems').url, menuID: $stateParams.menuID};
                    }  
                }
            }
        })
        
    $urlRouterProvider.otherwise(function ($injector, $location) {
        return '/';
    });*/

});        
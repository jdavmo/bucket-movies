var BMovies = angular.module('bucketMovie.movies', []);

BMovies.directive('callPopular', function($location, $timeout, globalServices) {
    return {
        restrict : 'AE',
        scope: {
            ngModel: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) {

            scope.popular     	= {url: scope.ngModel.template, list: ''};

            globalServices.globalRequest('/callPopular', '')
            .then(function(res){
                if(res.validation == 'ok')
                {

                    scope.popular.list  = res.list.results;
                                        
                }                                
            }, function(err){
                //toast in the service
            });         
            
        },
        template: '<div ng-include="popular.url"></div>'
    }
});

BMovies.directive('listMovies', function($location, $filter, $timeout, globalServices) {
    return {
        restrict : 'AE',
        scope: {
            ngModel: '=ngModel'
        },
        //controller: 'inboxpostController',
        link: function (scope, element, attrs, ngModelCtrl) {

            /*
            |
            |   
            |
            |
            */

            scope.navBanner  =  {template: $filter('url')('headCarousel').url};
            scope.list       =  {url: scope.ngModel.template};            
         

            function BMlist(append_search)
            {
                var enter = 0;

                if(append_search == 'search')
                {
                    scope.listMovies    = [];
                    scope.ngModel.page  = 0;
                    scope.ngModel.pages = 0;
                    scope.ngModel.total = 0;

                    var page            = scope.ngModel.page;
                    enter               = 1;
                }
                else
                {
                    var page      = scope.ngModel.page;
                    var pages     = scope.ngModel.pages;
                    if(page < pages)
                    {
                        enter = 1;
                    }
                    else
                    {
                        enter = 0;
                    }
                }

                if(enter == 1)
                {
                    page = parseInt(page)+1;

                    var array               = {};
                    array['page']           = page;
                    array['search']         = scope.ngModel.search;
                    
                    globalServices.globalRequest('/listMovies',array)
                    .then(function(res){
                        if(res.validation == 'ok')
                        {   

                            scope.listMovies               = globalServices.mergeArray(scope.listMovies, globalServices.orderArrayDate(globalServices.orderArrayMovies(res.list.results), 'date', ''), '');                            
                            scope.ngModel.page             = res.list.page;
                            scope.ngModel.pages            = res.list.total_pages;                            
                            scope.ngModel.total            = res.list.total_results;
                        }                        
                    }, function(err){
                        //servicio global
                    });

                }
            }

            /*
            | Infinite scroll
            */
            element.bind('scroll', function () {
                if(element[0].scrollHeight - element[0].scrollTop  == element[0].getBoundingClientRect().height) {
                    BMlist('');
                }
            });

            /*
            | Search
            */
            var tempFilterText = '',filterTextTimeout;
            scope.$watch('ngModel.search', function(current, old){

                if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

                tempFilterText      = current;

                filterTextTimeout   = $timeout(function() {
                    scope.ngModel.search = tempFilterText;                    
                    BMlist('search');
                }, 1000); // delay 250 ms                               

            })

            scope.$watch('ngModel.sort', function(current, old){

                if(current)
                {
                    if(current == 'dateUp')
                    {
                        scope.listMovies = globalServices.orderArrayDate(scope.listMovies, 'date', 'desc');
                    }
                    else if(current == 'dateDown')
                    {
                        scope.listMovies = globalServices.orderArrayDate(scope.listMovies, 'date', 'asc');
                    }
                        
                }                              

            })
            
        },
        template: '<div ng-include="list.url"></div>'
    }
});

BMovies.directive('showMore', function($mdDialog, $filter) {
    return {
        restrict : 'AE',
        scope: {
          ngModel: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) {            

            element.on('click', function(events) {

                $mdDialog.show({
                    controller: dialogCtrMovie,
                    templateUrl: $filter('url')('infoMovie').url,
                    parent: angular.element(document.body),
                    targetEvent: events,
                    clickOutsideToClose:true,
                    locals: {data: scope.ngModel}
                })
                .then(function(answer) {
                  
                }, function() {
                  
                });
                events.stopPropagation();
            });

            function dialogCtrMovie(scope, locals) {
                
                scope.init = function()
                {                   
                    scope.dataMovie = locals.data;                       
                };                

                scope.init();
            }

        }
    }
});



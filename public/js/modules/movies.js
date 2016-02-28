var BMovies = angular.module('bucketMovie.movies', []);

/*
|   Directive for call the popular movies in this case show the carousel
|   This directive need the ng-model with the route template
|   The scope navBanner was defined in the directive list-movies 
|   <call-popular ng-model="navBanner"></call-popular>
|   @attribute ng-model 
|   @return
|*/
BMovies.directive('callPopular', function($location, $timeout, globalServices) {
    return {
        restrict : 'AE',
        scope: {
            ngModel: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) {

            //this scope is used in the directive 
            scope.popular     	= {url: scope.ngModel.template, list: ''};

            //services global for request
            globalServices.globalRequest('/callPopular', '')
            .then(function(res){
                //server return ok
                if(res.validation == 'ok')
                {
                    //the scope with the result data movies
                    scope.popular.list  = res.list.results;
                                        
                }                                
            }, function(err){
                //toast in the service
            });         
            
        },
        //include template
        template: '<div ng-include="popular.url"></div>'
    }
});

/*
|   Directive for call the movies
|   This directive need the ng-model with the route template
|   The scope listMovies was defined state home in the file app.js
|   is required the md-content for the infinite scroll 
|   <md-content list-movies ng-model="listMovies"></md-content>
|   @attribute ng-model 
|   @return
|*/
BMovies.directive('listMovies', function($location, $filter, $timeout, globalServices) {
    return {
        restrict : 'AE',
        scope: {
            ngModel: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) {

            //scope for directive call-popular
            scope.navBanner  =  {template: $filter('url')('headCarousel').url};

            //these scopes are used in the directive 
            scope.list              =  {url: scope.ngModel.template}; 
            scope.listMovies        = [];
            scope.listMoviesActors  = [];
            
            //function for call list
            function BMlist(append_search, searchBy)
            {
                var enter = 0;

                //if append_search is = 'search' this will reset the list 
                //and it will start in the page 1 else incremental the page
                if(append_search == 'search')
                {
                    scope.listMovies                = [];
                    scope.ngModel.page              = 0;
                    scope.ngModel.pages             = 0;
                    scope.ngModel.total             = 0;
                    scope.ngModel.sortActor         = true;
                    scope.ngModel.sortMovieActor    = true;
                    scope.ngModel.actorMovies       = '';

                    var page            = scope.ngModel.page;
                    enter               = 1;
                }
                //continue with the next page
                else
                {
                    var page      = scope.ngModel.page;
                    var pages     = scope.ngModel.pages;
                    //if there is more pages for show 
                    if(page < pages)
                    {
                        enter = 1;
                    }
                    //no more pages
                    else
                    {
                        enter = 0;
                    }
                }

                //if there is more pages for show 
                if(enter == 1)
                {
                    //page incremental
                    page = parseInt(page)+1;

                    //array send
                    var array               = {};
                    array['page']           = page;
                    array['search']         = scope.ngModel.search;
                    array['searchBy']       = searchBy;
                    
                    //services global for request
                    globalServices.globalRequest('/listMovies',array)
                    .then(function(res){
                        if(res.validation == 'ok')
                        {   
                            //list movies
                            scope.listMovies               = globalServices.mergeArray(scope.listMovies, res.list.results);                            
                            //set de vars for infinite scroll
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
                    BMlist('', scope.ngModel.searchBy);
                }
            });

            /*
            | Search
            | when the user finished typing, the search will send the request
            */
            var tempFilterText = '',filterTextTimeout;
            scope.$watch('ngModel.search', function(current, old){


                if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

                tempFilterText      = current;

                filterTextTimeout   = $timeout(function() {
                    scope.ngModel.search = tempFilterText;                    
                    if(current == '' && old != '')
                    {
                        BMlist('search', '');
                    }
                    else if (current != '')
                    {
                        BMlist('search', scope.ngModel.searchBy);
                    }
                }, 1000); // delay 250 ms                               

            })

            scope.$watch('ngModel.searchBy', function(current, old){  
                if(scope.ngModel.search != '')
                {
                    BMlist('search', scope.ngModel.searchBy);
                }
            });    

            BMlist('search', '');
            
        },
        //include template
        template: '<div ng-include="list.url"></div>'
    }
});

/*
|   Directive for call the movie info in a modal
|   This directive need the ng-model with the data movie
|   The scope movie is the result of ng-repeat of list movies
|   <md-button show-more ng-model="movie">Read +</md-button>
|   @attribute ng-model 
|   @return
|*/
BMovies.directive('showTrailer', function($mdDialog, $filter, $sce) {
    return {
        restrict : 'AE',
        scope: {
          ngModelTrailer: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) {            

            //event click button
            element.on('click', function(events) {

                //call the material modal
                $mdDialog.show({
                    controller: dialogCtrTrailer,//require controller
                    templateUrl: $filter('url')('trailerMovie').url,//template
                    parent: angular.element(document.body),//injection
                    targetEvent: events,//event click
                    clickOutsideToClose:true,//this modal will close when the user make click otside
                    locals: {data: scope.ngModelTrailer}//here sent the data movie to controller
                })
                events.stopPropagation();
            });

            //controller modal
            function dialogCtrTrailer(scope, locals) {
                
                //the controller init here
                scope.init = function()
                {            
                    //scope with the data movie       
                    scope.dataTrailer = locals.data;
                };    

                scope.getIframeSrc = function (videoId) {
                    return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
                };            

                //calling the function init
                scope.init();
            }

        }
    }
});

/*
|   Directive for call the movie info and credits
|   This directive need the ng-model with the data movie
|   get-movie ng-model="dataMovie"
|   @attribute ng-model 
|   @return
|*/
BMovies.directive('getMovie', function(globalServices) {
    return {
        restrict : 'AE',
        scope: {
            ngModel: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) {            

            //services global for request
            globalServices.globalRequest('/getMovie', {id: scope.ngModel.dataInit.id})
            .then(function(res){
                //server return ok
                if(res.validation == 'ok')
                {
                    //the scope with the result data movies
                    scope.ngModel.dataMovie     = res.movie;
                    scope.ngModel.dataCredits   = res.credits;                                        
                }                                
            }, function(err){
                //toast in the service
            });  

        }
    }
});

BMovies.directive('movieInfo', function(globalServices, $filter) {
    return {
        restrict : 'AE',
        scope: {
            ngModelMovie: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) { 

            scope.movieInfo = {url: scope.ngModelMovie.template, data: ''}

            //services global for request
            globalServices.globalRequest('/getMovie', {id: scope.ngModelMovie.id})
            .then(function(res){
                //server return ok
                if(res.validation == 'ok')
                {
                    //the scope with the result data person
                    scope.movieInfo.data                = res.data;
                    scope.movieInfo.data.credits.cast   = globalServices.setSortFiels(res.data.credits.cast);
                    scope.movieInfo.data.credits.crew   = globalServices.setSortFiels(res.data.credits.crew);

                    //scope.movieInfo.data.known_for      = globalServices.orderImgTags(res.data.tagImgs.results);

                    scope.sortCredits('', scope.ngModelMovie.sort);
                                                           
                }                                
            }); 

            scope.sortCredits = function($event, sort)
            {

                scope.ngModelMovie.sort = sort;

                switch(scope.ngModelMovie.sortBy)
                {
                    case'chronological':
                        scope.movieInfo.data.credits.cast = $filter('orderBy')(scope.movieInfo.data.credits.cast, 'order', sort)
                        //scope.movieInfo.data.credits.crew = $filter('orderBy')(scope.movieInfo.data.credits.crew, 'dateO', sort)
                    break;
                    case'name':
                        scope.movieInfo.data.credits.cast = $filter('orderBy')(scope.movieInfo.data.credits.cast, 'name', sort)
                        scope.movieInfo.data.credits.crew = $filter('orderBy')(scope.movieInfo.data.credits.crew, 'name', sort)
                    break;
                }

            }

        },
        template: '<div ng-include="movieInfo.url" layout="column" layout-fill></div>'
    }
});

/*
|   Directive for call the movie info and credits
|   This directive need the ng-model with the data movie
|   get-movie ng-model="dataMovie"
|   @attribute ng-model 
|   @return
|*/
BMovies.directive('personInfo', function(globalServices, $filter) {
    return {
        restrict : 'AE',
        scope: {
            ngModelPerson: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) { 

            scope.personInfo = {url: scope.ngModelPerson.template, data: ''}

            //services global for request
            globalServices.globalRequest('/getPerson', {id: scope.ngModelPerson.id})
            .then(function(res){
                //server return ok
                if(res.validation == 'ok')
                {
                    //the scope with the result data person
                    scope.personInfo.data                = res.data;
                    scope.personInfo.data.credits.cast   = globalServices.setSortFiels(res.data.credits.cast);
                    scope.personInfo.data.credits.crew   = globalServices.setSortFiels(res.data.credits.crew);

                    scope.personInfo.data.known_for      = globalServices.orderImgTags(res.data.tagImgs.results);

                    scope.sortCredits('', scope.ngModelPerson.sort);
                                                           
                }                                
            }); 

            scope.sortCredits = function($event, sort)
            {

                scope.ngModelPerson.sort = sort;

                switch(scope.ngModelPerson.sortBy)
                {
                    case'year':
                        scope.personInfo.data.credits.cast = $filter('orderBy')(scope.personInfo.data.credits.cast, 'dateO', sort)
                        scope.personInfo.data.credits.crew = $filter('orderBy')(scope.personInfo.data.credits.crew, 'dateO', sort)
                    break;
                    case'name':
                        scope.personInfo.data.credits.cast = $filter('orderBy')(scope.personInfo.data.credits.cast, 'nameO', sort)
                        scope.personInfo.data.credits.crew = $filter('orderBy')(scope.personInfo.data.credits.crew, 'nameO', sort)
                    break;
                    case'media_type':
                        scope.personInfo.data.credits.cast = $filter('orderBy')(scope.personInfo.data.credits.cast, 'media_type', sort)
                        scope.personInfo.data.credits.crew = $filter('orderBy')(scope.personInfo.data.credits.crew, 'media_type', sort)
                    break;
                }

            }

        },
        template: '<div ng-include="personInfo.url" layout="column" layout-fill></div>'
    }
});

BMovies.directive('personCastCrew', function(globalServices, $filter, $state, $mdDialog) {
    return {
        restrict : 'AE',
        scope: {
            ngModelPersonCastCrew: '=ngModel',
            typeCastCrew: '@personCastCrew'
        },
        link: function (scope, element, attrs, ngModelCtrl) { 

            switch(scope.typeCastCrew)
            {
                case'Acting':
                    scope.castCrew = {url: $filter('url')('personActing').url, data: scope.ngModelPersonCastCrew, filter: ''};
                break;
                case'Production':
                case'Writing':
                case'Directing':
                    scope.castCrew = {url: $filter('url')('personCrew').url, data: scope.ngModelPersonCastCrew, filter: scope.typeCastCrew};
                break;
            }   

            scope.goMovie = function(data)
            {
                if(data.media_type == 'movie')
                {
                    $state.go('home.movie', {id: data.id})
                }
                if(data.media_type == 'tv')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('View no avaliable')
                            .textContent('The view for tv is not avaliable')
                            .ariaLabel('Alert Dialog')
                            .ok('ok')
                    );
                }                   
            }                     

        },
        template: '<div ng-include="castCrew.url"></div>'
    }
});

BMovies.directive('movieCastCrew', function(globalServices, $filter) {
    return {
        restrict : 'AE',
        scope: {
            ngModelMovieCastCrew: '=ngModel',
            typeCastCrew: '@movieCastCrew'
        },
        link: function (scope, element, attrs, ngModelCtrl) { 

            switch(scope.typeCastCrew)
            {
                case'Cast':                    
                    scope.castCrew = {url: $filter('url')('movieCast').url, data: scope.ngModelMovieCastCrew, filter: ''};
                break;
                case'Production':
                case'Writing':
                case'Directing':
                    scope.castCrew = {url: $filter('url')('movieCrew').url, data: scope.ngModelMovieCastCrew, filter: scope.typeCastCrew};
                break;
            }                        

        },
        template: '<div ng-include="castCrew.url"></div>'
    }
});
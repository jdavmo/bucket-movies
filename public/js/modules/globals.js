var BMGlobals = angular.module('bucketMovie.globals', []);

/*
| Directive for close any modal
*/
BMGlobals.directive("closeModal", function($mdDialog) {
    return {
        restrict: "A", // A = Attribute, C = CSS Class, E = HTML Element, M = HTML Comment
        link: function(scope, element, attributes) {
            element.bind("click", function() {
                $mdDialog.hide();
            }); 
        }
    };
});

/*
|   The services globals this service content process used in the module movies   
|*/
BMGlobals.service('globalServices', function globalServices($http, $q, $mdDialog, $mdToast, $filter, $state) {

    //Create object globalServices
    var globalServices = this;    

    /*
    |   Service for get position toast of material.angular
    |   This service return a string
    |   This services need one param type array:
    |   {bottom: true, top: false, left: false, right: true}
    |   @param array
    |   @return string 
    */
    globalServices.getToastPosition = function(array) 
    {

        return Object.keys(array)
          .filter(function(pos) { return array[pos]; })
          .join(' ');

    };

    /*
    |   Service for for show message toast of material.angular
    |   This services need two params:   
    |   @param string string
    |   @return 
    */
    globalServices.showToast = function(msn, pos) 
    {

        $mdToast.show(
            $mdToast.simple()
                .content(msn)
                .position(pos)
                .hideDelay(3000)
        );

    };

    /*
    |   Service for make request to server
    |   This services need two params:   
    |   @param string array
    |   @return promise
    */

    globalServices.globalRequest = function(url, params)
    {
        //object promise
        var defer = $q.defer();

        //request post to server
        $http.post('index.php'+url, params)
        .success(function(res){
            
            //if the result validation is fail show a toast
            if(res.validation == 'fail')
            {                
                var pos = globalServices.getToastPosition({bottom: true, top: false, left: false, right: true});
                globalServices.showToast('Error internal server', pos);                
            }   
            //result         
            defer.resolve(res);
            
        })
        .error(function(err, status){
            //error 500 show a toast
            var pos = globalServices.getToastPosition({bottom: true, top: false, left: false, right: true});
            globalServices.showToast('Error internal server', pos);
            defer.reject(err);
        })

        //return promise
        return defer.promise;
    };

    /*
    |   Service for concat two array
    |   This services need three params:   
    |   @param array array string
    |   @return array
    */
    globalServices.mergeArray = function(rows1, rows2, iniOrend)
    {        
        //count positions for each array
        var cant1 = rows1.length;
        var cant2 = rows2.length;

        //if the first array is empty retun the array 2
        if(cant1 == 0){
            return rows2;
        }

        //if both arrays content data
        if(cant1 > 0 && cant2 > 0)
        {    
            //the second array will be placed at the beginning of the first array
            if(iniOrend == 'ini')
            {
                rows1 = rows2.concat(rows1);
            }
            //the second array will be placed at the end of the first array
            else
            {
                rows1 = rows1.concat(rows2);
            }
            
            //return array concatenated
            return rows1;

        }
        
    }

    /*
    |   Service for evit duplicate movies in array tag imgs
    |   This services need one param:   
    |   @param array
    |   @return array
    */
    globalServices.orderImgTags = function(rows)
    {        
        var array = {};
        //count array
        var cant = rows.length;

        //if the array is empty retun the array
        if(cant == 0){
            return rows;
        }

        //if array content data
        if(cant > 0)
        {    
            //for each array tags imgs
            angular.forEach(rows, function(value, key) 
            {                
                //if the movie is not declared in the array insert
                if(array[value.media.id] == undefined)
                {
                    array[value.media.id] = value;
                }

            });

            //return array img without movies dupicates
            return array;

        }
        
    }

    /*
    |   Service for set values dateO and nameO this is for 
    |   equalize the date and name of movies and tv 
    |   This services need one param:   
    |   @param array
    |   @return array
    */
    globalServices.setSortFiels = function(rows)
    {
 
        //if rows is empty return rows
        if(rows.length == 0){
            return rows;
        }
       
        var i = 0;
        //for each rows
        angular.forEach(rows, function(value, key)
        {
            //si media type is movie
            if(value.media_type == 'movie')
            {
                if(value.release_date == '' || value.release_date == null)
                {
                    //set date
                    value['dateO'] = '1900-01-01';
                }
                else
                {
                    //set date
                    value['dateO'] = value.release_date;
                }
                //set name
                value['nameO'] = value.title;                
                i++;                 
            }
            //if media type is tv
            else if(value.media_type == 'tv')
            {
                
                if(value.first_air_date == '' || value.first_air_date == null)
                {
                    //set date
                    value['dateO'] = '1900-01-01';
                }
                else
                {
                    //set date
                    value['dateO'] = value.first_air_date;
                }
                //set name    
                value['nameO'] = value.name;                  
                i++;
            }
            //if media type is undefined
            else
            {
                if(value.release_date == '' || value.release_date == null)
                {
                    //set date
                    value['dateO'] = '1900-01-01';
                }
                else
                {   //set date
                    value['dateO'] = value.release_date;
                }
                //set name
                value['nameO']      = value.title;
                //set media type
                value['media_type'] = 'movie';
                i++;
            }
             
        });
    
        //return array
        return rows;
 
    }
    
});
var BMGlobals = angular.module('bucketMovie.globals', []);

BMGlobals.controller('validationBottomSheetCtrl', ['$scope', 'locals', function($scope, locals) {
    $scope.init = function()
    {
        $scope.msn = locals.data;
    }

    $scope.init();
}]);

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

BMGlobals.service('globalServices', function globalServices($http, $q, $mdDialog, $rootScope, $mdToast, $filter, $mdBottomSheet, $state) {

    var globalServices = this;
    globalServices.validation           = {"arr": ''};



    globalServices.getToastPosition = function(array) 
    {

        return Object.keys(array)
          .filter(function(pos) { return array[pos]; })
          .join(' ');

    };

    globalServices.showToast = function(msn, pos) 
    {

        $mdToast.show(
            $mdToast.simple()
                .content(msn)
                .position(pos)
                .hideDelay(3000)
        );

    };

    globalServices.showToastLoading = function(msn, pos) 
    {

        $mdToast.show(
            $mdToast.simple()
                .content(msn)
                .position(pos)
                .hideDelay(2000)
        );

    };

    globalServices.hideToastLoading = function() 
    {

        $mdToast.hide();

    };

    globalServices.globalRequest = function(url, array)
    {
        var defer = $q.defer();

        /*var element = document.querySelector('meta[name="csrf-token"]');
        var content = element && element.getAttribute("content");
        array['_token'] = content;
        , {headers: {'X-XSRF-TOKEN': content, '_token': content}}*/        

        $http.post('index.php'+url, array)
        .success(function(res){
            
            if(res.validation == 'fail')
            {                

                $mdBottomSheet.show({
                    templateUrl: $filter('url')('validationButtonSheet').url,
                    controller: 'validationBottomSheetCtrl',
                    /*targetEvent: ev,*/
                    locals: {data: res.msn}
                }).then(function(clickedItem) {
                    
                });
            }            
            defer.resolve(res);
            
        })
        .error(function(err, status){
            var pos = globalServices.getToastPosition({bottom: true, top: false, left: false, right: true});
            globalServices.showToast('Error internal server', pos);
            defer.reject(err);
        })

        return defer.promise;
    };

    globalServices.mergeArray = function(rows1, rows2, iniOrend)
    {        

        var cant1 = rows1.length;
        var cant2 = rows2.length;

        if(cant1 == 0){
            return rows2;
        }

        if(cant1 > 0 && cant2 > 0)
        {    
            if(iniOrend == 'ini')
            {
                rows1 = rows2.concat(rows1);
            }
            else
            {
                rows1 = rows1.concat(rows2);
            }
            
            return rows1;

        }
        
    }

    globalServices.orderArrayDate = function(rows, field, order)
    {

        var array = {};
        var date = '';

        //Organizar el array por la fecha mas nueva de priemar
        if(order == 'asc')
        {
            rows.sort(function(a,b){
                return new Date(a[field]) - new Date(b[field]);
            });
        }
        else
        {
            rows.sort(function(a,b){
                return new Date(b[field]) - new Date(a[field]);
            });
        }
                
        return rows;

    }

    globalServices.orderArrayMovies = function(rows)
    {

        var array = [];
      
        var i = 0;
        angular.forEach(rows, function(value, key)
        {
            if(value.media_type == 'person')
            {
                angular.forEach(value.known_for, function(valuePerson, keyPerson)
                {
                    array[i]         = valuePerson;
                   
                    if(valuePerson.media_type == 'movie'){
                        array[i]['date'] = valuePerson.release_date;    
                    }
                    if(valuePerson.media_type == 'tv'){
                        array[i]['date'] = valuePerson.first_air_date;    
                    }
                    
                    i++;
                })
            }
            else if(value.media_type == 'movie')
            {
                array[i]         = value;
                array[i]['date'] = value.release_date;
                i++;
            }
            else if(value.media_type == 'tv')
            {
                array[i]         = value;
                array[i]['date'] = value.first_air_date;
                i++;
            }
            else
            {
                array[i]                = value;
                array[i]['date']        = value.release_date;
                array[i]['media_type']  = 'noDefined';
                i++;
            }
            
        });

                
        return array;

    }

});
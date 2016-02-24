bucketMovies.filter('url', function() {
    return function(id) {

        var i = 4;
        var urls =
        {
            headCarousel:    { clase: '', id: '', url: 'templates/head/headCarousel.html?i='+i},
            listMovies:      { clase: '', id: '', url: 'templates/list/listMovies.html?i='+i},
            infoMovie:       { clase: '', id: '', url: 'templates/modal/infoMovie.html?i='+i},
        };
        return urls[id];
    };
});

bucketMovies.filter('icon', function() {
    return function(colection, icon) {  
        return 'www/lib/material-design-icons/'+colection+'/svg/production/ic_'+icon+'_24px.svg';
    };
});

bucketMovies.filter('DateStringToFormat', function($filter) {
    return function(date) {        
        if(date == '' || date == undefined || date == null)
        {
            date = moment()._d;
        }
        return Date.parse($filter('date')(moment(date)));
    }
});
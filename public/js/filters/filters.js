/*
|   Filter for centralize all urls templates
|   This filter return an array with url template
|   This filter need one param:
|   @param id 
|   @return array 
|*/
bucketMovies.filter('url', function() {
    return function(id) {

        //var i: it is for change versions templates
        var i = 4;

        //var urls: save the urls templates
        var urls =
        {
            headCarousel:    { clase: '', id: '', url: 'templates/head/headCarousel.html?i='+i},
            listMovies:      { clase: '', id: '', url: 'templates/list/listMovies.html?i='+i},
            infoMovie:       { clase: '', id: '', url: 'templates/modal/infoMovie.html?i='+i},
            cardMovie:       { clase: '', id: '', url: 'templates/cards/cardMovie.html?i='+i},
            cardPerson:      { clase: '', id: '', url: 'templates/cards/cardPerson.html?i='+i},
            cardTv:          { clase: '', id: '', url: 'templates/cards/cardTv.html?i='+i},
            personContent:   { clase: '', id: '', url: 'templates/person/personContent.html?i='+i},
            personCrew:      { clase: '', id: '', url: 'templates/person/personCrew.html?i='+i},
            personActing:    { clase: '', id: '', url: 'templates/person/personActing.html?i='+i},
        };
        //return array with the template required
        return urls[id];
    };
});

/*
|   Filter for calling icons material-design-icons
|   This filter return the route svg icon
|   This filter need two params:
|   @param colection icon 
|   @return string 
|*/
bucketMovies.filter('icon', function() {
    return function(colection, icon) {  
        return 'bower_components/material-design-icons/'+colection+'/svg/production/ic_'+icon+'_24px.svg';
    };
});

/*
|   Filter for get date
|   This filter return date in format javascript
|   This filter need one param:
|   @param date (string) 
|   @return date
|*/
bucketMovies.filter('DateStringToFormat', function($filter) {
    return function(date) {   
        //if the param arrive empty, this set the date current     
        if(date == '' || date == undefined || date == null)
        {
            date = moment()._d;
        }
        //return date format
        return Date.parse($filter('date')(moment(date)));
    }
});

bucketMovies.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
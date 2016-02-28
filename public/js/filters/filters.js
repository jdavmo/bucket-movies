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
            headCarousel:    { class: '', id: '', url: 'templates/head/headCarousel.html?i='+i},
            listMovies:      { class: '', id: '', url: 'templates/list/listMovies.html?i='+i},
            trailerMovie:    { class: '', id: '', url: 'templates/modal/trailerMovie.html?i='+i},
            cardMovie:       { class: '', id: '', url: 'templates/cards/cardMovie.html?i='+i},
            cardPerson:      { class: '', id: '', url: 'templates/cards/cardPerson.html?i='+i},
            cardTv:          { class: '', id: '', url: 'templates/cards/cardTv.html?i='+i},
            personContent:   { class: '', id: '', url: 'templates/person/personContent.html?i='+i},
            personCrew:      { class: '', id: '', url: 'templates/person/personCrew.html?i='+i},
            personActing:    { class: '', id: '', url: 'templates/person/personActing.html?i='+i},
            movieContent:    { class: '', id: '', url: 'templates/movie/movieContent.html?i='+i},
            movieCast:       { class: '', id: '', url: 'templates/movie/movieCast.html?i='+i},
            movieCrew:       { class: '', id: '', url: 'templates/movie/movieCrew.html?i='+i},
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
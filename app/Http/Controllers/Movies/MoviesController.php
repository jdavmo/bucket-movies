<?php
/**
 * This file is part of the BucketMovies Application.
 *
 *
 * @author Julian David G Moreno <jdavmo75@gmail.com>
 * @copyright (c) 2016, Julian Moreno
 * @version 0.0.1
 */
namespace App\Http\Controllers\Movies;

use Validator;
use Illuminate\Http\Request;
use Tmdb\Laravel\Facades\Tmdb;

use App\Http\Requests;
use App\Http\Controllers\Controller;

/*
|-------------------------------------------------------------
|   Movies you can use with Tmdb::getMoviesApi() 
|   For more info /vendor/php-tmdb/api/lib/Tmdb/Api/Movies.php
|-------------------------------------------------------------
|    FUNCTIONS
|    getMovie
|    getAlternativeTitles
|    getCredits
|    getImages
|    getKeywords
|    getReleases
|    getTrailers
|    getTranslations
|    getSimilar
|    getReviews
|    getLists
|    getChanges
|    getLatest
|    getUpcoming
|    getNowPlaying
|    getPopular
|    getTopRated
|    getAccountStates
|    rateMovie
|    getVideos
|-------------------------------------------------------------
|   People you can use with Tmdb::getPeopleApi() 
|   For more info /vendor/php-tmdb/api/lib/Tmdb/Api/People.php
|-------------------------------------------------------------
|    FUNCTIONS
|    getPerson
|    getCredits
|    getMovieCredits
|    getTvCredits
|    getCombinedCredits
|    getImages
|    getChanges
|    getExternalIds
|    getTaggedImages
|    getPopular
|    getLatest
|-------------------------------------------------------------
|   Search you can use with Tmdb::getSearchApi() 
|   For more info /vendor/php-tmdb/api/lib/Tmdb/Api/Search.php
|-------------------------------------------------------------
|    FUNCTIONS
|    searchMovies
|    searchCollection
|    searchTv
|    searchPersons
|    searchList
|    searchCompany
|    searchKeyword
|    searchMulti
|
*/

class MoviesController extends Controller
{
    /*
    | first and unique view
    */
    public function index()
    {
        //show view
        return view('welcome');
    }

    /*
    | calling the popular movies
    | @params
    | @return array
    */
    public function popular()
    {             
        try
        {
            //return validation ok with the popular movies 
            return array('validation' => 'ok', 'list' => Tmdb::getMoviesApi()->getPopular());
        } catch (Exception $e) {
            //return validation fail with the error
            return array('validation' => 'fail', 'msn' => $e);
        }
    }

    /*
    | calling expecific movie
    | @params id
    | @return array
    */
    public function getMovie(Request $request)
    {     
        //validation id
        $messages = [
            'id.required'    => 'Error in sent data',
        ];
        $rules = [
            "id" => "required",
        ];

        $validator = Validator::make($request->all(), $rules, $messages );
        if ($validator->fails())
        { 
            //$messages = $validator->messages();
            return array('validation' => 'fail', 'msn' => 'Error in sent data');
        }

        //get id movie
        $id = $request->input('id');

        try{
            //get movie
            $movie   = Tmdb::getMoviesApi()->getMovie($id);
            //get credits
            $credits = Tmdb::getMoviesApi()->getCredits($id);
            //return validation ok with the movie and credits
            return array('validation' => 'ok', 'movie' => $movie, 'credits' => $credits);

        } catch (Exception $e) {
            //return validation fail with the error
            return array('validation' => 'fail', 'msn' => $e);
        }
        
    }

    /*
    | calling expecific persor
    | @params id
    | @return array
    */
    public function getPerson(Request $request)
    {     
        //validation id
        $messages = [
            'id.required'    => 'Error in sent data',
        ];
        $rules = [
            "id" => "required",
        ];

        $validator = Validator::make($request->all(), $rules, $messages );
        if ($validator->fails())
        { 
            //$messages = $validator->messages();
            return array('validation' => 'fail', 'msn' => 'Error in sent data');
        }

        //get id person
        $id = $request->input('id');

        try{
            //get person
            $person     = Tmdb::getPeopleApi()->getPerson($id);
            $credits    = Tmdb::getPeopleApi()->getCombinedCredits($id);
            $images     = Tmdb::getPeopleApi()->getImages($id);
            $tagImgs    = Tmdb::getPeopleApi()->getTaggedImages($id);
                    
            //return validation ok with the person
            return array('validation' => 'ok', 'data' => ['person' => $person, 'credits' => $credits, 'images' => $images, 'tagImgs' => $tagImgs]);

        } catch (Exception $e) {
            //return validation fail with the error
            return array('validation' => 'fail', 'msn' => $e);
        }
        
    }

    /*
    | calling list movies popular or person
    | @params search page but is not required
    | @return array
    */
    public function listMovies(Request $request)
    {        
        try{

            if($request->input('search'))
            {    
                switch ($request->input('searchBy')) {
                    case 'person':
                        //return validation ok with the person   
                        return array('validation' => 'ok', 'list' => Tmdb::getSearchApi()->searchPersons($request->input('search'), array('page' => $request->input('page'))));
                    break;
                    case 'movie':
                        //return validation ok with the movies   
                        return array('validation' => 'ok', 'list' => Tmdb::getSearchApi()->searchMovies($request->input('search'), array('page' => $request->input('page'))));
                    break;
                    case 'tv':
                        //return validation ok with the person movies   
                        return array('validation' => 'ok', 'list' => Tmdb::getSearchApi()->searchTv($request->input('search'), array('page' => $request->input('page'))));
                    break;                    
                    default:
                        //return validation ok with the popular movies
                        return array('validation' => 'ok', 'list' => Tmdb::getMoviesApi()->getPopular(array('page' => $request->input('page'))));
                    break;
                }                
            }
            else
            {
                //return validation ok with the popular movies
                return array('validation' => 'ok', 'list' => Tmdb::getMoviesApi()->getPopular(array('page' => $request->input('page'))));
            }

        } catch (Exception $e) {
            //return validation fail with the error
            return array('validation' => 'fail', 'msn' => $e);
        }    
    }
}

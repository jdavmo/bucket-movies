<?php

namespace App\Http\Controllers\Movies;

use Validator;
use Illuminate\Http\Request;
use Tmdb\Laravel\Facades\Tmdb;

use App\Http\Requests;
use App\Http\Controllers\Controller;

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
                        //return validation ok with the person movies   
                        return array('validation' => 'ok', 'list' => Tmdb::getSearchApi()->searchPersons($request->input('search'), array('page' => $request->input('page'))));
                    break;
                    case 'movie':
                        //return validation ok with the person movies   
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

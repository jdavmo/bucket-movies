<?php

namespace App\Http\Controllers\Movies;

use Validator;
use Illuminate\Http\Request;
use Tmdb\Laravel\Facades\Tmdb;
use Tmdb\Helper\ImageHelper;
use Tmdb\Repository\MovieRepository;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class MoviesController extends Controller
{
    private $movies;
    private $helper;

    function __construct(MovieRepository $movies, ImageHelper $helper)
    {
        $this->movies = $movies;
        $this->helper = $helper;
    }

    public function index()
    {
        return view('welcome');
    }

    public function popular()
    {                   
        return array('validation' => 'ok', 'list' => Tmdb::getMoviesApi()->getPopular());
    }

    public function listMovies(Request $request)
    {        
        if($request->input('search'))
        {            
            return array('validation' => 'ok', 'list' => Tmdb::getSearchApi()->searchMulti($request->input('search'), array('page' => $request->input('page'), 'year' => '2010')));     
        }
        else
        {
            return array('validation' => 'ok', 'list' => Tmdb::getMoviesApi()->getPopular(array('page' => $request->input('page'))));
        }        
    }

    public function getImg($id, $quality, $type, $width, $height)
    {   
    	$movie = Tmdb::getMoviesApi()->getMovie($id);

    	if($type == 'backdrop')
    	{
    		echo ($this->helper->getHtml($movie['backdrop_path'], $quality, $width, $height));    		
    	}
    	else if($type == 'poster')
    	{
    		echo ($this->helper->getHtml($movie['poster_path'], $quality, $width, $height));
    	}    		       
    }
}

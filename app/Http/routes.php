<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/



/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
	//route index this the first show
   	Route::get('/', 'Movies\MoviesController@index');
   	//movies popular
	Route::post('callPopular', 'Movies\MoviesController@popular');
	//multi movies
	Route::post('listMovies', 'Movies\MoviesController@listMovies'); 
	//get data movie && and credits
	Route::post('getMovie', 'Movies\MoviesController@getMovie');
	//get data person
	Route::post('getPerson', 'Movies\MoviesController@getPerson');
	
});
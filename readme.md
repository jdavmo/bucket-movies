# BucketMovies

Bucket movies is an application that allows you to search for popular movies. you can also  search the movies of your favourite actor, this application was made as a developer test for the company Alert Logit Inc. 

This application was made using Laravel Framework 5.2 and Angularjs 1.5, I used these frameworks because are powerfull and optimized.

## Official website

[BucketMovies website](http://bucketapps.co).

## License

The BucketMovies is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

## Install

In the app folder execute in the terminal

```bash
$ composer install
```
in the /public folder execute 

```bash
$ bower install 
```
Make sure you have permissions

You need permissions -R 777 in the folder /storage

## Configuration

Yo need create the file .env in the folder aplication, with the next values.

```bash
APP_ENV=local
APP_DEBUG=true
APP_KEY=SomeRandomString

TMDB_KEY=SomeKeyHere

DB_HOST=127.0.0.1
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_DRIVER=sync

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_DRIVER=smtp
MAIL_HOST=mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```
Now execute in the foldel application 

```bash
$ php artisan key:generate 
```

This response

```bash
Application key [mQXLGJ4QHxc3TnmFlO0sQAKvmQzKl8h4] set successfully.
```
You don't need copy and paste the key in the .env file because artisan already made it, check the file

Now you need create un api key in (https://www.themoviedb.org), copy the key from themoviedb and paste in
the .env file

```bash
TMDB_KEY=9127c87exxxxxxxb1b33c0d32bcb2db09
```

Enjoy it
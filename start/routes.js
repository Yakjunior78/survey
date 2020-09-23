'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome');

Route.group( () => {
	Route.post('test', 'TestController.publish');
	Route.post('send', 'TestController.sendSms');
	Route.get('token', 'TestController.token');
}).prefix('api');

Route.group( () => {
	Route.post('/surveys', 'SurveysController.store');
	Route.post('/surveys/initiate', 'SurveysController.initiate');
	Route.resource('/instances', 'InstanceController');
	Route.post('/instances/initialize', 'InstanceController.initialize');
}).prefix('api');

Route.group( () => {
	Route.post('/response', 'ResponsesController.handle');
}).prefix('api');
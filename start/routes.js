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
	/**
	 * Survey
	 */
	Route.resource('/surveys', 'SurveysController');
	
	/**
	 * Instance, Statistics
	 */
	Route.resource('/instances', 'InstanceController');
	
	Route.get('/instance/:id/dispatch', 'InstanceController.dispatch');
	
	Route.post('/instances/initialize', 'InstanceController.initialize');
	Route.post('/statistics', 'StatisticsController.instance');
	
	/**
	 * Questions, Choices, Ratings, Conditions, Ranks
	 */
	Route.resource('/questions', 'QuestionsController');
	Route.resource('/question-choices', 'ChoicesController');
	Route.resource('/question-max-rating', 'RatingsController');
	Route.resource('/question-conditions', 'ConditionsController');
	Route.post('/questions/update-rank', 'QuestionsController.updateRank');
	
	/**
	 * Categories, Operands, Channels, Statuses
	 */
	Route.resource('/categories', 'CategoryController');
	Route.resource('/operands', 'OperandsController');
	Route.resource('/channels', 'ChannelsController');
	Route.resource('/statuses', 'StatusesController');
	
	/**
	 * Question types
	 */
	Route.get('/question-types', 'QuestionTypesController.all');
}).prefix('api');

Route.group( () => {
	/**
	 * Response hook
	 */
	Route.post('/response', 'ResponsesController.handle');
}).prefix('api');

Route.group( () => {
	/**
	 * Response hook
	 */
	Route.get('/senders', 'SendersController.index');
}).prefix('api');


Route.group( () => {
	/**
	 * Test routes
	 */
	Route.post('test', 'TestController.publish');
	Route.post('send', 'TestController.sendSms');
	Route.get('token', 'TestController.token');
}).prefix('api');
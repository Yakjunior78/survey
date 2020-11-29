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
	Route.resource('/surveys', 'SurveysController');
	
	Route.resource('/instances', 'InstanceController');
	
	Route.post('/instances/initialize', 'InstanceController.initialize');
	Route.post('/statistics', 'StatisticsController.instance');

	Route.resource('/questions', 'QuestionsController');
	Route.resource('/question-choices', 'ChoicesController');
	Route.resource('/question-max-rating', 'RatingsController');
	Route.resource('/question-conditions', 'ConditionsController');
	Route.post('/questions/update-rank', 'QuestionsController.updateRank');

	Route.resource('/categories', 'CategoryController');
	Route.resource('/operands', 'OperandsController');
	Route.resource('/channels', 'ChannelsController');
	Route.get('/interaction-modes', 'ChannelsController.interactionModes');
	Route.resource('/statuses', 'StatusesController');
	
	Route.get('/question-types', 'QuestionTypesController.all');
}).prefix('api');

Route.group( () => {
	Route.get('/instance/:id/dispatch', 'DispatchSurveyController.dispatch');
}).prefix('api');

Route.group( () => {
	Route.post('/response', 'ResponsesController.handle');
}).prefix('api');

Route.group( () => {
	Route.get('/senders', 'SendersController.index');
}).prefix('api');


Route.group( () => {
	Route.post('test', 'TestController.publish');
	Route.get('session/:id', 'TestController.createSession');
	Route.post('send', 'TestController.sendSms');
	Route.get('token', 'TestController.token');
}).prefix('api');
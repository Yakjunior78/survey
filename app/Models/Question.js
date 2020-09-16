'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Question extends Model {
	
	instances() {
		return this.belongsToMany('App/Models/Instances');
	}
	
	conditions() {
		return this.hasMany('App/Models/Condition');
	}
	
	choices() {
		return this.hasMany('App/Models/Choice');
	}
	
	inputTypes() {
		return this.hasMany('App/Models/InputType')
	}
	
	responses() {
		return this.hasMany('App/Models/Response');
	}
	
	type() {
		return this.belongsTo('App/Models/QuestionType');
	}
}

module.exports = Question

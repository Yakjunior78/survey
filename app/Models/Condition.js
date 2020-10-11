'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Condition extends Model {
	
	operand() {
		return this.belongsTo('App/Models/Operand');
	}
	
	question() {
		return this.belongsTo('App/Models/Question');
	}
	
	nextQuestion() {
		return this.belongsTo('App/Models/Question', 'next_question_id');
	}
}

module.exports = Condition

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
}

module.exports = Condition

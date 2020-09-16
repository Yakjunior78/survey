'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Response extends Model {
	question() {
		return this.belongsTo('App/Models/Question');
	}
	
	contact() {
		return this.belongsTo('App/Models/Contact');
	}
}

module.exports = Response

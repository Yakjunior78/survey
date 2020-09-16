'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Session extends Model {
	instance() {
		return this.belongsTo('App/Models/Instance');
	}
	
	status() {
		this.belongsTo('App/Models/Status');
	}
}

module.exports = Session

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Survey extends Model {
	
	instances() {
		return this.hasMany('App/Models/Instance');
	}
	
	category() {
		return this.belongsTo('App/Models/Category');
	}
}

module.exports = Survey

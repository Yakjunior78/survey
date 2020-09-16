'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Instance extends Model {
	survey() {
		return this.belongsTo('App/Models/Survey');
	}
	
	questions() {
		return this.belongsToMany('App/Modules/Question');
	}
	
	sessions() {
		return this.hasMany('App/Modules/Session');
	}
	
	channel() {
		return this.belongsTo('App/Models/Channel');
	}
}

module.exports = Instance

'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Instance extends Model {
	
	static boot() {
		super.boot();
		this.addHook("beforeCreate", "UuidHook.generateUuid");
	}
	
	survey() {
		return this.belongsTo('App/Models/Survey');
	}
	
	questions() {
		return this.belongsToMany('App/Models/Question').withTimestamps();
	}
	
	sessions() {
		return this.hasMany('App/Models/Session');
	}
	
	channel() {
		return this.belongsTo('App/Models/Channel');
	}
	
	status() {
		return this.belongsTo('App/Models/Status');
	}
}

module.exports = Instance

'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Session extends Model {
	
	static boot() {
		super.boot();
		this.addHook("beforeCreate", "UuidHook.generateUuid");
	}
	
	static get deleteTimestamp () {
		return null
	}
	
	instance() {
		return this.belongsTo('App/Models/Instance');
	}
	
	contact() {
		return this.belongsTo('App/Models/Contact');
	}
	
	sender() {
		return this.belongsTo('App/Models/Sender');
	}
	
	status() {
		return this.belongsTo('App/Models/Status');
	}
	
	sessionTrails() {
		return this.hasMany('App/Models/SessionTrail');
	}
	
	question() {
		return this.belongsTo('App/Models/Question');
	}
	
	responses() {
		return this.belongsTo('App/Models/Response');
	}
}

module.exports = Session

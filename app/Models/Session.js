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
	
	question() {
		return this.belongsTo('App/Models/Question');
	}
	
	status() {
		return this.belongsTo('App/Models/Status');
	}
}

module.exports = Session

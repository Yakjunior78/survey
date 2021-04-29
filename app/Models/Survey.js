'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Survey extends Model {

	static boot() {
		super.boot();
		this.addHook("beforeCreate", "UuidHook.generateShorterUuid");
	}

	static get deleteTimestamp () {
		return null
	}

	instances() {
		return this.hasMany('App/Models/Instance');
	}

	questions() {
		return this.hasMany('App/Models/Question');
	}

	category() {
		return this.belongsTo('App/Models/Category');
	}

	status() {
		return this.belongsTo('App/Models/Status');
	}

	company() {
		return this.belongsTo('App/Models/Company');
	}
}

module.exports = Survey

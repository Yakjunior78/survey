'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SessionTrail extends Model {
	question() {
		return this.belongsTo('App/Models/Question');
	}
}

module.exports = SessionTrail;
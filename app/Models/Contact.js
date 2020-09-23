'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Contact extends Model {
	
	static boot() {
		super.boot();
		this.addHook("beforeCreate", "UuidHook.generateShorterUuid");
	}
	
	group() {
		return this.belongsTo('App/Models/Group');
	}
}

module.exports = Contact

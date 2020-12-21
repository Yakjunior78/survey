'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Interaction extends Model {
	
	channel()
	{
		return this.belongsTo('App/Models/Channel');
	}
}

module.exports = Interaction

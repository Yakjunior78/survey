'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Question extends Model {

	static boot() {
		super.boot();
		this.addHook("beforeCreate", "UuidHook.generateShorterUuid");
	}

	instances() {
		return this.belongsToMany('App/Models/Instances');
	}

	conditions() {
		return this.hasMany('App/Models/Condition');
	}

	choices() {
		return this.hasMany('App/Models/Choice');
	}

	inputType() {
		return this.belongsTo('App/Models/InputType')
	}

	responses() {
		return this.hasMany('App/Models/Response');
	}

	type() {
		return this.belongsTo('App/Models/QuestionType');
	}
}

module.exports = Question

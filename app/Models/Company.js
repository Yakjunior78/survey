'use strict';

const Hash = use('Hash');

const Model = use('Model');

class Company extends Model {
	senders() {
		return this.belongsToMany('App/Models/Sender');
	}
}

module.exports = Company;
const auth = new(use('App/Services/Billing/Auth'))();
const Database = use('Database');

class Account {
	
	async handle(user)
	{
		let token = await auth.token ();
		
		let customer = await this.customer(user);
	}
	
	async customer(user)
	{
		let account = await Database.connection('mysqlAuth')
			.table('account_billings')
			.where('account', user.account)
			.first();

		console.log(account)
	}
}

module.exports = Account;
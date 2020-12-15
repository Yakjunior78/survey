const auth = new(use('App/Services/Billing/Auth'))();
const Database = use('Database');
const axios = use('axios');
const Env = use('Env');

class Account {
	
	async handle(user)
	{
		let token = await auth.token ();
		
		let account = await this.get(user);
		
		if(!account) {
			return null;
		}
		
		return account;
	}
	
	async get(user)
	{
		return await Database.connection('mysqlAuth')
			.table('account_billings')
			.where('account', user.customer_account)
			.first();
	}
	
	async update(account, prePayment)
	{
		await Database.connection ('mysqlAuth')
			.table ('account_billings')
			.where ('id', account.id)
			.update ({ 'prepayment_id': prePayment.id });
	}
}

module.exports = Account;
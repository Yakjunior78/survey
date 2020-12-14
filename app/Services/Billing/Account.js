const auth = new(use('App/Services/Billing/Auth'))();
const Database = use('Database');

class Account {
	
	async handle(user)
	{
		let token = await auth.token ();
		
		let account = await this.get(user);
		
		if(!account) {
			account = await this.create(user);
		}
		
		console.log(account, 'this is the account');
	}
	
	async get(user)
	{
		return await Database.connection('mysqlAuth')
			.table('account_billings')
			.where('account', user.customer_account)
			.first();
	}
	
	async create(user)
	{
		let data = await this.data(user);
		console.log(data, 'this is the data');
	}
	
	async data(user)
	{
		return {
			"name": user.name,
			"currency_id": "8",
			"company_id": "1",
			"customer_account": user.customer_account,
			"email": user.email,
			"phone": user.phone_number,
			"company_name": "Emalify Company",
			"contact_name": user.phone_number,
			"website": "",
			"enable_portal": "1",
			"addresses": {
				"billing": {
					"name": user.name,
					"address_street_1": "123",
					"address_street_2": "123",
					"city": "Nairobi",
					"state": "Nairobi",
					"country_id": "113",
					"zip": user.phone_number,
					"phone": user.phone_number,
					"type": "billing"
				},
				"shipping": {
					"name": user.name,
					"address_street_1": "123",
					"address_street_2": "123",
					"city": "Nairobi",
					"state": "Nairobi",
					"country_id": "113",
					"zip": user.phone_number,
					"phone": user.phone_number,
					"type": "shipping"
				}
			}
		}
	}
}

module.exports = Account;
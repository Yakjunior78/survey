const Database = use('Database');

class Plan {
	async store(account, subscription)
	{
		console.log('we are here at the plan')
		let data = await this.data(account, subscription);
		
		console.log(data, 'this is the data');
		
		return Database
			.connection ('mysqlAuth')
			.table ('plans')
			.insert (data);
	}
	
	async data(account, subscription)
	{
		return {
			plan_id: 12,
			name: 'Prepaid',
			slug: '',
			description: 'Pre payment plan for surveys',
			customer_id: account.customer_id,
			subscription_id: subscription.id,
			amount: 0,
			item_id: 1,
			network: null
		}
	}
}

module.exports = Plan;
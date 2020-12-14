const Database = use('Database');
const moment = use('moment');

class Plan {
	async store(account, subscription)
	{
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
			slug: 'prepaid',
			description: 'Pre payment plan for surveys',
			customer_id: account.customer_id,
			subscription_id: subscription.id,
			amount: 0,
			item_id: 1,
			network: null,
			created_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
			updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
		}
	}
}

module.exports = Plan;
const Database = use('Database');
const moment = use('moment');
const Env = use('Env');

class Plan {
	
	async store(account, subscription)
	{
		let data = await this.data(account, subscription);
		
		return Database
			.connection ('mysqlAuth')
			.table ('plans')
			.insert (data);
	}
	
	async data(account, subscription)
	{
		return {
			plan_id: Env.get('BILLING_PRE_PAYMENT_PLAN_ID'),
			name: 'Prepaid',
			slug: 'prepaid',
			description: 'Pre payment plan for emalify surveys',
			customer_id: account.customer_id,
			subscription_id: subscription.id,
			amount: 4,
			item_id: 1,
			network: null,
			created_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
			updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
		}
	}
}

module.exports = Plan;
const Database = use('Database');

class Plan {
	async create(account, subscription)
	{
		return Database
			.connection ('mysqlAuth')
			.table ('plans')
			.insert ({
				plan_id: 12,
				name: 'Prepaid',
				slug: '',
				description: 'Pre payment plan for surveys',
				customer_id: account.customer_id,
				subscription_id: subscription.id,
				amount: 0,
				item_id: 1,
				network: null,
				created_at: Date.now (),
				updated_at: Date.now ()
			});
	}
}

module.exports = Plan;
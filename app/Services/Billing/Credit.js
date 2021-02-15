const auth = new(use('App/Services/Billing/Auth'))();
const axios = use('axios');
const Database = use('Database');
const Env = use('Env');
const moment = use('moment');

class Credit {
	
	async handle(plan, quantity, description)
	{
		let data = await this.data(plan, quantity, description);
		
		console.log('BILLING INSTANCE: ', data, 'this is the billing data');
		
		return axios.post (
			Env.get ('BILLING_URL') + '/api/usages',
				data,
				{
					headers: {
						Accept: 'application/json',
						Authorization: 'Bearer '+ await auth.token(),
						company: 1
					}
				})
				.then ( (data) => {
					console.log('BILLING SYSTEM RESPONSE', data, 'this is the result');
					return data;
				})
				.catch ((err) => {
					console.log('BILLING SYSTEM RESPONSE', err, 'this is the error');
					return null;
				});
	}
	
	async data(plan, quantity, description)
	{
		return {
			"subscription_id": plan.subscription_id,
			"company_id": "1",
			"unique_id": Math.random(64),
			"breakdown": [
				{
					"plan_id": plan.plan_id,
					"quantity": quantity
				}
			],
			"timestamp": (moment(Date.now()).unix()).toString(),
			"description": description,
			"metadata": {}
		}
	}
}

module.exports = Credit;
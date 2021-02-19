const auth = new(use('App/Services/Billing/Auth'))();
const axios = use('axios');
const Database = use('Database');
const Env = use('Env');
const moment = use('moment');

const { randId } = use('App/Helpers/Emalify');

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
					ContentType: 'application/json',
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
		let now = new Date();
		
		now.setHours( now.getHours() + 3 );
		
		console.log('DEDUCT RESOURCE: ', now, 'this is the date on resource deduction');
		
		return {
			"subscription_id": (plan.subscription_id).toString(),
			"company_id": "1",
			"unique_id": (await randId()+'-'+await randId()).toString(),
			"breakdown": [
				{
					"plan_id": plan.plan_id.toString(),
					"quantity": quantity.toString()
				}
			],
			"timestamp": (moment(now).unix()).toString(),
			"description": description,
			"metadata": {}
		}
	}
}

module.exports = Credit;
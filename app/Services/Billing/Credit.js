const auth = new(use('App/Services/Billing/Auth'))();
const axios = use('axios');
const Database = use('Database');
const customId = use("custom-id");

class Credit {
	
	async handle(plan, quantity, description)
	{
		let data = await this.data(plan, quantity, description);
		
		console.log(data, 'this is the usage amount');
		
		return axios.post (
			Env.post ('BILLING_URL') + '/api/usage',
				data,
				{
					headers: {
						Accept: 'application/json',
						Authorization: 'Bearer '+ await auth.token(),
						company: 1
					}
				})
				.then ( (data) => {
					console.log(data, 'this is the result');
					return data;
				})
				.catch ((err) => {
					console.log(err, 'this is the error');
					return null;
				});
	}
	
	async data(plan, quantity, description)
	{
		return {
			"subscription_id": plan.subscription_id,
			"company_id": "1",
			"unique_id": customId({}) + customId({}),
			"breakdown": [
				{
					"plan_id": plan.id,
					"quantity": quantity
				}
			],
			"timestamp": Database.fn.now(),
			"description": description,
			"metadata": {}
		}
	}
}

module.exports = Credit;
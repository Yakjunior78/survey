const auth = new(use('App/Services/Billing/Auth'))();

const axios = use('axios');
const Env = use('Env');

class Subscription {
	
	async get(id)
	{
		console.log(id, 'this is the customer id');
		
		return axios.get (
			Env.get('BILLING_URL') + '/api/subscriptions/customer/' + id,
				{
					headers: {
						Accept: 'application/json',
						Authorization: await auth.token()
					}
				})
				.then ( ( data )  => {
					return data;
				})
				.catch ((err) => {
					return null;
				});
	}
	
	async create(account)
	{
		let data = await this.data(account);
		
		return axios.get (
			Env.post ('BILLING_URL') + '/api/subscriptions',
				data,
				{
					headers: {
						Accept: 'application/json',
						Authorization: await auth.token()
					}
				})
				.then (async ({data}) => {
					return data;
				})
				.catch ((err) => {
					return null;
				});
	}
	
	async data(account)
	{
		return {
			"name": "Subscription for survey",
			"plans": [
				"74", "75", "76", "77"
			],
			"customer_id": account.customer_id,
			"description": "Default subscription for survey",
			"prorated": false,
			"active": true,
			"coupon": null,
			"tax_rate": 0,
			"discount": 0,
			"billing_cycle_anchor": 15886333126,
			"metadata": {}
		}
	}
}

module.exports = Subscription;
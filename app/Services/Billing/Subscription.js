const auth = new(use('App/Services/Billing/Auth'))();

const axios = use('axios');
const Env = use('Env');

class Subscription {
	
	async get(id)
	{
		return axios.get (
			Env.get('BILLING_URL')+'/api/subscriptions/customer/'+id,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + await auth.token(),
						company: 1
					}
				})
				.then ( ({data})   => {
					return data;
				})
				.catch ((err) => {
					console.log(err, 'this is an error');
					return null;
				});
	}
	
	async create(account)
	{
		let data = await this.data(account);
		
		return axios.post (
			Env.get('BILLING_URL')+'/api/subscriptions',
				data,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + await auth.token()
					}
				})
				.then ( ({ data }) => {
					console.log(data, 'this is the subscription');
					return data.subscription;
				})
				.catch ((err) => {
					console.log(err, 'this is the error');
					return null;
				});
	}
	
	async data(account)
	{
		return {
			"name": "Subscription for survey",
			"plans": [
				"37"
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
const auth = new(use('App/Services/Billing/Auth'))();

const axios = use('axios');
const Env = use('Env');
const moment = use('moment');

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
					return null;
				});
	}
	
	async create(account)
	{
		let form = await this.data(account);
		
		return axios.post (
			Env.get('BILLING_URL')+'/api/subscriptions',
			form,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + await auth.token()
				}
			})
			.then ( ({ data }) => {
				return data.subscription;
			})
			.catch ((err) => {
				console.log(err, 'this is the error');
				return null;
			});
	}
	
	async data(account)
	{
		let plan = Env.get('BILLING_PRE_PAYMENT_PLAN_ID');
		
		let now = new Date();
		
		return {
			"name": "Subscription for survey",
			"plans": [
				plan.toString()
			],
			"customer_id": (account.customer_id).toString(),
			"description": "Default subscription for survey",
			"prorated": false,
			"active": true,
			"coupon": null,
			"tax_rate": 0,
			"discount": 0,
			"billing_cycle_anchor": (moment(now).unix()).toString(),
			"metadata": {}
		}
	}
}

module.exports = Subscription;
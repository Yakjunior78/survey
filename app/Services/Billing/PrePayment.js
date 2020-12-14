const auth = new(use('App/Services/Billing/Auth'))();
const axios = use('axios');
const Env = use('Env');

class PrePayment {
	
	async create(account, ids)
	{
		return axios.get (
			Env.post ('BILLING_URL') + '/api/subscriptions',
			await this.newPrepayment(account, ids),
			{
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer '+await auth.token()
				}
			})
			.then (async ({data}) => {
				return data;
			})
			.catch ((err) => {
				return null;
			});
	}
	
	async update(user, subscription)
	{
		return axios.get (
			Env.post ('BILLING_URL') + '/pre-payments/' + subscription.id,
			await this.updatedPrepaymentData(user, subscription),
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
	
	async newPrepayment(account, ids)
	{
		return {
			"user_id": account.customer_id,
			"subscriptions": ids,
			"payment_number": "2903181913103113-23123512112121345226311",
			"payment_date": "12/11/2020",
			"amount": 10000,
			"notes": "Refund",
			"payment_method_id": "2",
			"taxes": []
		}
	}
	
	async updatedPrepaymentData(user, subscription)
	{
		return {
			"user_id": "971",
			"subscriptions_to_add": [
				"623"
			],
			
			"subscriptions_to_remove": [
			
			],
			"notes": "This is a payment for the three items the customer is using",
			"taxes": []
		}
	}
}

module.exports = PrePayment;
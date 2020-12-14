const auth = new(use('App/Services/Billing/Auth'))();
const axios = use('axios');
const Env = use('Env');

class PrePayment {
	
	async create(account, subscription)
	{
		let data = await this.newPrepayment(account, subscription);
		
		return axios.get (
			Env.post ('BILLING_URL') + '/api/pre-payments',
			data,
			{
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer '+ await auth.token()
				}
			})
			.then ( (data) => {
				return data;
			})
			.catch ((err) => {
				return null;
			});
	}
	
	async update(account, subscription)
	{
		return axios.get (
			Env.post ('BILLING_URL') + '/pre-payments/' + subscription.id,
			await this.updatedPrepaymentData(account, subscription),
			{
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + await auth.token()
				}
			})
			.then ( ({data}) => {
				console.log(data, 'pre payment created');
				return data;
			})
			.catch ((err) => {
				return null;
			});
	}
	
	async newPrepayment(account, subscription)
	{
		return {
			"user_id": account.customer_id,
			"subscriptions": [ subscription.id ],
			"payment_number": "2903181913103113-23123512112121345226311",
			"payment_date": "12/11/2020",
			"amount": 10000,
			"notes": "Refund",
			"payment_method_id": "2",
			"taxes": []
		}
	}
	
	async updatedPrepaymentData(account, subscription)
	{
		return {
			"user_id": account.customer_id,
			"subscriptions_to_add": [ subscription.id ],
			"subscriptions_to_remove": [],
			"notes": "This is a payment for survey usage",
			"taxes": []
		}
	}
}

module.exports = PrePayment;
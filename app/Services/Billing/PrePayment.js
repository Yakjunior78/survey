const auth = new(use('App/Services/Billing/Auth'))();
const { randId } = use('App/Helpers/Emalify');
const axios = use('axios');
const Env = use('Env');

class PrePayment {
	
	async create(account, subscription)
	{
		let data = await this.newPrepayment(account, subscription);
		
		return axios.post (
			Env.get ('BILLING_URL') + '/api/pre-payments',
			data,
			{
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer '+ await auth.token(),
					company: 1
				}
			})
			.then ( ({data}) => {
				return data.prepayment;
			})
			.catch ((err) => {
				console.log(err, 'this is the error');
				return null;
			});
	}
	
	async update(account, subscription)
	{
		let data = await this.updatedPrepaymentData(account, subscription);
		
		return axios.put (
			Env.get ('BILLING_URL')+'/api/pre-payments/'+account.prepayment_id,
			data,
			{
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + await auth.token(),
					company: 1
				}
			})
			.then ( ({data}) => {
				return data.prepayment;
			})
			.catch ((err) => {
				console.log(err, 'this is the error');
				return null;
			});
	}
	
	async newPrepayment(account, subscription)
	{
		return {
			"user_id": account.customer_id,
			"subscriptions": [ subscription.id ],
			"payment_number": (await randId()+'-'+await randId()).toString(),
			"payment_date": "12/11/2020",
			"amount": 20,
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
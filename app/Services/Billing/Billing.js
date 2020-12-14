const Account = new(use('App/Services/Billing/Account'))();
const Subscription = new(use('App/Services/Billing/Subscription'))();
const Prepayment = new(use('App/Services/Billing/PrePayment'))();

class Billing {
	
	async handle(user)
	{
		let account = await Account.handle(user);
		
		let subscriptions = await Subscription.get(account.customer_id);
		
		let prePayment = null;
		
		if(subscriptions) {
			prePayment = await Prepayment.create();
		} else {
			subscriptions = await Subscription.create(account, subscriptions);
			prePayment = await Prepayment.update(account, subscriptions);
		}
		
		
		console.log(prePayment, 'this is the prepayment');
		
		
		/**
		 * Activate - create a record under user products
		 * Set default sender code
		 */
	}
}

module.exports = Billing;
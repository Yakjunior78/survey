const Account = new(use('App/Services/Billing/Account'))();
const Subscription = new(use('App/Services/Billing/Subscription'))();
const Prepayment = new(use('App/Services/Billing/PrePayment'))();

class Billing {
	
	async handle(user)
	{
		let account = await Account.handle(user);
		
		let subscription = await Subscription.get(account.customer_id);
		
		console.log(subscription, 'this is the subscription');
		
		return;
		
		let prePayment = null;
		
		if(subscription) {
			prePayment = await Prepayment.create();
		} else {
			subscription = await Subscription.create(account, subscription);
			prePayment = await Prepayment.update(account, subscription);
		}
		
		/**
		 * Activate - create a record under user products
		 * Set default sender code
		 */
	}
}

module.exports = Billing;
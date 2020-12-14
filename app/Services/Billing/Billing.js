const Account = new(use('App/Services/Billing/Account'))();
const Subscription = new(use('App/Services/Billing/Subscription'))();
const Prepayment = new(use('App/Services/Billing/PrePayment'))();
const { mapIds } = use('App/Helpers/Emalify');

class Billing {
	
	async handle(user)
	{
		let account = await Account.handle(user);
		
		let subscriptions = await Subscription.get(account.customer_id);
		
		console.log(subscriptions, 'these are the subscriptions');
		
		let prePayment = null;
		
		if(subscriptions) {
			let subscription_ids = await mapIds(subscriptions.subscriptions, 'id');
			
			console.log(subscription_ids, 'ids');
			
			prePayment = await Prepayment.create(account, subscription_ids);
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
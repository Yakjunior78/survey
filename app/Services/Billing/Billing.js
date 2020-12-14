const Account = new(use('App/Services/Billing/Account'))();
const Subscription = new(use('App/Services/Billing/Subscription'))();
const Prepayment = new(use('App/Services/Billing/PrePayment'))();
const Plan = new(use('App/Services/Billing/Plan'))();

const { mapIds } = use('App/Helpers/Emalify');

class Billing {
	
	async handle(user)
	{
		let account = await Account.handle(user);
		
		let subscriptions = await Subscription.get(account.customer_id);
		
		let prePayment = null;
		
		if(!subscriptions) {
			
			let subscription = await Subscription.create(account);
			
			prePayment = await Prepayment.create(account, subscription);
			
		} else {
			
			let subscription = await Subscription.create(account);
			
			prePayment = await Prepayment.update(account, subscription);
		}
		
		await Plan.create();
		/**
		 * Activate - create a record under user products
		 * Update plan
		 * Set default sender code
		 */
	}
}

module.exports = Billing;
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
		let subscription = null;
		
		if(!subscriptions) {
			
			subscription = await Subscription.create(account);
			
			prePayment = await Prepayment.create(account, subscription);
			
		} else {
			
			subscription = await Subscription.create(account);
			
			prePayment = await Prepayment.update(account, subscription);
		}
		
		console.log('we are here with you');
		
		let plan = await Plan.store(account, subscription);
		
		console.log(plan, 'this is the plan');
		/**
		 * Activate - create a record under user products
		 * Update plan
		 * Set default sender code
		 */
	}
}

module.exports = Billing;
const Account = new(use('App/Services/Billing/Account'))();
const Subscription = new(use('App/Services/Billing/Subscription'))();
const Prepayment = new(use('App/Services/Billing/PrePayment'))();
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
			
			console.log(prePayment, 'prepayment under if - created');
			
		} else {
			
			let subscription = await Subscription.create(account);
			
			prePayment = await Prepayment.update(account, subscription);
			
			console.log(prePayment, 'prepayment under else - updated');
		}
		
		console.log(prePayment, 'this is the prepayment');
		
		/**
		 * Activate - create a record under user products
		 * Set default sender code
		 */
	}
}

module.exports = Billing;
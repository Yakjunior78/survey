const Account = new(use('App/Services/Billing/Account'))();
const Subscription = new(use('App/Services/Billing/Subscription'))();
const Prepayment = new(use('App/Services/Billing/PrePayment'))();
const Plan = new(use('App/Services/Billing/Plan'))();
const UserProduct = new(use('App/Services/Billing/Product'))();
const Sender = new(use('App/Services/Billing/Sender'))();

const { mapIds } = use('App/Helpers/Emalify');

class Billing {
	
	async handle(user)
	{
		let account = await Account.handle(user);
		
		if(!account) {
			return {
				status: 406,
				message: 'Failed to register user on billing account'
			}
		}
		
		let subscriptions = await Subscription.get(account.customer_id);
		
		let prePayment = null;
		let subscription = null;
		
		if(!subscriptions) {
			
			subscription = await Subscription.create(account);
			
			prePayment = await Prepayment.create(account, subscription);
			
		} else {
			
			subscription = await Subscription.create(account);
			
			if(subscription) {
				prePayment = await Prepayment.update(account, subscription);
			}
		}
		
		if(prePayment) {
			
			await Account.update(account, prePayment);
		}
		
		await Plan.store(account, subscription);
		
		await UserProduct.store(user);
		
		return await Sender.store(user);
	}
}

module.exports = Billing;
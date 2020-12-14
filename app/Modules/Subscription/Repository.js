const Billing = new(use('App/Services/Billing/Account'))();

class SubscriptionRepository {
	async subscribe(user) {
		return await Billing.handle(user);
	}
}

module.exports = SubscriptionRepository;
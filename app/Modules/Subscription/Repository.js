const Billing = new(use('App/Services/Billing/Billing'))();

class SubscriptionRepository {
	async subscribe(user) {
		return await Billing.handle(user);
	}
}

module.exports = SubscriptionRepository;
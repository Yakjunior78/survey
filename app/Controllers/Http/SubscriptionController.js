const repo = new(use('App/Modules/Subscription/Repository'))();

class SubscriptionController {
	
	async subscribe({ request, response })
	{
		let user = request.user;
		
		let result = await repo.subscribe(user);
		
		return response.json(result);
	}
}

module.exports = SubscriptionController;
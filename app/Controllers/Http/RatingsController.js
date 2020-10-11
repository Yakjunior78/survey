const RatingRepo = new(use('App/Modules/Questions/RatingRepository'))();

class RatingsController {
	
	async store({ request, response })
	{
		let data = request.all();
		
		let result = await RatingRepo.store(data);
		
		return response.json(result);
	}
}

module.exports = RatingsController;
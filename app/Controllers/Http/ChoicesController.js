const ChoiceRepo = new(use('App/Modules/Questions/ChoiceRepository'))();

class ChoicesController {
	
	async store({ request, response })
	{
		let data = request.all();
		return response.json(await ChoiceRepo.store(data));
	}
	
	async destroy({ params, response })
	{
		return response.json(await ChoiceRepo.destroy(params.id));
	}
}

module.exports = ChoicesController;
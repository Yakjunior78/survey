const ChoiceModel = use('App/Models/Choice');

class ChoiceRepository {
	async store(data)
	{
		data.value = data.name;
		data.label = data.name;
		
		let choiceModel = await ChoiceModel.create(data);
		
		return {
			status: 201,
			message: 'Question choice saved successfully',
			choice: choiceModel
		}
	}
}

module.exports = ChoiceRepository;
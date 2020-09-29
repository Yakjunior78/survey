const ChoiceModel = use('App/Models/Choice');
const { transform } = use('App/Helpers/Transformer');

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
	
	async destroy(id)
	{
		let choice = await ChoiceModel.findOrFail(id);
		
		let question = await choice.question().first();
		
		await choice.delete();
		
		return {
			status: 201,
			message: 'Question choice deleted successfully',
			question: await transform(question, 'Question')
		}
	}
}

module.exports = ChoiceRepository;
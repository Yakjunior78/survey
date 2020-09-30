const ConditionModel = use('App/Models/Condition');
const { transform } = use('App/Helpers/Transformer');

class ConditionRepository {
	
	async store(data)
	{
		let condition = null;
		
		if(data.id !== undefined) {
			condition = await ConditionModel.find(data.id);
			condition.fill(data);
			await condition.save();
		} else {
			condition = await ConditionModel.create(data);
		}
		
		let question = await condition.question().first();
		
		return {
			status: 201,
			message: 'Question condition created successfully',
			question: await transform(question, 'Question'),
			condition: condition
		}
	}
}

module.exports = ConditionRepository;
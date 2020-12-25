const ChoiceModel = use('App/Models/Choice');

const { transform } = use('App/Helpers/Transformer');

class QuestionStatistics {

	async transform(question, data) {

		let channel = data && data.channel ? data.channel : null;
		
		let instance = data && data.instance ? data.instance : null;
		
		let type = await question.type().first();
		
		let inputType = await question.inputType().first();
		
		let responses = await this.responses(question, channel, instance);

		let choices = await this.options(question);

		return {
			id: question.id,
			uuid: question.uuid,
			question: question.question,
			rank: question.rank,
			questionType: type ? type.slug : '',
			responses: responses,
			choices: []
		}
	}

	async responses(question, channel, instance)
	{
		
		if(instance) {
			return question
				.responses ()
				.where ('channel_id', channel.id)
				.whereHas ('session', (session) => {
					session.where ('instance_id', instance.id)
				})
				.getCount ();
		}
		
		return question.responses ().getCount ();
	}
	
	async options(question)
	{
		let choicesCount = await question.choices().getCount();

		let choices = await question.choices().fetch();

		choices = choicesCount ? choices.toJSON() : [];

		let transformedChoices = [];

		for (let i = 0; i < choices.length; i++) {

			let choice = await ChoiceModel.find(choices[i].id);

			let transformedQuestion =  await transform(choice, 'Choice');

			await transformedChoices.push(transformedQuestion);
		}

		return transformedChoices;
	}
}

module.exports = QuestionStatistics;

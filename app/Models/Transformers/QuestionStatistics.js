const ChoiceModel = use('App/Models/Choice');

const { transform } = use('App/Helpers/Transformer');

class QuestionStatistics {

	async transform(question, channel) {

		let type = await question.type().first();
		let inputType = await question.inputType().first();
		let responses = channel && channel.id
			? await question.responses().where('channel_id', channel.id).getCount()
			: await question.responses().getCount();

		let choices = await this.options(question);

		return {
			id: question.id,
			uuid: question.uuid,
			question: question.question,
			rank: question.rank,
			questionType: type ? type.slug : '',
			responses: responses,
			choices: choices
		}
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

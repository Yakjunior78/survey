const InstanceModel = use('App/Models/Instance');
const QuestionModel = use('App/Models/Question');
const SurveyModel = use('App/Models/Survey');

const { transform } = use('App/Helpers/Transformer');

class StatisticsRepository {

	async instanceQuestions(survey_id, instance_id)
	{
		let instance = await InstanceModel.query().where('uuid', instance_id).first();

		let survey = await SurveyModel.query().where('uuid', survey_id).first();

		let questions = instance
			? await instance.questions().orderBy('rank', 'asc').fetch()
			: await survey.questions().fetch();

		questions = questions.toJSON();

		let channel = instance ? await instance.channel().first() : {};

		let transformedQuestions = [];

		for (let i = 0; i < questions.length; i++) {

			let question = await QuestionModel.find(questions[i].id);

			let transformedQuestion =  await transform(
				question,
				'QuestionStatistics',
				{
					channel: channel,
					instance : instance
				})

			await transformedQuestions.push(transformedQuestion);
		}

		return transformedQuestions;
	}
}

module.exports = StatisticsRepository;

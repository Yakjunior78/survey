'use strict';

const InstanceModel = use('App/Models/Instance');
const SurveyModel = use('App/Models/Survey');
const ResponseModel = use('App/Models/Response');
const SessionModel = use('App/Models/Session');
const QuestionModel = use('App/Models/Question');

const { transform } = use('App/Helpers/Transformer');

const Database = use('Database');

class ResponseRepository {

	async responses(data)
	{
		let instance = null;
		let survey = null;

		if(data.instance_id) {
			instance = await InstanceModel.findBy('uuid', data.instance_id);
		}

		if(!instance) {
			return [];
		}

		survey = instance
			?  await instance.survey().first()
			: await SurveyModel.findBy('uuid', data.survey_id);

		let channel = instance ? await instance.channel().first() : null;

		let sessions = await SessionModel
			.query()
			.where('instance_id', instance.id)
			.orderBy('updated_at', 'desc')
			.paginate(data.page ? data.page : 1, 8);

		sessions = sessions ? sessions.toJSON() : [];

		let sessionList = sessions.data;

		let transformedSessions = [];

		for (let i = 0; i < sessionList.length; i++)
		{
			let session = await SessionModel.query().where('id', sessionList[i].id).first();

			let transformed = await transform (session, 'Session');

			transformedSessions.push(transformed);
		}

		let questions = await instance.questions().orderBy('rank', 'asc').fetch();

		questions = questions ? questions.toJSON() : [];

		let transformedQuestions = [];

		for (let i = 0; i < questions.length; i++)
		{
			let q = await QuestionModel.query().where('id', questions[i].id).first();

			let transformedQ = await transform (q, 'Question');

			transformedQuestions.push(transformedQ);
		}

		sessions.data = transformedSessions;

		return {
			questions: transformedQuestions,
			sessions: sessions
		};
	}
}

module.exports = ResponseRepository

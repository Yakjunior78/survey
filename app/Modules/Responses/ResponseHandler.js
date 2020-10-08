const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();
const ResponseModel = use('App/Models/Response');
const ChannelModel = use('App/Models/Channel');
const { transform } = use('App/Helpers/Transformer');

const Instance = new(use('App/Modules/Responses/Instance'))();
const Session = new(use('App/Modules/Responses/Session'))();

class ResponseHandler {
	
	async handle(request)
	{
		let data = request.data;
		
		let type = await this.type(request.type);
		
		let instances = await Instance.find(data, type);
		
		if(!instances)  return 'no instance';

		let session = await Session.find(instances, data, type);
		
		await this.recordResponse(session, data);
		
		let nextQuestion = await this.getNextQuestion(session);
		
		if(!nextQuestion) return null;
		
		await this.updateSession(session, nextQuestion);
		
		return nextQuestion;
	}
	
	async type(type)
	{
		let channel = await ChannelModel.query().where('service', type).first();
		
		return  channel ? channel.slug : null;
	}
	
	async recordResponse(session, data)
	{
		let question = await session.question().first();
		
		return await ResponseModel.create({
			response: data.message,
			question_id: question.id,
			contact_id: session.contact_id
		});
	}
	
	async getNextQuestion(session, instance)
	{
		let currentQuestion = await session.question().first();
		
		let survey = await instance.survey().first();
		
		let question = await QuestionRepo.nextQuestion(survey, currentQuestion.rank);
		
		return await transform(question, 'question');
	}
	
	async updateSession(session, question)
	{
		session.question_id = question.id;
		
		await session.save();
		
		return session;
	}
}

module.exports = ResponseHandler;
const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const ResponseModel = use('App/Models/Response');
const ChannelModel = use('App/Models/Channel');

const Instance = new(use('App/Modules/Responses/Instance'))();
const Session = new(use('App/Modules/Responses/Session'))();
const Question = new(use('App/Modules/Responses/Question'))();

class ResponseHandler {
	
	async handle(request)
	{
		let data = request.data;
		
		let type = await this.type(request.type);
		
		let instances = await Instance.find(data, type);
		
		if(!instances)  return 'no instance';

		let session = await Session.find(instances, data, type);
		
		let response = await this.recordResponse(session, data);
		
		return Question.next (session, response);
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
}

module.exports = ResponseHandler;
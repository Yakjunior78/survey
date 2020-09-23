const ContactRepo = new(use('App/Modules/Contacts/ContactRepository'))();
const InstanceRepo = new(use('App/Modules/Instances/InstanceRepository'))();
const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();
const SenderRepo = new(use('App/Modules/Senders/SenderRepository'))();
const InstanceModel = use('App/Models/Instance');
const ResponseModel = use('App/Models/Response');
const SessionHandler = use('App/Modules/Session/SessionHandler');

class ResponseHandler {
	
	async handle(request)
	{
		let type = request.type;
		let data = request.data;
		
		let instance = await this.getInstance(data, type);
		
		if(!instance)  return 'no instance';
		
		let contact = await this.getContact(data, type, instance);
		
		let sender = await this.getSender(data, type);
		
		let session = await this.getSession(contact, instance, sender);
		
		await this.recordResponse(session, data);
		
		let nextQuestion = await this.getNextQuestion(session, instance);
		
		if(!nextQuestion) return null;
		
		await this.updateSession(session, nextQuestion);
		
		return nextQuestion;
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
		
		return await QuestionRepo.nextQuestion(survey, currentQuestion.rank);
	}
	
	async updateSession(session, question)
	{
		session.question_id = question.id;
		
		await session.save();
		
		return session;
	}
	
	async getInstance(data, type)
	{
		let instance = null;
		
		if(type === 'web') {
			instance = await InstanceRepo.getInstance(data.instanceId);
		}
		
		if(type === 'OnDemandNotification') {
			instance = await InstanceModel
				.query()
				.whereHas('sender', (sender) => {
					sender.where('code', data.shortCode);
				})
				.whereHas('status', (status) => {
					status.where('slug', 'active');
				})
				.first();
		}
		
		return instance;
	}
	
	async getSession(contact, instance, sender)
	{
		const sessionHandler = new SessionHandler(contact, instance, sender);
		
		return await sessionHandler.handle(true);
	}
	
	async getContact(data, type, instance)
	{
		let contact = null;
		
		if(type === 'web') {
			contact = await ContactRepo.getContact(data);
		}
		
		if(type === 'OnDemandNotification') {
			
			let group = await instance.group().first();

			contact = await ContactRepo.getContact(data, group);
		}
		
		return contact;
	}
	
	async getSender(data, type)
	{
		if(type !== 'OnDemandNotification') {
			return null;
		}
		
		return await SenderRepo.get(data.shortCode);
	}
}

module.exports = ResponseHandler;
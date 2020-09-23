const SessionModel = use('App/Models/Session');
const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();

class SessionHandler  {
	
	constructor (contact, instance, sender, channel) {
		this.contact = contact;
		this.instance = instance;
		this.sender = sender;
		this.channel = channel;
	}
	
	async handle(create) {
		
		let session = await this.session();
		
		if(!session && create) {
			
			let survey = await this.instance.survey().fetch();
			
			let question = await QuestionRepo.get(survey, 1);
			
			session = await SessionRepo.create(this.instance, this.contact, question);
		}
		
		return session;
	}
	
	async session() {
		return await SessionRepo.show(this.contact, this.instance, this.sender);
	}
}

module.exports = SessionHandler;
'use strict';

const CompanyModel = use('App/Models/Company');
const SessionHandler = new(use('App/Modules/Surveys/Session'))();
const ContactModel = use('App/Models/Contact');
const ResponseModel = use('App/Models/Response');

class ResponseHandler {
	
	async handle(req) {
		
		let session = await SessionHandler.get (req.data);
		
		if(!session) {
			
			let session = await SessionHandler.create (req.data);
			
			let quiz = await this.sessionQuiz(session);
			
			return quiz ? quiz.question  : 'Survey not active';
		}
		
		await this.recordResponse(session, req.data);
		
		let nextQuestion = this.nextQuestion(session);
		
		await this.updateSession(session, nextQuestion);
		
		return nextQuestion ? nextQuestion.question : 'Thank you, we appreciate';
	}
	
	async sessionQuiz(session) {
		return session.question().first();
	}
	
	async recordResponse(session, data) {
		
		let question = await this.sessionQuiz(session);
		
		let company = await SessionHandler.companyByCode(data.shortCode);
		let contact = await SessionHandler.findContact(company, data.phoneNumber);
		
		let responseModel = new ResponseModel();
		
		responseModel.response = data.message;
		responseModel.question_id = question.id;
		responseModel.contact_id = contact.id;
		
		await responseModel.save();
		
		return responseModel;
	}
	
	async updateSession(session, question) {
		session.question_id = question.id;
		await session.save()
		return session;
	}
	
	async nextQuestion(session) {
		
		let currentQuestion = session.question().fetch();
		
		let instance = session.instance().first();

		return instance
			.questions ()
			.query ()
			.where ('rank', '!==', currentQuestion.rank)
			.orderBy ('rank', 'asc')
			.first ();
	}
}

module.exports = ResponseHandler;
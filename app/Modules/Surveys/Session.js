const SessionModel = use('App/Models/Session');
const CompanyModel = use('App/Models/Company');
const SurveyModel = use('App/Models/Survey');
const ContactModel = use('App/Models/Contact');
const InstanceModel = use('App/Models/Instance');
const SenderModel = use('App/Models/Sender');
const StatusModel = use('App/Models/Status');

class SessionHandler {
	
	async get(data) {
		
		return SessionModel
			.query ()
			.whereHas ('contact', (contact) => {
				contact.where ('msisdn', data.phoneNumber);
			})
			.whereHas ('sender', (sender) => {
				sender.where ('code', data.shortCode);
			})
			.whereHas ('status', (status) => {
				status.where ('slug', 'open');
			})
			.orderBy ('created_at', 'desc')
			.first ();
	}
	
	async create(data) {
		
		let company = await this.companyByCode(data.shortCode);
		
		if(!company) {
			return false;
		}
		
		let survey = await this.latestSurvey(company);
		
		if(!survey) {
			return false;
		}
		
		let contact = await this.findContact(company, data.phoneNumber);
		
		if(!contact) {
			return false;
		}
		
		let status = await StatusModel.query().where('slug', 'open').first();
		
		let instance = await this.latestInstance(survey);
		
		if(!instance) {
			instance = await this.newInstance(survey, contact, status);
		}
		
		let question = await this.firstQuestion(instance);
		
		if(!question) {
			return false;
		}
		
		let sessionModel = new SessionModel;
		
		let sender = await this.senderByCode(data.shortCode);
		
		sessionModel.instance_id = instance.id;
		sessionModel.contact_id = contact.id;
		sessionModel.status_id = status.id;
		sessionModel.question_id = question ? question.id : null;
		sessionModel.sender_id = sender ? sender.id : null;
		sessionModel.token = null;
		
		await sessionModel.save();
		
		return sessionModel;
	}
	
	async companyByCode(code) {
		return CompanyModel
			.query ()
			.whereHas ('senders', (senders) => {
				senders.where ('code', code);
			})
			.orderBy('created_at', 'desc')
			.first ();
	}
	
	async senderByCode(code) {
		return SenderModel
			.query ()
			.where ('code', code)
			.orderBy('created_at', 'desc')
			.first ();
	}
	
	async latestSurvey(company) {
		return SurveyModel
			.query ()
			.where ('company_id', company.id)
			.whereHas ('status', (status) => {
				status.where ('slug', 'open')
			})
			.orderBy ('created_by', 'desc')
			.first ();
	}
	
	async findContact(company, phone) {

		return ContactModel
			.query ()
			.where ('msisdn', phone)
			.whereHas ('group', (group) => {
				group.where ('company_id', company.id)
			})
			.first ();
	}
	
	async latestInstance(survey) {
		return survey
			.instances ()
			.whereHas ('status', (status) => {
				status.where('slug', 'open')
			})
			.orderBy ('created_at', 'desc')
			.first()
	}
	
	async newInstance(survey, contact, status) {
		
		let instanceModel = new InstanceModel;
		
		let group = await contact.group().fetch();
		
		instanceModel.description = 'Test survey instance';
		instanceModel.survey_id = survey.id;
		instanceModel.start_at = '2020-09-16 08:57:56';
		instanceModel.channel_id = 1;
		instanceModel.group_id = group.id;
		instanceModel.created_by = 1;
		instanceModel.created_by_name = 'Yakov Erick';
		instanceModel.status_id = status.id
		
		await instanceModel.save ();
		
		let questions = await this.surveyQuestions(survey);
		
		await this.attachQuestions(instanceModel, questions);
		
		return instanceModel;
	}
	
	async firstQuestion(instance) {
		return instance.questions().orderBy('rank', 'asc').first();
	}
	
	async attachQuestions(instance, questions) {
		
		for(let i in questions.rows) {
			const question = questions.rows[i];
			await instance.questions().attach([question.id]);
		}
	}
	
	async surveyQuestions(survey, instance) {
		return survey
			.questions ()
			.fetch ();
	}
}

module.exports = SessionHandler;
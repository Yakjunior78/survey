const SessionModel = use('App/Models/Session');
const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();

const { getStatus } = use('App/Helpers/Emalify');
const { notAllowed } = use('App/Helpers/Response');

class SessionRepository {
	
	async init(instance, contact)
	{
		let survey = await instance.survey().fetch();
		
		let question = await QuestionRepo.get(survey, 1);
		
		if(!question) return null;
		
		return await this.create(instance, contact, question);
	}
	
	async create(instance, contact, question)
	{
		let status = await getStatus('active');
		
		return await SessionModel.create ({
			instance_id : instance.id,
			contact_id : contact.id,
			status_id :  status ? status.id : null,
			question_id :  question.id
		});
	}
	
	async show(contact, instance, sender)
	{
		if(instance) {
			return SessionModel
				.query ()
				.where ('instance_id', instance.id)
				.whereHas ('status', (status) => {
					status.where('slug', 'active');
				})
				.where ('contact_id', contact.id)
				.first ();
		}
		
		if(sender) {
			return SessionModel
				.query ()
				.where ('sender_id', sender.id)
				.whereHas ('status', (status) => {
					status.where('slug', 'active');
				})
				.where ('contact_id', contact.id)
				.first ();
		}
		
		return null;
	}
}

module.exports = SessionRepository;
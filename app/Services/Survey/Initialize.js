const SurveyModel = use('App/Models/Survey');
const InstanceModel = use('App/Models/Instance');
const ContactModel = use('App/Models/Contact');
const SessionModel = use('App/Models/Session');
const sessionRepo = use('App/Modules/Session/SessionRepository');
const { transform } = use('App/Helpers/Transformer');

class Initialize {
	
	async handle(data)
	{
		let survey = await SurveyModel.query().where('uuid', data.sid).first();
		
		if(!survey) {
			return {
				status: 406,
				message: 'No survey with such id'
			}
		}
		
		let instance = await InstanceModel.query().where('uuid', data.iid).first();
		
		if(!instance) {
			return {
				status: 406,
				message: 'No survey instance with such id'
			}
		}
		
		let contact = await ContactModel.query().where('uuid', data.cid).first();
		
		let question = await this.question(instance, contact);
		
		return {
			status: 201,
			survey: survey,
			question: await transform(question, 'Question'),
			contact: contact,
			instance: instance
		};
	}
	
	async question(instance, contact)
	{
		let session = await SessionModel
			.query()
			.where('instance_id', instance.id)
			.where('contact_id', contact.id)
			.first();
		
		if(!session)  {
			session = await sessionRepo.create(contact, instance);
		}
		
		return await session.question().first();
	}
}

module.exports = Initialize;
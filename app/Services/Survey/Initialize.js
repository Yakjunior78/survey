const SurveyModel = use('App/Models/Survey');
const InstanceModel = use('App/Models/Instance');
const ContactModel = use('App/Models/Contact');
const SessionModel = use('App/Models/Session');
const sessionRepo = use('App/Modules/Session/SessionRepository');
const contactRepo = use('App/Modules/Contacts/ContactRepository');
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
		
		let contact = await this.contact(instance, data);
		
		if(!contact) {
			return {
				status: 406,
				message: 'No contact associated with this survey session'
			}
		}
		
		let question = await this.question(instance, contact);
		
		question = question ? await transform(question, 'Question') : null;
		
		return {
			status: 201,
			survey: survey,
			question: question,
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
		
		let status = await session.status().first();
		
		if(status.slug === 'closed') {
			return null;
		}
		
		if(!session)  {
			session = await sessionRepo.create(contact, instance);
		}
		
		return await session.question().first();
	}
	
	async contact(instance, data)
	{
		let channel = await instance.channel().first();
		
		switch (channel.slug) {
			
			case 'sms':
				return await ContactModel.query().where('uuid', data.cid).first();
				
			case 'facebook':
				return await contactRepo.createFbContact (data);
			
			default:
				return null;
		}
		
	}
}

module.exports = Initialize;
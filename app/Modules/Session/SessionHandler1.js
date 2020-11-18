const SessionModel = use('App/Models/Session');
const InstanceModel = use('App/Models/Instance');
const ContactModel = use('App/Models/Contact');
const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();

class SessionHandler1  {
	
	constructor (contacts, instances, sender, channel) {
		this.contacts = contacts;
		this.instances = instances;
		this.sender = sender;
		this.channel = channel;
	}
	
	async handle(create) {
		
		let instances = this.instances.toJSON();
		let contacts = this.contacts.toJSON();
		
		let session = await this.session(instances, contacts);
		
		if(!session && create) {
			
			let instance = instances[0];
			
			let contact = contacts[0];
			
			let instanceModel = await InstanceModel.find(instance.id);
			let contactModel = await ContactModel.find(contact.id);
			
			let survey = await instanceModel.survey().first();
			
			let question = await QuestionRepo.get(survey, 1);
			
			return SessionRepo.create(instanceModel, contact, question);
		}
		
		return session;
	}
	
	async session(instances, contacts)
	{
		let instance_ids = [];
		let contact_ids = [];
		
		for (let i = 0; i < instances.length; i++) {
			await instance_ids.push((instances[i].id));
		}
		
		for (let i = 0; i < contacts.length; i++) {
			await contact_ids.push((contacts[i].id));
		}
		
		return SessionModel
			.query()
			.whereHas('contact', (contact) => {
				contact.whereIn('id', contact_ids)
			})
			.whereHas('instance', (instance) => {
				instance.whereIn('id', instance_ids)
			})
			.whereHas ('status', (status) => {
				status.where('slug', 'active');
			})
			.orderBy('updated_at', 'asc')
			.first();
	}
}

module.exports = SessionHandler1;
const SenderRepo = new(use('App/Modules/Senders/SenderRepository'))();
const Contact = new(use('App/Modules/Responses/Contact'))();

const SessionHandler = use('App/Modules/Session/SessionHandler');
const ContactModel = use('App/Models/Contact');
const SessionModel = use('App/Models/Session');

class Session {
	
	async find(instances, data, channel)
	{
		let contacts = await Contact.find(instances, data, channel.slug);
		
		if(!contacts) return null;
		
		let sender = await this.getSender(data, channel.slug);
		
		return await this.getSession(contacts, instances, sender);
	}
	
	async getSession(contact, instance, sender)
	{
		const sessionHandler = new SessionHandler(contact, instance, sender);
		
		return await sessionHandler.handle(true);
	}
	
	async getSender(data, type)
	{
		if(type !== 'OnDemandNotification') {
			return null;
		}
		
		return await SenderRepo.get(data.shortCode);
	}
}

module.exports = Session;
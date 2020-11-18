const repo = new(use('App/Modules/Session/SessionRepository'))();

class SessionHandler {
	
	async handle(contacts, instances)
	{
		let session = await repo.find(contacts, instances);
		
		if(!session) {
			session = await repo.create(contacts.first(), instances.first());
		}
		
		return session;
	}
}

module.exports = SessionHandler;
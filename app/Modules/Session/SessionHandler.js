const repo = new(use('App/Modules/Session/SessionRepository'))();
const SessionTrailModel = use('App/Models/SessionTrail');

class SessionHandler {
	
	async handle(contacts, instances)
	{
		let session = await repo.find(contacts, instances);
		
		if(!session) {
			return await repo.create(contacts.first(), instances.first());
		}
		
		return session;
	}
	
	async update(session, next)
	{
		let latestTrail = await session
			.sessionTrails()
			.orderBy('created_at', 'desc')
			.first();
		
		latestTrail.replied = true;
		
		await latestTrail.save();
		
		if(!next) return null;
		
		return await SessionTrailModel.create({
			session_id: session.id,
			question_id: next.id,
			consent: false
		});
	}
}

module.exports = SessionHandler;
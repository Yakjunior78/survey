const repo = new(use('App/Modules/Session/SessionRepository'))();
const SessionTrailModel = use('App/Models/SessionTrail');
const SessionModel = use('App/Models/Session');

const { getStatus } = use('App/Helpers/Emalify');

class SessionHandler {
	
	async handle(contacts, instances)
	{
		return await repo.find (contacts, instances);
	}
	
	async update(session, next)
	{
		let latestTrail = await session
			.sessionTrails()
			.orderBy('created_at', 'desc')
			.first();
		
		latestTrail.replied = true;
		
		await latestTrail.save();
		
		if(!next) return await this.deactivateSession(session);
		
		return await SessionTrailModel.create({
			session_id: session.id,
			question_id: next.id,
			consent: false
		});
	}
	
	async deactivateSession(session)
	{
		let status = await getStatus('closed');
		
		return await SessionModel
			.query()
			.where('id', session.id)
			.update({'status_id': status.id});
	}
}

module.exports = SessionHandler;
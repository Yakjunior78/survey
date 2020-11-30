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
		console.log(next, 'this is the next question mf');
		
		if(!next) return await this.deactivateSession(session);
		
		session.question_id = next.id;
		
		return session.save();
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
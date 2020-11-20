const repo = new(use('App/Modules/Session/SessionRepository'))();
const SessionTrailModel = use('App/Models/SessionTrail');
const SessionModel = use('App/Models/Session');

const { getStatus } = use('App/Helpers/Emalify');

class SessionHandler {
	
	async handle(contacts, instances)
	{
		let session = await repo.find(contacts, instances);
		
		if(!session) {
			
			let activeInstances = [];
			
			instances = instances.toJSON();
			
			for (const instance of instances) {
				let expired = await repo.checkExpiry(contacts.first(), instance);
				if(!expired) activeInstances.push(instance);
			}
			
			return {
				instances: activeInstances,
				session: session
			};
			
			// return await repo.create(contacts.first(), activeInstances[0]);
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
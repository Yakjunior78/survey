const moment = use('moment');
const Env = use('Env');

const ResponseModel = use('App/Models/Response');

class SessionTransformer {
	
	async transform(session) {
		
		return {
			contact: await session.contact().first(),
			responses: await this.responses(session),
			question: await session.question().first()
		}
	}
	
	async responses(session)
	{
		let responses = await session.responses().fetch();
		
		responses = responses ? responses.toJSON() : [];
		
		let transformedResponses = [];
		
		for (let i = 0; i < responses.length; i++)
		{
			let response = await ResponseModel.query().where('id', responses[i].id).first();
			
			let transformed = await transform (response, 'Response');
			
			transformedResponses.push(transformed);
		}
		
		return transformedResponses;
	}
}

module.exports = SessionTransformer;
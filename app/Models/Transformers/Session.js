const moment = use('moment');
const Env = use('Env');

const ResponseModel = use('App/Models/Response');
const { transform } = use('App/Helpers/Transformer');

class SessionTransformer {
	
	async transform(session) {
		
		return {
			contact: await session.contact().first(),
			question: await session.question().first(),
			responses: await this.responses(session)
		}
	}
	
	async responses(session)
	{
		let responses = await session.responses().orderBy('updated_at', 'asc').fetch();
		
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
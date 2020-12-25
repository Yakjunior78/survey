const { transform } = use('App/Helpers/Transformer');
const QuestionModel = use('App/Models/Question');
const InstanceModel = use('App/Models/Instance');

class SurveyTransformer {
	
	async transform(survey) {
		
		let company = await survey.company().first();
		let category = await survey.category().first();
		let status = await survey.status().first();
		
		let instances = await this.instances(survey);
		let channels = await this.channels(instances);
		
		return {
			id: survey.id,
			uuid: survey.uuid,
			title: survey.title,
			description: survey.description,
			company: company ? company.name : null,
			category_id: survey.category_id,
			category: category ? category.name : null,
			status_id: survey.status_id,
			status: status ? status.name : null,
			by: survey.created_by,
			questions: await this.questions(survey),
			instances: instances,
			channels: channels,
			created_by_name: survey.created_by_name,
			sessions: await this.sessions(survey)
		}
	}
	
	async questions(survey)
	{
		let questions =  await survey
			.questions()
			.orderBy('rank', 'asc')
			.fetch();
		
		questions = questions.toJSON();
		
		let transformedQuestions = [];
		
		for (let i = 0; i < questions.length; i++) {
			
			let question = await QuestionModel.findOrFail(questions[i].id);
			
			let transformed = await transform (question, 'Question');
			transformedQuestions.push(transformed);
		}
		
		return transformedQuestions;
	}
	
	async channels(instances)
	{
		let channels = [];
		
		for (let i = 0; i < instances.length; i++) {
			
			let instanceModel = await InstanceModel.find(instances[i].id);
			let channel = await instanceModel.channel().first();
			
			let exists = await channels.find( chan => chan.id === channel.id);
			
			if(!exists) {
				channels.push(channel);
			}
		}
		
		return channels;
	}
	
	async instances(survey)
	{
		let instances =  await survey
			.instances()
			.orderBy('updated_at', 'desc')
			.fetch();
		
		instances = instances.toJSON();
		
		let transformedInstances = [];
		
		for (let i = 0; i < instances.length; i++) {
			
			let instance = await InstanceModel.findOrFail(instances[i].id);
			
			let transformed = await transform (instance, 'Instance');
			
			transformedInstances.push(transformed);
		}
		
		return transformedInstances;
	}
	
	async sessions(survey)
	{
		return [];
	}
}

module.exports = SurveyTransformer;
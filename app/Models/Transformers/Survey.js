class SurveyTransformer {
	
	async transform(survey) {
		
		let company = await survey.company().first();
		let category = await survey.category().first();
		let status = await survey.status().first();
		
		return {
			uuid: survey.uuid,
			title: survey.title,
			description: survey.description,
			company: company ? company.name : null,
			category_id: survey.category_id,
			category: category ? category.name : null,
			status_id: survey.status_id,
			status: status ? status.name : null,
			by: survey.created_by,
			questions: await this.questions(survey)
		}
	}
	
	async questions(survey)
	{
		return await survey.questions().fetch();
	}
}

module.exports = SurveyTransformer;
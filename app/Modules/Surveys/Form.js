const { validate } = use('Validator');

class SurveyForm {
	
	async validate(request) {
		
		const rules = {
			title: 'required',
			company_id: 'required'
		}
		
		return await validate (request, rules);
	}
	
	async error(validation) {
		return {
			status: 401,
			data: validation.messages(),
			message: 'Missing form fields'
		}
	}
}

module.exports = SurveyForm;

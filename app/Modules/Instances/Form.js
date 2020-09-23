const { validate } = use('Validator');

class InstanceForm {
	
	async validate(request) {
		
		const rules = {
			survey_id: 'required',
			group_id: 'required',
			start_at: 'required',
			channel_id: 'required',
		}
		
		return await validate (request, rules);
	}
	
	async validateInstance(request) {
		
		const rules = {
			uuid: 'required'
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

module.exports = InstanceForm;

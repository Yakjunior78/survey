const SurveyModel = use('App/Models/Survey');
const SurveyForm = new(use('App/Modules/Surveys/Form'))();

const { validate } = use('Validator');

class SurveyRepository {
	
	async create(data) {
		
		let validation = await SurveyForm.validate(data);

		if (validation.fails()) {
			return SurveyForm.error(validation);
		}
		
		return await SurveyModel.create({
			title: data.title,
			description: data.description,
			company_id: data.company_id,
			created_by: data.created_by,
			category_id: data.category_id,
			status_id: data.status_id
		});
	}
}

module.exports = SurveyRepository;
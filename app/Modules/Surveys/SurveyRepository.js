const SurveyModel = use('App/Models/Survey');
const StatusModel = use('App/Models/Status');

const SurveyForm = new(use('App/Modules/Surveys/Form'))();

const { validate } = use('Validator');

class SurveyRepository {
	
	async create(data) {
		
		let validation = await SurveyForm.validate(data);

		if (validation.fails()) {
			return SurveyForm.error(validation);
		}
		
		let status = await StatusModel.query().where('slug', 'active').first();
		
		let survey = await SurveyModel.create({
			title: data.title,
			description: data.description,
			company_id: data.company_id,
			created_by: data.created_by,
			category_id: data.category_id,
			status_id: status ? status.id : null
		});
		
		return {
			status: 201,
			message: 'Survey created successfully',
			data: survey
		}
	}
}

module.exports = SurveyRepository;
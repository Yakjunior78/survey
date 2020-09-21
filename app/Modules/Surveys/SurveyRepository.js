const SurveyModel = use('App/Models/Survey');
const SurveyForm = new(use('App/Modules/Surveys/Form'))();

const { validate } = use('Validator');

class SurveyRepository {
	
	async create(data) {
		
		let validation = await SurveyForm.validate(data);

		if (validation.fails()) {
			return SurveyForm.error(validation);
		}
		
		let surveyModel = new SurveyModel;
		
		surveyModel.title = data.title;
		surveyModel.description = data.description;
		surveyModel.company_id = data.company_id;
		surveyModel.created_by = data.created_by;
		surveyModel.category_id = data.category_id;
		surveyModel.status_id = data.status_id;
		
		await surveyModel.save();
		
		return surveyModel;
	}
	
	async initiate(data) {
	
	}
}

module.exports = SurveyRepository;
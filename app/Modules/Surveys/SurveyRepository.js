const SurveyModel = use('App/Models/Survey');
const StatusModel = use('App/Models/Status');

const CompanyModel = use('App/Models/Company');

const SurveyForm = new(use('App/Modules/Surveys/Form'))();

const { validate } = use('Validator');
const { transform } = use('App/Helpers/Transformer');

class SurveyRepository {

	async index(identity, page)
	{
		let surveys = await SurveyModel
			.query()
			.whereHas('company', (company) => {
				company.where('identity', identity)
			})
			.orderBy('updated_at', 'desc')
			.paginate(page ? page : 1, 8);

		surveys = surveys.toJSON();

		let surveyList = surveys.data;

		let transformedSurveys = [];

		for (let i = 0; i < surveyList.length; i++)
		{
			let survey = await SurveyModel.findOrFail(surveyList[i].id);

			let transformed = await transform (survey, 'Survey');

			transformedSurveys.push(transformed);
		}

		surveys.data = transformedSurveys;

		return surveys;
	}

	async create(data) {

		let validation = await SurveyForm.validate(data);

		if (validation.fails()) {
			return SurveyForm.error(validation);
		}

		let company = await this.company(data.identity);

		if(!company) {
			company = await this.createCompany(data);
		}

		let status = await StatusModel.query().where('slug', 'active').first();

		let survey = await SurveyModel.create({
			title: data.title,
			description: data.description,
			company_id: company.id,
			created_by: data.created_by,
			category_id: data.category_id,
			status_id: status ? status.id : null
		});

		return {
			status: 201,
			message: 'Survey created successfully',
			survey: survey
		}
	}

	async show(id)
	{
		let survey = await SurveyModel
			.query()
			.where('uuid', id)
			.first();

		return transform(survey, 'Survey');
	}

	async update(id, data)
	{
		await SurveyModel
			.query()
			.where('uuid', id)
			.update(data);

		let survey = await SurveyModel
			.query()
			.where('uuid', id)
			.first();

		return transform(survey, 'Survey');
	}

	async destroy(id)
	{
		let survey = await SurveyModel
			.query()
			.where('uuid', id)
			.first();

		await survey.delete();

		return {
			'message': 'Survey deleted successfully',
			'status': 201
		}
	}

	async company(identity)
	{
		return CompanyModel.query ().where ('identity', identity).first ();
	}

	async createCompany(data)
	{
		return await CompanyModel.create({
			name: 'xema user '+data.identity,
			slug: 'xema_user_'+data.identity,
			description: 'Company with account id '+data.identity,
			identity: data.identity
		})
	}
}

module.exports = SurveyRepository;

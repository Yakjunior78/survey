const SurveyModel = use('App/Models/Survey');
const StatusModel = use('App/Models/Status');
<<<<<<< HEAD
=======
const CompanyModel = use('App/Models/Company');

const SurveyForm = new(use('App/Modules/Surveys/Form'))();

>>>>>>> dd4324e5f85f04eb8764b12f3091da5b448a7d20
const { validate } = use('Validator');
const { transform } = use('App/Helpers/Transformer');

const SurveyForm = new(use('App/Modules/Surveys/Form'))();

class SurveyRepository {
<<<<<<< HEAD
	
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
=======

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

        let status = await StatusModel.query().where('slug', 'active').first();

        let company = await this.company(data);

        let survey = await SurveyModel.create({
            title: data.title,
            description: data.description,
            company_id: company ? company.id : 1,
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


    async company(data)
    {
        let company = await CompanyModel.query().where('identity', data.identity).first();

        if(!company) {
           company = await CompanyModel.create({
              name: data.name ? data.name : 'Emailfy '+data.identity,
              slug: data.name ? data.name : 'Emailfy '+data.identity,
              description: data.name ? data.name : 'Emailfy '+data.identity,
              identity: data.identity,
              created_by_name: data.created_by ? data.created_by : ''
           });
        }

        return company;
    }
>>>>>>> dd4324e5f85f04eb8764b12f3091da5b448a7d20
}

module.exports = SurveyRepository;

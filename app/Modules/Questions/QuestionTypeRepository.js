const QuestionTypeModel = use('App/Models/QuestionType');

class QuestionTypeRepository {
	async get() {
		return await QuestionTypeModel.query().where('active', 1).fetch();
	}
}

module.exports = QuestionTypeRepository;
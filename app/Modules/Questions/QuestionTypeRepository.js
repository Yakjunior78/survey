const QuestionTypeModel = use('App/Models/QuestionType');

class QuestionTypeRepository {
	async get() {
		return await QuestionTypeModel.all();
	}
}

module.exports = QuestionTypeRepository;
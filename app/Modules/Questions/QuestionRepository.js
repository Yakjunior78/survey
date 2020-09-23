class QuestionRepository {
	
	async get(survey, rank) {
		return survey
			.questions ()
			.where ('rank', rank)
			.first ();
	}
}
module.exports = QuestionRepository;
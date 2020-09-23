class QuestionRepository {
	
	async get(survey, rank) {
		return survey
			.questions ()
			.where ('rank', rank)
			.first ();
	}
	
	async nextQuestion(survey, rank)
	{
		return survey
			.questions ()
			.where ('rank', rank + 1)
			.first ();
	}
}
module.exports = QuestionRepository;
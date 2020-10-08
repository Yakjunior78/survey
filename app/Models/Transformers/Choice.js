class QuestionTransformer {
	
	async transform(choice) {
		
		let question = await choice.question().first();
		let response = await question.responses().where('response', choice.value).getCount()
		
		return {
			id: choice.id,
			name: choice.label,
			responses: response
		}
	}
}

module.exports = QuestionTransformer;
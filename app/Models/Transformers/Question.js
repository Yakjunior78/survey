class QuestionTransformer {
	
	async transform(question) {
		
		return {
			uuid: question.uuid,
			question: question.question,
			input: await question.inputType().first(),
			options: await question.choices().fetch(),
			conditions: await question.conditions().fetch(),
			type: await question.type().first()
		}
	}
}

module.exports = QuestionTransformer;
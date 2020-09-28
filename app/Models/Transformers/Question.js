class QuestionTransformer {
	
	async transform(question) {
		
		let type = await question.type().first();
		let inputType = await question.inputType().first();
		
		return {
			id: question.id,
			uuid: question.uuid,
			question: question.question,
			input: inputType,
			input_type_id: inputType.id,
			options: await question.choices().fetch(),
			conditions: await question.conditions().fetch(),
			question_type_id: type.id,
			questionType: type,
		}
	}
}

module.exports = QuestionTransformer;
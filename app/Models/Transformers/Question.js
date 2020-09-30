class QuestionTransformer {
	
	async transform(question) {
		
		let type = await question.type().first();
		let inputType = await question.inputType().first();
		
		return {
			id: question.id,
			uuid: question.uuid,
			question: question.question,
			required: question.required ? true : false,
			multiple: question.multiple ? true : false,
			input: inputType ? inputType : null,
			input_type_id: inputType ? inputType.id : null,
			options: await question.choices().fetch(),
			conditions: await question.conditions().fetch(),
			question_type_id: type ? type.id : null,
			questionType: type ? type : null,
		}
	}
}

module.exports = QuestionTransformer;
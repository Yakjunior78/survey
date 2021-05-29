const ConditionModel = use('App/Models/Condition');

class QuestionTransformer {

	async transform(question) {

		if(!question) {
			return {};
		}

		let type = await question.type().first();
		let inputType = await question.inputType().first();

		return {
			id: question.id,
			uuid: question.uuid,
			question: question.question,
			required: question.required,
			multiple: !!question.multiple,
			input: inputType ? inputType : null,
			input_type_id: inputType ? inputType.id : null,
			options: await question.choices().fetch(),
			conditions: await this.conditions(question),
			question_type_id: type ? type.id : null,
			questionType: type ? type : null,
			rank: question.rank,
			response: await question.responses().fetch()
		}
	}

	async conditions(question)
	{
		let conditions = await question.conditions().orderBy('created_at', 'desc').fetch();

		conditions = conditions.toJSON();

		let transformedConditions = [];

		for (let i = 0; i < conditions.length; i++) {

			let condition = await ConditionModel.findOrFail(conditions[i].id);

			let transformed = {
				id: condition.id,
				question_id: condition.question_id,
				next_question_id: condition.next_question_id,
				operand_id: condition.operand_id,
				limit: condition.limit,
				min: condition.min,
				max: condition.max,
				end: condition.end,
				operand: await condition.operand().first()
			}

			transformedConditions.push(transformed);
		}

		return transformedConditions;
	}
}

module.exports = QuestionTransformer;

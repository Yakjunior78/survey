class QuestionTransformer {

	async transform(choice, data) {

		console.log(choice.value, 'this is te value')

		let question = await choice.question().first();

		let instance = data && data.instance ? data.instance : null;

		let response = await question.responses()
			.where('response', choice.value)
			.whereHas('session', (session) => {
				session.where('instance_id', instance.id)
			})
			.getCount()

		return {
			id: choice.id,
			name: choice.label,
			responses: response
		}
	}
}

module.exports = QuestionTransformer;

const InstanceRepo = new(use('App/Modules/Instances/InstanceRepository'))();

const InstanceModel = use('App/Models/Instance');
const ResponseModel = use('App/Models/Response');
const QuestionTypeModel = use('App/Models/QuestionType');

class Response {

	async record(session, data, channel)
	{
		let question = await session.question().first();

		let validator = await this.validate(question, data);

		if(!validator) {
			return false;
		}

		if(!question) return null;

		let response = data.message;

		let choice = null;

		switch(channel.slug) {
			case 'sms':

				choice = await question.choices().where('rank', data.message).first();

				if(!choice) {
					choice = await question.choices().where('value', data.message).first();
				}

				response = choice && choice.id ? choice.value : data.message;

				break;

			case 'web':
			case 'chat':

				choice = await question.choices().where('id', data.message).first();
				response = choice && choice.id ? choice.value : data.message;

				break;

			default:
				response = data.message;
				break;
		}

		return await ResponseModel.create({
			response: response,
			question_id: question.id,
			contact_id: session.contact_id,
			session_id: session.id,
			channel_id: channel.id
		});
	}

	async validate(question, data)
	{
		let response = data.message;

		let type = await question.type().first();

		if(!type) {
			type = await QuestionTypeModel.query().where('slug', 'open_ended').first();
		}

		let responseArray = [];

		switch(type.slug) {
			case 'multiple_choice':
			case 'rating_scale':
			case 'image_choice':
			case 'ranking':

				responseArray = Array.from(String(response), Number);

				const newArray = responseArray.filter(function (value) {
					return !Number.isNaN(value);
				});

				let exists = await question.choices ().whereIn ('rank', newArray).getCount ();

				if(!exists) {
					exists = await question.choices ().where ('value', data.message).getCount ();
				}

				return exists > 0;

			case 'closed_ended':
			case 'open_ended':
			case 'demographic':
				return response !== '' || response !== undefined || true
			default:
				return true;
		}
	}
}

module.exports = Response;

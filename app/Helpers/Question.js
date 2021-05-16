'use strict';

const QuestionModel = use('App/Models/Question');

const smsReply = async (question, repeat) => {

	if(!question || (question && !question.id)) {
		return 'Thank you for participating in our survey. Good bye.'
	}

	question = await QuestionModel.query().where('id', question.id).first();

	let additional = '';

	if(repeat) {
		additional = 'Kindly respond with correct value as below: ';
	}

	let description = additional + '' + question.question;

	let type = await question.type().first();

	console.log(type, 'this is the type');

	let choice_string = '';

	switch(type.slug) {
		case 'multiple_choice':
			let choices = await question.choices().fetch();
			choice_string = await formatChoices(choices);
			break;
		case 'open_ended':
			choice_string = '';
			break;
		default:
			choice_string = '';
			break;
	}

	return description + '\n' + choice_string;
}

async function formatChoices(choices)
{
	if(!choices) {
		return '';
	}

	let reply = 'Reply with: ';

	choices = choices.toJSON();

	for (let i = 0; i < choices.length; i++) {
		let value = choices[i].rank;
		let label = choices[i].label;

		let choiceString = '\n '+ '('+value+') '+label;

		reply = reply + ' ' + choiceString;
	}

	return reply;
}

const jsonReply = async (question, repeat) =>
{
	let additional = '';

	if(repeat) {
		additional = 'Kindly respond with correct value as below: ';
	}

	let description = additional + '' + question.question;

	return {
		status: 201,
		message: 'Response saved successfully',
		note: description,
		question: question
	}
}

module.exports = {
	smsReply,
	jsonReply
}

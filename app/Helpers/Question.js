'use strict';

const smsReply = async (question) => {
	
	if(!question || (question && !question.id)) {
		return 'Thank you for participating in our survey. Good bye.'
	}
	
	let description = question.question;
	
	let type = await question.questionType;
	
	let choice_string = '';
	
	switch(type.slug) {
		case 'multiple_choice':
			let choices = question.options;
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

const jsonReply = async (question) =>
{
	return {
		status: 201,
		message: 'Response saved successfully',
		question: question
	}
}

module.exports = {
	smsReply,
	jsonReply
}
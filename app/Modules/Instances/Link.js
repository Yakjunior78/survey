'use strict';
const Env = use('Env');

class Link {
	async generate(instance) {
		
		let survey = await instance.survey().first();
		console.log('4:Survey found');
		
		let message = instance.introductory_message;
		
		if(message === '') {
			message = 'Hello, below is the link to '+ survey.title;
		}
		
		let link = Env.get('SURVEY_WEB_URI')+'/survey/'+survey.uuid+'/'+instance.uuid;
		
		console.log('5:Message found');
		
		return message + '\n' + link;
	}
}

module.exports = Link;
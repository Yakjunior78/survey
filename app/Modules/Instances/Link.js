'use strict';

class Link {
	async generate(instance) {
		
		let survey = await instance.survey().first();
		
		let message = instance.introductory_message;
		
		if(message === '') {
			message = 'Hello, below is the link to '+ survey.title;
		}
		
		let link = Env.get('SURVEY_WEB_URI')+'/survey/'+survey.uuid+'/'+instance.uuid;
		
		return message + '\n' + link;
	}
}

module.exports = Link;
'use strict';

const axios = require('axios');
const Env = use('Env');

const SMSAuth = new(use('App/Modules/Auth/SMS'))();

const base_url = Env.get('SMS_API_BASE_URI');
const projectId = Env.get('SMS_PROJECT_ID');

class SMSSender {
	
	async sendBulkSms(data) {

		let headers = await SMSAuth.headers();
		
		return await axios.post(base_url + '/projects/'+projectId+'/sms/bulk', data, { headers: headers })
			.then( ({ data }) => {
				return data;
			})
			.catch( (resp) => {
				return resp;
			});
	}
}

module.exports = SMSSender;
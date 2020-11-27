'use strict';

const axios = require('axios');
const Env = use('Env');

const Auth = new(use('App/Services/SMS/Auth'))();

const base_url = Env.get('SMS_API_BASE_URI');
const projectId = Env.get('SMS_PROJECT_ID');

class Send {
	
	async handle(data) {
		
		let headers = await Auth.headers();
		
		console.log(data, 'this is the data');
		
		return await axios.post(base_url + '/projects/'+projectId+'/sms/bulk', data, { headers: headers })
			.then( ({ data }) => {
				console.log(data, 'sms sent successfully');
				return data;
			})
			.catch( (resp) => {
				console.log(resp.data, 'Failed to send sms');
				return resp;
			});
	}
}

module.exports = Send;
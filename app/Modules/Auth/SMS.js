'use strict';

const Env = use('Env');
const axios = require('axios');

const base_url = Env.get('SMS_API_BASE_URI');

class SMSAuth {
	
	async apiToken() {
		return await axios.post( base_url+'/oauth/token', this.oauthIds(), { header: this.tokeHeaders() })
			.then( ({ data })=> {
				return data.access_token;
			})
			.catch( (rep) => {
				return rep;
			});
	}
	
	oauthIds() {
		return {
			client_id: Env.get('APP_CLIENT_ID'),
			client_secret: Env.get('APP_CLIENT_SECRET'),
			grant_type: 'client_credentials'
		}
	}
	
	async tokeHeaders() {
		return {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		};
	}
	
	async headers() {
		return {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + await this.apiToken()
		};
	}
}

module.exports = SMSAuth;
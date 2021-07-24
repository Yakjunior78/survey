'use strict';

const Env = use('Env');
const axios = require('axios');

const base_url = Env.get('XEMA_API_BASE_URI');

class Auth {

	async apiToken() {

		return await axios.post(
				base_url+'/profile-services/customers/login',
				await this.oauthCredentials())
			.then( ({ data })=> {
				return data.result.data.token;
			})
			.catch( (rep) => {
				return rep;
			});
	}

	async oauthCredentials()
	{
		return {
			'username': '254718532419',
			'password': 'X8l5CScI4LpietiOyT8clA=='
		}
	}

	oauthIds() {
		return {
			client_id: Env.get('SMS_APP_CLIENT_ID'),
			client_secret: Env.get('SMS_APP_CLIENT_SECRET'),
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

module.exports = Auth;

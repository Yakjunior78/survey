'use strict';

const axios = require('axios');
const Env = use('Env');

const Auth = new(use('App/Services/SMS/Auth'))();

const base_url = Env.get('XEMA_API_BASE_URI');

class Send {

	async handle(data) {

		let token = await Auth.apiToken();

		data.providerCode = Env.get('SMS_PROVIDER');

		return await axios.post(
			base_url + '/messaging-services/message/send-'+data.type,
			data,
			{
				headers: {
					Authorization: 'Bearer '+token
				}
			})
			.then( ({ data }) => {
				console.log(data, 'sms sent successfully');
				return data;
			})
			.catch( (err) => {
				console.log(err.message, 'Failed to send sms');
				return err;
			});
	}
}

module.exports = Send;

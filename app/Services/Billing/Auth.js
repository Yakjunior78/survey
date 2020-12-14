const axios = require('axios');
const Env = use('Env');

class Auth {
	async token()
	{
		return Env.get('BILLING_ACCESS_TOKEN');
		
		return await axios.post(
			Env.get('BILLING_URL') + '/api/oauth/token',
			{
				'client_id': Env.get('BILLING_CLIENT_ID'),
				'client_secret': Env.get('BILLING_CLIENT_SECRET'),
				'grant_type': 'client_credentials',
			},
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			})
			.then(({ data }) => {
				console.log(data, 'this is the account')
				return data.access_token;
			})
			.catch( (res) => {
				console.log(res, 'Failed to login to billing');
			})
	}
}

module.exports = Auth;
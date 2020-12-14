const axios = require('axios');
const Env = use('Env');

class Auth {
	async token()
	{
		return await axios.post(
			Env.post('BILLING_URL') + '/api/auth/login',
			{
				'username': Env.get('BILLING_API_USERNAME'),
				'password': Env.get('BILLING_API_PASSWORD'),
			},
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			})
			.then(({ data }) => {
				
				console.log(data, 'this is the token')
				return data.access_token;
			})
			.catch( (res) => {
				console.log(res, 'Failed to login to billing');
			})
	}
}

module.exports = Auth;
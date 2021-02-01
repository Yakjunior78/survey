'use strict';

const Env = use('Env');
const axios = require('axios');

class AuthenticateUser {
	
	async handle ({ request, response }, next)
	{
		let token = request.header('Authorization');
		
		return await this.validate(request, response, token, next);
	}
	
	async wsHandle ({ request, response }, next )
	{
		let req = request.all();
		let token = req.token;
		
		return await this.validate(request, response, token, next);
	}
	
	async validate(request, response, token, next)
	{
		return await axios.get(
			Env.get('APP_AUTH_URL') + '/api/user/details',
			{
				headers: {
					Accept: 'application/json',
					Authorization: token
				}
			})
			.then( async ({ data }) => {
				
				console.log(data, 'this is the data');
				
				if(data.status === 200) {
					request.user = data.user;
				}
				
				await next();
			})
			.catch( (err) => {
				console.log(err, 'this is the data');
				return this.unauthorised(response, err);
			});
	}
	
	async unauthorised(response, err)
	{
		return response.status(401).json({
			status: 401,
			message: 'Unauthorised',
			err: err
		});
	}
}

module.exports = AuthenticateUser
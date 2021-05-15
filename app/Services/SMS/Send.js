'use strict';

const axios = require('axios');
const Env = use('Env');

const Auth = new(use('App/Services/SMS/Auth'))();

const base_url = Env.get('SMS_API_BASE_URI');
const projectId = Env.get('SMS_PROJECT_ID');

class Send {

	async handle(data) {

		return await axios.post(
			base_url + '/send-bulksms',
			data,
			{
				headers: {
					Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SUQiOjMsImFjY291bnROdW1iZXIiOiI4MjY5MjM1NzU5ODE0MjI5MTA0MzQ3MTQxIiwiYWNjb3VudENyZWRpdEJhbGFuY2UiOiJzbEt4NUE3ZVloeFJBWlk3bnpGdnBnPT0iLCJhY3RpdmUiOjEsInByb2ZpbGVJRCI6MSwicGFzc3dvcmRIYXNoIjoiZDU4ZmM4ZGFmMDBlOWJjM2UyODRjODUzMjZhODQ4NmRmMjg0MjEyZDdjYzY5Y2Y1NjJlNzI1NGI2ZDM0YTkzMSIsIm1zaXNkbiI6MjU0NzE4NTMyNDE5LCJwcm9maWxlU3RhdHVzSUQiOjEsInBhc3N3b3JkU3RhdHVzIjoxLCJkYXRlTGFzdEFjY2Vzc2VkIjoiMjAyMS0wNC0yNVQyMDozODozMS4wMDBaIiwiZGF0ZVBhc3N3b3JkQ2hhbmdlZCI6IjIwMjEtMDQtMjVUMjA6Mzg6MzEuMDAwWiIsImZpcnN0TmFtZSI6IkJyaWFuIiwibGFzdE5hbWUiOiJLYW1hdSIsImVtYWlsQWRkcmVzcyI6ImJyaWFuLmthbUBnbWFpbC5jb20iLCJpYXQiOjE2MjEwODA0NjIsImV4cCI6MTYyMTA5MTI2Mn0.63-DsAwzZ-LgjgtXNcBjnraEGGmj9K2LoNTyhqd9nMw'
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

const moment = use('moment');
const Env = use('Env');


class ResponseTransformer {
	
	async transform(response) {
		return {
			question: await response.question().first(),
			response: await response.response,
		}
	}
}

module.exports = ResponseTransformer;
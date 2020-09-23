const SenderModel = use('App/Models/Sender');

class SenderRepository {
	get(code) {
		return SenderModel
			.query()
			.where('code', code)
			.first();
	}
}

module.exports = SenderRepository;
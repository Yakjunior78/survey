const SenderModel = use('App/Models/Sender');
const CompanyModel = use('App/Models/Company');


class SenderRepository {

	async all(identity) {
		return await SenderModel
			.query ()
			.where ('code', '20880')
			.fetch();
	}

	get(code) {
		return SenderModel
			.query()
			.where('code', code)
			.first();
	}
}

module.exports = SenderRepository;

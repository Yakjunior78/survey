const SenderModel = use('App/Models/Sender');
const CompanyModel = use('App/Models/Company');


class SenderRepository {
	
	async all(identity) {
		return await SenderModel
			.query ()
			.whereHas ('company', (company) => {
				company.where ('identity', identity)
			})
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
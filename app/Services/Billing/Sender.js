const CompanyModel = use('App/Models/Company');
const SenderModel = use('App/Models/Sender');

const Env = use('Env');

class Sender {
	
	async store(user)
	{
		let company = await CompanyModel.create({
			name: 'Emalify ' +user.customer_account,
			slug: 'emalify ' + user.customer_account,
			description: 'Survey account for the account no' +user.customer_account,
			identity: user.customer_account,
			created_by_name: user.name,
		});
		
		return await  SenderModel.create({
			code: Env.get('DEFAULT_SENDER_CODE'),
			company_id: company.id
		})
	}
}

module.exports = Sender;
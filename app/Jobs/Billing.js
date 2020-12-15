const InstanceModel = use('App/Models/Instance');
const Credit = use('App/Services/Billing/Credit');

const Database = use('Database');
const Env = use('Env');

class Billing {
	
	async handle(data)
	{
		let instance = await InstanceModel.find(data.id);
		
		if(!instance) {
			console.log('Instance of survey instance not found');
			return ;
		}
		
		let size = await this.fileSize(instance);
		
		console.log(size, 'this is the size');
		
		let plan = await this.plan(instance);
		
		console.log(plan, 'this is the plan');
		
		await Credit.handle(plan, size, 'Usage for survey dispatch');
		
		console.log('billed');
		
		instance.billed = true;
		
		return instance.save();
	}
	
	async record(subscription)
	{
		let data = {
			"subscription_id": "626",
			"company_id": "1",
			"unique_id": "1675949159296675-168594817292902230",
			"breakdown": [
				{
					"plan_id": "39",
					"quantity": "2"
				}
			],
			"timestamp": "1607004706",
			"description": "This is a usage log deducting from the balannce to level the customers previus balance.",
			"metadata": {}
		}
	}
	
	async fileSize(instance)
	{
		let group = await this.group(instance.group_id);
		
		if(!group) {
			console.log('Instance of survey contact group not found');
			return ;
		}
		
		let file = await Database.connection('mysqlSMS')
			.from('file_upload_queues')
			.where('contact_groups_id', group.id)
			.first();
		
		return file ? file.count : 0;
	}
	
	async group(id)
	{
		return Database.connection ('mysqlSMS')
			.from ('contact_groups')
			.where ('id', id)
			.first ();
	}
	
	async plan(instance)
	{
		let survey = await instance.survey().first();
		
		let company = await survey.company().first();
		
		let accountBilling = await Database.connection('mysqlAuth')
			.from('account_billings')
			.where('account', company.identity)
			.first();
		
		return await Database.connection('mysqlAuth')
			.from('plans')
			.where('customer_id', accountBilling.customer_id)
			.where('plan_id', Env.get('BILLING_PRE_PAYMENT_PLAN_ID'))
			.first();
	}
}

module.exports = Billing;
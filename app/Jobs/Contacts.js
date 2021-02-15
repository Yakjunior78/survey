const Database = use('Database');
const CompanyModel = use('App/Models/Company');
const GroupModel = use('App/Models/Group');
const ContactModel = use('App/Models/Contact');
const InstanceModel = use('App/Models/Instance');

const Dispatch = new(use('App/Services/Survey/Dispatch'))();
const ContactHandler = new(use('App/Modules/Contacts/ContactsHandler'))();

const { getGroup, getFile, getCompany } = use('App/Helpers/Contacts');

const GroupHandler = new(use('App/Modules/Contacts/Group'))();

class Contacts {
	
	async clone(instance)
	{
		instance = await InstanceModel.find(instance.id);
		
		if(instance.cloned) {
			console.log('Instance already cloned');
			return;
		}
		
		let group = await getGroup(instance.group_id);
		
		if(!group) {
			console.log('CONTACTS CLONING: contact group was not identified');
			return;
		}
		
		let file = await getFile(group.id);
		
		if(!file) {
			console.log('CONTACTS CLONING: contact group details was not identified');
			return;
		}
		
		let company = await getCompany(group.customer_account);
		
		let contactGroup = await GroupHandler.getByCode(group.id);
		
		if(!contactGroup) {
			console.log('CONTACTS CLONING: started');
			await ContactHandler.clone(group, company, file);
		}
		
		instance.cloned = true;
		
		await instance.save ();
		
		return await Dispatch.handle(instance);
	}
}

module.exports = Contacts;
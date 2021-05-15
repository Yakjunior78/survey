const ContactModel = use('App/Models/Contact');
const ProfileContactGroupModel = use('App/Models/ProfileContactGroup');
const ProfileContactModel = use('App/Models/ProfileContact');
const XemaContactModel = use('App/Models/XemaContact');

const repo = new(use('App/Modules/Contacts/ContactRepository'))();
const GroupHandler = new(use('App/Modules/Contacts/Group'))();

const Database = use('Database');
const Logger = use('Logger');

class ContactsHandler {

	async find(data, channel)
	{
		switch(channel.slug) {
			case 'sms':
				return await repo.forSms(data);
			case 'web':
				return await repo.forWeb(data);
			default:
				return null;
		}
	}

	async validate(data)
	{
		let contact = await ContactModel.query().where('uuid', data.cid).first();

		if(!contact) {
			return await repo.createSingleContact(data);
		}

		return contact;
	}

	async clone(group)
	{
		let profileContactGroup = await ProfileContactGroupModel
			.query()
			.where('contactGroupID', group.contactGroupID)
			.first()

		console.log(profileContactGroup.profileContactGroupMappingID, 'id');

		let contacts = await XemaContactModel
			.query()
			.whereHas('profileContacts', (query) => {
				query.where('profileContactGroupMappingID', profileContactGroup.profileContactGroupMappingID)
			})
			.fetch();

		contacts = contacts.toJSON();

		let contactGroup = await GroupHandler.store({
			title: group.contactGroupName,
			code: group.contactGroupID,
			company_id: profileContactGroup.profileID
		});

		for (const contact of contacts) {
			await ContactModel.create({
				group_id: contactGroup.id,
				company_id: profileContactGroup.profileID,
				msisdn: contact.destination,
				fname: contact.fullNames ? contact.fullNames : null,
				lname: contact.fullNames ? contact.fullNames : null
			});
		}

		Logger.info('ended at : ' + Date.now());

		return true;
	}
}

module.exports = ContactsHandler;

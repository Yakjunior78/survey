const GroupModel = use('App/Models/Group');

class Group {
	
	async getByCode(code)
	{
		return await GroupModel
			.query()
			.where('code', code)
			.first();
	}
	
	async store(data)
	{
		return GroupModel.create (data);
	}
}

module.exports = Group;
const Instance = use('App/Models/Instance');

class Dispatch {
	
	async constructor ({ id }) {
		this.instance = await Instance.find(id);
	}
	
	async handle()
	{
		console.log(this.instance, 'this is the instance');
	}
}

module.exports = Dispatch;
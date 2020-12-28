const Instance = use('App/Models/Instance');
const Channel = use('App/Models/Channel');

const SMS = new(use('App/Services/Survey/SMS'))();
const Twitter = new(use('App/Services/Survey/Twitter'))();
const Facebook = new(use('App/Services/Survey/Facebook'))();
const Email = new(use('App/Services/Survey/Email'))();
const Whatsapp = new(use('App/Services/Survey/Whatsapp'))();

class Dispatch {
	
	async handle(instance)
	{
		let channel = await instance.channel().first();
		
		return channel;
	
		switch(channel.slug) {
			
			case 'sms':
				return await SMS.handle(instance);
				
			case 'twitter':
				return await Twitter.handle(instance);
			
			case 'facebook':
				return await Facebook.handle(instance);
			
			case 'email':
				return await Email.handle(instance);
			
			case 'whatsapp':
				return await Whatsapp.handle(instance);
				
			default:
				return;
		}
	}
}

module.exports = Dispatch;
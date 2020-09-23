'use strict';

const { Command } = require('@adonisjs/ace');
const Event = use('Event');

const Response = new(use('App/Modules/Surveys/Response'))();
const SessionHandler = new(use('App/Modules/Session/SessionHandler'))();

const InstanceModel = use('App/Models/Instance');
const ContactModel = use('App/Models/Contact');
const ChannelModel = use('App/Models/Channel');
const SurveyModel = use('App/Models/Survey');

class Test extends Command {
    
    static get signature () {
        return 'test';
    }
    
    static get description () {
        return 'Tell something helpful about this command';
    }
    
    async handle(args, options) {
        
        let instance = await InstanceModel.find(79);
        let contact = await ContactModel.find(15);
        let sender = null;
        let channel = await ChannelModel.find(2);
    
        let result = await SessionHandler.handle(contact, instance, sender, channel);
        
        console.log(result, 'this is the result');
    }
}

module.exports = Test

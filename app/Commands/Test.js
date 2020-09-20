'use strict';

const { Command } = require('@adonisjs/ace');
const Response = new(use('App/Modules/Surveys/Response'))();

const ContactModel = use('App/Models/Contact');
const SurveyModel = use('App/Models/Survey');

class Test extends Command {
    
    static get signature () {
        return 'test';
    }
    
    static get description () {
        return 'Tell something helpful about this command';
    }
    
    async handle(args, options) {
        
        let contact = await ContactModel.first();
        
        console.log(contact.msisdn, 'contacts');
        
        return true;
    }
}

module.exports = Test

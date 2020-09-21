'use strict';

const { Command } = require('@adonisjs/ace');
const Event = use('Event');

const Response = new(use('App/Modules/Surveys/Response'))();

const InstanceModel = use('App/Models/Instance');
const SurveyModel = use('App/Models/Survey');

class Test extends Command {
    
    static get signature () {
        return 'test';
    }
    
    static get description () {
        return 'Tell something helpful about this command';
    }
    
    async handle(args, options) {
        
        let instanceModel = await InstanceModel.find(79);
        
        return Event.fire('new::instance', instanceModel);
    }
}

module.exports = Test

'use strict'

const { Command } = require('@adonisjs/ace');
const Response = new(use('App/Modules/Surveys/Response'))();
const SurveyModel = use('App/Models/Survey');

class Test extends Command {
  
    static get signature () {
        return 'test'
    }

    static get description () {
        return 'Tell something helpful about this command';
    }
  
    async handle (args, options) {
        
        let survey = await SurveyModel.find(1);
        
        return true;
    }
}

module.exports = Test

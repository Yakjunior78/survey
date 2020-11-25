'use strict';

const { Command } = require('@adonisjs/ace');
const Auth = new(use('App/Modules/Auth/SMS'))();

class TestAuth extends Command {
  
    static get signature () {
        return 'scheduler:run';
    }

    static get description () {
        return 'Tell something helpful about this command';
    }

    async handle (args, options) {
        console.log('this scheduler is running');
        return;
    }
}

module.exports = TestAuth

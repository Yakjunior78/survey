'use strict';

const { Command } = require('@adonisjs/ace');
const Env = use('Env');

const SMS = new(use('App/Modules/Surveys/SMS'))();

class TestSendingSms extends Command {
    
    static get signature () {
        return 'test:sending:sms'
    }

    static get description () {
        return 'Test sending sms via api call command'
    }

    async handle (args, options)
    {
        let data = await this.testData ();
        
        return await SMS.sendBulkSms(data);
    }
    
    async testData() {
        return {
            from: Env.get('DEFAULT_SHORT_CODE'),
            messages: [
                {
                  recipient: '254704664119',
                  message: 'Hi Yakov, how are you doing?'
                }
            ]
        }
    }
}

module.exports = TestSendingSms

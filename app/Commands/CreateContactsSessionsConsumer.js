'use strict';

const Env = use('Env');
const Logger = use('Logger');

const { Command } = require('@adonisjs/ace');
const {PubSub} = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();
const sub = Env.get('CREATE_SURVEY_INSTANCE_SESSIONS_SUBSCRIPTION');

const sessionHandler = new(use('App/Jobs/Session'))();

class CreateContactsSessionsConsumer extends Command {
    static get signature () {
        return 'create:contacts:sessions:consumer'
    }
    
    static get description () {
        return 'Create survey sessions';
    }
    
    async handle (args, options) {
      
        Logger.info('Contacts clone handler');
        
        const subscription = pubSubClient.subscription(sub);
        
        return subscription.on ('message', await this.messageHandler);
    }
    
    async messageHandler(message) {
      
        Logger.info('Session started');
        
        try {
            const payload = JSON.parse(Buffer.from(message.data, 'utf-8').toString());
            
            await sessionHandler.handle(payload.data);
            
            Logger.info('Session creation completed');
            
            return message.ack();
          
        } catch (e) {
            Logger.info(e.message, 'this is the error');
            return message.nack();
        }
    }
}

module.exports = CreateContactsSessionsConsumer

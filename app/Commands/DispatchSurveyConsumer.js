'use strict';

const { Command } = require('@adonisjs/ace');
const {PubSub} = require('@google-cloud/pubsub');

const Env = use('Env');
const Logger = use('Logger');
const sub = Env.get('DISPATCH_SURVEY_INSTANCE_SUBSCRIPTION');

const pubSubClient = new PubSub();

const instanceHandler = new(use('App/Jobs/Instance'))();

class DispatchSurveyConsumer extends Command {
  
  static get signature () {
    return 'dispatch:survey:consumer'
  }
  
  static get description () {
    return 'Dispatch survey instance';
  }
  
  async handle (args, options) {
    
    Logger.info('Listening to messages');
    
    const subscription = pubSubClient.subscription(sub);
    
    return subscription.on ('message', await this.messageHandler);
  }
  
  async messageHandler(message) {
    
    Logger.info('handling message');
    
    try {
      const payload = JSON.parse(Buffer.from(message.data, 'utf-8').toString());
      
      Logger.info('Sent for processing');
      
      await instanceHandler.dispatch(payload.data);
      
      Logger.info('Instance dispatched successfully');
      
      return message.ack();
      
    } catch (e) {
      Logger.info(e.message, 'this is the error');
      return message.nack();
    }
  }
}

module.exports = DispatchSurveyConsumer

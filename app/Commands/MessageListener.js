'use strict';

const { Command } = require('@adonisjs/ace');
const {PubSub} = require('@google-cloud/pubsub');
const Logger = use('Logger');

let MessageModel = use('App/Models/Message');

class MessageListener extends Command {
  
  static get signature () {
      return 'message:listener';
  }

  static get description () {
      return 'Listening to published messages';
  }

  async handle (args, options) {
      
      this.info('Started');
      
      await this.messageListen();
      
      this.info('Completed')
  }
  
  async messageListen () {
      
      let subscription = 'test-subscription';
      
      const pubSubClient = new PubSub();
      let sub = pubSubClient.subscription(subscription);
      
      await sub.on('message', this.messageHandler);
  }
  
  async messageHandler (message) {
      try {
          
          const payload = JSON.parse(Buffer.from(message.data, 'utf-8').toString());
          
          let msgModel = new MessageModel;
          
          msgModel.msisdn = payload.msisdn;
          msgModel.message = payload.message;
          
          await msgModel.save();
          
          message.ack();
          
      } catch (e) {
          console.log(e, 'this is the error');
          message.nack();
      }
  }
}

module.exports = MessageListener;

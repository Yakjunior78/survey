'use strict'

const { Command } = require('@adonisjs/ace')

class CloneContactsConsumer extends Command {
  static get signature () {
    return 'clone:contacts:consumer'
  }

  static get description () {
    return 'Tell something helpful about this command'
  }

  async handle (args, options) {
    this.info('Dummy implementation for clone:contacts:consumer command')
  }
}

module.exports = CloneContactsConsumer

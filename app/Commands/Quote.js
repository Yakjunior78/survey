'use strict'

const { Command } = use('@adonisjs/ace')
const got = use('got')

class Quote extends Command {
  static get signature () {
    return 'quote'
  }
  
  static get description () {
    return 'Shows inspirational quote from Paul Graham'
  }
  
  async handle (args, options) {
    const response = await got('https://wisdomapi.herokuapp.com/v1/author/paulg/random')
    const quote = JSON.parse(response.body)
    console.log(`${this.chalk.gray(quote.author.name)} - ${this.chalk.cyan(quote.author.company)}`)
    console.log(`${quote.content}`)
  }
}

module.exports = Quote
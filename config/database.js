'use strict';

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  /*
  |--------------------------------------------------------------------------
  | Sqlite
  |--------------------------------------------------------------------------
  |
  | Sqlite is a flat file database and can be good choice under development
  | environment.
  |
  | npm i --save sqlite3
  |
  */
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.databasePath(`${Env.get('DB_DATABASE', 'development')}.sqlite`)
    },
    useNullAsDefault: true
  },

  /*
  |--------------------------------------------------------------------------
  | MySQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MySQL database.
  |
  | npm i --save mysql
  |
  */
  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    }
  },
    
    mysqlContacts: {
        client: 'mysql',
        connection: {
            host: Env.get('DB_HOST_TEST', '35.240.42.252'),
            port: Env.get('DB_PORT_TEST', '3306'),
            user: Env.get('DB_USER_TEST', 'emalify'),
            password: Env.get('DB_PASSWORD_TEST', 'emalify@2019'),
            database: Env.get('DB_DATABASE_CONTACTS', 'ext_contacts')
        },
        pool: {
            acquireTimeoutMillis: 60 * 1000,
        }
    },
    
    mysqlSMS: {
        client: 'mysql',
        connection: {
            host: Env.get('DB_HOST_TEST', '35.240.42.252'),
            port: Env.get('DB_PORT_TEST', '3306'),
            user: Env.get('DB_USER_TEST', 'emalify'),
            password: Env.get('DB_PASSWORD_TEST', 'emalify@2019'),
            database: Env.get('DB_DATABASE_SMS', 'rt_sms')
        },
        pool: {
            acquireTimeoutMillis: 60 * 1000,
        }
    },

  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  pg: {
      client: 'pg',
      connection: {
          host: Env.get('DB_HOST', 'localhost'),
          port: Env.get('DB_PORT', ''),
          user: Env.get('DB_USER', 'root'),
          password: Env.get('DB_PASSWORD', ''),
          database: Env.get('DB_DATABASE', 'adonis')
      }
  }
}

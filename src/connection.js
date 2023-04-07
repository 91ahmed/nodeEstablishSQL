const mysqlConnect = require('./mysql/mysqlConnect')
const postgresConnect = require('./pg/postgresConnect')
const dataInspect = require('./sanitize/dataInspect')

/**
 *	Establish connection with database
 */
class connection
{
	constructor (config)
	{
		this.database

		// Set database driver
		if (typeof config.es_driver !== 'undefined')
		{
			if (config.es_driver === 'mysql-pool') 
			{
				this.database = new mysqlConnect()
				this.database.setPool(config.connect)
			} 
			else if (config.es_driver === 'mysql-client')
			{
				this.database = new mysqlConnect()
				this.database.setClient(config.connect)
			}
			else if (config.es_driver === 'pg-pool') 
			{
				this.database = new postgresConnect()
				this.database.setPool(config.connect)
			}
			else if (config.es_driver === 'pg-client') 
			{
				this.database = new postgresConnect()
				this.database.setClient(config.connect)
			}
		}
		else
		{
			throw "You have to define the database driver {es_driver: 'undefined'}"
		}

		// Set database table
		if (typeof config.es_table !== 'undefined')
		{
			this.database.setTable(dataInspect.filterTable(config.es_table))
		}
	}

	table (tablename)
	{
		this.database.setTable(dataInspect.filterTable(tablename))
	}

	query (callback = '')
	{
		return callback(this.database)
	}
}

module.exports = connection
const { Pool } = require('pg')
const { Client } = require('pg')
const builder = require('./postgresBuilder')

class postgresConnect extends builder
{
	constructor ()
	{
		super()

		this.table
		this.config
		this.connect
	}
	
	close ()
	{
		return this.connect.end()
	}

	setTable (tableName)
	{
		this.table = tableName
	}

	setPool (config)
	{
		this.config = config

		this.connect = new Pool(config)
	}

	setClient (config)
	{
		this.config = config

		this.connect = new Client(config)
		this.connect.connect()
	}

	async save (callback = '')
	{
		await this.connect.query(this.sqlQuery, this.data, (err, result) => 
		{
			// return callback with the result
			if (callback !== '') {
				return callback(result)
			}
		})

		// should empty after each query
		this.data = []
		// should reset the placeholder to 1 after each query
		this.placeholder = 1
	}

	async get (callback)
	{
		await this.connect.query(this.sqlQuery, this.data, (err, result) => 
		{
			// return callback with the result
			return callback(result)
		})

		// should empty after each query
		this.data = []
		// should reset the placeholder to 1 after each query
		this.placeholder = 1
	}
}

module.exports = postgresConnect
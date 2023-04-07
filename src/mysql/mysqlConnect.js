const mysql = require('mysql')
const mysqlBuilder = require('./mysqlBuilder')

class mysqlConnect extends mysqlBuilder
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

		this.connect = mysql.createPool(config)
	}

	setClient (config)
	{
		this.config = config

		this.connect = mysql.createConnection(config)
	}

	async save (callback = '')
	{
		await this.connect.query(this.sqlQuery, this.data, (err, results) => 
		{
			// return callback with the result
			if (callback !== '') {
				return callback(result)
			}
		})

		// Should empty after each query
		this.data = []
	}

	async get (callback, err = null)
	{
		await this.connect.query(this.sqlQuery, this.data, (err, results) => 
		{
			// return callback with the result
			return callback(results)
		})

		// Should empty after each query
		this.data = []
	}
}

module.exports = mysqlConnect
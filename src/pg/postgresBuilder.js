class postgresBuilder
{
	constructor ()
	{	
		this.placeholder = 1
		this.data = []
		this.sqlQuery = ''
		this.table = ''
	}

	update (set) 
	{
		if (typeof set !== 'object' || Array.isArray(set)) {
			throw "update() method accepts 1 parameter and should be type of object."
		}

		let setData = ''

		for (let column in set) 
		{
			this.data.push(set[column])
			setData += `${column} = $${this.placeholder}, `
			this.placeholder++
		}

		// trim comma and space from the end
		set = setData.replace(/,\s+$/, '')

		this.sqlQuery = `UPDATE ${this.table} SET ${set}`

		return this
	}

	insert (set) 
	{
		if (typeof set !== 'object' || Array.isArray(set)) {
			throw "insert() method accepts 1 parameter and should be type of object."
		}

		let columns = ''
		let values  = ''

		for (let column in set) 
		{
			columns += `${column}, `
			
			this.data.push(set[column])
			values += `$${this.placeholder}, `
			this.placeholder++
		}	

		// trim comma and space from the end
		columns = columns.replace(/,\s+$/, '')
		values  = values.replace(/,\s+$/, '')

		this.sqlQuery = `INSERT INTO ${this.table} (${columns}) VALUES (${values})`

		return this
	}

	delete () 
	{
		this.sqlQuery = `DELETE FROM ${this.table}`
		return this
	}

	select (columns) 
	{
		if (!Array.isArray(columns)) {
			throw "select() method accepts 1 parameter and should be type of array."
		}

		this.sqlQuery = `SELECT `

		for (let col in columns) 
		{
			this.sqlQuery += `${columns[col]}, `
		}

		// trim comma and space from the end
		this.sqlQuery = this.sqlQuery.replace(/,\s+$/, '')

		this.sqlQuery += ` FROM ${this.table}`

		return this
	}

	distinct (columns)
	{
		if (!Array.isArray(columns)) {
			throw "distinct() method accepts 1 parameter and should be type of array."
		}

		this.sqlQuery = `SELECT DISTINCT ${columns} FROM ${this.table}`
		return this	
	}

	all ()
	{
		this.sqlQuery = `SELECT * FROM ${this.table}`
		return this
	}

	where (column)
	{
		if (typeof column !== 'string') {
			throw "where() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` WHERE ${column}`

		return this
	}

	whereNot (column)
	{
		if (typeof column !== 'string') {
			throw "whereNot() method accepts 1 parameter and should be type of string."
		}

		this.data.push(column)
		this.sqlQuery += ` WHERE NOT ${column}`
		return this
	}

	isNull ()
	{
		this.sqlQuery += ` IS NULL`
		return this
	}

	isNotNull ()
	{
		this.sqlQuery += ` IS NOT NULL`
		return this
	}

	like (pattern)
	{
		if (typeof pattern !== 'string') {
			throw "like() method accepts 1 parameter and should be type of string."
		}

		this.data.push(pattern)

		this.sqlQuery += ` LIKE $${this.placeholder}::text`
		this.placeholder++

		return this
	}

	in (values)
	{
		if (!Array.isArray(values)) {
			throw "in() method accepts 1 parameter and should be type of array."
		}

		// In postgres I replace (IN) with (ANY) to accept array parameter
		this.data.push(values)

		this.sqlQuery += ` = ANY ($${this.placeholder})`
		this.placeholder++

		return this
	}

	between (value1, value2)
	{
		if (Array.isArray(value1) || Array.isArray(value2) || typeof value1 == 'object' || typeof value2 == 'object') {
			throw "between() method has invalid parameter value."
		}

		this.data.push(value1)
		this.data.push(value2)

		this.sqlQuery += ` BETWEEN $${this.placeholder}` 
		this.placeholder++
		this.sqlQuery += ` AND $${this.placeholder}`
		this.placeholder++

		return this
	}

	limit (limit)
	{
		if (typeof limit !== 'number') {
			throw "limit() method accepts 1 parameter and should be type of number."
		}

		this.data.push(limit)

		this.sqlQuery += ` LIMIT $${this.placeholder}::int`
		this.placeholder++

		return this
	}

	or (column)
	{
		if (typeof column !== 'string') {
			throw "or() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` OR ${column}`
		return this
	}

	and (column)
	{
		if (typeof column !== 'string') {
			throw "and() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` AND ${column}`
		return this
	}

	value (operator, value)
	{
		if (Array.isArray(operator) || Array.isArray(value) || typeof operator == 'object' || typeof value == 'object') {
			throw "value() method has invalid parameter value."
		}

		const operators = ['=', '<', '>', '!=', '<=', '>=', '<>']

		this.data.push(value)

		if (!operators.includes(operator)) {
			this.sqlQuery += ` = $${this.placeholder}`
		} else {
			this.sqlQuery += ` ${operator} $${this.placeholder}`
		}

		this.placeholder++

		return this
	}

	truncate ()
	{
		this.sqlQuery = `TRUNCATE ${this.table}`
		return this
	}

	innerJoin (table)
	{
		if (typeof table !== 'string') {
			throw "innerJoin() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` INNER JOIN ${table}`
		return this
	}

	leftJoin (table)
	{
		if (typeof table !== 'string') {
			throw "leftJoin() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` LEFT JOIN ${table}`
		return this
	}

	rightJoin (table)
	{
		if (typeof table !== 'string') {
			throw "rightJoin() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` RIGHT JOIN ${table}`
		return this
	}

	crossJoin (table)
	{
		if (typeof table !== 'string') {
			throw "crossJoin() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` CROSS JOIN ${table}`
		return this
	}

	fullJoin (table)
	{
		if (typeof table !== 'string') {
			throw "fullJoin() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` FULL OUTER JOIN ${table}`
		return this
	}
 
	on (column1, column2)
	{
		if (typeof column1 !== 'string' || typeof column2 !== 'string') {
			throw "on() method has invalid parameter value."
		}

		this.sqlQuery += ` ON ${column1} = ${column2}`
		return this
	}

	union (columns, table)
	{
		if (typeof columns !== 'string' || typeof columns !== 'string') {
			throw "union() method has invalid parameter value."
		}

		this.sqlQuery += ` UNION SELECT ${columns} FROM ${table}`
		return this
	}

	unionAll (columns, table)
	{
		if (typeof columns !== 'string' || typeof columns !== 'string') {
			throw "unionAll() method has invalid parameter value."
		}

		this.sqlQuery += ` UNION ALL SELECT ${columns} FROM ${table}`
		return this
	}

	groupBy (columns)
	{
		if (!Array.isArray(columns)) {
			throw "groupBy() method accepts 1 parameter and should be type of array."
		}

		this.sqlQuery += ` GROUP BY ${columns}`
		return this
	}

	having (column)
	{
		if (typeof column !== 'string') {
			throw "having() method accepts 1 parameter and should be type of string."
		}

		this.sqlQuery += ` HAVING ${column}`
		return this
	}

	orderBy (columns, sort = 'DESC')
	{
		if (!Array.isArray(columns)) {
			throw "orderBy() method first parameter should be type of array."
		}

		let order = ['DESC', 'ASC']

		if (order.includes(sort)) {
			this.sqlQuery += ` ORDER BY ${columns} ${sort}`
		} else {
			this.sqlQuery += ` ORDER BY ${columns} DESC`
		}
		
		return this
	}
}

module.exports = postgresBuilder
class dataInspect 
{
	filterTable (tableName)
	{
		// trim table name
		tableName = tableName.split(' ').join('') // trim space
		tableName = tableName.split(';').join('') // trim comma
		tableName = tableName.split('--').join('') // trim dash
		tableName = tableName.split('/*').join('') // trim comment
		tableName = tableName.split('*/').join('') // trim comment

		return tableName
	}

	dataType (val, type) 
	{
		if (typeof(val) != type) {
			throw 'Error: ('+val+') not valid data type it should be '+type
		} else {
			return val
		}
	}
}

module.exports = new dataInspect
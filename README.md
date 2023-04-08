## node establish sql

Elegant node.js query builder, provide an interface for mysql and postgresql drivers with appropriate methods to build SQL queries.

### Content
- [Features](#features)
- [How to install](#install-via-npm)
- [Full Example](#full-example)
- [Establish Connection](#establish-connection)
- [Specify the table name](#specify-the-table-name)
- [Get the connection object](#get-the-connection-object)
- [End Connection](#end-connection)
- [Select Statement](#select)
	- [Select All Columns](#select-all-columns)
	- [Select Specific Columns](#select-specific-columns)
	- [Select Distinct Values](#select-distinct-values)
  - [Select With Alias Name](#select-with-alias-name)
  - [Select With Aggregate Functions](#select-with-aggregate-functions)
- [Where Clause](#where-caluse)
  - [And - Or - Not](#and-or-not)
  - [Like - In - Between](#like-in-between)
  - [Is Null - Is Not Null](#is-null-and-is-not-null)
- [Order By - Limit](#orderby-and-limit)
- [Group By - Having](#groupby-and-having)
- [Joins (inner, left, right, full, cross)](#joins)
- [Union - Union All](#union-and-union-all)
- [Insert](#insert)
- [Update](#update)
- [Truncate](#truncate)
- [Delete](#delete)

### Features
* Support MysqL and PostgreSQL.
* Provide diverse methods to cover the majority of SQL statements.
* Invoke methods in chaining style to make them readable and concise.
* Use placeholders and filters for query values to prevent SQL Injection.

### Install via npm
``` bash
npm i node_establish_sql
```

### Full Example
``` javascript
// require the package
const connection = require('node_establish_sql')

// Create connection
const database = new connection({
    es_driver: 'mysql-pool', // specify the database driver
    es_table: 'tablename', // specify the database table name

    // provide your connection information
    connect: 
    {
      host: 'localhost',
      user: 'user-name',
      password: '12345',
      database: 'database-name',
      port: 3306
    }
})

// build your SQL Query
database.query((sql) => 
{
    sql.all()
       .where('id')
       .between(5, 30)
       .orderBy(['name'], 'ASC')
       .limit(5)
       .get((result) => {
          // Get the result
          console.log(result)
          // Close connection
          sql.close()
       })
})
```

### Establish Connection
To initialize connection just add an object with the database information to the class, you can through this object specify the connection driver, table and the database connection information.

The query builder supports [mysql](https://www.npmjs.com/package/mysql) and [postgresql](https://node-postgres.com/) database drivers, you can specify the driver through "es_driver" property by selecting one of these connection types ( `mysql-client` - `mysql-pool` - `pg-client` - `pg-pool` ). 

**Example**
``` javascript
const database = new connection({
    // database driver
    // [mysql-client, mysql-pool, pg-client, pg-pool]
    es_driver: 'mysql-pool',
    // database table
    es_table: 'tablename', 

    // Connection information
    connect: 
    {
      host: 'localhost',
      user: 'user-name',
      password: '1234',
      database: 'database-name',
      port: 3306
    }
})
``` 

Read about the different between pool and client connection.<br/>
[https://node-postgres.com/features/pooling](https://node-postgres.com/features/pooling) 

### Specify the table name
Like the previous example you can determine the name of the table within the connection object by provide the table name to the "es_table" properity ``{es_table: "tablename"}`` or you can use ``table()`` method.

**Example**
``` javascript
// specify the table name within the connection object
const database = new connection({
    es_driver: 'mysql-pool', // database driver
    es_table: 'your-table-name', // table name

    // Connection information
    connect: 
    {
      host: 'localhost',
      user: 'user-name',
      password: '1234',
      database: 'database-name',
      port: 3306
    }
})

// specify the table name through table method
database.table('your-table-name')
```

### Get the Connection Object
Use the ``connect`` property to tap into the features of the client and pool connecitons of mysql and postgresql drivers, This property returns the connection object of the database driver.

**Example**
``` javascript
database.query((sql) => 
{
    // connection object
    sql.connect

    /** Some Examples **/

    // Write sql query
    sql.connect.query('SELECT * FROM users', (err, res) => {
      console.log(res)
    }) 

    // end connection
    sql.connect.destroy()
})
```

### End Connection
It is advisable to end the database connection after you are done with the query and to do this you can use ``close()`` method.

**Example**
``` javascript
database.query((sql) => 
{
    // SELECT * FROM table
    sql.all()
       .get((result) => {
           console.log(result) // result

           sql.close() // close connection
       })
})
```

### Select
The query builder provide three methods to select table columns.

**Method** | **Describe** | **Parameters** | **Output**
:--- | :--- | :--- | :---
``all()`` | This method selects all columns from the table. | no parameters needed | _SELECT *_
``select()`` | This method will help you to select specific columns from the table. | _(array)_ the columns you need to select | _SELECT columns_
``distinct()`` | This method will return distinct (different) results | _(array)_ the columns you need to select | _SELECT DISTINCT columns_

#### Select all columns
``` javascript
database.query((sql) => 
{
    // SELECT * FROM table
    sql.all()
       .get((result) => {
           console.log(result) // result
       })
})
```

#### Select specific columns
``` javascript
database.query((sql) => 
{
    // SELECT column1, column2 FROM table
    sql.select(['column1', 'column2'])
       .get((result) => {
            console.log(result) // result
       })
})
```

#### Select distinct values
``` javascript
database.query((sql) => 
{
    // SELECT DISTINCT column1, column2 FROM table
    sql.distinct(['column1', 'column2'])
       .get((result) => {
           console.log(result) // result
       })
})
```

#### Select with alias name
``` javascript
database.query((sql) => 
{
    // SELECT column1 AS col1, column2 AS col2 FROM table
    sql.select([
          'column1 AS col1', 
          'column2 AS col2'
        ])
       .get((result) => {
            console.log(result) // result
       })
})
```

#### Select with aggregate functions
``` javascript
database.query((sql) => 
{
    /**
      SELECT 
      COUNT(id) AS id_count, 
      MAX(price) AS max_price,
      MIN(price) AS min_price,
      SUM(price) AS total_price
      FROM table
    **/
    sql.select([
          'COUNT(id) AS id_count', 
          'MAX(price) AS max_price',
          'MIN(price) AS min_price',
          'SUM(price) AS total_price'
        ])
       .get((result) => {
            console.log(result) // result
       })
})
```

### Where Clause
Adding where clause is very important to filter the columns.
Here are the available methods that will help you to build your **Where** condition.

**Method** | **Describe** | **Parameters** | **Output**
:--- | :--- | :--- | :---
``where()`` | Allow you to filter rows using where clause | _(string)_ the column | _WHERE column_
``value()`` | Used to specify the **operator** and the **value** after where statement.<br/>``=``  ``<``  ``>``  ``<=``  ``>=``  ``<>``  ``!=`` | _(string)_ the operator <br/> _(mixed)_ the value | _= value_

**Example**
``` javascript
database.query((sql) => 
{
    // SELECT * FROM table WHERE column > 5
    sql.all()
       .where('column').value('>', 5)
       .get((result) => {
           console.log(result)
       })
})
```

### And Or Not

These operators are used to combine with **where** condition to get accurate results.

**Method** | **Parameters** | **Output**
:--- | :--- | :---
``and()`` | _(string)_ column name | _AND column_
``or()`` | _(string)_ column name | _OR column_
``whereNot()`` | _(string)_ column name | _WHERE NOT column_

**Example**
``` javascript
database.query((sql) => 
{
    // SELECT * FROM table WHERE column = 2 AND column2 = 'value'
    sql.all()
       .where('column').value('=', 2)
       .and('column2').value('=', 'value')
       .get((result) => {
          console.log(result)
       })

    // SELECT * FROM table WHERE column = 2 OR column = 5
    sql.all()
       .where('column').value('=', 2)
       .or('column').value('=', 5)
       .get((result) => {
          console.log(result)
       })

    // SELECT * FROM table WHERE NOT column = 20
    sql.all()
       .whereNot('column').value('=', 20)
       .get((result) => {
          console.log(result)
       })
})
```

### Like In Between

**Method** | **Parameters** | **Output**
:--- | :--- | :---
``like()`` | _(string)_ pattern | _LIKE "%%"_
``in()`` | _(array)_ values | _IN (1,2,3)_
``between()`` | _(mixed)_ value1 <br/> _(mixed)_ value2 | _BETWEEN value AND value_

**Example**
``` javascript
database.query((sql) => 
{
    // SELECT * FROM table WHERE column LIKE '%pattern%'
    sql.all()
       .where('column').like('%pattern%')
       .get((result) => {
          console.log(result)
       })

    // SELECT * FROM table WHERE column IN (3,0,8)
    sql.all()
       .where('column').in([3, 0, 8])
       .get((result) => {
          console.log(result)
       })

    // SELECT * FROM table WHERE column BETWEEN 5 AND 10
    sql.all()
       .where('column').between(5, 10)
       .get((result) => {
          console.log(result)
       })
})
```

### Is Null and Is Not Null

**Example**
``` javascript
database.query((sql) => 
{
    // SELECT * FROM table WHERE column IS NULL
    sql.all()
       .where('column').isNull()
       .get((result) => {
          console.log(result)
       })

    // SELECT * FROM table WHERE column IS NOT NULL
    sql.all()
       .where('column').isNotNull()
       .get((result) => {
          console.log(result)
       })
})
```

### Orderby and Limit

You can use `orderBy()` and `limit()` to sort data and retrieve limited records.

**Method** | **Parameters** | **Output**
:--- | :--- | :---
``orderBy()`` | _(array)_ columns. <br/> _(string)_ sort (DESC, ASC). | _ORDER BY columns DESC_
``limit()`` | _(integer)_ records number. | _LIMIT value_


**Example**
``` javascript
database.query((sql) => 
{
    // SELECT * FROM table ORDER BY id LIMIT 5
    sql.all()
       .orderBy(['id']) // default DESC
       .limit(5)
       .get((result) => {
          console.log(result)
       })
})
```

### Groupby and Having

Use `groupBy()` and `having()` to summarize the results and get statistical information.

**Method** | **Parameters** | **Output**
:--- | :--- | :---
``groupBy()`` | _(array)_ columns. | _GROUP BY columns_
``having()`` | _(string)_ the column. | _HAVING column_


**Example**
``` javascript
database.query((sql) => 
{
    // SELECT COUNT(column) AS c FROM table GROUP BY column HAVING column > 5
    sql.select(['COUNT(column) AS c'])
       .groupBy(['column'])
       .having('column').value('>', 5)
       .get((result) => {
          console.log(result)
       })
})
```

### Joins

**Example**
``` javascript
database.query((sql) => 
{
    // SELECT * FROM table1 INNER JOIN table2 ON column1 = column2
    sql.all()
       .innerJoin('table2').on('column1', 'column2')
       .get((result) => {
           console.log(result)
       })

    // SELECT * FROM table1 LEFT JOIN table2 ON column1 = column2
    sql.all()
       .leftJoin('table2').on('column1', 'column2')
       .get((result) => {
           console.log(result)
       })

    // SELECT * FROM table1 RIGHT JOIN table2 ON column1 = column2
    sql.all()
       .rightJoin('table2').on('column1', 'column2')
       .get((result) => {
           console.log(result)
       })

    // SELECT * FROM table1 FULL OUTER JOIN table2 ON column1 = column2
    sql.all()
       .fullJoin('table2').on('column1', 'column2')
       .get((result) => {
           console.log(result)
       })

    // SELECT * FROM table1 CROSS JOIN table2
    sql.all()
       .crossJoin('table2')
       .get((result) => {
           console.log(result)
       })
})
```

### Union and Union All

Use Union and Union All Operators two combine the result of two tables.

**Method** | **Parameters** | **Output**
:--- | :--- | :---
``union()`` | _(array)_ columns. <br/> _(string)_ table. | _UNION columns FROM table_
``unionAll()`` | _(array)_ columns. <br/> _(string)_ table. | _UNION ALL columns FROM table_

**Example**
``` javascript
database.query((sql) => 
{
    // SELECT column1, column2 FROM table1 UNION column1, column2 FROM table2
    sql.select(['column1', 'column2'])
       .union(['column1', 'column2'], 'table2')
       .get((result) => {
           console.log(result)
       })

    // SELECT column1, column2 FROM table1 UNION ALL column1, column2 FROM table2
    sql.select(['column1', 'column2'])
       .unionAll(['column1', 'column2'], 'table2')
       .get((result) => {
           console.log(result)
       })
})
```

### Insert

The query builder provide ``insert()`` method to insert records into database table, The insert method accepts an object of column names and values.

**Method** | **Describe** | **Parameters** | **Output**
:--- | :--- | :--- | :---
``insert()`` | Generate sql insert statement. | _(object)_ column and value | _INSERT INTO table (columns) VALUES (values)_

**Example**
``` javascript
database.query((sql) => 
{
    // INSERT INTO table (id, name) VALUES (20, "ahmed")
    sql.insert({id: 20, name: 'ahmed'})
       .save()
})
```

### Update

To update existing records use `update()` method, it accepts an object of column and value pairs indicating the columns to be updated.

**Method** | **Describe** | **Parameters** | **Output**
:--- | :--- | :--- | :---
``update()`` | Generate sql update statement. | _(object)_ column and value | _UPDATE table SET column = value_

**Example**
``` javascript
database.query((sql) => 
{
    // UPDATE table SET column1 = 'value1', column2 = 'value2' WHERE column = 'value'
    sql.update({
      column1: 'value1', 
      column2: 'value2'
    })
    .where('column').value('=', 'value') // condition
    .save()

    // UPDATE table SET column = 'value' WHERE column = 'value'
    sql.update({column: 'value'})
       .where('column').value('=', 'value')
       .save()
})
```

### Truncate

This method will truncate the selected table.

**Example**
``` javascript
database.query((sql) => 
{
    // TRUNCATE TABLE tablename
    sql.truncate().save()
})
```

### Delete

You can use `delete()` method to delete single or multiple records.

**Method** | **Describe** | **Parameters** | **Output**
:--- | :--- | :--- | :---
``delete()`` | Generate sql delete statement. | no parameters needed | _DELETE FROM table_

**Example**
``` javascript
database.query((sql) => 
{
    // DELETE FROM table WHERE column = 'value'
    sql.delete()
       .where('column').value('=', 'value')
       .save()

    // DELETE FROM table WHERE column IN (9,7,8)
    sql.delete().where('column').in([9,7,8]).save()
})
```

> Note: with insert, delete and update you should call ``save()`` method at the end to execute the qurey.
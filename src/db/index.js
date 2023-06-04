// import mongodb from 'mongodb'

// export default async function MakeDb() {
//     const MongoClient = mongodb.MongoClient
//     // mongodb+srv://app-server:Ii3Gn6d6VVuJZ6gZ@xdb-oavpl.mongodb.net/ZDB_ZDB_growminate?authSource=admin&replicaSet=XDB-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true
//     const url = 'mongodb+srv://app-server:Ii3Gn6d6VVuJZ6gZ@xdb-oavpl.mongodb.net'
//     // const url = process.env.DB_URL;
//     // const url = 'mongodb+srv://app-server:Ii3Gn6d6VVuJZ6gZ@xdb-oavpl.mongodb.net/XDB_Conceptor?authSource=admin&replicaSet=XDB-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
//     // const dbName = process.env.DB_NAME;
//     const dbName = 'findependence'


//     // console.log(url, dbName);
//     const client = new MongoClient(url, { useNewUrlParser: true })
//     await client.connect()
//     const db = await client.db(dbName)
//     db.MakeId = MakeIdFromString
//     db.MakeDate = MakeDate
//     return db
// }
// function MakeIdFromString(id) {
//     return new mongodb.ObjectID(id)
// }
// function MakeDate(date) {
//     return new mongodb.Timestamp()
// }

// get the client
// const mysql = require('mysql2');
// Create the connection pool. The pool-specific settings are the defaults

import mysql from 'mysql2';

export default async function MakeDb() {
const config={
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB_NAME,
    password: process.env.MYSQL_PASS,
}
// console.log(config)
    const pool = mysql.createPool({
       ...config,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    });
    // pool;

    return pool.promise();
}
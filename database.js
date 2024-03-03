mysql = require('mysql2');

const env = require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST || '',
    user: process.env.MYSQL_ADDON_USER || '',
    password: process.env.MYSQL_ADDON_PASSWORD || '',
    database: process.env.MYSQL_ADDON_DB || '',
    port: process.env.MYSQL_ADDON_PORT || '8080'
}).promise();

const get = async function get(name) {
    const rows = await pool.query('select * from stats where name = ?', name);
    if (rows.length > 2) {
        console.log(rows);
        console.error("More than one row of type " + name + " in stats");
        return null;
    }
    else {
        const row = rows[0][0];

        
        console.log(row);

        return row;
    }
}

const insert = async function insert(name,views,likes) {
    const row = await pool.query('insert into stats(name,views,likes) values(?,?,?)', [name,views,likes]);
    
    console.log(row);

    return row;
}
const update = async function update(gameName, updateName, updateAmount) {
    const curNum = await module.exports.get(gameName);

    // console.log(curNum[updateName]);

    if (curNum) {
        const rows = await pool.query('UPDATE `stats` SET ?? = ? WHERE `stats`.`name` = ?', [updateName, (curNum[updateName]+ updateAmount), gameName]);

        const returnValue = curNum;

        returnValue[updateName] += 1;
        return returnValue;
    }
    else {
        await module.exports.insert(gameName,1,0);

        return await module.exports.get(gameName);

    }
    

    

    console.log(rows);

    return rows;
}


module.exports = { get, insert, update };

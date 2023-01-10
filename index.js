const pg = require('@yugabytedb/pg');
const fs = require('fs')
function createConnection() {
    const yburl = "postgresql://admin:N_aqDWzqRbqdmvmmPPCoayvB_EsZa_@asia-south2.bc3385d9-b31d-4af5-9f34-2deee617dc64.gcp.ybdb.io:5433/yugabyte?ssl=true&sslmode=verify-full&sslrootcert=./root.crt";
    const client = new pg.Client(yburl);
    client.connect();
    return client;
}

async function createTableAndInsertData(client) {
    console.log("Connected to the YugabyteDB Cluster successfully.")
    await client.query("DROP TABLE IF EXISTS employee").catch((err) => {
        console.log(err.stack);
    })
    await client.query("CREATE TABLE IF NOT EXISTS employee" +
        "  (id int primary key, name varchar, age int, language text)").then(() => {
            console.log("Created table employee");
        }).catch((err) => {
            console.log(err.stack);
        })

    var insert_emp1 = "INSERT INTO employee VALUES (1, 'John', 35, 'Java')"
    await client.query(insert_emp1).then(() => {
        console.log("Inserted Employee 1");
    }).catch((err) => {
        console.log(err.stack);
    })
    var insert_emp2 = "INSERT INTO employee VALUES (2, 'Sam', 37, 'JavaScript')"
    await client.query(insert_emp2).then(() => {
        console.log("Inserted Employee 2");
    }).catch((err) => {
        console.log(err.stack);
    })
}

async function fetchData(client) {
    try {
        const res = await client.query("select * from employee")
        console.log("Employees Information:")
        for (let i = 0; i < res.rows.length; i++) {
            console.log(`${i + 1}. name = ${res.rows[i].name}, age = ${res.rows[i].age}, language = ${res.rows[i].language}`)
        }
    } catch (err) {
        console.log(err.stack)
    }
}

(async () => {
    const client = createConnection();
    if (client) {
        // await createTableAndInsertData(client);
        await fetchData(client);
    }
})();

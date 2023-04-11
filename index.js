const { getUnitedData } = require("./united")
const { addMerchs } = require("./addToDB")
const { getDb, connectToDb } = require("./db")
const fs = require('fs/promises')

const main = async (db) => {
    const data = await getUnitedData()
    await addMerchs(data, db)
    //await fs.appendFile('message.txt', `main in index ran at ${Date.now()} \n`, err => (err) ? console.log(err) : console.log('worked'))
    process.exit()
}


// db connection
let db

connectToDb((err) => {
    if (!err) {
        db = getDb()
        console.log('Connected to Database')
        main(db)

    }

})

 





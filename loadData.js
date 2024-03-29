/*
 *  Utility function to manually load data to database.
 *  Takes a relative folder path to data files and:
 *    - Enumerates and iterates over the files 
 *    - Adds files to database
 */

const fs = require("fs")
const { getDb, connectToDb } = require('./db')
const { addMerchs } = require('./addMerchs')


const main = async (db, relativeFolderPath) => {

    const fileList = await fs.readdirSync(`${relativeFolderPath}`)

    for (let file of fileList) {
        const fileName = await `${relativeFolderPath}/${file}`
        const fileContent = await require(fileName)
        console.log(`Adding:           ${fileName}`)
        await addMerchs(fileContent, db)
        console.log(`Finished adding:  ${fileName}`)
    }

    console.log('Finished Task')
    process.exit()
}


// db connection
let db

connectToDb((err) => {
    if (!err) {
        db = getDb()
        console.log('Connected to Database')
        main(db, process.argv[2])
    }
})






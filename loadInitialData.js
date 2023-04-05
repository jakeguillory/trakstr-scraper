const fs = require("fs");
const { getDb, connectToDb } = require('./db')
const { addMerchs } = require('./addToDB')


const main = async () => {


    const fileList = await fs.readdirSync("./initial-data")

    for (let file of fileList) {

        const fileName = await `./initial-data/${file}`

        const fileContent = await require(fileName)

        await console.log(`Adding:           ${fileName}`)

        await addMerchs(fileContent)
        
        await console.log(`Finished adding:  ${fileName}`)

    }

    console.log('Finished Task')

}


// db connection
let db

connectToDb((err) => {
    if (!err) {
        db = getDb()
        console.log('Connected to Database')
        main()
    }

})






const fs = require("fs");
const { getDb, connectToDb } = require('./db')



const addMerchs = async (merchs) => {

    // Adds single merch json file to db

    const merchsDate = merchs.pop().date

    for (let merch of merchs) {

        try {

            const dateQuery = { merchName: merch.merchName, "prices.date" : merchsDate }

            if (await db.collection('united').findOne(dateQuery)) {
                continue

            }

            if (merch.instoreIcon == true) {
                merchName = merchName + " - Instore"
            } else {
                merchName = merch.merchName
            }

            const query = { merchName: merchName }

            const Price = {
                price: merch.price,
                date: merchsDate
            }

            const obj = {
                merchName: merchName,
                link: merch.link, 
                instoreIcon: merch.instoreIcon,
                unit: merch.unit,
                prices: [

                    {date: merchsDate,
                    price: merch.price},

                ]
            }

            const update = { $push: { prices: Price } }

            if (await db.collection('united').findOne(query)) {

                await db.collection('united').updateOne(query, update)

            } else {

                await db.collection('united')
                .insertOne(obj)
            }

        } catch (err) {
            console.err(err)
        }

    }

        console.log("Done in addMerchs")

}

const main = async () => {

    //Takes all files from logs folder, filters based on price data that has changed and adds to database
    //Have created a special test database to have seperate from airates database
    console.time()

    // const changedMerchs = await require('./changedMerchs.json')

    const fileList = await fs.readdirSync("./atlasLogs/")

    for (let file of fileList) {

        const fileName = await `./atlasLogs/${file}`

        const fileContent = await require(fileName)

        // const filteredContent = await fileContent.filter(merch => changedMerchs.includes(merch.merchName) || merch.date)

        await console.log(`Adding:           ${fileName}`)

        await addMerchs(fileContent)
        
        await console.log(`Finished adding:  ${fileName}`)

    }

    console.log('Finished Task in: ')
    console.timeEnd()

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






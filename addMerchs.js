/*
 *  Adds a single data file (merchs) to database:
 *    - merchs is a array of objects (json) file created by the getUnitedData() function
 *    - Iterates through objects and processes each one
 */

const fs = require("fs")


const addMerchs = async (merchs, db) => {

    // Last object is the date the data was scraped
    const merchsDate = merchs.pop().date

    for (let merch of merchs) {
        try {

            // Skip adding merchant if there is already an entry for this date
            const dateQuery = { merchName: merch.merchName, "prices.date" : merchsDate }
            if (await db.collection('united').findOne(dateQuery)) {
                continue
            }

            // Create new name to keep track of special "Instore" deals
            if (merch.instoreIcon == true) {
                merchName = merch.merchName + " - Instore"
            } else {
                merchName = merch.merchName
            }

            // Build merchant object
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

            // Update database

            // Create option for updating if merchant already exists
            const update = { $push: { prices: Price } }
 
            if (await db.collection('united').findOne(query)) {
                await db.collection('united').updateOne(query, update)
            } else {
                await db.collection('united')
                .insertOne(obj)
            }

        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = {
    addMerchs,
}







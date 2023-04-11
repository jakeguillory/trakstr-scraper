const fs = require("fs");



const addMerchs = async (merchs, db) => {

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
            console.error(err)
        }

    }

}



module.exports = {
    addMerchs,
}







/*
 *  Main entry point for Trakstr scraper that:
 *    - connects to database
 *    - scrapes the data (and saves a copy to a local file)
 *    - adds the data to database
 */

const { getUnitedData } = require("./getUnitedData")
const { addMerchs } = require("./addMerchs")
const { getDb, connectToDb } = require("./db")


const main = async (db) => {
  const data = await getUnitedData()
  await addMerchs(data, db)
  process.exit()
};


// db connection
let db

connectToDb((err) => {
  if (!err) {
    db = getDb()
    console.log("Connected to Database")
    main(db)
  }
});

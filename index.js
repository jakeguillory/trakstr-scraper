const { getUnitedData } = require("./united");
const { addMerchs } = require("./addToDB");
const { getDb, connectToDb } = require("./db");

const main = async (db) => {
  const data = await getUnitedData();
  await addMerchs(data, db);
  process.exit();
};

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    db = getDb();
    console.log("Connected to Database");
    main(db);
  }
});

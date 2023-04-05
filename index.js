const { getUnitedData } = require("./united")
const { addMerchs } = require("./addToDB")



const main = async () => {
    const data = await getUnitedData()
    addMerchs(data)
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


 





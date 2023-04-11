const { getDb, connectToDb } = require("./db")



const main = async () => {

	let merchs = [   ]

	await db.collection('united')
		.find({merchName: "ABCmouse.com"})
		.sort({ merchName: 1 })
		.forEach(merch => merchs.push(merch))


	console.log(JSON.stringify(merchs))
	
	process.exit()

}


let db

connectToDb((err) => {


	if (!err) {

		db = getDb()
		console.log('Connected to Database')
		main()

	}

})




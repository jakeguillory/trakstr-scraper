const { getUnitedData } = require("./united")
// const schedule = require("node-schedule")

/*
-   Fetch data and save to file   Got this part pretty good just need to see how to integrate its asyncess with rest of program
-   Parse data and extract into final javascript object
-   Add to database
*/

const main = async () => {
    data = await getUnitedData()
    console.log(`United data read at: ${data[data.length - 1].date}`)
}

main()

// schedule.scheduleJob('*/30 * * * *', async () => {
//     await main()
//     console.log("Round Completed")
// })
 





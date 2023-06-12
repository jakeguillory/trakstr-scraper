/*
 *  Scraping function for extracting data from United airlines rewards page
 */

const puppeteer = require("puppeteer")
const fs = require("fs/promises")


const URL = "https://shopping.mileageplus.com/b____.htm"


async function getUnitedData() {

  // Typical puppeteer init functions
  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: [" --disable-extensions "],
    args: [
      "--disabled-gpu",
      "--disabled-dev-shm-usage",
      "--disabled-setuid-sandbox",
      "--no-sandbox",
    ],
  })
  const page = await browser.newPage()
  await page.goto(URL, { waitUntil: "load", timeout: 0 })

  // Everything in the following function is executed in the browser
  const browserData = await page.evaluate(() => {
    // Regular expressions for extracting below
    const priceRe = /(\d+)\s(miles?\/?\$?)/        
    const instoreUnitPriceRe = /Earn\s(.+?)\s/    //Used if instoreIcon is true

    const blockLength = document.querySelectorAll(
      "div.mn_groupsWrap[data-sort-type='byAlpha'] li"
    ).length

    const obj = []

    // Iterate over every merchant and extract info
    for (let i = 0; i < blockLength; i++) {
      const block = document.querySelectorAll(
        "div.mn_groupsWrap[data-sort-type='byAlpha'] li"
      )[i]
      const merchName = block.querySelector("span.mn_merchName").innerText
      const link = block.querySelector("a").href

      let price, unit, instoreIcon

      // Sets variables base on three conditions:
      //  - Instore icon deal
      //  - No deals currently
      //  - Default
      if (block.querySelector("div.mn_merchListInstoreIcon")) {
        price = block
          .querySelector("span.mn_instoreRebateDisplayRate")
          .innerText.match(instoreUnitPriceRe)[1]
        unit = block.querySelector("span.mn_instoreRebateCurrency").innerText
        instoreIcon = true
      } else if (block.querySelector("span.mn_deactivatedRebate")) {
        price = null
        unit = null
        instoreIcon = false
      } else {
        price = block
          .querySelector("span.mn_rebateValueWithCurrency")
          .innerText.match(priceRe)[1]
        unit = block
          .querySelector("span.mn_rebateValueWithCurrency")
          .innerText.match(priceRe)[2]
        instoreIcon = false
      }

      // Build merchant object
      obj.push({
        merchName,
        link,
        price,
        unit,
        instoreIcon,
      })
    }

    return obj
  })

  // Get current date, convert to unix epoch time, add to data file
  const date = Math.floor(new Date().getTime() / 1000)
  browserData.push({ date: date })

  // Save data to json file in logs folder
  await fs.writeFile(
    `./logs/united-${date}.json`,
    JSON.stringify(browserData),
    (err) => {
      console.log(err)
    }
  );

  await browser.close()

  return browserData
}

module.exports = {
  getUnitedData,
}

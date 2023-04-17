const puppeteer = require("puppeteer")
const fs = require("fs/promises");

const URL = "https://shopping.mileageplus.com/b____.htm";

async function getUnitedData() {

  const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser',
	  				   headless: true,
	  				   ignoreDefaultArgs: [' --disable-extensions '],
	  				   args: [
						     "--disabled-gpu",
						     "--disabled-dev-shm-usage",
						     "--disabled-setuid-sandbox",
						     "--no-sandbox",
					   ],
  					 })
  const page = await browser.newPage()
  await page.goto(URL, { waitUntil: "load", timeout: 0 })

  const browserData = await page.evaluate(() => {

    const re = /(\d+)\s(miles?\/?\$?)/
    const instoreUnitRe = /Earn\s(.+?)\s/

    const myObj = []

    const blockLength = document.querySelectorAll("div.mn_groupsWrap[data-sort-type='byAlpha'] li").length

    for (let i = 0; i < blockLength; i++) {

      const date = (new Date()).toString()
      const block = document.querySelectorAll("div.mn_groupsWrap[data-sort-type='byAlpha'] li")[i]
      const merchName = block.querySelector("span.mn_merchName").innerText
      const link = block.querySelector("a").href

      let price, unit, instoreIcon
       
      if (block.querySelector("div.mn_merchListInstoreIcon")) {
         price = block.querySelector("span.mn_instoreRebateDisplayRate").innerText.match(instoreUnitRe)[1]
         unit = block.querySelector("span.mn_instoreRebateCurrency").innerText
         instoreIcon = true
      } else if (block.querySelector("span.mn_deactivatedRebate")) {
         price = null
         unit = null
         instoreIcon = false
      } else    {
         price = block.querySelector("span.mn_rebateValueWithCurrency").innerText.match(re)[1]
         unit = block.querySelector("span.mn_rebateValueWithCurrency").innerText.match(re)[2]
         instoreIcon = false
      }

      myObj.push({ 
        merchName,
        link,
        price,
        unit,
        instoreIcon,
      })
    }
   
    return myObj
  })
  
  const date = (new Date()).toString()

  browserData.push({ date: date })

  await fs.writeFile(`./logs/unitedData - ${date}.json`, JSON.stringify(browserData))     // Run this code and block line 64 to write to a file

  await browser.close()

  return browserData        // Run this code and block line 60 to return directly into other file
}

getUnitedData()

module.exports = {
    getUnitedData,
}

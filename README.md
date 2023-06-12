# Scraper for Trakstr App

TRAKSTR: Application that tracks reward data

## Features

- Scrapes target website for merchant reward data using headless browser
- Parses data and adds to database

## Technology

- NodeJS
- Puppeteer (headless browser library)
- Mongodb

## Skills Displayed

- Web scraping
- Headless browser
- Document database logic and design
- File system scripting
- Regular expressions
  

## Future Improvements

- Store data only for days when prices change
- Make scraper more robust with retries 
- SQL version using PostgreSQL
 
## How To Use

NOTE: The instructions below were tested on Windows 11 running Ubuntu 22.04.2 on WSL with Node version 18.16.0

1. **Ensure a recent NodeJS and Docker installation**

2. **Copy this repo**

```
git clone https://github.com/jakeguillory/trakstr-scraper.git && cd trakstr-scraper
```

3. **Change credentials**

Change username and password on lines 10, 11, 21, 22 on mongo.yaml.

Change username and password in connection string of MONGO-URI in .env file

4. **Start Database Containers**

```
docker compose -f mongo.yaml up -d
```

Verify that the containers are running

```
docker ps
```

Verify that Mongo Express viewer is available. Browse to the following:

```
http://localhost:8081
```

5. **Install Dependencies**

```
npm install puppeteer mongodb dotenv
```

6. **Load sample data (optional)**

```
node loadData.js ./initial-data
```

Data should be viewable in Mongo Express at http:/localhost:8081

7. **Setup Recurring Scraper**

Setup cron-job task scheduler. The following command opens the doc:

```
crontab -e
```

Depending on your system, the paths below will be different. Full paths should be used as per the following formula: 

\<CRON EXPRESSION> cd \<FULL PATH TO REPO> && \<FULL PATH TO NODE PROGRAM> \<PROGRAM TO BE EXECUTED>

The cron expression represents the frequency for scraping. Consult https://crontab.guru for reference

An example below:

```
0 7 * * * cd /home/user/trakstr-scraper && /home/user/.nvm/versions/node/v18.16.0/bin/node index.js
```

The cron expression above runs once a day at 7:00 AM. It navigates to the repository and runs "node index.js"

8. **Test**

Data should be available in Mongo Express viewer

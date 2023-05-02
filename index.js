const puppeteer =  require('puppeteer') //is used to import puppeteer, it is going to be the first line of your scraper.

const fs = require('fs')  //The Node.js file system module allows you to work with the file system on your computer., here we are importing file system module from node modules

const scrap = async () =>{
    const browser = await puppeteer.launch({
    headless : false, //opens a chromium browser, if it was true, then it will not open a chromiun browser.
    defaultViewport:false //by this it will adjust the viewport of the web page according to our screen size
}); //browser initiate
    const page = await browser.newPage();
    const url =  "https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory" // opening a new blank page
    await page.goto(url, //it will navigete to the defined url
    {waitUntil : 'domcontentloaded'} //will wait till the DOM is loaded completely
    ) 
     const countryList = await page.$x("//div[@id='covid-19-cases-deaths-and-rates-by-location']//tbody//tr//th");
     const deathsInMillion = await page.$x("//div[@id='covid-19-cases-deaths-and-rates-by-location']//tbody//tr//th/following-sibling::td[1]")
     const deaths = await page.$x("//div[@id='covid-19-cases-deaths-and-rates-by-location']//tbody//tr//th/following-sibling::td[2]")
     const cases = await page.$x("//div[@id='covid-19-cases-deaths-and-rates-by-location']//tbody//tr//th/following-sibling::td[3]")
     let rowList = [] 
    let record = {'country' : '','cases' :'', 'deaths' : '', 'deathsInMillion':''}
 


try {
    for(let i = 0; i <countryList.length; i++){
   
        const eachCountry = countryList[i]
        record.country = await page.evaluate(element => element.textContent, eachCountry)
    //console.log(record.country)
    
        
        const eachDeathInMillion = deathsInMillion[i]
        record.deathsInMillion = await page.evaluate(element => element.textContent, eachDeathInMillion)
    //console.log(record.deathsInMillion)
    
        
         const eachDeath = deaths[i]
         record.deaths = await page.evaluate(element => element.textContent, eachDeath)
        // console.log(record.deaths)
    
    
        
         const eachCases = cases[i]
         record.cases = await page.evaluate(element => element.textContent, eachCases)
        // console.log(record.cases)
    
    
    console.log(record)
    } 
    
} catch (error) {
    console.log('Error found')
}

   await browser.close();
};

scrap();

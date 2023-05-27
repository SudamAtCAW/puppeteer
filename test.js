const fs = require('fs') //the fs module lets us write into file system
const puppeteer = require("puppeteer") ;


//the functions we will be using are web apis for which we will use async functions

async function main() {
    const browser = await puppeteer.launch({
        headless : false, //if set to true will run headlessly
        defaultViewport:{width: 1920, height: 1080 } //applying the viewport 
    }); //creating an instance of the chromium browser and launching it
    const page = await browser.newPage() //creating a new page of the browser
    await page.goto('https://www.traversymedia.com/') //navigating to the required url

    const html  = await page.content() //this method will get all the html content from the page
    //console.log(html)
//page.evaluate() is a method that allows you to execute a function within the context of the
// page you are interacting with. It provides a way to run custom JavaScript code on the page
// and retrieve data or perform operations.
//The page.evaluate() method takes a function as its argument and executes that function within
// the context of the current page. It provides a bridge between the Node.js environment (where Puppeteer runs)
// and the browser environment (where the page is loaded).\

const title = await page.evaluate( () =>document.title) //here we are getting the titlt of the web page
//console.log(title)

//getting the inner text of elements inside body
const text = await page.evaluate( () => document.body.innerText)
//console.log(text)

//In Puppeteer, querySelectorAll is not a Puppeteer-specific method, but rather a standard DOM
 //ethod available in browsers. However, Puppeteer provides a similar method called $$(selector)
 // that works in a similar way to querySelectorAll but within the context of the page you are
 // interacting with.
// It allows you to select multiple elements from the page based on a CSS selector and returns
//an array of ElementHandle objects.



const links = await page.evaluate( 
    //as the page.evaluate takes function as a call back, we are passing thr Array.from method which
//will return an array , by doing document.querrySelectorAll('a'), we are wraping all the a tag elements
    () => Array.from(document.querySelectorAll('a'),
    //the array.from method takes a second parameter which will be a function
//here we are passing each a tag elements inside the function and getting the href of them
    (e) =>e.href))

 //   console.log(links)

 //now we will get the data present insdie multiple elements

 //here we will return an object ov coureses, i.e the curly barackets  after passing the parameter element
 const courses = await page.evaluate(() => Array.from(document.querySelectorAll('#cscourses .card'), (e) =>({
title : e.querySelector('.card-body h3').innerText,
level : e.querySelector('.card-body .level').innerText,
url : e.querySelector('.card-footer a').href
 }))
 );
 //console.log(courses)

 //the above can be done in another way, with ut using Array.from
 //the $$eval method lets us select multiple elements from the page and perform any action on them

const courses2 = await page.$$eval('#cscourses .card'
//this takes a second parameter which is a function, in which we will pass the elements selected by the locator
//inside the function we will use .map function to loop through each of the element
//the e represents each of the element from the elements array
,(elements) => elements.map(e =>({
    title : e.querySelector('.card-body h3').innerText,
    level : e.querySelector('.card-body .level').innerText,
    url : e.querySelector('.card-footer a').href
}))
);
//onsole.log(courses2)

//save data to a JSON file, first paramenter is name of the file
//in the second parameter we are converting the arry to json values, which will take a
//call back function
fs.writeFile('courses.json', JSON.stringify(courses), (err)=>{
    if(err) throw err;
    console.log('File saved')
})

    await browser.close();
}
main();
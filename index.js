const puppeteer = require('puppeteer');

function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://www.kijiji.ca/b-ottawa/laptops/k0l1700185?rb=true&dc=true");
            let listings = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('div.info');
                items.forEach((item) => {
                    results.push({
                        url:  item.querySelector('a.title').getAttribute('href'),
                        text: item.querySelector('div.description').innerText,
                        price: item.querySelector('div.price').innerText
                    });
                });
                return results;
            })
            browser.close();
            let filteredResults = [];
            listings.forEach((listing) => {
                console.log(parseFloat(listing.price.slice(0, 1)));
                if (parseFloat(listing.price.slice(0, 1)) < 100) {
                    filteredResults.push(listing)
                }
            })
            return resolve(filteredResults);
        } catch (e) {
            return reject(e);
        }
    })
}
run().then(console.log).catch(console.error);
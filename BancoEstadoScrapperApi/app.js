import puppeteer from 'puppeteer-extra';
import puppeteerHar from 'puppeteer-har';
import puppeteerStealth from 'puppeteer-extra-plugin-stealth';
import secrets from './secrets.json' assert { type: 'json' };

function delay(time) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time)
	});
}

puppeteer.use(puppeteerStealth());
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
const har = new puppeteerHar(page);
await har.start({ path: 'result.har' });
await page.setViewport({ width: 1920, height: 1080 });

await page.evaluateOnNewDocument(() => {
	delete navigator.__proto__.webdriver;
});

await page.setExtraHTTPHeaders({
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
	'upgrade-insecure-requests': '1',
	'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
	'accept-encoding': 'gzip, deflate, br',
	'accept-language': 'en-US,en;q=0.9,en;q=0.8'
});

await page.goto('https://www.bancoestado.cl/content/bancoestado-public/cl/es/home/home.html#/login')
await delay(10000);
await page.click('text=Banca en Línea');
await delay(1000);
await page.type('#rut', secrets.rut, { delay: 120 });
await delay(1000);
await page.type('#pass', secrets.pass, { delay: 120 });
await delay(1000);
await page.click('text=Ingresar');
await delay(30000);
await har.stop();
await browser.close();
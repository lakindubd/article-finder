require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const numPages = parseInt(req.query.pages) || 1; // Number of pages to scrape
    const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        let results = [];

        for (let i = 0; i < numPages; i++) {
            const pageUrl = `${url}&start=${i * 10}`;
            console.log(`Navigating to: ${pageUrl}`);
            await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
            const newResults = await page.evaluate(() => {
                const articles = [];
                document.querySelectorAll('.gs_ri').forEach(article => {
                    const title = article.querySelector('.gs_rt a')?.textContent || 'No title';
                    const link = article.querySelector('.gs_rt a')?.href || '#';
                    const snippet = article.querySelector('.gs_rs')?.textContent || 'No snippet';
                    articles.push({ title, link, snippet });
                });
                return articles;
            });
            results = results.concat(newResults);
        }

        await browser.close();
        res.json(results);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

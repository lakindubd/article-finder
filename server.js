require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url);
        const results = await page.evaluate(() => {
            const articles = [];
            document.querySelectorAll('.gs_ri').forEach(article => {
                const title = article.querySelector('.gs_rt a')?.textContent || 'No title';
                const link = article.querySelector('.gs_rt a')?.href || '#';
                const snippet = article.querySelector('.gs_rs')?.textContent || 'No snippet';
                articles.push({ title, link, snippet });
            });
            return articles;
        });

        await browser.close();
        res.json(results);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        const htmlPath = path.resolve(__dirname, 'LabGuide_Presentation.html');
        await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
        
        await page.emulateMediaType('print');
        
        const pdfPath = path.resolve(__dirname, 'LabGuide_Presentation.pdf');
        await page.pdf({
            path: pdfPath,
            width: '1920px',
            height: '1080px',
            printBackground: true,
            margin: { top: 0, bottom: 0, left: 0, right: 0 }
        });
        
        await browser.close();
        console.log('PDF generated successfully!');
    } catch (err) {
        console.error('Error generating PDF:', err);
    }
})();

import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PnlService {
  generatePnlShot = async (data: any) => {
    try {
      const html = await this.pnlTemplate(data);

      // Use Puppeteer to generate the PNG
      // const browser = await puppeteer.launch({
      //   headless: "new",
      // });

      const browser = await puppeteer.launch({
        executablePath:
          process.env.NODE_ENV === 'production'
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
        timeout: 60000, // Set a higher timeout value
      });
      const page = await browser.newPage();

      await page.setContent(html);
      //   await page.addStyleTag({ content: css });

      // Adjust the viewport size if necessary
      //{ width: 1172, height: 698 }
      await page.setViewport({ width: 900, height: 850 });
      //{ width: 900, height: 850 }
      // {width: 1080, height: 1024}
      /*  
      take a screenshot and save it as a PNG, 
      use clip to crop the image if needed 
    */
      const screenshot = await page.screenshot({ type: 'png' });

      // close the browser
      await browser.close();

      console.log(screenshot);
      console.log(typeof screenshot);

      if (!Buffer.isBuffer(screenshot)) {
        throw new Error('Invalid image buffer');
      }
      // returns the screenshot
      return { image: screenshot };
    } catch (error) {
      console.log(error);
    }
  };

  pnlTemplate = async (data: any) => {
    function formatNumber(num: number): string {
      return num.toLocaleString();
    }
    const amount = formatNumber(Number(data.amount)) || '';
    console.log(amount);

    try {
      const pnlDetailHTML = `<!doctype html>
<html lang="en">

<head>
    <title>PNL</title>
    <meta charset="utf-8">
    <meta name="author" content="Alaric von Teplitz">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body
    style="margin:0; overflow-x: hidden; background-image: url('https://i.ibb.co/8DX2Lx3F/bg2.png'); background-size: cover; background-position: center; height: 100vh; display: flex; justify-content: center;">
    <div style="width: 90%; max-width: 50rem; padding: 2vh 0;">

        <div style="display: flex; justify-content: center; padding-top: 4vh;">
            <img src="https://i.ibb.co/8g88JndR/logo.png" alt="" style="width: min(20rem, 80%); height: auto;" />
        </div>

        <div style="display: flex; justify-content: space-between; margin: 4vh 0">
            <p style="font-size: clamp(2rem, 6vw, 2.5rem); font-weight: bold; color: aliceblue; margin: 1vh 0;">
                Reward
            </p>
            <p style="font-size: clamp(2rem, 6vw, 2.5rem); font-weight: bold; color: rgb(30, 138, 0); margin: 1vh 0;">
                $${amount}
            </p>
        </div>

        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 2vh">
            <div style="flex: 1 1 60%; min-width: 15rem;">
                <div style="margin-bottom: 3vh">
                    <p
                        style="font-size: clamp(1.5rem, 3vw, 1.2rem); font-weight: bold; color: rgb(182, 182, 182); margin: 0.5vh 0;">
                        Token
                    </p>
                    <p
                        style="font-size: clamp(1.8rem, 3.5vw, 1.3rem); font-weight: bold; color: rgb(255, 255, 255); margin: 0.5vh 0;">
                        ETH
                    </p>
                </div>
                <div>
                    <p
                        style="font-size: clamp(1.5rem, 3vw, 1.2rem); font-weight: bold; color: rgb(182, 182, 182); margin: 0.5vh 0;">
                        Network
                    </p>
                    <p
                        style="font-size: clamp(1.8rem, 3.5vw, 1.3rem); font-weight: bold; color: rgb(255, 255, 255); margin: 0.5vh 0;">
                        Ethereum Mainnet
                    </p>
                </div>
            </div>
            <div style="flex: 1 1 30%; min-width: 10rem; text-align: center;">
                <img src="https://i.ibb.co/bjjwMhZX/rocket.png" alt=""
                    style="max-height: 50vh; width: auto; height: auto; max-width: 100%;" />
            </div>
        </div>
    </div>
</body>

</html>`;

      return pnlDetailHTML;
    } catch (error) {
      console.log(error);
    }
  };
}

const puppeteer = require('puppeteer');
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;


async function main () {
    // 首先通过Puppeteer启动一个浏览器环境
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--incognito'
        ]
    })
    log(chalk.green('服务正常启动'))
    // 使用 try catch 捕获异步中的错误进行统一的错误处理
    try {
        // 打开一个新的页面
        const [page] = await browser.pages();
        // await page.emulate(devices['iPhone 8'])
        // 监听页面内部的console消息
        page.on('console', msg => {
            // if (typeof msg === 'object') {
            //     console.log(msg)
            // } else {
            //     log(chalk.blue(msg))
            // }
        })
        let origin = 'zh-CN'
        let target = 'ar'
        await page.goto('https://translate.google.cn/?sl=' + origin + '&tl=' + target + '', { timeout: 0, waitUntil: "networkidle0" })

        log(chalk.yellow('进入https://translate.google.cn/'))
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        let inintData = {}
        const mapObj = async (_inintData, key, outKey) => {
            if (_inintData[key] instanceof Object) {
                for (let k in _inintData[key]) {
                    await mapObj(_inintData[key], k, key)
                }
            } else {
                // 翻译
                let originText = _inintData[key]
                await page.keyboard.type(originText);
                await sleep(3000)
                let result = await page.evaluate(() => {
                    // 先声明一个用于存储爬取数据的数组
                    try {
                        let result = document.querySelector(".JLqJ4b span[jsname='W297wb']").innerText;
                        return result
                    } catch (error) {
                        return ''
                    }

                })
                if (outKey) {
                    if (!inintData[outKey]) {
                        inintData[outKey] = {}
                    }
                    inintData[outKey][key] = result
                } else {
                    inintData[key] = result
                }

                // 清除输入框
                await page.waitForSelector('.DVHrxd');
                await page.click(".DVHrxd");
                log(chalk.green(originText, '=>', result))
            }
        }
        //点击原文
        await page.click(".QFw9Te");
        await page.waitForSelector('.QFw9Te');
        fs.readFile('locales/zh-cn.json', 'utf8', async function (err, data) {
            if (err) console.log(err);
            let _inintData = JSON.parse(data)
            for (const key in _inintData) {
                await mapObj(_inintData, key)
            }
            var result = JSON.stringify(inintData);
            fs.writeFileSync('locales/' + target + '.json', result, 'utf8')
            // 所有的数据爬取完毕后关闭浏览器
            log(chalk.yellow('服务正常结束,1000ms后自动关闭程序'))
            await sleep(1000)
            await page.close()
        });
    }
    catch (error) {
        // 出现任何错误，打印错误消息并且关闭浏览器
        console.log(error)
        log(chalk.red('服务意外终止'))
        await browser.close()
    } finally {
        // 最后要退出进程
        // process.exit(0)
    }
}
main()

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import XLSX from 'xlsx'
import puppeteer from 'puppeteer'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const browser = await puppeteer.launch({ headless: false })
const page = await browser.newPage()
const xlsxData = readXLSX('../../files/3.7游戏站(1).xlsx')
for (const item of xlsxData) {
  try {
    await page.goto(item['app store链接'])
    await page.waitForSelector('#ember3 source')

    const srcset = await page.evaluate(() => {
      // Replace 'selector' with the CSS selector of your element
      const element = document.querySelector('#ember3 source')
      if (element)
        return element.srcset
      else
        return null
    })
    const imgPaht = srcset ? `${formatUrl(srcset)}/492x0w.webp` : ''
    console.log(imgPaht)
    saveUrlAsImage(path.join(__dirname, `../../files/apple/${item.__EMPTY}.png`), imgPaht)
  }
  catch (e) {
    console.log(e)
  }
}

function formatUrl(url) {
  if (!url)
    return ''
  const urlArray = url.split('.webp')[0].split('/')
  urlArray.pop()
  return urlArray.join('/')
}
// // other actions...
// await browser.close()
function readXLSX(elxspath) {
  const filePath = path.join(__dirname, elxspath)
  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath)
    const sheet_name_list = workbook.SheetNames
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list])
  }
}
async function saveUrlAsImage(outputPath, url) {
  try {
    const data = await axios.get(url, { responseType: 'arraybuffer' })
    fs.writeFileSync(outputPath, data.data)
    console.log(`Image saved successfully at ${outputPath}`)
  }
  catch (error) {
    console.error('Error saving image:', error)
  }
}

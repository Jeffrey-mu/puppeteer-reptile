import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import XLSX from 'xlsx'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const browser = await puppeteer.launch({ 'headless': false, '--no-sandbox': true })
const page = await browser.newPage()
const xlsxData = readXLSX('../../files/3.7游戏站(1)(1).xlsx')
for (const item of [xlsxData[0]]) {
  await page.goto(item[' app store链接'])
  const a = '1'
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

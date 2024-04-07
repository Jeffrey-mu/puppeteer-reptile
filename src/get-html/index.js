import fs from 'node:fs'
import puppeteer from 'puppeteer'

(async () => {
  const types = [
    {
      type: 'cards',
      dom: 'div',
    },
    {
      type: 'buttons',
      dom: 'button',
    },
    {
      type: 'loaders',
      dom: 'div',
    },
    {
      type: 'inputs',
      dom: 'div',
    },
  ]
  for (const item of types) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://uiverse.io/${item.type}?t=tailwind`)

    // 通过 evaluate 方法来执行 JavaScript 代码
    const data = await page.evaluate((item) => {
      // 在这里处理 Shadow DOM
      // 例如，获取 Shadow DOM 中的元素
      const buttonsContainers = document.querySelectorAll('.cards-container .card #container')
      const buttonHTMLArray = []

      buttonsContainers.forEach((buttonContainer) => {
        const buttonInsideShadow = buttonContainer.shadowRoot.querySelector(item.dom)

        // 如果找到了按钮，则添加到数组中
        if (buttonInsideShadow) {
          buttonHTMLArray.push({
            html: buttonInsideShadow.outerHTML,
          })
        }
      })

      return buttonHTMLArray
    }, item)

    // 写入 HTML 文件
    data.forEach((buttonData, index) => {
      if (!fs.existsSync(item.type))
        fs.mkdirSync(item.type)
      const filename = `${item.type.slice(0, -1)}_${index}.html`
      fs.writeFileSync(`${item.type}/${filename}`, buttonData.html)
      console.log(`File ${filename} written successfully.`)
    })

    await browser.close()
  }
})()

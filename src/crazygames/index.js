/**
 * @Author WangJiaFeng
 * @Description 获取crazygames游戏列表
 * @email 1115378579@qq.com
 * @Date 2024-07-16 18:27:28 星期二
 * @return
 */

import fs from 'node:fs'
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()

await page.goto('https://www.crazygames.com')

const gameChannelNavigationListCollection = await page.$$eval('#sidebarContainer a', links =>
  links.filter(link => link.querySelector('.css-pm85vu'))
    .map((link) => {
      return {
        link: link.href,
        img: link.querySelector('img')?.src || null,
        label: link.querySelector('.LabelContainer')?.innerHTML.trim() || null,
        type: link.querySelector('.LabelContainer')?.innerHTML.trim().toLowerCase().replace(' ', '-') || null,
      }
    }))
fs.writeFileSync('gameChannelNavigationListCollection.json', JSON.stringify(gameChannelNavigationListCollection))

const gameList = []

console.log(gameChannelNavigationListCollection)

for (const gameChannelNavigationList of gameChannelNavigationListCollection) {
  await page.goto(gameChannelNavigationList.link)
  await getPageGame(page, gameChannelNavigationList)

  const whetherThePagingExists = await page.$('.css-uzrh1o')
  if (whetherThePagingExists) {
    const links = await page.$$eval('.css-uzrh1o a', links =>
      links.map(link => link.href))
    const linksSet = [...new Set(links)]
    console.log(linksSet)

    for (const link of linksSet) {
      await page.goto(link)
      await getPageGame(page, gameChannelNavigationList)
    }
  }
}

console.log(gameList.length)

async function getPageGame(page, type) {
  const pageGames = await page.$$eval('.css-1dtmw8n a', (links, type) =>
    links.map((link) => {
      const gameThumbTitleContainer = link.querySelector('.gameThumbTitleContainer')
      const gameThumbImage = link.querySelector('.GameThumbImage')
      const path = link.href.replace('https://www.crazygames.com/game/', '')
      return {
        href: link.href,
        gameThumbTitleContainer: gameThumbTitleContainer ? gameThumbTitleContainer.textContent.trim() : null,
        gameThumbImage: gameThumbImage ? gameThumbImage.src : null,
        video: `https://videos.crazygames.com/${path}/1/${path}-landscape-205x115.mp4` || '',
        type: type.type,
      }
    }), type)
  gameList.push(...pageGames)
  fs.writeFileSync('gameList.json', JSON.stringify(gameList, null, 2))

  return pageGames
}
await browser.close()

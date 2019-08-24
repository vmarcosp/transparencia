import fs from 'fs'
import { JSDOM } from 'jsdom'
import createURL from './url';
import { prop, pipe, map } from 'ramda'
import { querySelector, querySelectorAll } from './utils'
import { getEmployeeData } from './employee';

/**
 * Selectors
 */

const TABLE_SELECTOR = '.tableDados>tbody>tr>td>a'

const getEmployeeLinks = pipe(
  querySelectorAll(TABLE_SELECTOR),
  Array.from,
  map(prop('href'))
)

export const executeCrawlerTest = async () => {
  console.log('-----------PROCESSING------------')
  const URL = createURL(1, 2018)

  const dom = await JSDOM.fromURL(URL)
  const { document } = dom.window

  const links = getEmployeeLinks(document)
  const data = await getEmployeeData(links[0])
  console.table(data)
  console.log('------------FINISHED-------------')

}

const executeCrawler = async () => {
  console.log('-----------PROCESSING------------')
  const URL = createURL(1, 2018)

  const dom = await JSDOM.fromURL(URL)
  const { document } = dom.window

  const links = getEmployeeLinks(document)
  const promises = links.map(getEmployeeData)
  const allData = await Promise.all(promises)

  fs.writeFileSync('data.json', JSON.stringify(allData))
  console.log('------------FINISHED-------------')

}

process.env.NODE_ENV === 'test' ? executeCrawlerTest() : executeCrawler()



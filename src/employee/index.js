import { JSDOM } from 'jsdom'
import * as R from 'ramda'
import { LEFT_COLUMN_SELECTOR, RIGHT_COLUMN_SELECTOR, TABLE_SELECTOR } from './selectors'
import { innerHTML, querySelectorAll, querySelector } from '../utils'
import { getResolver } from './resolvers'

/**
 * mapped aliases
 */
const aliases = {
  'vínculo': 'vinculo',
  'situação': 'situacao',
  'cargahorária': 'cargaHoraria',
  'lotação': 'lotacao',
  'colaborador': 'colaborador',
  'datadeaposentadoria': 'dataAposentadoria',
  'cargo': 'cargo',
  'dataadmissão': 'dataAdmissao',
  'unidade': 'unidade',
  'nr.atodenomeaçãodocargoatual': 'nomeacaoCargoAtual',
  'datadenomeaçãodocargoatual': 'dataNomeacaoCargoAtual',
  'curso': 'curso',
  'nr.docontrato': 'numeroContrato',
  'datadocontrato': 'dataContrato'
}

/**
 * Clear unecessary characters
 */
const clearLabel = R.pipe(
  R.replace(/[\r\s\n]/ig, ''),
  R.toLower
)

/**
 * Get alias by label
 * @param {String} value 
 */
const getAlias = value => {
  const ocourrences = value.match(/(.*)<sup>/)
  const aliasName = ocourrences ? ocourrences[1] : value

  return aliases[clearLabel(aliasName)]
}

/**
 * Extract all employee data
 * @param {String} url 
 */
export const getEmployeeData = async url => {
  const { window } = await JSDOM.fromURL(url)
  const { document } = window

  // const $rowsFromLeft = document.querySelectorAll(LEFT_COLUMN_SELECTOR)
  // const $rowsFromRight = document.querySelectorAll(RIGHT_COLUMN_SELECTOR)
  const $table = getSalaryTable(document)

  console.log($table)

  const employeeData = {
    // ...getPrimaryInfo($rowsFromLeft),
    // ...getPrimaryInfo($rowsFromRight)
  }

  return employeeData
}

/**
 * Extract column label
 * @param {Number} index 
 */
const getLabel = (index, rows) =>
  R.pipe(
    R.prop(index),
    extractNodeValue('label'),
    innerHTML,
    R.trim,
    getAlias
  )(rows)


/**
 * Extract column value
 * @param {Number} index 
 */
const getValue = ({ index, label }, rows) =>
  R.pipe(
    R.prop(index + 1),
    getResolver(label),
    R.replace(/[\n\r]/g, ''),
    R.trim
  )(rows)


/**
 * Validate children tree
 * @param {String} selector 
 * @param {HTMLElement} $element 
 */
const extractNodeValue = selector => $element => {
  const children = $element.querySelector(selector)

  return children ? children : $element
}

/**
 * Iterate for all the columnns and extract the data
 */
const extractPrimaryInfo = R.curry((index, rows) => {
  const label = getLabel(index, rows)
  const value = getValue({ index, label }, rows)
  const nextPosition = index + 2

  const values = { [label]: value }


  return rows[nextPosition]
    ? {
      ...extractPrimaryInfo(nextPosition, rows),
      ...values
    }
    : values
})

/**
 * Parse, transform and get employee 'primary info'
 */
const getPrimaryInfo = R.pipe(
  Array.from,
  extractPrimaryInfo(0),
  R.dissoc('')
)

const getSalaryTable = R.pipe(
  querySelectorAll(TABLE_SELECTOR),
  R.prop(1),
  querySelectorAll('tbody>tr>td'),
  R.map(innerHTML)
)

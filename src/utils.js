import { curry, prop, tap } from 'ramda'

export const querySelectorAll = curry((selector, $parent) => $parent.querySelectorAll(selector))

export const querySelector = curry((selector, $parent) => $parent.querySelector(selector))

export const getText = prop('textContent')

export const getHref = prop('href')

export const innerHTML = prop('innerHTML')

export const log = tap(console.log)

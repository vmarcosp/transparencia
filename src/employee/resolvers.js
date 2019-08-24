import { pipe, replace } from 'ramda'
import { innerHTML, querySelector } from '../utils'

/**
 * Cargo field resolver
 */
const cargoResolver = pipe(
  querySelector('span'),
  innerHTML,
)

/**
 * Curso field resolver
 */
const cursoResolver = pipe(
  querySelector('small'),
  querySelector('em'),
  innerHTML,
  replace(/&lt;/ig, ''),
  replace(/&gt;/ig, '')
)

/**
 * Mapped resolvers
 */
const mappedResolvers = {
  'cargo': cargoResolver,
  'curso': cursoResolver
}

/**
 * 
 * @param {String} label 
 * @param {HTMLElement} label 
 */
export const getResolver = label => value => {
  const resolver = mappedResolvers[label] || innerHTML
  return resolver(value)
}

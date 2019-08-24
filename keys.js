const data = require('./data.json')
const R = require('ramda')

const values = data.reduce((acc, value) => {
  const keys = Object.keys(value)
    .map(key => key.toLowerCase().replace(/[\r\s\n]/ig, ''))

  return [...acc, ...keys]
}, [])

const first = 'Nr. do contrato <sup>(<a id="iNrAtoNomeacao" class="linkHighLight" href="#iNrAtoNomeacao">3</a>)</sup>'
const second = 'Situação<sup>(<a id="iNrExoneracaoDemissao" class="linkHighLight" href="#iNrExoneracaoDemissao">4</a>)</sup>'
const third = 'Nr. ato de nomeação do cargo atual <sup>(<a id="iNrAtoNomeacao" class="linkHighLight" href="#iNrAtoNomeacao">3</a>)</sup>'

// console.log(first.match(/(.*)<sup>/))
// console.log(second.match(/(.*)<sup>/))
// console.log(third.match(/(.*)<sup>/))
console.log(R.uniq(values))

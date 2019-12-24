
import reset from './css/reset.css'

import until from './js/until'

console.log(until)
console.log('isIOS', until.isIOS)

const main = function () {
  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('reset', reset)
}
main()

// async function sayHello () {
//   const result = await fetch(SERVICE_URL)
//   console.log(result)
// }

// sayHello()

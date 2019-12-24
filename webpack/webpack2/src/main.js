
import reset from './css/reset.css'

import demo from './js/demo.js'
const main = function () {
  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('other', demo)
  console.log('reset', reset)
}
main()

// async function sayHello () {
//   const result = await fetch(SERVICE_URL)
//   console.log(result)
// }

// sayHello()

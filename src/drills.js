require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

console.log('knex and driver installed correctly');

//drill 1
function searchByItemName(searchTerm) {
    knexInstance
      .select('*')
      .from('shopping_list')
      .where('name', 'ILIKE', `%${searchTerm}%`)
      .then(result => {
        console.log(result)
      })
  }
  
  searchByItemName('fish')

//drill 2
  function paginateItems(page) {
    const productsPerPage = 6
    const offset = productsPerPage * (page - 1)
    knexInstance
      .select('*')
      .from('shopping_list')
      .limit(productsPerPage)
      .offset(offset)
      .then(result => {
        console.log(result)
      })
  }
  
   paginateItems(2)

//drill 3
function productAddedDaysAgo(days) {
    knexInstance
      .select('*')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
      )
      .from('shopping_list')
      .then(result => {
        console.log(result)
      })
  }
  
  productAddedDaysAgo(6)

//drill 4
function costPerCategory() {
    knexInstance
      .select('category')
      .sum('price as total')
      .from('shopping_list')
      .groupBy('category')
      .then(result => {
        console.log(result)
      })
  }
  
  costPerCategory()

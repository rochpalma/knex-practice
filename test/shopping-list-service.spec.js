const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List service object`, function() {
    let db
    let testItems = [
        {
            shopping_id: 1,
            name: 'Item 1',
            price: '1.00',
            category: 'Main',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            shopping_id: 2,
            name: 'Item 2',
            price: '2.00',
            category: 'Snack',
            checked: false,
            date_added: new Date('2100-05-22T16:28:32.615Z'),
        },
        {
            shopping_id: 3,
            name: 'Item 3',
            price: '3.00',
            category: 'Snack',
            checked: false,
            date_added: new Date('1919-12-22T16:28:32.615Z'),
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())
    afterEach(() => db('shopping_list').truncate())
    after(() => db.destroy())
    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
          return db
            .into('shopping_list')
            .insert(testItems)
        })

        it(`getAllItems() resolves all item  from 'shopping_list' table`, () => {
            // test that ShoppingListService.getAllArticles gets data from table
                return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
            .then(actual => {
              expect(actual).to.eql({
                shopping_id: thirdId,
                name: thirdTestItem.name,
                price: thirdTestItem.price,
                category: thirdTestItem.category,
                checked: thirdTestItem.checked,
                date_added: thirdTestItem.date_added        
              })
            })
        })

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
            .then(() => ShoppingListService.getAllItems(db))
            .then(allItems => {
                // copy the test articles array without the "deleted" article
                const expected = testItems.filter(item => item.shopping_id !== itemId)        
                expect(allItems).to.eql(expected)
            })
        })

        //not yet done with update
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'Item 5',
                price: '5.00',
                category: 'Snack',
                checked: false,
                date_added: new Date('1919-12-22T16:28:32.615Z'),
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
            .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
            .then(item => {
                expect(item).to.eql({
                shopping_id: idOfItemToUpdate,
                ...newItemData,
                })
            })
        })
    })
    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
          return ShoppingListService.getAllItems(db)
            .then(actual => {
              expect(actual).to.eql([])
            })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Item 4',
                price: '4.00',
                category: 'Breakfast',
                checked: false,
                date_added: new Date('1919-12-22T16:28:32.615Z'),
            }
            return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
                expect(actual).to.eql({
                    shopping_id: 1,
                    ...newItem
                })
            })
        })
    })
  })
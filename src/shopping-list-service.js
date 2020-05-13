const ShoppingListService = {
    getAllItems(knex) {
        return knex.select('*').from('shopping_list')
    },
    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, shopping_id) {
        return knex.from('shopping_list').select('*').where('shopping_id', shopping_id).first()
    },  
    deleteItem(knex, shopping_id) {
        return knex('shopping_list')
        .where({ shopping_id })
        .delete()
    }, 
    updateItem(knex, shopping_id, newItemField) {
        return knex('shopping_list')
        .where({ shopping_id })
        .update(newItemField)
    }, 

}

module.exports = ShoppingListService
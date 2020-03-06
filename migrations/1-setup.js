exports.up = async function (knex) {
  await knex.schema.createTable('pings', (table) => {
    table.increments('id').primary()
    table.timestamp('date').defaultTo(knex.fn.now())
    table.string('userId').notNullable().index()
    table.integer('isFirstPing')
    table.string('beakerVersion')
    table.string('os')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('pings')
}
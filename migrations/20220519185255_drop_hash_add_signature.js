/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('transactions', table => {
      table.dropColumn('hash');
      table.string('signature');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('transactions', table => {
      table.dropColumn('signature');
      table.addColumn('hash');
  })
};

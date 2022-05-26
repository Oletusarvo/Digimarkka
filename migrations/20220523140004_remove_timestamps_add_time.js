/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('transactions', table => {
      table.dropColumn('created_at').dropColumn('updated_at');
      table.string('timestamp');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('transactions', table => {
      table.dropColumn('timestamp').timestamps(true, true);
  });
};

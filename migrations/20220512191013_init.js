/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
      table.string('firstname');
      table.string('lastname');
      table.string('sex');
      table.string('username').unique();
      table.string('password');
      table.string('email').unique();
      table.string('phone');
      table.timestamps(true, true);
  })
  .createTable('wallets', table => {
      table.string('address');
      table.string('username');
      table.string('title');
      table.float('balance');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_info').dropTableIfExists('accounts');
};

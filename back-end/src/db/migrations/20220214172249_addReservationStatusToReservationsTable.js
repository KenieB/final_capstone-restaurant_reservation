exports.up = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.string("reservation_status").defaultTo("booked").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema
    .hasColumn("reservations", "reservation_status")
    .then((exists) => {
      if (exists) {
        return knex.schema.table("reservations", (table) => {
          table.dropColumn("reservation_status");
        });
      }
    });
};

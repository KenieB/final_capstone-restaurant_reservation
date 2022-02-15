const knex = require("../db/connection");

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

function readTableReservationDetail(ids) {
  return knex("tables as t")
    .fullOuterJoin("reservations as r", "t.reservation_id", "r.reservation_id")
    .select(
      "t.table_id",
      "t.table_name",
      "t.capacity as table_capacity",
      "t.status as table_status",
      "t.reservation_id as table_reservation_id",
      "r.reservation_id",
      "r.people as reservation_size",
      "r.reservation_date",
      "r.reservation_time"
    )
    .where({ "t.table_id": ids.tableId })
    .orWhere({ "r.reservation_id": ids.reservationId });
}

function readReservationsToSeat(reservationId) {
  return knex("tables as t")
    .rightOuterJoin("reservations as r", "t.reservation_id", "r.reservation_id")
    .select (
      "t.table_id",
      "r.reservation_id",
      "r.reservation_date",
    )
    .where({ "r.reservation_id": reservationId })
    .first();
}

function readTableDetail(tableId) {
  return knex("tables as t")
    .join("reservations as r", "t.reservation_id", "r.reservation_id")
    .select("t.*", "r.people as reservation_size")
    .where({ "t.table_id": tableId })
    .first();
}

function update(tableUpdate) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableUpdate.table_id })
    .update({
      reservation_id: tableUpdate.reservation_id,
      status: "Occupied",
    })
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

function destroy(tableId) {
  return knex("tables")
    .where({ table_id: tableId })
    .del();
}

module.exports = {
  create,
  list,
  read,
  readTableReservationDetail,
  readTableDetail,
  readReservationsToSeat,
  update,
  delete: destroy,
};

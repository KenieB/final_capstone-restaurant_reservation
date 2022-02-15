const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(viewDate) {
  return knex("reservations")
    .select("*")
    .where({ 
      reservation_date: viewDate,
      reservation_status: "booked",
    })
    .orWhere({
      reservation_date: viewDate,
      reservation_status: "seated",
    })
    .orderBy("reservation_time");
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function updateStatus(reservationStatusUpdate) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationStatusUpdate.reservationId })
    .update({
      reservation_status: reservationStatusUpdate.newReservationStatus,
    })
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  create,
  list,
  read,
  updateStatus,
};

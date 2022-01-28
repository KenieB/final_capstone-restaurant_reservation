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
        .where({ "reservation_date": viewDate })
        .orderBy("reservation_time");
}

module.exports = {
    create,
    list,
}
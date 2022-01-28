const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const reservationsService = require("./reservations.service");
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//Request Validations

function bodyHasFirstNameProperty(req, res, next) {
  const { data: { first_name } = {} } = req.body;
  if (first_name) {
    res.locals.first_name = first_name;
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a first name",
  });
}

function bodyHasLastNameProperty(req, res, next) {
  const { data: { last_name } = {} } = req.body;
  if (last_name) {
    res.locals.last_name = last_name;
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a last name",
  });
}

function bodyHasMobileNumberProperty(req, res, next) {
  const { data: { mobile_number } = {} } = req.body;
  if (mobile_number) {
    res.locals.mobile_number = mobile_number;
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a mobile number",
  });
}

function bodyHasReservationDateProperty(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;
  if (reservation_date) {
    res.locals.reservation_date = reservation_date;
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a reservation date",
  });
}

function bodyHasReservationTimeProperty(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;
  if (reservation_time) {
    res.locals.reservation_time = reservation_time;
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a reservation time",
  });
}

function bodyHasPeopleProperty(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (people) {
    res.locals.people = Number(people);
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a party size",
  });
}

// --
async function list(req, res) {
  const data = await reservationsService.list(req.query.date);
  res.json({ data });
}

async function create(req, res) {
  /* const newReservation = {
    first_name: res.locals.first_name,
    last_name: res.locals.last_name,
    mobile_number: res.locals.mobile_number,
    people: res.locals.people,
    reservation_date: res.locals.reservation_date,
    reservation_time: res.locals.reservation_time,
  };

  const now = new Date().toISOString();
  newReservation.created_at = now;
  newReservation.updated_at = now;
  newReservation.reservation_id = nextId++;

  reservations.push(newReservation);*/

  const newReservationRequest = {
    first_name: res.locals.first_name,
    last_name: res.locals.last_name,
    mobile_number: res.locals.mobile_number,
    people: res.locals.people,
    reservation_date: res.locals.reservation_date,
    reservation_time: res.locals.reservation_time,
  };

  const newReservation = await reservationsService.create(
    newReservationRequest
  );

  res.status(201).json({
    data: newReservation,
  });
}

module.exports = {
  list,
  create: [
    bodyHasFirstNameProperty,
    bodyHasLastNameProperty,
    bodyHasMobileNumberProperty,
    bodyHasPeopleProperty,
    bodyHasReservationDateProperty,
    bodyHasReservationTimeProperty,
    asyncErrorBoundary(create),
  ],
};

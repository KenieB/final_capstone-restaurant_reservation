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
  const methodName = "bodyHasFirstNameProperty";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data: { first_name } = {} } = req.body;
  if (first_name) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.first_name = first_name;
    return next();
  }
  const message = "Reservation must include a first name";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasLastNameProperty(req, res, next) {
  const methodName = "bodyHasLastNameProperty";
  req.log.debug({ __filename, methodName, body: req.body })
  const { data: { last_name } = {} } = req.body;
  if (last_name) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.last_name = last_name;
    return next();
  }
  const message = "Reservation must include a last name";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasMobileNumberProperty(req, res, next) {
  const methodName = "bodyHasMobileNumberProperty";
  req.log.debug({ __filename, methodName, body: req.body })
  const { data: { mobile_number } = {} } = req.body;
  if (mobile_number) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.mobile_number = mobile_number;
    return next();
  }
  const message = "Reservation must include a mobile number";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasReservationDateProperty(req, res, next) {
  const methodName = "bodyHasReservationDateProperty";
  req.log.debug({ __filename, methodName, body: req.body })
  const { data: { reservation_date } = {} } = req.body;
  if (reservation_date) {
    req.log.trace({ __filename, methodName, valid: true })
    res.locals.reservation_date = reservation_date;
    return next();
  }
  const message = "Reservation must include a reservation date";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasReservationTimeProperty(req, res, next) {
  const methodName = "bodyHasReservationTimeProperty";
  req.log.debug({ __filename, methodName, body: req.body })
  const { data: { reservation_time } = {} } = req.body;
  if (reservation_time) {
    req.log.trace({ __filename, methodName, valid: true })
    res.locals.reservation_time = reservation_time;
    return next();
  }
  const message = "Reservation must include a reservation time";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasPeopleProperty(req, res, next) {
  const methodName = "bodyHasPeopleProperty";
  req.log.debug({ __filename, methodName, body: req.body })
  const { data: { people } = {} } = req.body;
  if (people) {
    req.log.trace({ __filename, methodName, valid: true })
    res.locals.people = Number(people);
    return next();
  }
  const message = "Reservation must include a party size"; 
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}


async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName })
  const data = await reservationsService.list(req.query.date);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

async function create(req, res) {
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

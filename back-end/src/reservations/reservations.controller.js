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
  req.log.debug({ __filename, methodName, body: req.body });
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
  req.log.debug({ __filename, methodName, body: req.body });
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
  req.log.debug({ __filename, methodName, body: req.body });
  const { data: { reservation_date } = {} } = req.body;
  if (reservation_date) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.reservation_date = reservation_date;
    return next();
  }
  const message = "Reservation must include a reservation date";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasReservationTimeProperty(req, res, next) {
  const methodName = "bodyHasReservationTimeProperty";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data: { reservation_time } = {} } = req.body;
  if (reservation_time) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.reservation_time = reservation_time;
    return next();
  }
  const message = "Reservation must include a reservation time";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasPeopleProperty(req, res, next) {
  const methodName = "bodyHasPeopleProperty";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data: { people } = {} } = req.body;
  if (people) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.people = Number(people);
    return next();
  }
  const message = "Reservation must include a party size";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function reservationDateIsInFuture(req, res, next) {
  const methodName = "reservationDateIsInFuture";
  req.log.debug({ __filename, methodName, body: req.body });
  const reqReservationDateTimeStr =
    res.locals.reservation_date + " " + res.locals.reservation_time + ":00";
  const reqReservationDateValue = new Date(reqReservationDateTimeStr);
  const currentDateValue = new Date();
  if (reqReservationDateValue.valueOf() - currentDateValue.valueOf() > 0) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.reqReserveAsDate = reqReservationDateValue;
    return next();
  }
  const message = "Reservation date and time must be in future";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function reservationDateIsNotTuesday(req, res, next) {
  const methodName = "reservationDateIsNotTuesday";
  req.log.debug({ __filename, methodName, body: req.body });
  
  if(res.locals.reqReserveAsDate.getDay() !== 2) {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  const message = "Restaurant closed on Tuesdays. Select a different date.";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function reservationTimeIsInBusinessHours(req, res, next) {
  const methodName = "reservationTimeIsAfterOpen";
  req.log.debug({ __filename, methodName, body: req.body });
  const reqReserveHour = res.locals.reqReserveAsDate.getHours();
  const reqReserveMin = res.locals.reqReserveAsDate.getMinutes();

  if(Number(reqReserveHour) < 10 || (Number(reqReserveHour) === 10 && Number(reqReserveMin) < 30)) {
    const message = "Reservation time must be after 10:30 AM";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  if(Number(reqReserveHour) > 21 || (Number(reqReserveHour) === 21 && Number(reqReserveMin) > 30)) {
    const message = "Reservation time must be before 9:30 PM";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  req.log.trace({ __filename, methodName, valid: true });
  return next();
}

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });
  const data = await reservationsService.list(req.query.date);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

async function create(req, res) {
  const methodName = "create";
  req.log.debug({ __filename, methodName });

  const newReservationRequest = {
    first_name: res.locals.first_name,
    last_name: res.locals.last_name,
    mobile_number: res.locals.mobile_number,
    people: res.locals.people,
    reservation_date: res.locals.reservation_date,
    reservation_time: res.locals.reservation_time,
  };

  const data = await reservationsService.create(newReservationRequest);
  res.status(201).json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
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
    reservationDateIsInFuture,
    reservationDateIsNotTuesday,
    reservationTimeIsInBusinessHours,
    asyncErrorBoundary(create),
  ],
};

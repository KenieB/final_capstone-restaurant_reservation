const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");

const VALID_STATUS_VALUES = ["booked", "seated", "finished"];

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
  const message = "Reservation must include a first_name";
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
  const message = "Reservation must include a last_name";
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
  const message = "Reservation must include a mobile_number";
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
  const message = "Reservation must include a reservation_date";
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
  const message = "Reservation must include a reservation_time";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasPeopleProperty(req, res, next) {
  const methodName = "bodyHasPeopleProperty";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data: { people } = {} } = req.body;
  if (people) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.peopleInReq = people;
    return next();
  }
  const message = "Reservation must include a party size ( people )";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function peoplePropertyIsNumber(req, res, next) {
  const methodName = "peoplePropertyIsNumber";
  const peopleInReq = res.locals.peopleInReq;
  req.log.debug({
    __filename,
    methodName,
    peopleInReqBody: peopleInReq,
    peopleInReqNumber: Number.isInteger(peopleInReq),
  });
  if (!Number.isInteger(peopleInReq)) {
    const message = "Reservation property - people - must be a number";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  req.log.trace({ __filename, methodName, valid: true });
  res.locals.people = Number(peopleInReq);
  return next();
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
  const message = "reservation_date and reservation_time must be in future";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function reservationDateIsNotTuesday(req, res, next) {
  const methodName = "reservationDateIsNotTuesday";
  req.log.debug({ __filename, methodName, body: req.body });

  if (res.locals.reqReserveAsDate.getDay() !== 2) {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  const message =
    "Restaurant closed on Tuesdays. reservation_date cannot be a Tuesday. Select a different date.";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function reservationTimeIsInBusinessHours(req, res, next) {
  const methodName = "reservationTimeIsAfterOpen";
  req.log.debug({ __filename, methodName, body: req.body });
  const reqReserveHour = res.locals.reqReserveAsDate.getHours();
  const reqReserveMin = res.locals.reqReserveAsDate.getMinutes();

  if (
    Number(reqReserveHour) < 10 ||
    (Number(reqReserveHour) === 10 && Number(reqReserveMin) < 30)
  ) {
    const message = "reservation_time must be after 10:30 AM";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  if (
    Number(reqReserveHour) > 21 ||
    (Number(reqReserveHour) === 21 && Number(reqReserveMin) > 30)
  ) {
    const message = "reservation_time must be before 9:30 PM";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  req.log.trace({ __filename, methodName, valid: true });
  return next();
}

async function reservationExists(req, res, next) {
  const methodName = "reservationExists";
  const reservationId = req.params.reservation_id;
  req.log.debug({
    __filename,
    methodName,
    params: { reservation_id: reservationId },
  });
  const reservation = await reservationsService.read(reservationId);
  if (reservation) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.reservation = reservation;
    return next();
  }
  const message = `Cannot find reservation_id #${reservationId}.`;
  next({ status: 404, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasStatusProperty(req, res, next) {
  const methodName = "bodyHasStatusProperty";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data: { status } = {} } = req.body;
  if (status) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.statusUpdate = status;
    return next();
  }
  const message = "Reservation update must include status property";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function statusPropertyIsValid(req, res, next) {
  const methodName = "statusPropertyIsValid";
  req.log.debug({ __filename, methodName, status: res.locals.statusUpdate });

  if (VALID_STATUS_VALUES.includes(res.locals.statusUpdate)) {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  const message = `Requested status update - ${res.locals.statusUpdate} - for reservation #${res.locals.reservation.reservation_id} is not valid. reservation_status must be one of: 'booked', 'seated', 'finished', 'cancelled'.`;
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}


//CRUD methods
async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });
  const data = await reservationsService.list(req.query.date);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

async function create(req, res, next) {
  const methodName = "create";
  req.log.debug({ __filename, methodName, body: req.body });

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

function read(req, res) {
  const methodName = "read";
  req.log.debug({ __filename, methodName });
  const { reservation } = res.locals;
  res.json({ data: reservation });
  req.log.trace({ __filename, methodName, return: true, data });
}

async function updateStatus(req, res) {
  const methodName = "updateStatus";

  const reservationStatusUpdate = {
    reservationId: res.locals.reservation.reservation_id,
    newReservationStatus: res.locals.statusUpdate,
  };
  req.log.debug({
    __filename,
    methodName,
    reservationStatusUpdate: reservationStatusUpdate,
  });
  const updatedReservation = await reservationsService.updateStatus(reservationStatusUpdate);
  const data = updatedReservation.reservation_status;
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
    peoplePropertyIsNumber,
    bodyHasReservationDateProperty,
    bodyHasReservationTimeProperty,
    reservationDateIsInFuture,
    reservationDateIsNotTuesday,
    reservationTimeIsInBusinessHours,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    bodyHasStatusProperty,
    statusPropertyIsValid,
    asyncErrorBoundary(updateStatus),
  ],
};

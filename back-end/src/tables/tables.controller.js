const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");

const VALID_PROPERTIES = ["reservation_id"];

//Request Validations

function bodyHasData(req, res, next) {
  const methodName = "bodyHasData";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data = {} } = req.body;
  if (data) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.data = data;
    return next();
  }
  const message = "Request body must include data property.";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyDataHasReservationIdProperty(req, res, next) {
  const methodName = "bodyDataHasReservationIdProperty";
  req.log.debug({ __filename, methodName, data: res.locals.data });
  const { data: { reservation_id } = {} } = req.body;
  if (reservation_id) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.reservationId = reservation_id;
    return next();
  }
  const message = "Request data must include a reservation_id property.";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

async function reservationIdExists(req, res, next) {
  const methodName = "reservationIdExists";
  const res_id = res.locals.reservationId;
  req.log.debug({ __filename, methodName, reservation_id: res_id });
  const readReservationId = await tablesService.readReservationsToSeat(res_id);

  if(readReservationId) {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  
  const message = `Cannot find reservation_id ${res.locals.reservationId}`;
  next({ status: 404, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasTableNameProperty(req, res, next) {
  const methodName = "bodyHasTableNameProperty";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data: { table_name } = {} } = req.body;
  if (table_name) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.table_name = table_name;
    return next();
  }
  const message = "Table must include a table_name";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function tableNameHasValidLength(req, res, next) {
  const methodName = "tableNameHasValidLength";
  req.log.debug({ __filename, methodName, table_name: res.locals.table_name });
  const tableName = res.locals.table_name;
  if (tableName.length > 1) {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  const message =
    "Value for table_name property must be at least 2 characters long.";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function bodyHasCapacityProperty(req, res, next) {
  const methodName = "bodyHasCapacityProperty";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data: { capacity } = {} } = req.body;
  if (capacity) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.capacityInReq = capacity;
    return next();
  }
  const message = "Table must include a capacity";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function capacityIsNumber(req, res, next) {
  const methodName = "capacityIsNumber";
  const capacityInReq = res.locals.capacityInReq;
  req.log.debug({
    __filename,
    methodName,
    capacity: capacityInReq,
    capacityNumber: Number.isInteger(capacityInReq),
  });
  if (!Number.isInteger(capacityInReq)) {
    const message = "Table property - capacity - must be a number";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  req.log.trace({ __filename, methodName, valid: true });
  res.locals.capacity = Number(capacityInReq);
  return next();
}

async function tableExists(req, res, next) {
  const methodName = "tableExists";
  const tableId = req.params.table_id;
  req.log.debug({
    __filename,
    methodName,
    params: { table_id: tableId },
  });
  const table = await tablesService.read(tableId);
  if (table) {
    req.log.trace({ __filename, methodName, valid: true });
    res.locals.table = table;
    return next();
  }
  const message = `Cannot find table_id #${tableId}.`;
  next({ status: 404, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function hasOnlyValidProperties(req, res, next) {
  const methodName = "hasOnlyValidProperties";
  req.log.debug({ __filename, methodName, body: req.body });
  const { data = {} } = req.body;
  const invalidProperties = Object.keys(data).filter(
    (property) => !VALID_PROPERTIES.includes(property)
  );
  if (invalidProperties.length) {
    const message = `Invalid property(ies): ${invalidProperties.join(", ")}`;
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  res.locals.reservationId = Number(data.reservation_id);
  req.log.trace({ __filename, methodName, valid: true });
  return next();
}

async function reservationFitsTableCapacity(req, res, next) {
  const methodName = "reservationFitsTableCapacity";
  const readIds = {
    tableId: res.locals.table.table_id,
    reservationId: res.locals.reservationId,
  };
  const tableReservationDetail = await tablesService.readTableReservationDetail(
    readIds
  );
  const reservationDetail = tableReservationDetail.find(
    (tableJoinEntry) =>
      tableJoinEntry.reservation_id === res.locals.reservationId
  );
  const tableReservationSize = {
    table_capacity: res.locals.table.capacity,
    reservation_size: reservationDetail.reservation_size,
  };
  req.log.debug({
    __filename,
    methodName,
    entity_ids: readIds,
    table_reservation_size: {
      table_capacity: res.locals.table.capacity,
      reservation_size: reservationDetail.reservation_size,
    },
    table_reservation_detail: tableReservationDetail,
  });
  if (res.locals.table.capacity < reservationDetail.reservation_size) {
    const message = `Maximum capacity for table_id #${readIds.tableId} ('${res.locals.table.table_name}') is ${tableReservationSize.table_capacity}. Please select a table with capacity of at least ${tableReservationSize.reservation_size} to seat reservation_id #${readIds.reservationId}`;
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }
  res.locals.tableReservationDetail = tableReservationDetail;
  req.log.trace({ __filename, methodName, valid: true });
  return next();
}

function tableIsNotOccupied(req, res, next) {
  const methodName = "tableIsNotOccupied";
  const tableStatus = res.locals.table.status;
  req.log.debug({ __filename, methodName, table_status: tableStatus });
  if (tableStatus === "Free") {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  const message = `table_id #${res.locals.table.table_id} ('${res.locals.table.table_name}') is currently occupied. Finish current table seating to reset table status for new party seating.`;
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

function tableIsOccupied(req, res, next) {
  const methodName = "tableIsOccupied";
  const tableStatus = res.locals.table.status;
  req.log.debug({ __filename, methodName, table_status: tableStatus });
  if (tableStatus === "Occupied") {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  const message = `table_id #${res.locals.table.table_id} ('${res.locals.table.table_name}') is currently not occupied`;
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}

//CRUD methods

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });
  const data = await tablesService.list(req.query.date);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

async function create(req, res) {
  const methodName = "create";
  req.log.debug({ __filename, methodName, body: req.body });

  const newTableRequest = {
    table_name: res.locals.table_name,
    capacity: res.locals.capacity,
  };

  const data = await tablesService.create(newTableRequest);
  res.status(201).json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

async function update(req, res) {
  const methodName = "update";
  const tableUpdate = {
    table_id: res.locals.table.table_id,
    reservation_id: res.locals.reservationId,
  };
  req.log.debug({ __filename, methodName, update: tableUpdate });
  const data = await tablesService.update(tableUpdate);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

async function destroy(req, res) {
  const methodName = "destroy";
  req.log.debug({ __filename, methodName, table: res.locals.table });

  const table_id = res.locals.table.table_id;
  const newReqFromTable = {
    table_name: res.locals.table.table_name,
    capacity: res.locals.table.capacity,
  };

  await tablesService.delete(table_id);

  const data = await tablesService.create(newReqFromTable);

  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

module.exports = {
  list,
  create: [
    bodyHasData,
    bodyHasTableNameProperty,
    tableNameHasValidLength,
    bodyHasCapacityProperty,
    capacityIsNumber,
    asyncErrorBoundary(create),
  ],
  update: [
    bodyHasData,
    bodyDataHasReservationIdProperty,
    asyncErrorBoundary(reservationIdExists),
    asyncErrorBoundary(tableExists),
    hasOnlyValidProperties,
    tableIsNotOccupied,
    asyncErrorBoundary(reservationFitsTableCapacity),
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(destroy),
  ],
};

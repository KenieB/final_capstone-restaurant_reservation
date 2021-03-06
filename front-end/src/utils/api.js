/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservations with specified `viewDate`
 * @param {string<viewDate>}
 *  the `reservation_date` matching desired reservation(s)
 * @param {AbortController.signal<signal>}
 *  optional AbortController.signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservations with `reservation_date`===`viewDate` saved in the database.
 */

export async function listReservations(viewDate, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  url.searchParams.append("date", viewDate);
  const options = {
    headers,
    signal,
  };
  return await fetchJson(url, options, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Saves a new reservation to database.
 * @param {object<reservation>}
 *  the object containing new reservation data
 * @param {AbortController.signal<signal>}
 *  optional AbortController.signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the newly created reservation.
 */
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options)
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves reservation with the specified `reservationId`.
 * @param {string<reservationId>}
 *  the `reservation_id` property matching the desired reservation
 * @param {AbortController.signal<signal>}
 *  optional AbortController.signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the saved reservation.
 */
export async function readReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  const options = {
    headers,
    signal,
  };
  return await fetchJson(url, options)
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing tables.
 * @param {AbortController.signal<signal>}
 *  optional AbortController.signal
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    headers,
    signal,
  };
  return await fetchJson(url, options, []);
}

/**
 * Saves a new table to the database.
 * @param {object<table>}
 *  the object containing new reservation data
 * @param {AbortController.signal<signal>}
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves to the newly created table.
 */
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Updates table record to seat reservation.
 * @param {number<tableId>}
 *  the `table_id` property associated with table to update
 * @param {number<reservationId>}
 *  the update value for `reservation_id` property of the specified table
 * @param {AbortController.signal<signal>}
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves to the updated table.
 */
export async function seatTable(tableId, reservationId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id: reservationId } }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Delete table record for seated reservation and insert clean(unassociated, free) record for table.
 * @param {number<tableId>}
 *  the `table_id` property associated with table to delete and insert
 * @param {AbortController.signal<signal>}
 *  optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves to deleted table record.
 */
export async function finishTable(tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "DELETE",
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Updates specified reservation record with new status.
 * @param {number<reservationId>}
 *  the `reservation_id` property of the reservation record to update
 * @param {string<newStatus>}
 *  the update value for `reservation_status` property of the specified reservation record
 * @param {AbortController.signal<signal>}
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves to the updated reservation.
 */
 export async function updateReservationStatus(reservationId, newStatus, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: newStatus } }),
    signal,
  };
  return await fetchJson(url, options)
    .then(formatReservationDate)
    .then(formatReservationTime);
}
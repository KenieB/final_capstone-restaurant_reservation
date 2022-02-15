import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import TableDisplayByStatus from "./TableDisplayByStatus";
import ReservationButtonDisplayByStatus from "./ReservationButtonDisplayByStatus";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  viewDate,
  reservations,
  setReservations,
  reservationsError,
  setReservationsError,
  tables,
  setTables,
}) {
  
  //React Hook(s)
  const history = useHistory();

  /**
   * Clean up `error`, retrieve reservations for `viewDate` from database with API `listReservations()`
   *  Set `reservations` with return value of `listReservations()`
   *      If error, catch and set to `error`
   *
   * @returns {abort}
   *      Abort controller for API call
   */
  function loadDashboardReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(viewDate, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  /**
   * Clean up `error`, retrieve tables with current status from database with API `listTables()`
   *  Set `tables` with return value of `listTables()`
   *      If error, catch and set to `error`
   *
   * @returns {abort}
   *      Abort controller for API call
   */
  function loadDashboardTables() {
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // DATA FORMAT FUNCTIONS

  /**
   * Map `reservations` for `viewDate` to display table rows
   */
  const reservationsTableRows = reservations.map((reservation) => (

    <tr key={reservation.reservation_id}>
      <th scope="row">
        <ReservationButtonDisplayByStatus reservation={reservation} />
      </th>
      <td className="text-center">
        {reservation.reservation_time.charAt(0) === "0"
          ? reservation.reservation_time.substring(1, 5)
          : reservation.reservation_time.substring(0, 5)}
      </td>
      <td className="text-center">{reservation.first_name}</td>
      <td className="text-center">{reservation.last_name}</td>
      <td className="text-center">{reservation.mobile_number}</td>
      <td className="text-center">{reservation.people}</td>
    </tr>
  ));

  /**
   * Map `tables` to display table rows
   */
  const tablesTableRows = tables.map((table, index) => (
    <TableDisplayByStatus key={index} table={table} setReservationsError={setReservationsError} />   
  ));

  // CLICK HANDLERS
  /**
   * `Previous` Button Click Handler - Set `viewDate` to current (`viewDate` - 1).
   *   Setting new `viewDate` will trigger Dashboard to reload via `useEffect(loadDashboardReservations, [viewDate])`.
   *    @param {event}
   */
  const previousClickHandler = (event) => {
    event.preventDefault();
    const prevViewDate = previous(viewDate);
    history.push({
      pathname: "/dashboard",
      search: `?date=${prevViewDate}`,
    });
  };
  /**
   * `Today` Button Click Handler - Set `viewDate` to today's date
   *   Setting new `viewDate` will trigger Dashboard to reload via `useEffect(loadDashboardReservations, [viewDate])`.
   *
   *    @param {event}
   */
  const todayClickHandler = (event) => {
    event.preventDefault();
    const stringToday = today();
    history.push({
      pathname: "/dashboard",
      search: `?date=${stringToday}`,
    });
  };
  /**
   * `Next` Button Click Handler - Find .
   *    @param {event}
   */
  const nextClickHandler = (event) => {
    event.preventDefault();
    const nextViewDate = next(viewDate);
    history.push({
      pathname: "/dashboard",
      search: `?date=${nextViewDate}`,
    });
  };

  /**
   * First useEffect calls loadDashboardReservations. New render based on change to `viewDate`.
   */
  useEffect(loadDashboardReservations, [
    viewDate,
    setReservations,
    setReservationsError,
  ]);
  /**
   * Second useEffect calls loadDashboardTables. New render based on change to `reservations`.
   */
  useEffect(loadDashboardTables, [
    reservations,
    setTables,
    setReservationsError,
  ]);

  return (
    <main>
      <h1>DASHBOARD</h1>
      <ErrorAlert error={reservationsError} />
      <div>
        <div className="d-xl-flex ms-xl-4 mb-2">
          <h4
            style={{ letterSpacing: 1, fontVariant: "small-caps" }}
            className="mb-0"
          >
            Reservations for {viewDate}
          </h4>
        </div>
        <div className="container mw-100 mx-1">
          <div className="row row-cols-1 row-cols-xl-2">
            <div className="col col-xl-8 d-flex align-items-center">
              <div className="table-responsive flex-fill">
                <table className="table table-dark table-striped table-hover align-middle">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center px-2">
                        Status
                      </th>
                      <th scope="col" className="text-center px-2">
                        Time
                      </th>
                      <th scope="col" className="text-center px-2">
                        First Name
                      </th>
                      <th scope="col" className="text-center px-2">
                        Last Name
                      </th>
                      <th scope="col" className="text-center px-2">
                        Mobile Number
                      </th>
                      <th scope="col" className="text-center px-2">
                        Party Size
                      </th>
                    </tr>
                  </thead>
                  <tbody>{reservationsTableRows}</tbody>
                </table>
              </div>
            </div>
            <div className="col col-xl-4 pe-xl-4 d-flex justify-content-evenly align-items-center">
              <div className="table-xl-responsive flex-fill">
                <table className="table table-light table-striped table-hover align-middle">
                  <thead>
                    <tr className="table-secondary">
                      <th scope="col" className="text-center align-middle px-2">
                        Table Name
                      </th>
                      <th scope="col" className="text-center align-middle px-2">
                        Status
                      </th>
                      <th scope="col" className="text-center align-middle px-2">
                        Capacity
                      </th>
                    </tr>
                  </thead>
                  <tbody>{tablesTableRows}</tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-xl-4 mb-2">
            <div className="d-grid gap-2 d-xl-inline-flex justify-content-xl-evenly align-content-xl-center col col-xl-8">
              <button
                type="button"
                style={{
                  letterSpacing: 2,
                  fontVariant: "small-caps",
                  minWidth: "30%",
                  fontWeight: 500,
                }}
                className="btn btn-warning rounded-pill fs-5 text-dark"
                onClick={previousClickHandler}
              >
                Previous
              </button>
              <button
                type="button"
                style={{
                  letterSpacing: 2,
                  fontVariant: "small-caps",
                  minWidth: "30%",
                  fontWeight: 500,
                }}
                className="btn btn-dark rounded-pill fs-5 text-warning"
                onClick={todayClickHandler}
              >
                Today
              </button>
              <button
                type="button"
                style={{
                  letterSpacing: 2,
                  fontVariant: "small-caps",
                  minWidth: "30%",
                  fontWeight: 500,
                }}
                className="btn btn-warning rounded-pill fs-5 text-dark"
                onClick={nextClickHandler}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

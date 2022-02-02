import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  viewDate,
  setViewDate,
  reservations,
  setReservations,
  reservationsError,
  setReservationsError,
}) {
  /**
   * Object for translating month digit respresentation to text full name string
   *
   * (keys) "##" || (values) "Month-Name"
   */
  const MONTH_NAME_TRANSLATOR = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  //React Hook(s)
  const history = useHistory();

  /**
   * Clean up `reservationsError`, retrieve reservations for `viewDate` from database with API `listReservations()`
   *  Set `reservations` with return value of `listReservations()`
   *      If error, catch and set to `reservationsError`
   *
   * @returns {abort}
   *      Abort controller for API call
   */
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(viewDate, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  /**
   * Translate default `viewDate` format("YYYY-MM-DD") to formal US-Standard format
   *
   * @returns {string}
   *      'viewDate' formatted as "Full-Month-Name DD, YYYY"
   */
  const longDateString = (dateToTranslate) =>
    MONTH_NAME_TRANSLATOR[dateToTranslate.substr(5, 2)] +
    " " +
    dateToTranslate.substr(8, 2) +
    ", " +
    dateToTranslate.substr(0, 4);

  /**
   * Map `reservations` for `viewDate` to display table rows
   */
  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row" className="text-center px-2">
        {reservation.reservation_id}
      </th>
      <td className="text-center px-4">{reservation.reservation_time}</td>
      <td className="text-center px-4">{reservation.first_name}</td>
      <td className="text-center px-4">{reservation.last_name}</td>
      <td className="text-center px-4">{reservation.mobile_number}</td>
      <td className="text-center px-2">{reservation.people}</td>
    </tr>
  ));
 
  /**
   * `Previous` Button Click Handler - Set `viewDate` to current (`viewDate` - 1).
   *   Setting new `viewDate` will trigger Dashboard to reload via `useEffect(loadDashboard, [viewDeck])`.
   *    @param {event}
   */
  const previousClickHandler = (event) => {
    event.preventDefault();
    const prevViewDate = previous(viewDate);
    history.push({
      pathname: '/dashboard',
      search: `?date=${prevViewDate}`
    });
  };
  /**
   * `Today` Button Click Handler - Set `viewDate` to today's date
   *   Setting new `viewDate` will trigger Dashboard to reload via `useEffect(loadDashboard, [viewDeck])`.
   *
   *    @param {event}
   */
  const todayClickHandler = (event) => {
    event.preventDefault();
    const stringToday = today();
    history.push({
      pathname: '/dashboard',
      search: `?date=${stringToday}`
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
      pathname: '/dashboard',
      search: `?date=${nextViewDate}`
    });
  };

  /**
   * useEffect calls loadDashboard. New render based on `viewDate` change(s).
   */
  useEffect(loadDashboard, [viewDate, setReservations, setReservationsError]);

  return (
    <main>
      <h1>DASHBOARD</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {longDateString(viewDate)}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <div className="d-flex me-5">
          <div className="table-responsive me-5">
            <table className="table table-dark table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col" className="text-center px-2">
                    (ID#)
                  </th>
                  <th scope="col" className="text-center px-4">
                    Time
                  </th>
                  <th scope="col" className="px-4">
                    First Name
                  </th>
                  <th scope="col" className="px-4">
                    Last Name
                  </th>
                  <th scope="col" className="text-center px-4">
                    Mobile Number
                  </th>
                  <th scope="col" className="text-center px-2">
                    Party Size
                  </th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>
        </div>
        <div className="d-grid gap-1 d-md-block vw-50">
          <button type="button" className="btn btn-primary" onClick={previousClickHandler}>
            Previous
          </button>
          <button type="button" className="btn btn-primary" onClick={todayClickHandler}>
            Today
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={nextClickHandler}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
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
  const monthDigitAsText = {
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

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(viewDate, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const longDateString = (dateToTranslate) =>
    monthDigitAsText[dateToTranslate.substr(5, 2)] +
    " " +
    dateToTranslate.substr(8, 2) +
    ", " +
    dateToTranslate.substr(0, 4);

  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id} className="table-striped">
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

  useEffect(loadDashboard, [viewDate]);

  return (
    <main>
      <h1>DASHBOARD</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {longDateString(viewDate)}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
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
      <div className="d-flex vw-50">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button type="button" className="btn btn-primary">
            Previous
          </button>
          <button type="button" className="btn btn-primary">
            Today
          </button>
          <button type="button" className="btn btn-primary">
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

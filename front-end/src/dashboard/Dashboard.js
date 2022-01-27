import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

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
    "10": "October",
    "11": "November",
    "12": "December",
  };

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id} className="table-striped">
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.people}</td>
    </tr>
  ));

  useEffect(loadDashboard, [date]);

  const longDateString = monthDigitAsText[date.substr(5,2)] + " " + date.substr(8,2) + ", " + date.substr(0, 4);

  return (
    <main>
      <h1>DASHBOARD</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {longDateString}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="table-responsive">
        <table className="table table-sm table-striped">
          <thead>
            <tr className="table-primary">
              <th scope="col">#</th>
              <th scope="col">Time</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Party Size</th>
            </tr>
          </thead>
          {tableRows}
        </table>
      </div>
    </main>
  );
}

export default Dashboard;

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

/**
 * Defines the reservation rows to display on the dashboard page.
 * @param reservation
 *  the reservation the user wants to view.
 * @returns {JSX.Element}
 */
function ReservationButtonDisplayByStatus({ reservation }) {
  //
  // const history = useHistory();

  //useEffect(() => {}, [reservation.reservation_status]);

  if (reservation.reservation_status === "booked") {
    return (
      <div className="d-flex flex-column">
        <div
          style={{
            letterSpacing: 2,
            fontVariant: "all-small-caps",
            fontWeight: 400,
          }}
          className="text-center pb-1"
          data-reservation-id-status={reservation.reservation_id}
        >
          {reservation.reservation_status}
        </div>
        <div>
          <Link
            to={`/reservations/${reservation.reservation_id}/seat`}
            style={{
              letterSpacing: 2,
              fontVariant: "all-small-caps",
              fontWeight: 500,
            }}
            className="d-flex justify-content-center btn btn-outline-warning border-2 rounded py-0 fs-5"
          >
            Seat
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="d-flex flex-column">
        <div
          style={{
            letterSpacing: 2,
            fontVariant: "all-small-caps",
            fontWeight: 500,
          }}
          className="text-center fs-5 text-warning"
          data-reservation-id-status={reservation.reservation_id}
        >{reservation.reservation_status}</div>
      </div>
    );
  }
}

export default ReservationButtonDisplayByStatus;

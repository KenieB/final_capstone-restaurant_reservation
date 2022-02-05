import React from "react";
//import { Link } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

export const CreateReservation = ({ reservationsError, setReservationsError }) => {
  return (
    <div className="mt-2">
      <h1>Create Reservation</h1>
      <div>
        <ErrorAlert error={reservationsError} />
      </div>
      <ReservationForm reservationsError={reservationsError} setReservationsError={setReservationsError} />
    </div>
  );
};

export default CreateReservation;

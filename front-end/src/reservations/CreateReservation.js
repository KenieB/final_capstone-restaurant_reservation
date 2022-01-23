import React from "react";
import { Link } from "react-router-dom";
import ReservationForm from "./ReservationForm";

export const CreateReservation = ({}) => {
    return (
        <div className="mt-2">
            <h1>Create Reservation</h1>
            <ReservationForm />
        </div>
    );
}

export default CreateReservation;
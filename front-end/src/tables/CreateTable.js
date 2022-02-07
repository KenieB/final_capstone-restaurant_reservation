import React from "react";
//import { Link } from "react-router-dom";
import TableForm from "./TableForm";
import ErrorAlert from "../layout/ErrorAlert";

export const CreateTable = ({ reservationsError, setReservationsError }) => {
  return (
    <div className="mt-2">
      <h1>Create Table</h1>
      <div>
        <ErrorAlert error={reservationsError} />
      </div>
      <TableForm error={reservationsError} setReservationsError={setReservationsError} />
    </div>
  );
};

export default CreateTable;

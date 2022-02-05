import React from "react";
//import { Link } from "react-router-dom";
import TableForm from "./TableForm";
import ErrorAlert from "../layout/ErrorAlert";

export const CreateTable = ({ tablesError, setTablesError }) => {
  return (
    <div className="mt-2">
      <h1>Create Table</h1>
      <div>
        <ErrorAlert error={tablesError} />
      </div>
      <TableForm tablesError={tablesError} setTablesError={setTablesError} />
    </div>
  );
};

export default CreateTable;

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { finishTable, updateReservationStatus } from "../utils/api";

/**
 * Defines the table rows to display on the dashboard page.
 * @param table
 *  the table the user wants to view.
 * @returns {JSX.Element}
 */
function TableDisplayByStatus({ table, setReservationsError }) {
  //
  const history = useHistory();

  const [finishTableFlag, setFinishTableFlag] = useState(false);
  const handleFinishTable = (event) => {
    const abortController = new AbortController();
    setReservationsError(null);
    const result = window.confirm(
      "Is this table ready to seat new guests?\n\nThis cannot be undone."
    );
    if (result) {
    const finishedReservationId = table.reservation_id;
      async function clearTable() {
        try {
          const finishedTable = await finishTable(
            table.table_id,
            abortController.signal
          );
          if (finishedTable) {
            const newStatusFinish = "finished";
            await updateReservationStatus(finishedReservationId, newStatusFinish, abortController.signal);
            setFinishTableFlag(true);
          }
        } catch (error) {
          setReservationsError(error);
        }
      }
      clearTable();
    }
  };

  useEffect(() => {
    if(finishTableFlag) {
      history.go(0);
    }
    // eslint-disable-next-line
  },[finishTableFlag]);

  if (table.status === "Free") {
    return (
      <tr>
        <th scope="row" className="ps-3">
          {table.table_name}
        </th>
        <td
          className="text-center fw-light"
          data-table-id-status={table.table_id}
        >
          {table.status}
        </td>
        <td className="text-center fw-light">{table.capacity}</td>
      </tr>
    );
  } else {
    return (
      <tr>
        <th scope="row" className="ps-3">
          {table.table_name}
        </th>
        <td
          className="text-center fw-light"
          data-table-id-status={table.table_id}
        >
          <div className="d-flex flex-column align-content-center">
            <div className="pb-1">{table.status}</div>
            <div>
              <button
                type="button"
                style={{
                  letterSpacing: 2,
                  fontVariant: "all-small-caps",
                  fontWeight: 500,
                }}
                className="btn btn-warning rounded-pill fs-6 text-dark pt-0 pb-1 align-self-center"
                data-table-id-finish={table.table_id}
                onClick={handleFinishTable}
              >
                Finish
              </button>
            </div>
          </div>
        </td>
        <td className="text-center fw-light">{table.capacity}</td>
      </tr>
    );
  }
}

export default TableDisplayByStatus;

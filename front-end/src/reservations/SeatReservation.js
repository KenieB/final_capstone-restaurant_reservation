import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { seatTable } from "../utils/api";

export const SeatReservation = ({
  activeReservation,
  setActiveReservation,
  tables,
  setTables,
  reservationsError,
  setReservationsError,
}) => {
  //
  const [selectTableId, setSelectTableId] = useState(1);
  const params = useParams();
  const reservationId = params.reservation_id;
  const history = useHistory();

  const smallCapsStyle = {
    letterSpacing: 2,
    fontVariant: "small-caps",
    fontWeight: 500,
  };
  const allSmallCapsStyle = {
    letterSpacing: 2,
    fontVariant: "all-small-caps",
    fontWeight: 500,
  };

  const selectTableOptions = tables.map((table) => (
    <option
      key={`${table.table_id}`}
      value={`${table.table_id}`}
    >{`${table.table_name} - ${table.capacity}`}</option>
  ));

  const handleCancel = () => {
    history.goBack();
  };

  const handleChange = ({ target }) => {
    setSelectTableId(target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function seatReservationTable() {
      try {
        const response = await seatTable(
          selectTableId,
          reservationId,
          abortController.signal
        );
        history.push({
          pathname: "/dashboard",
          search: `?date=${activeReservation.reservation_date}`,
        });
      } catch (error) {
        setReservationsError(error);
      }
    }
    seatReservationTable();
    return () => abortController.abort();
  };

  return (
    <div className="mt-2">
      <h1 className="text-center text-md-start">
        Seat Reservation #{params.reservation_id}
      </h1>
      <div>
        <ErrorAlert error={reservationsError} />
      </div>
      <div className="container mt-5 ms-lg-3">
        <div className="row">
          <div className="col col-lg-6">
            <label htmlFor="table_id" style={smallCapsStyle}>
              Table number:
            </label>
            <select
              name="table_id"
              id="table_id"
              className="form-select form-select-lg"
              aria-label="Select table to seat reservation"
              required
              autofocus
              onChange={handleChange}
            >
              {selectTableOptions}
            </select>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col col-lg-6">
            <div className="d-grid gap-2 mx-3 my-3 d-md-flex justify-content-md-evenly ms-md-0 me-md-5">
              <button
                type="button"
                className="btn btn-secondary btn-lg col-md-4 fs-5 py-1"
                style={allSmallCapsStyle}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg col-md-4 fs-5 py-1"
                style={allSmallCapsStyle}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatReservation;

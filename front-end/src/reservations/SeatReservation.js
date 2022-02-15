import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { seatTable, updateReservationStatus } from "../utils/api";

export const SeatReservation = ({
  activeReservation,
  setActiveReservation,
  tables,
  setTables,
  reservationsError,
  setReservationsError,
}) => {
  //
  const [selectTableId, setSelectTableId] = useState(tables[0].table_id);
  const [tableSeatedFlag, setTableSeatedFlag] = useState(false);
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
      label={`${table.table_name} - ${table.capacity}`}
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
        await seatTable(selectTableId, reservationId, abortController.signal);
        setTableSeatedFlag(true);
      } catch (error) {
        setReservationsError(error);
      }
    }
    seatReservationTable();
    return () => abortController.abort();
  };

  useEffect(() => {
    if (tableSeatedFlag) {
      const abortController = new AbortController();
      async function seatReservationStatus() {
        try {
          const newStatus = "seated";
          const updatedReservation = await updateReservationStatus(
            reservationId,
            newStatus,
            abortController.signal
          );
          console.log("updated reservation: ", updatedReservation);
          history.push({
            pathname: "/dashboard",
            search: `?date=${activeReservation.reservation_date}`,
          });
        } catch (error) {
          setReservationsError(error);
        }
      }
      seatReservationStatus();
      return () => abortController.abort();
    }
    // eslint-disable-next-line
  }, [tableSeatedFlag]);

  return (
    <div className="mt-2">
      <h1 className="text-center text-md-start">
        Seat Reservation #{reservationId}
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

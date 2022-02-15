import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

export const TableForm = ({ reservationsError, setReservationsError }) => {
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

  const initFormState = {
    table_name: "",
    capacity: 1,
  };

  const [formData, setFormData] = useState(initFormState);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  const handleCancel = () => {
    history.goBack();
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function createNewTable() {
      try {
        const newTableRequest = {
          ...formData,
          capacity: Number(formData.capacity),
        }
        await createTable(newTableRequest, abortController.signal);
        history.push("/dashboard");
      } catch (error) {
        setReservationsError(error);
      }
    }
    createNewTable();
    return () => abortController.abort();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-2 mx-3 my-1 justify-content-md-evenly ms-md-0 me-md-5 mb-md-1">
          <div className="col-md-5">
            <label
              htmlFor="table_name"
              className="form-label"
              style={smallCapsStyle}
            >
              Table name:
            </label>
            <input
              id="table_name"
              type="text"
              name="table_name"
              placeholder="Table name"
              minLength={2}
              className="form-control"
              autoFocus
              required
              onChange={handleChange}
              value={formData.table_name}
            />
          </div>
          <div className="col-md-5">
            <label
              htmlFor="capacity"
              className="form-label"
              style={smallCapsStyle}
            >
              Capacity:
            </label>
            <input
              id="capacity"
              type="number"
              name="capacity"
              className="form-control"
              min="1"
              required
              onChange={handleChange}
              value={formData.capacity}
            />
          </div>
        </div>
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
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default TableForm;

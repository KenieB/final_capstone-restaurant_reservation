import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

export const ReservationForm = ({
  reservationsError,
  setReservationsError,
}) => {
  const { url } = useRouteMatch();
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

  const initFormState = () => {
    if (!url.includes("new")) {
      const initialFormState = {
        first_name: "placeholder-exst-reservation-first-name",
        last_name: "placeholder-exst-reservation-last-name",
        mobile_number: "123-456-7890",
        reservation_date: "2022-03-29",
        reservation_time: "12:12:12",
        people: 3,
      };
      return initialFormState;
    } else {
      const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
      };
      return initialFormState;
    }
  };

  const [formData, setFormData] = useState(initFormState());
  const [newReservationDate, setNewReservationDate] = useState("");

  //const [reservationUpdateFlag, setReservationUpdateFlag] = useState(false);

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
    setNewReservationDate("");
    async function createNewReservation() {
      try {
        const newReservationRequest = {
          ...formData,
          people: Number(formData.people),
        };
        const response = await createReservation(
          newReservationRequest,
          abortController.signal
        );
        setNewReservationDate(response.reservation_date);
      } catch (error) {
        setReservationsError(error);
      }
    }
    createNewReservation();
    return () => abortController.abort();
  };

  useEffect(() => {
    if (newReservationDate) {
      history.push({
        pathname: "/dashboard",
        search: `?date=${newReservationDate}`,
      });
    }
    // eslint-disable-next-line
  }, [newReservationDate]);

  if (url === "/reservations/new") {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="row g-2 mx-3 my-1 justify-content-md-evenly ms-md-0 me-md-5 mb-md-1">
            <div className="col-md-5">
              <label
                htmlFor="first_name"
                className="form-label"
                style={smallCapsStyle}
              >
                First name:
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder="First name"
                className="form-control"
                autoFocus
                required
                onChange={handleChange}
                value={formData.first_name}
              />
            </div>
            <div className="col-md-5">
              <label
                htmlFor="last_name"
                className="form-label"
                style={smallCapsStyle}
              >
                Last name:
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                placeholder="Last name"
                className="form-control"
                required
                onChange={handleChange}
                value={formData.last_name}
              />
            </div>
          </div>
          <div className="row g-2 mx-3 my-1 justify-content-md-evenly ms-md-0 me-md-5">
            <div className="col-md-5">
              <label
                htmlFor="mobile_number"
                className="form-label"
                style={smallCapsStyle}
              >
                Mobile number:
              </label>
              <input
                id="mobile_number"
                type="tel"
                name="mobile_number"
                className="form-control"
                placeholder="000-000-0000"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
                onChange={handleChange}
                value={formData.mobile_number}
              />
            </div>
            <div className="col-md-5">
              <label
                htmlFor="people"
                className="form-label"
                style={smallCapsStyle}
              >
                Party size (min: 1):
              </label>
              <input
                id="people"
                type="number"
                name="people"
                className="form-control"
                min="1"
                max="6"
                required
                onChange={handleChange}
                value={formData.people}
              />
            </div>
          </div>
          <div className="row g-2 mx-3 mt-1 justify-content-md-evenly ms-md-0 me-md-5">
            <div className="col-md-5">
              <label
                htmlFor="reservation_date"
                className="form-label"
                style={smallCapsStyle}
              >
                Date of reservation:
              </label>
              <input
                id="reservation_date"
                type="date"
                name="reservation_date"
                className="form-control"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                required
                onChange={handleChange}
                value={formData.reservation_date}
              />
            </div>
            <div className="col-md-5">
              <label
                htmlFor="reservation_time"
                className="form-label"
                style={smallCapsStyle}
              >
                Time of reservation:
              </label>
              <input
                id="reservation_time"
                type="time"
                name="reservation_time"
                className="form-control"
                placeholder="12:00"
                pattern="[0-9]{2}:[0-9]{2}"
                required
                onChange={handleChange}
                value={formData.reservation_time}
              />
            </div>
          </div>
          <div
            className="d-grid gap-2 mx-3 my-3 d-md-flex justify-content-md-evenly ms-md-0 me-md-5"
            style={smallCapsStyle}
          >
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
  } else {
    return (
      <>
        <h1>EDIT RESERVATION</h1>
        <h3>form placeholder</h3>
      </>
    );
  }
};

export default ReservationForm;

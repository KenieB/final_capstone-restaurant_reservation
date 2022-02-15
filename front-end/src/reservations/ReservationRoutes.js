import React, { useEffect } from "react";
import { Route, Switch, useRouteMatch, useParams } from "react-router-dom";
import SeatReservation from "./SeatReservation";
import { readReservation } from "../utils/api";

function ReservationRoutes({
  activeReservation,
  setActiveReservation,
  tables,
  setTables,
  reservationsError,
  setReservationsError,
}) {
  const { path } = useRouteMatch();
  const { reservation_id } = useParams();

  /**
   * useEffect calls loadActiveReservation. New render based on change to `reservation_id` url param.
   */
  useEffect(() => {
    setActiveReservation({});
    const abortController = new AbortController();
    async function loadActiveReservation() {
      try {
        const readReservationFromId = await readReservation(
          reservation_id,
          abortController.signal
        );
        setActiveReservation(readReservationFromId);
      } catch (error) {
        setReservationsError(error);
      }
    }
    loadActiveReservation();
    return () => abortController.abort();
  }, [reservation_id, setActiveReservation, setReservationsError]);

  return (
    <Switch>
      <Route path={`${path}/seat`}>
        <SeatReservation
          activeReservation={activeReservation}
          setActiveReservation={setActiveReservation}
          tables={tables}
          setTables={setTables}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
        />
      </Route>
      <Route path={`${path}/edit`}>
        <h1>{`PATH: ${path}`}</h1>
      </Route>
    </Switch>
  );
}

export default ReservationRoutes;

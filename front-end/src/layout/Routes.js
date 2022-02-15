import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateReservation from "../reservations/CreateReservation";
import CreateTable from "../tables/CreateTable";
import ReservationRoutes from "../reservations/ReservationRoutes";

/**
 * Defines main routes for the application.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [activeReservation, setActiveReservation] = useState({});
  const [viewDate, setViewDate] = useState(today());
  const [tables, setTables] = useState([]);

  //const [table, setTable] = useState({});

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setActiveReservation({});
    }
  }, [location]);

  useEffect(() => {
    const searchQuery = location.search;
    if (searchQuery) {
      const queryKey = searchQuery.substring(1, 5);
      queryKey === "date"
        ? setViewDate(searchQuery.substring(6, 16))
        : setViewDate(today());
    } else {
      setViewDate(today());
    }
  }, [location]);

  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/tables/new">
        <CreateTable
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
        />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
        />
      </Route>
      <Route path="/reservations/:reservation_id">
        <ReservationRoutes
          activeReservation={activeReservation}
          setActiveReservation={setActiveReservation}
          tables={tables}
          setTables={setTables}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
        />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          viewDate={viewDate}
          reservations={reservations}
          setReservations={setReservations}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
          tables={tables}
          setTables={setTables}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

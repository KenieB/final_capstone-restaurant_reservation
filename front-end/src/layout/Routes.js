import React, { useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateReservation from "../reservations/CreateReservation";
import CreateTable from "../tables/CreateTable";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  //const [reservation, setReservation] = useState({});
  const [viewDate, setViewDate] = useState(today());
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  //const [table, setTable] = useState({});

  const location = useLocation();

  useEffect(() => {
    const searchQuery = location.search;
    if (searchQuery) {
      const queryKey = searchQuery.substring(1, 5);
      queryKey === "date"
        ? setViewDate(searchQuery.substring(6, 16))
        : setViewDate(today());
    }
  }, [location]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTable tablesError={tablesError} setTablesError={setTablesError} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <CreateReservation reservationsError={reservationsError} setReservationsError={setReservationsError} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          viewDate={viewDate}
          setViewDate={setViewDate}
          reservations={reservations}
          setReservations={setReservations}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

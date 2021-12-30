import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";
import Search from "../search/Search";
import ReservationSeat from "../reservations/ReservationSeat";
// import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
	// const [date, setDate] = useState(today());
	// const url = useRouteMatch();
	// const query = useQuery();
	// const [dashboardDate, setDashboardDate] = useState(
	// 	useQuery().get("date") || today()
	// );

	// useEffect(loadDate, [url, query]);

	// function loadDate() {
	// 	const newDate = query.get("date");
	// 	if (newDate) setDate(newDate);
	// }

	return (
		<Switch>
			<Route exact={true} path="/">
				<Redirect to={"/dashboard"} />
			</Route>
			<Route exact={true} path="/reservations">
				<Redirect to={"/dashboard"} />
			</Route>
			<Route path="/dashboard/:date">
				<Dashboard />
			</Route>
			<Route path="/dashboard/">
				<Dashboard date={today()} />
			</Route>
			<Route path="/search">
				<Search />
			</Route>
			<Route path="/reservations/:reservation_id/seat">
				<ReservationSeat />
			</Route>
			<Route path="/reservations/:reservation_id/edit">
				<Reservations date={today()} />
			</Route>
			<Route path="/reservations/new">
				<Reservations date={today()} />
			</Route>
			<Route path="/tables/new">
				<Tables date={today()} />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Routes;

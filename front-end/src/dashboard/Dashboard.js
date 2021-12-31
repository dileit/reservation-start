import React, { useEffect, useState } from "react";
import { listTables, freeTable, listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { Link } from "react-router-dom";
import ReservationList from "../reservations/ReservationList";
import TablesList from "../tables/TablesList.js";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
	// const params = useParams();
	// const history = useHistory();
	// format date YYYY-MM-DD
	// if (params.date) {
	// 	date = params.date;
	// }
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [tables, setTables] = useState([]);
	const [tablesError, setTablesError] = useState(null);
	const query = useQuery();
	const dateQuery = query.get("date");

	if (dateQuery) date = dateQuery;

	// const dateObj = new Date(date);
	// const dateString = dateObj.toDateString();

	// list reservations
	useEffect(loadDashboard, [date]);

	function loadDashboard() {
		const abortController = new AbortController();
		setReservationsError(null);
		setTablesError(null);
		listReservations({ date }, abortController.signal)
			.then(setReservations)
			.catch(setReservationsError);
		listTables(abortController.signal).then(setTables).catch(setTablesError);
		return () => abortController.abort();
	}

	// final reservation handler - processes clearing table + reservations

	const handleFinal = async ({ target }) => {
		const abortController = new AbortController();
		const value = target.value;
		const result = window.confirm(
			"Is this table ready to seat new guests? This cannot be undone."
		);
		if (result) {
			async function deleteData() {
				try {
					await freeTable(value, abortController.signal);

					// const output = await listTables(abortController.signal);
					// const output2 = await listReservations(
					// 	{ date },
					// 	abortController.signal
					// );
					// setTables(output);
					// setReservations(output2);
					// history.go(0);
				} catch (error) {
					if (error.name === "AbortError") {
						// Ignore `AbortError`
						console.log("Aborted");
					} else {
						throw error;
					}
				}
			}
			deleteData();
			window.location.reload();
			return () => abortController.abort();
		}
	};

	return (
		<main>
			<h1>Dashboard</h1>
			<div className="d-md-flex mb-3">
				<h4 className="mb-0">Reservations for {date}</h4>
			</div>
			<div>
				<Link to={`/dashboard?date=${previous(date)}`} className="btn btn-dark">
					Previous
				</Link>{" "}
				&nbsp;
				<Link to={`/dashboard?date=${next(date)}`} className="btn btn-dark">
					Next
				</Link>{" "}
				&nbsp;
				<Link to={`/dashboard?date=${today()}`} className="btn btn-success">
					Today
				</Link>
			</div>
			<br />
			<div>
				<ReservationList reservations={reservations} />
			</div>
			<h4 className="mb-0">Tables:</h4> <br />
			<div>
				<TablesList tables={tables} handleFinal={handleFinal} />
			</div>
			<ErrorAlert error={reservationsError} />
			<ErrorAlert error={tablesError} />
		</main>
	);
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTables, listReservations } from "../utils/api";
import { previous, next, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
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
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [tables, setTables] = useState([]);
	const [tablesError, setTablesError] = useState(null);
	const query = useQuery();
	const dateQuery = query.get("date");

	if (dateQuery) date = dateQuery;

	// loads reservations
	useEffect(() => {
		const abortController = new AbortController();

		async function loadReservations() {
			setReservationsError(null);
			try {
				const data = await listReservations({ date }, abortController.signal);
				setReservations(data);
			} catch (error) {
				setReservationsError(error);
			}
		}
		loadReservations();
		return () => abortController.abort();
	}, [date]);

	// loads all tables
	useEffect(() => {
		const abortController = new AbortController();

		async function loadTables() {
			setReservationsError(null);
			try {
				const data = await listTables(abortController.signal);
				setTables(data);
			} catch (error) {
				setTablesError(error);
			}
		}

		loadTables();

		return () => abortController.abort();
	}, []);

	// Filtering for reservations that are booked/seated.
	const bookedAndSeated = reservations.filter(
		(reservation) => reservation.status !== "finished"
	);

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
				<ReservationList reservations={bookedAndSeated} />
			</div>
			<h4 className="mb-0">Tables:</h4> <br />
			<div>
				<TablesList tables={tables} />
			</div>
			<ErrorAlert error={reservationsError} />
			<ErrorAlert error={tablesError} />
		</main>
	);
}

export default Dashboard;

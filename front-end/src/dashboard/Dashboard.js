import React, { useEffect, useState } from "react";
import { readByDate, listTables, freeTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
// import useQuery from "../utils/useQuery";
import { Link, useParams, useHistory } from "react-router-dom";
import ReservationList from "../reservations/ReservationList";
import TablesList from "../tables/TablesList.js";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
	const params = useParams();
	const history = useHistory();
	// format date YYYY-MM-DD
	if (params.date) {
		date = params.date;
	}
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [tables, setTables] = useState([]);

	// list reservations
	useEffect(loadDashboard, [date]);

	function loadDashboard() {
		// const reservation_date = date;
		const abortController = new AbortController();
		setReservationsError(null);
		readByDate(date, abortController.signal)
			.then(setReservations)
			.catch(setReservationsError);
		listTables(abortController.signal)
			.then(setTables)
			.catch(setReservationsError);
		return () => abortController.abort();
	}

	// final reservation handler - processes clearing table + reserves

	const handleFinal = async ({ target }) => {
		const abortController = new AbortController();
		const value = target.value;
		const result = window.confirm(
			`Is this table prepped for new guests? Cannot be undone.`
		);
		if (result) {
			async function deleteData() {
				try {
					// const activeTable = tables.filter(
					// 	(table) => table.table_id === Number(value)
					// );
					await freeTable(value, abortController.signal);
					// await statusUpdate(
					// 	activeTable[0].reservation_id,
					// 	{ status: "Finished" },
					// 	abortController.signal
					// );
					const output = await listTables(abortController.signal);
					const output2 = await readByDate(date, abortController.signal);
					setTables(output);
					setReservations(output2);
					history.push("/dashboard/");
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
		}
	};

	// const handleFinal = async ({ target }) => {
	// 	const abortController = new AbortController();
	// 	const value = target.value;
	// 	const result = window.confirm(
	// 		`Is this table prepped for new guests? Cannot be undone.`
	// 	);
	// 	if (result) {
	// 		async function deleteData() {
	// 			try {
	// 				const currentTable = tables.filter(
	// 					(table) => table.table_id === Number(value)
	// 				);

	// 				await freeTable(value, abortController.signal);
	// 				await statusUpdate(
	// 					currentTable[0].reservation_id,
	// 					{ status: "Finished" },
	// 					abortController.signal
	// 				);
	// 				const output = await listTables(abortController.signal);
	// 				const output2 = await readByDate(date, abortController.signal);
	// 				setTables(output);
	// 				setReservations(output2);
	// 			} catch (error) {
	// 				if (error.name === "AbortError") {
	// 					console.log("Aborted");
	// 				} else {
	// 					throw error;
	// 				}
	// 			}
	// 		}
	// 		deleteData();
	// 	}
	// };

	return (
		<main>
			<h1>Dashboard</h1>
			<div className="d-md-flex mb-3">
				<h4 className="mb-0">Reservations for {date}</h4>
			</div>
			<div>
				<Link to={`/dashboard/${previous(date)}`} className="btn btn-dark">
					Previous
				</Link>{" "}
				&nbsp;
				<Link to={`/dashboard/${next(date)}`} className="btn btn-dark">
					Next
				</Link>{" "}
				&nbsp;
				<Link to={`/dashboard/${today()}`} className="btn btn-success">
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
		</main>
	);
}

export default Dashboard;

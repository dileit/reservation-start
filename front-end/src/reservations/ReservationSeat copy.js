import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
	readReservation,
	listTables,
	seatTable,
	statusUpdate,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
	const params = useParams();
	const history = useHistory();
	const { reservation_id } = params.reservation_id;

	const [reservation, setReservation] = useState([]);
	const [tables, setTables] = useState([]);
	// no table selected as default
	const [seatError, setSeatError] = useState({ message: "Select a table." });

	// initial state
	const initialState = {
		table_id: "x",
	};

	const [formData, setFormData] = useState({ ...initialState });

	// load api

	useEffect(loadResAndTables, [reservation_id]);
	console.log(reservation);

	function loadResAndTables() {
		const abortController = new AbortController();
		readReservation(reservation_id, abortController.signal).then(
			setReservation
		);
		listTables(abortController.signal).then(setTables);

		return () => abortController.abort();
	}

	// useEffect(() => {
	// 	const abortController = new AbortController();
	// 	async function loadData() {
	// 		try {
	// 			const output = await readReservation(
	// 				reservation_id,
	// 				abortController.signal
	// 			);
	// 			const output2 = await listTables(abortController.signal);
	// 			setReservation(output);
	// 			setTables(output2.filter((table) => table.status === "Free"));
	// 			// we only want to filter tables that are free
	// 		} catch (error) {
	// 			if (error.name === "AbortError") {
	// 				console.log("Aborted");
	// 			} else {
	// 				throw error;
	// 			}
	// 		}
	// 	}
	// 	loadData();
	// });

	// submit handler

	const handleSubmit = (e) => {
		e.preventDefault();
		const abortController = new AbortController();
		if (seatError === null) {
			async function updateData() {
				try {
					await seatTable(
						formData.table_id,
						{ reservation_id },
						abortController.signal
					);
					await statusUpdate(
						reservation_id,
						{ status: "Seated" },
						abortController.signal
					);
					history.push(`/dashboard/`);
				} catch (error) {
					if (error.name === "AbortError") {
						console.log("Aborted");
					} else {
						throw error;
					}
				}
			}
			updateData();
			return () => {
				abortController.abort();
			};
		}
	};

	// handle change

	const handleChange = ({ target }) => {
		let value = target.name;
		let foundTable = tables.filter((table) => table.table_id === Number(value));

		// if title drop or a table w/o room - throw error
		if (value === "x") {
			setSeatError({ message: "Please select a table" });
		} else {
			if (reservation.people > foundTable[0].capacity) {
				setSeatError({ message: "That table does not have enough room." });
			} else {
				setSeatError(null);
			}
		}
		setFormData({ ...formData, [target.name]: value });
	};

	// return JSX

	return (
		<main>
			<h1>Seat Party</h1>
			<ErrorAlert error={seatError} />
			<div className="d-md-flex mb-3">
				<div className="col-sm-6">
					<div className="card text-white bg-dark mb-3">
						<div className="card-header">
							<h4>
								{reservation.first_name} {reservation.last_name}
							</h4>
						</div>
						<div className="card-body">
							<h5 className="card-title">
								Time: {reservation.reservation_time}{" "}
							</h5>
							<p className="card-text">
								Date: {reservation.reservation_date} <br />
								Mobile Number: {reservation.mobile_number} <br />
								Party Size: {reservation.people} <br /> <br />
							</p>
						</div>
					</div>
				</div>
				<div className="col-sm-6">
					<div className="card text-white bg-dark mb-3">
						<div className="card-header">
							<h4>Select a Table</h4>
						</div>
						<div className="card-body">
							<form onSubmit={handleSubmit}>
								<select
									name="table_id"
									onChange={handleChange}
									className="form-control form-control-lg"
									value={formData.table_id}
								>
									<option value="x">Select A Table</option>
									{tables.map((table) => (
										<option value={table.table_id}>
											{table.table_name} - {table.capacity}
										</option>
									))}
								</select>
								<br />
								<br />
								<button
									className="btn btn-secondary"
									type="button"
									onClick={() => history.goBack()}
								>
									Cancel
								</button>{" "}
								&nbsp; &nbsp;
								<button type="submit" className="btn btn-primary">
									Save
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<br />
			<div></div>
		</main>
	);
}

export default ReservationSeat;

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, updateSeat, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

// function ReservationSeat() {
// 	const history = useHistory();
// 	const cancelHandler = () => history.goBack();

// 	const { reservation_id } = useParams();
// 	const [tables, setTables] = useState([]);
// 	const [tableFormData, setTableFormData] = useState({});
// 	const [error, setError] = useState(null);

// 	// fetches table and error data
// 	useEffect(() => {
// 		const abortController = new AbortController();
// 		setError(null);
// 		listTables().then(setTables).catch(setError);

// 		return () => abortController.abort();
// 	}, []);

// 	// submit click handler
// 	const submitHandler = (event) => {
// 		event.preventDefault();
// 		const tableObj = JSON.parse(tableFormData);
// 		updateSeat(tableObj.table_id, reservation_id)
// 			.then((response) => {
// 				console.log("RES", response);
// 				const newTables = tables.map((table) => {
// 					return table.table_id === response.table_id ? response : table;
// 				});
// 				setTables(newTables);
// 				history.push("/dashboard");
// 			})

// 			.catch(setError);
// 	};

// 	// change handlers
// 	const tableFormChangeHandler = (event) =>
// 		setTableFormData(event.target.value);

// 	// if 'tables' is true, then display the following:
// 	if (tables) {
// 		return (
// 			<>
// 				<div className="headingBar d-md-flex my-3 p-2">
// 					<h1> Seat The Current Reservation </h1>
// 				</div>

// 				<ErrorAlert error={error} />
// 				<div className="mb-3">
// 					<h3> Current Reservation: {reservation_id} </h3>
// 				</div>

// 				<form className="form-group" onSubmit={submitHandler}>
// 					<div className="col mb-3">
// 						<label className="form-label" htmlFor="table_id">
// 							{" "}
// 							Select Table{" "}
// 						</label>
// 						<select
// 							className="form-control"
// 							name="table_id"
// 							id="table_id"
// 							onChange={tableFormChangeHandler}
// 						>
// 							<option value=""> Table Name - Capacity </option>
// 							{tables.map((table) => (
// 								<option
// 									key={table.table_id}
// 									value={JSON.stringify(table)}
// 									required={true}
// 								>
// 									{table.table_name} - {table.capacity}
// 								</option>
// 							))}
// 						</select>
// 					</div>
// 					<button className="btn btn-dark mx-3" type="submit">
// 						{" "}
// 						Submit{" "}
// 					</button>
// 					<button
// 						type="button"
// 						onClick={cancelHandler}
// 						className="btn btn-dark"
// 					>
// 						{" "}
// 						Cancel{" "}
// 					</button>
// 				</form>
// 			</>
// 		);
// 	} else {
// 		return (
// 			<div className="headingBar d-md-flex my-3 p-2">
// 				<h1> No open tables to seat </h1>
// 			</div>
// 		);
// 	}
// }

function ReservationSeat() {
	const { reservation_id } = useParams();
	const history = useHistory();

	const [reservation, setReservation] = useState([]);

	const [tables, setTables] = useState([]);

	const [seatError, setSeatError] = useState({ message: "Select a table." });

	// initial state
	const initialState = {
		table_id: "x",
	};

	const [formData, setFormData] = useState({ ...initialState });

	// load api

	useEffect(loadResAndTables, [reservation_id]);

	function loadResAndTables() {
		const abortController = new AbortController();
		readReservation(reservation_id, abortController.signal).then(
			setReservation
		);
		listTables(abortController.signal).then(setTables);

		return () => abortController.abort();
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const abortController = new AbortController();
		if (seatError === null) {
			async function updateData() {
				try {
					await updateSeat(
						formData.table_id,
						reservation_id,
						abortController.signal
					);
					history.push(`/dashboard`);
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
		let value = target.value;
		let foundTable = tables.filter((table) => table.table_id === Number(value));

		// If starting non-select option OR table w/o room - throw error
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
							<h5 className="card-title">Party Size: {reservation.people} </h5>
						</div>
					</div>
				</div>
				<div className="col-sm-6">
					<div className="card text-white bg-dark mb-3">
						<div className="card-header">
							<h4>Select a Table</h4>
						</div>
						<div className="card-body">
							<form onSubmit={(e) => handleSubmit(e)}>
								<select
									name="table_id"
									onChange={handleChange}
									className="form-control form-control-lg"
									value={formData.table_id}
								>
									<option value="x">Select A Table</option>
									{tables.map((table) => (
										<option key={table.table_id} value={table.table_id}>
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
									Submit
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

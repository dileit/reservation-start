import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, updateSeat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
	const history = useHistory();
	const cancelHandler = () => history.goBack();

	const { reservation_id } = useParams();
	const [tables, setTables] = useState([]);
	const [tableFormData, setTableFormData] = useState({});
	const [error, setError] = useState(null);

	// fetches table and error data
	useEffect(() => {
		const abortController = new AbortController();
		setError(null);
		listTables().then(setTables).catch(setError);

		return () => abortController.abort();
	}, []);

	// submit click handler
	const submitHandler = (event) => {
		event.preventDefault();
		const tableObj = JSON.parse(tableFormData);
		updateSeat(tableObj.table_id, reservation_id)
			.then((response) => {
				console.log("RES", response);
				const newTables = tables.map((table) => {
					return table.table_id === response.table_id ? response : table;
				});
				setTables(newTables);
				history.push("/dashboard");
			})

			.catch(setError);
	};

	// change handlers
	const tableFormChangeHandler = (event) =>
		setTableFormData(event.target.value);

	// if 'tables' is true, then display the following:
	if (tables) {
		return (
			<>
				<div className="headingBar d-md-flex my-3 p-2">
					<h1> Seat The Current Reservation </h1>
				</div>

				<ErrorAlert error={error} />
				<div className="mb-3">
					<h3> Current Reservation: {reservation_id} </h3>
				</div>

				<form className="form-group" onSubmit={submitHandler}>
					<div className="col mb-3">
						<label className="form-label" htmlFor="table_id">
							{" "}
							Select Table{" "}
						</label>
						<select
							className="form-control"
							name="table_id"
							id="table_id"
							onChange={tableFormChangeHandler}
						>
							<option value=""> Table Name - Capacity </option>
							{tables.map((table) => (
								<option
									key={table.table_id}
									value={JSON.stringify(table)}
									required={true}
								>
									{table.table_name} - {table.capacity}
								</option>
							))}
						</select>
					</div>
					<button className="btn btn-dark mx-3" type="submit">
						{" "}
						Submit{" "}
					</button>
					<button
						type="button"
						onClick={cancelHandler}
						className="btn btn-dark"
					>
						{" "}
						Cancel{" "}
					</button>
				</form>
			</>
		);
	} else {
		return (
			<div className="headingBar d-md-flex my-3 p-2">
				<h1> No open tables to seat </h1>
			</div>
		);
	}
}

export default ReservationSeat;

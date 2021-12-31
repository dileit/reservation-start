import React, { useState } from "react";
import { searchByPhoneNumber } from "../utils/api";
import ReservationList from "../reservations/ReservationList";

function Search() {
	const [reservations, setReservations] = useState([]);
	const initialState = {
		mobile_number: "",
	};
	const [formData, setFormData] = useState({ ...initialState });
	const abortController = new AbortController();

	// submit handler
	const handleSubmit = (e) => {
		e.preventDefault();

		async function updateData() {
			try {
				const output = await searchByPhoneNumber(
					formData.mobile_number,
					abortController.signal
				);
				setReservations(output);
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
	};

	// change handler
	const handleChange = ({ target }) => {
		let value = target.value;
		setFormData({
			...formData,
			[target.name]: value,
		});
	};

	// JSX

	return (
		<main>
			<h1>Search</h1>
			<div className="d-md-flex mb-3">
				<h4 className="mb-0">Search for a reservation by phone number:</h4>
			</div>
			<div>
				<form onSubmit={handleSubmit}>
					<input
						id="mobile_number"
						type="text"
						name="mobile_number"
						onChange={handleChange}
						value={formData.mobile_number}
						style={{ width: "150px" }}
						placeholder="Enter a customer's phone number"
						required
					/>{" "}
					&nbsp; &nbsp;
					<button type="submit" className="btn btn-dark">
						Find
					</button>
				</form>
			</div>
			<br />
			{reservations.length < 1 ? (
				<div className="d-md-flex mb-3">
					<h4 className="my-3">No reservations found</h4>
				</div>
			) : (
				<div>
					<ReservationList reservations={reservations} />
				</div>
			)}
		</main>
	);
}

export default Search;

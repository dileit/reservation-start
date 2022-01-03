import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

// Defines the 'New Reservation' page

function ReservationNew() {
	const history = useHistory();
	const [error, setError] = useState("");

	const initialState = {
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
	};
	const [formData, setFormData] = useState({ ...initialState });
	// Submit click handler
	// upon submitting, create new reservation
	async function submitHandler(event) {
		event.preventDefault();
		const abortController = new AbortController();
		const formattedTime = formatTime();

		try {
			formData.reservation_time = formattedTime;
			formData.people = Number(formData.people);
			await createReservation(formData, abortController.signal);
		} catch (error) {
			setError(error);
			return;
		}

		history.push(`/dashboard?date=${formData.reservation_date}`);
		return () => abortController.abort();
	}

	// reformat possible date input that includes `pm`
	function formatTime() {
		let cleanTime = formData.reservation_time
			.replace(/[\s:]/g, "")
			.toLowerCase();
		if (cleanTime.includes("pm")) {
			cleanTime = Number(cleanTime.slice(0, 4)) + 1200;
			cleanTime = String(cleanTime);
		}
		return `${cleanTime.slice(0, 2)}:${cleanTime.slice(2, 4)}`;
	}

	return (
		<div>
			<div className="headingBar d-md-flex my-3 p-2">
				<h1>New Reservation</h1>
			</div>
			<h4>Complete all fields to create a new reservation</h4>
			<hr></hr>
			<ReservationForm
				formData={formData}
				setFormData={setFormData}
				submitHandler={submitHandler}
				error={error}
			/>
		</div>
	);
}

export default ReservationNew;

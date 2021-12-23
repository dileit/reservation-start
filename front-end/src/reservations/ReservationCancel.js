import React from "react";
import { useHistory } from "react-router-dom";
import { updateResStatus } from "../utils/api";

// updates status of a reservation - "Cancelled"

const ReservationCancel = ({ reservation }) => {
	const history = useHistory();
	const { reservation_id } = reservation;

	const handleCancel = async () => {
		const abortController = new AbortController();
		const result = window.confirm(
			`Do you want to cancel this reservation? This cannot be undone.`
		);

		// if they do want to cancel - confirm
		if (result) {
			const updatedReservation = {
				reservation_id,
				status: "Cancelled",
			};

			try {
				await updateResStatus(updatedReservation, abortController.signal);
				history.go(0);
			} catch (error) {
				if (error.name === "AbortError") {
					console.log("Aborted");
				} else {
					throw error;
				}
			}
		}
		return () => {
			// console.log("cleanup post");
			abortController.abort();
		};
	};
	return (
		<button
			type="button"
			data-reservation-id-cancel={reservation_id}
			onClick={() => handleCancel()}
			value={reservation_id}
			className="btn btn-danger"
		>
			Cancel
		</button>
	);
};

export default ReservationCancel;

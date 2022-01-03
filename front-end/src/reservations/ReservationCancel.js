import { useHistory } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

// Updates the `status` of a reservation to "cancelled"

function ReservationCancel({ reservation }) {
	const history = useHistory();
	const { reservation_id, reservation_date } = reservation;

	async function handleCancel() {
		const abortController = new AbortController();
		const cancelReservation = window.confirm(
			"Do you want to cancel this reservation? This cannot be undone."
		);

		if (!cancelReservation)
			return history.push(`/dashboard?date=${reservation_date}`);

		const updatedReservation = {
			reservation_id,
			status: "cancelled",
		};
		try {
			await updateReservationStatus(updatedReservation, abortController.signal);
		} catch (error) {
			if (error.name === "AbortError") {
				console.log("Aborted");
			} else {
				throw error;
			}
		}

		window.location.reload();

		return () => abortController.abort();
	}

	return (
		<button
			type="button"
			className="btn btn-danger"
			data-reservation-id-cancel={reservation_id}
			onClick={() => handleCancel()}
		>
			Cancel
		</button>
	);
}

export default ReservationCancel;

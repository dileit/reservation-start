import React from "react";
import { Link, useHistory } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";
import { formatAsTime } from "../utils/date-time";

const ReservationList = ({ reservations }) => {
	const history = useHistory();
	// const [currentReservation, setCurrentReservation] = useState({});
	// const output1 = await readReservation(value);
	// setCurrentReservation(output1);

	// const updatedReservation = output1;

	// target from button / cancel reservation /refresh page
	const handleCancel = async ({ target }) => {
		const abortController = new AbortController();
		const value = target.value;

		const result = window.confirm(
			`Do you want to cancel this reservation? This cannot be undone.`
		);

		if (result) {
			async function deleteData() {
				try {
					const updatedReservation = {
						reservation_id: value,
					};

					await updateReservationStatus(
						updatedReservation,
						abortController.signal
					);

					// await cancelReservation(value, abortController.signal);
					// await statusUpdate(
					// 	value,
					// 	{ status: "Cancelled" },
					// 	abortController.signal
					// );
					history.go(0);
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
			return () => {
				abortController.abort();
			};
		}
	};

	const list = reservations.map((reservation) => (
		<div className="col-sm-6" key={reservation.reservation_id}>
			<div className="card text-white bg-dark mb-3">
				<div className="card-header">
					<h4>
						{reservation.first_name} {reservation.last_name}
					</h4>
				</div>
				<div className="card-body">
					<h5 className="card-title">
						Time: {formatAsTime(reservation.reservation_time)}
					</h5>
					<p className="card-text">
						Date: {reservation.reservation_date} <br />
						Phone Number: {reservation.mobile_number}
						<br />
						Party Size: {reservation.people} <br />
					</p>
					<div data-reservation-id-status={reservation.reservation_id}>
						Status: {reservation.status}
					</div>{" "}
					<br /> <br />
					{reservation.status === "Booked" ? (
						<div>
							<Link
								to={`/reservations/${reservation.reservation_id}/seat`}
								className="btn btn-success"
							>
								Seat
							</Link>{" "}
							&nbsp;
							<Link
								to={`/reservations/${reservation.reservation_id}/edit`}
								className="btn btn-warning"
							>
								Edit
							</Link>{" "}
							&nbsp;
							<button
								data-reservation-id-cancel={reservation.reservation_id}
								onClick={handleCancel}
								value={reservation.reservation_id}
								className="btn btn-danger"
							>
								Cancel
							</button>
						</div>
					) : (
						<button
							data-reservation-id-cancel={reservation.reservation_id}
							onClick={handleCancel}
							value={reservation.reservation_id}
							className="btn btn-danger"
						>
							Cancel
						</button>
					)}
				</div>
			</div>
		</div>
	));

	// display the actual Reservation List content if it has content
	if (reservations.length > 0) {
		return <div className="row">{list}</div>;
	} else {
		//if there are no reservations display the no matching reservations message.
		return (
			<div className="alert alert-success" role="alert">
				No matching reservations found.
			</div>
		);
	}
};

export default ReservationList;
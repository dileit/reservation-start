import React from "react";
import { Link, useHistory } from "react-router-dom";
import { statusUpdate } from "../utils/api";
import { formatAsTime } from "../utils/date-time";

const ListReservations = ({ reservation }) => {
	const history = useHistory();

	// target from button / cancel reservation /refresh page
	const handleCancel = async (e) => {
		e.preventDefault();
		const abortController = new AbortController();
		// const value = target.value;
		const result = window.confirm(
			`Do you want to cancel this reservation? This cannot be undone.`
		);

		if (result) {
			async function deleteData() {
				try {
					const data = { status: "Cancelled" };
					await statusUpdate(
						data,
						reservation.reservation_id,
						abortController.signal
					);
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
		}
	};

	// display the actual Reservation List content if it has content
	return (
		<div className="row">
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
		</div>
	);

	//if there are no reservations display the no matching reservations message.
};

function ReservationList({ reservations }) {
	if (reservations.length < 1) return <h4>No Reservations Found.</h4>;
	const list = reservations.map(ListReservations);

	return (
		<div>
			<div className="row">{list}</div>
		</div>
	);
}

export default ReservationList;
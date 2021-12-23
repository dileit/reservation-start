import React from "react";
import { Link } from "react-router-dom";
// import { cancelReservation } from "../utils/api";
import { formatAsTime } from "../utils/date-time";
import ReservationCancel from "./ReservationCancel";

const ReservationList = ({ reservations }) => {
	// const history = useHistory();

	// target from button / cancel reservation /refresh page

	// display the actual Reservation List content if it has content
	if (reservations.length > 0) {
		return (
			<div className="row">
				{reservations.map((reservation) => (
					<div className="col-sm-6" key={reservation.reservation_id}>
						<div className="card text-white bg-dark mb-3">
							<div className="card-header">
								<h4>
									{reservation.first_name} {reservation.last_name}
								</h4>
							</div>
							<div className="card-body">
								<h5 className="card-title">
									{" "}
									Time: {formatAsTime(reservation.reservation_time)}
								</h5>
								<p className="card-text">
									Date: {reservation.reservation_date}
									<br />
									Phone Number: {reservation.mobile_number} <br />
									Party Size: {reservation.people} <br />
								</p>
								<div data-reservation-id-status={reservation.reservation_id}>
									Status: {reservation.status}
								</div>{" "}
								<br />
								<br />
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
										<ReservationCancel reservation={reservation} />
									</div>
								) : (
									<>
										<ReservationCancel reservation={reservation} />
									</>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		);
	} else {
		// if none to display
		return (
			<div className="alert alert-success" role="alert">
				No matching reservations found.
			</div>
		);
	}
};

export default ReservationList;

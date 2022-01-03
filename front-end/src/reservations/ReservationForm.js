import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

// Defines the reservation form

function ReservationForm({ formData, setFormData, submitHandler, error }) {
	const history = useHistory();
	const cancelClickHandler = () => history.goBack();
	// change handlers
	const handleChange = ({ target }) => {
		let value = target.value;
		setFormData({ ...formData, [target.name]: value });
	};

	return (
		<>
			<ErrorAlert error={error} />
			<form onSubmit={submitHandler}>
				<div className="row mb-3">
					<div className="col-4 form-group">
						<label className="form-label" htmlFor="first_name">
							First Name
						</label>
						<input
							className="form-control"
							id="first_name"
							name="first_name"
							type="text"
							onChange={handleChange}
							required={true}
							value={formData.first_name}
						/>
						<small className="form-text text-muted"> Enter First Name </small>
					</div>
					<div className="col-4">
						<label className="form-label" htmlFor="last_name">
							Last Name
						</label>
						<input
							className="form-control"
							id="last_name"
							name="last_name"
							type="text"
							onChange={handleChange}
							required={true}
							value={formData.last_name}
						/>
						<small className="form-text text-muted"> Enter Last Name </small>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-4 form-group">
						<label className="form-label" htmlFor="mobile_number">
							Mobile Number
						</label>
						<input
							className="form-control"
							id="mobile_number"
							name="mobile_number"
							type="text"
							onChange={handleChange}
							required={true}
							placeholder="0000000000"
							value={formData.mobile_number}
						/>
						<small className="form-text text-muted">
							{" "}
							Enter Mobile Number (ex: 0000000000){" "}
						</small>
					</div>
					<div className="col-4 form-group">
						<label className="form-label" htmlFor="mobile_number">
							Party Size
						</label>
						<input
							className="form-control"
							id="people"
							name="people"
							type="number"
							onChange={handleChange}
							required={true}
							value={formData.people}
						/>
						<small className="form-text text-muted"> Enter Party Size </small>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-4 form-group">
						<label>Reservation Date</label>
						<input
							className="form-control"
							id="reservation_date"
							name="reservation_date"
							type="date"
							onChange={handleChange}
							required={true}
							value={formData.reservation_date}
							placeholder="DDMMYYY"
						/>
						<small className="form-text text-muted">
							{" "}
							Enter Reservation Date (ex: MM/DD/YYYY){" "}
						</small>
						<small className="form-text text-muted">
							(Closed on Tuesdays){" "}
						</small>
					</div>
					<div className="col-4 form-group">
						<label>Reservation Time</label>
						<input
							className="form-control"
							id="reservation_time"
							name="reservation_time"
							type="time"
							onChange={handleChange}
							required={true}
							placeholder="reservation time"
							value={formData.reservation_time}
						/>
						<small className="form-text text-muted">
							{" "}
							Enter Reservation Time{" "}
						</small>
					</div>
				</div>
				<button type="submit" className="btn btn-success mx-3">
					{" "}
					Submit
				</button>
				<button
					type="button"
					className="btn btn-dark"
					onClick={cancelClickHandler}
				>
					{" "}
					Cancel{" "}
				</button>
			</form>
		</>
	);
}

export default ReservationForm;

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
	createReservation,
	readReservation,
	updateReservation,
} from "../utils/api";

import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 * The reservations form can be used for making new reservations
 * or updating existing ones..
 */

function Reservations({ date }) {
	const params = useParams();

	const reservation_id = params.reservation_id;
	// if this from route /reservations/:reservation_id/edit
	// reservation_id will have a value - else undefined
	// set initial state
	const initialState = {
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
	};

	const [formData, setFormData] = useState({ ...initialState });
	const [errorState, setErrorState] = useState(null);

	// useEffect hook to pull reservation_id data from API
	// if not undefined

	useEffect(() => {
		if (reservation_id) {
			const abortController = new AbortController();
			async function loadData() {
				try {
					const output1 = await readReservation(
						reservation_id,
						abortController.signal
					);
					setFormData(output1);
				} catch (error) {
					// filter out tables that arent free
					if (error.name === "AbortError") {
						console.log("Aborted");
					} else {
						throw error;
					}
				}
			}
			loadData();
		}
	}, [reservation_id]);

	const history = useHistory();

	// submit handler to update
	const handleSubmit = (formData, e) => {
		e.preventDefault();
		setErrorState(null);

		let isDate = new Date(formData.reservation_date);
		let compareDate = new Date(date);

		let today = new Date();
		const currentTime = today.getHours() + ":" + today.getMinutes();
		let enteredTime = formData.reservation_time;

		if (isDate < compareDate) {
			const error = { status: 400, message: "Must select a future date." };
			setErrorState(error);
			return;
		}
		//reservation must not be on a tuesday

		if (isDate.getUTCDay() === 2) {
			const error = {
				status: 400,
				message: "Restaraunt is closed on Tuesdays",
			};
			setErrorState(error);
			return;
		}

		if (isDate < compareDate && isDate.getUTCDay() === 2) {
			const error = {
				status: 400,
				message: "Cannot be in the past or on Tuesdays.",
			};
			setErrorState(error);
			return;
		}

		// time in past

		if (enteredTime < currentTime && isDate === today) {
			const error = { status: 400, message: "Time cannot be in the past." };
			setErrorState(error);
			return;
		}

		// before closing
		// if (enteredTime >= "21:30" && enteredTime <= "22:30") {
		// 	const error = {
		// 		status: 400,
		// 		message: "No Reservations allowed an hour before closing.",
		// 	};
		// 	setErrorState(error);
		// 	return;
		// }

		// must have 1 or more people

		if (formData.people <= 0) {
			const error = { status: 400, message: "Must have 1 or more people." };
			setErrorState(error);
			return;
		}

		const abortController = new AbortController();
		// check errors
		async function updateData() {
			try {
				// if not undefined - updating. otherwise create new
				if (reservation_id) {
					await updateReservation(formData, abortController.signal);
				} else {
					await createReservation(formData, abortController.signal);
				}
				history.push(`/dashboard/${formData.reservation_date}`);
			} catch (error) {
				setErrorState(error);
			}
		}
		updateData();

		return () => {
			abortController.abort();
		};
	};

	const handleChange = ({ target }) => {
		let value = target.value;

		setFormData({
			...formData,
			[target.name]: value,
		});
	};

	return (
		<main>
			<h1>Reservations</h1>
			<div className="d-md-flex mb-3">
				<ErrorAlert error={errorState} />
			</div>

			<form onSubmit={(e) => handleSubmit(formData, e)}>
				<ReservationForm formData={formData} handleChange={handleChange} />
				<button
					type="button"
					onClick={() => history.goBack()}
					className="btn btn-secondary"
				>
					Cancel
				</button>{" "}
				&nbsp;
				<button type="submit" className="btn btn-primary">
					Save
				</button>
			</form>
		</main>
	);
}

export default Reservations;

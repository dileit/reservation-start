import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
	createReservation,
	readReservation,
	updateReservation,
} from "../utils/api";
// import { formatAsTime } from "../utils/date-time";
import ReservationForm from "./ReservationForm";
import ReservationError from "./ReservationError";

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
		reservation_date: date,
		reservation_time: "10:30:00",
		people: 1,
	};

	// let errorArray = [0, 0, 0];
	// let errorMsg = [
	// 	`Must select a future date`,
	// 	`Restaurant is closed on Tuesdays`,
	// 	`Must select a time between 10:30AM - 9:30PM`,
	// 	`Time cannot be in the past.`,
	// ];

	let errorOptions = [0, 0, 0, 0];
	let errorMessages = [
		"Must select a future date",
		"Restaraunt is closed on Tuesdays",
		"Must select a time between 10:30AM - 9:30PM",
		"Time cannot be in the past.",
	];

	const [formData, setFormData] = useState({ ...initialState });
	const [errorList, setErrorList] = useState([]);

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
	const handleSubmit = (e) => {
		e.preventDefault();

		const abortController = new AbortController();
		// check errors
		if (errorList.length === 0) {
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
					if (error.name === "AbortError") {
						console.log("Aborted");
					} else {
						throw error;
					}
				}
			}
			updateData();

			return () => {
				// console.log("cleanup post");
				abortController.abort();
			};
		}
	};

	// change handler
	// const handleChange = ({ target }) => {
	// 	let value = target.value;
	// 	// each time field value is changed - check if valid
	// 	// aka people must be positive integer not 0 or less
	// 	if (target.name === "people" && target.value <= 0) {
	// 		value = 1;
	// 	}
	// 	// date must not be in the past
	// 	if (target.name === "reservation_date") {
	// 		let dateInput = new Date(value);
	// 		let dateCompare = new Date(date);
	// 		if (dateInput < dateCompare) {
	// 			errorArray[0] = 1;
	// 		} else {
	// 			errorArray[0] = 0;
	// 		}

	// 		//reservation must not be on a tuesday
	// 		if (dateInput.getUTCDay() === 2) {
	// 			errorArray[1] = 1;
	// 		} else {
	// 			errorArray[1] = 0;
	// 		}

	// 		//reservation must be between 10:30am and 9:30pm

	// 		if (target.name === "reservation_time") {
	// 			let today = new Date();
	// 			const currentTime = today.getHours() + ":" + today.getMinutes();
	// 			let enteredTime = value;

	// 			if (enteredTime < currentTime) {
	// 				errorArray[3] = 1;
	// 			} else {
	// 				errorArray[3] = 0;
	// 			}

	// 			if (value >= "10:30" && value <= "21:30") {
	// 				errorArray[2] = 0;
	// 			} else {
	// 				errorArray[2] = 1;
	// 			}
	// 		}
	// 	}

	// 	// if any errors combine to our error list
	// 	let errList = [];
	// 	errorArray.forEach((code, index) => {
	// 		if (code === 1) {
	// 			errList.push(errorMsg[index]);
	// 		}
	// 	});
	// 	setErrorList(errList);
	// 	setFormData({ ...formData, [target.name]: value });
	// };

	const handleChange = ({ target }) => {
		let value = target.value;
		//each time a value is change check to see if it is valid or not.
		//people must be a positive integer, if it is at 0 or below set it to 1
		if (target.name === "people" && target.value <= 0) {
			value = 1;
		}
		//reservation date must not be a date in the past
		if (target.name === "reservation_date") {
			let isDate = new Date(value);
			let compareDate = new Date(date);
			if (isDate < compareDate) {
				errorOptions[0] = 1;
			} else {
				errorOptions[0] = 0;
			}
			//reservation must not be on a tuesday
			if (isDate.getUTCDay() === 2) {
				errorOptions[1] = 1;
			} else {
				errorOptions[1] = 0;
			}
		}
		//reservation must be between 10:30am and 9:30pm
		if (target.name === "reservation_time") {
			let today = new Date();
			const currentTime = today.getHours() + ":" + today.getMinutes();
			let enteredTime = value;

			if (enteredTime < currentTime) {
				errorOptions[3] = 1;
			} else {
				errorOptions[3] = 0;
			}

			if (value >= "10:30" && value <= "21:30") {
				errorOptions[2] = 0;
			} else {
				errorOptions[2] = 1;
			}
		}
		//if any of these errors are triggered, combine them into the error list and then push it to the errorList
		let errList = [];
		errorOptions.forEach((code, index) => {
			if (code === 1) {
				errList.push(errorMessages[index]);
			}
		});
		setErrorList(errList);
		setFormData({
			...formData,
			[target.name]: value,
		});
	};

	// now return the jsx

	return (
		<main>
			<h1>Reservations</h1>
			<div className="d-md-flex mb-3">
				<ReservationError errorList={errorList} />
			</div>

			<form onSubmit={handleSubmit}>
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

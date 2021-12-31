/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL = "http://localhost:5000";

// const API_BASE_URL =
// process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// update with deployed back end when done

/**
 * Defines the default headers for these functions to work with `json-server`
 */

const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
	try {
		const response = await fetch(url, options);

		if (response.status === 204) {
			return null;
		}

		const payload = await response.json();

		if (payload.error) {
			return Promise.reject({ message: payload.error });
		}
		return payload.data;
	} catch (error) {
		if (error.name !== "AbortError") {
			console.error(error.stack);
			throw error;
		}
		return Promise.resolve(onCancel);
	}
}

// lists Reservations

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
	const url = new URL(`${API_BASE_URL}/reservations/`);
	Object.entries(params).forEach(([key, value]) =>
		url.searchParams.append(key, value.toString())
	);
	return await fetchJson(url, { headers, signal }, [])
		.then(formatReservationDate)
		.then(formatReservationTime);
}

/**
 * Creates a new reservation
 * @param signal
 * optional abort signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of new reservation saved in the database.
 */

// retrieve specified reservation_id

export async function createReservation(reservation, signal) {
	const url = `${API_BASE_URL}/reservations`;
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify({ data: reservation }),
		signal,
	};
	return await fetchJson(url, options, {});
}

// read reservation by date

/**
 * Retrieves all existing reservations on a certain date.
 * @param reservation_date
 * A date in YYYY-MM-DD format
 * @param signal
 * optional abort signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function readByDate(reservation_date, signal) {
	const url = `${API_BASE_URL}/reservations/ByDate?reservation_date=${reservation_date}`;
	return await fetchJson(url, { signal })
		.then(formatReservationDate)
		.then(formatReservationTime);
}

/**
 * Retrieves a single reservation with a reservationId
 * @param reservation_id
 * The reservation Id for the reservation
 * @param signal
 * optional abort signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function readReservation(reservation_id, signal) {
	const url = `${API_BASE_URL}/reservations/${reservation_id}`;
	return await fetchJson(url, { signal }, {})
		.then(formatReservationDate)
		.then(formatReservationTime);
}

// update existing reservation

/**
 * Update a single reservation with a reservationId provided
 * @param updatedReservation
 * object of the updatedReservation - with reservation_id
 * @param signal
 * optional abort signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function updateReservation(updatedReservation, signal) {
	const url = `${API_BASE_URL}/reservations/${updatedReservation.reservation_id}`;
	const options = {
		method: "PUT",
		headers,
		body: JSON.stringify({ data: updatedReservation }),
		signal,
	};
	return await fetchJson(url, options, updatedReservation)
		.then(formatReservationDate)
		.then(formatReservationTime);
}

// update reservation status - Booked to Cancelled

/**
 * Update a single reservation's status with a reservationId provided
 * @param updatedReservation
 * object of the updatedReservation - with reservation_id
 * @param signal
 * optional abort signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function updateReservationStatus(updatedReservation, signal) {
	console.log(updatedReservation);
	const url = `${API_BASE_URL}/reservations/${updatedReservation.reservation_id}/status`;
	const options = {
		method: "PUT",
		headers,
		body: JSON.stringify({ data: updatedReservation }),
		signal,
	};

	return await fetchJson(url, options, updatedReservation);
}

// delete reservation

/**
 * Deletes a single reservation with a reservationId provided
 * @param reservationId
 * The reservation_id for selected reservation
 * @param signal
 * optional abort signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function deleteReservation(reservationId, signal) {
	const url = `${API_BASE_URL}/reservations/${reservationId}`;
	const options = { method: "DELETE", signal };
	return await fetchJson(url, options);
}

// creates a table

/**
 * Add new table to the database
 * @param newTable
 * object containing data for the new table
 * @param signal
 * optional abort signal
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of all tables saved in the database.
 */

export async function createTable(newTable, signal) {
	const url = `${API_BASE_URL}/tables`;
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify({ data: newTable }),
		signal,
	};
	// console.log("post attempt:", url, options);
	return await fetchJson(url, options, {});
}

// update Table

/**
 * Add new table to the database
 * @param updatedTable
 * object containing data for the table to be updated
 * @param signal
 * optional abort signal
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of all tables saved in the database.
 */

export async function updateTable(updatedTable, signal) {
	const url = `${API_BASE_URL}/tables/${updatedTable.table_id}`;
	const options = {
		method: "PUT",
		headers,
		body: JSON.stringify(updatedTable),
		signal,
	};
	return await fetchJson(url, options);
}

// delete table

/**
 * Add new table to the database
 * @param tableId
 * object containing data for the new table
 * @param signal
 * optional abort signal
 */

export async function deleteTable(tableId, signal) {
	const url = `${API_BASE_URL}/tables/${tableId}`;
	const options = { method: "DELETE", signal };
	return await fetchJson(url, options);
}

// seat a table

/**
 * Seat a table = "Occupied"
 * @param tableId
 * table_id for the table to be seated - "Occupied"
 * @param reservation_id
 * provided from params
 * @param signal
 * optional abort signal
 */

export async function seatTable(tableId, reservation_id, signal) {
	const url = `${API_BASE_URL}/tables/${tableId}/seat`;
	const options = {
		method: "PUT",
		headers,
		body: JSON.stringify({ data: { reservation_id } }),
		signal,
	};
	return await fetchJson(url, options);
}

// export async function updateSeating(updatedTable, signal) {
// 	const url = `${API_BASE_URL}/tables/${updatedTable.table_id}/seat`;
// 	const options = {
// 		method: "PUT",
// 		headers,
// 		body: JSON.stringify({ data: updatedTable }),
// 		signal,
// 	};
// 	return await fetchJson(url, options, updatedTable);
// }

// list Tables

/**
 * Lists all tables
 * @param signal
 * optional abort signal
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of all tables saved in the database.
 */

export async function listTables(signal) {
	const url = new URL(`${API_BASE_URL}/tables/`);
	return await fetchJson(url, { headers, signal }, []);
}
/**
 * Clear a table in the database
 * @param tableId
 * the table_id for the table to be cleared/unseated. Status changed to "Free"
 * @param signal
 * optional abort signal
 */

export async function freeTable(tableId, signal) {
	const url = `${API_BASE_URL}/tables/${tableId}/seat`;
	const options = { method: "DELETE", headers, signal };
	return await fetchJson(url, options);
}

// search for a reservation by phone number

/**
 * Retrieves all reservations of a specific phone number
 * @param mobile_phone
 * A phone number to search with - only numerical digits - partial matches
 * @param signal
 * optional abort signal
 * @returns {Promise<[reservation]>}
 * promise resolves possibly to empty array of reservation
 */

export async function searchByPhoneNumber(mobile_phone, signal) {
	const url = `${API_BASE_URL}/reservations?mobile_number=${mobile_phone}`;
	return await fetchJson(url, { signal })
		.then(formatReservationDate)
		.then(formatReservationTime);
}

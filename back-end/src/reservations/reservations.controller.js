const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties(
	"first_name",
	"last_name",
	"mobile_number",
	"reservation_date",
	"reservation_time",
	"people"
);

const VALID_PROPERTIES = [
	"first_name",
	"last_name",
	"mobile_number",
	"reservation_date",
	"reservation_time",
	"people",
	"status",
	"reservation_id",
	"created_at",
	"updated_at",
];

function hasOnlyValidProperties(req, res, next) {
	const { data = {} } = req.body;

	const invalidFields = Object.keys(data).filter(
		(field) => !VALID_PROPERTIES.includes(field)
	);

	if (invalidFields.length) {
		return next({
			status: 400,
			message: `Invalid field(s): ${invalidFields.join(", ")}`,
		});
	}
	next();
}

/**
 * List handler for reservation resources
 */

async function list(req, res) {
	const { date, mobile_number } = req.query;
	let data = [];

	if (date) {
		data = await service.listByDate(date);
	} else if (mobile_number) {
		data = await service.listByMobileNumber(mobile_number);
	} else {
		data = await service.list();
	}

	res.json({
		data: data,
	});
}

async function listByDate(req, res, next) {
	const { reservation_date } = req.query;
	const error = { status: 400, message: "Reservation date not found." };
	if (!reservation_date) return next(error);

	// const knexIns = req.app.get("db");
	let reservations = await service.listByDate(reservation_date);
	if (reservations instanceof Error)
		return next({ message: reservations.message });
	res.json({
		data: reservations,
	});
}

// validation for reservation inputs

function validReservation(req, res, next) {
	const { people, reservation_date, reservation_time } = req.body.data;
	// add time
	let adjustedTime = reservation_date + " 23:59:59.999Z";
	// to compare if a reservation is a day before current date - thus invalid
	let dateInput = new Date(adjustedTime);
	let dateCompare = new Date();
	dateInput.setHours(0, 0, 0, 0);
	dateCompare.setHours(0, 0, 0, 0);

	// const error = { status: 400, message: "Invalid Reservation Information" };

	// reject if reservation made in past
	if (dateInput < dateCompare)
		return next({
			status: 400,
			message: `Reservations cannot be made for a date in the past.`,
		});

	// reject if 0 or less people in the party
	if (people <= 0)
		return next({
			status: 400,
			message: `Cannot make a reservation for ${data.people} people.`,
		});

	// reject if on a Tuesday - closed
	if (dateInput.getUTCDay() === 2)
		return next({
			status: 400,
			message: "We do not take reservations on Tuesdays.",
		});

	// reject reservations outside of open hours before 10:30am, after 9:30pm
	if (reservation_time < "10:30" || reservation_time >= "21:30")
		return next({
			status: 400,
			message: `Reservations must be during our open hours: 10:30AM & 9:30PM`,
		});

	// if all is well move on to create
	next();
}

// time validation
// function reservationInPast(reservation_date, reservation_time) {
// 	const timestamp = Date.parse(`${reservation_date} ${reservation_time}`);
// 	console.log(timestamp);
// 	return timestamp < Date.now();
// }

// POST - create new reservation
async function create(req, res, next) {
	const { data } = req.body;
	// const newReservation = await service.create(req.body);
	// if (newReservation instanceof Error)
	// 	return next({ message: newReservation.message });
	// res.status(201).json({ data: newReservation });
	const newReservation = { ...data, status: "booked" };
	const newData = await service.create(newReservation);
	res.status(201).json({ data: newData });
}

// reservation exists validation

async function reservationExists(req, res, next) {
	const { reservation_id } = req.params;
	const reservation = await service.read(reservation_id);
	if (reservation) {
		res.locals.reservation = reservation;
		return next();
	}
	next({
		status: 400,
		message: `Reservation ID ${reservation_id} does not exist.`,
	});
}

// read reservation

function read(req, res) {
	const { reservation: data } = res.locals;
	res.json({ data });
}

async function updateReservationToCancelled(req, res, next) {
	const updatedReservation = {
		...res.locals.reservation,
		status: "cancelled",
	};
	const data = await service.updateReservationStatus(updatedReservation);
	next();
}

// update reservation
async function update(req, res) {
	const updatedRes = { ...res.locals.reservation, ...res.body.data };
	const data = await service.update(updatedRes);
	res.json({ data });
}

// delete reservation

async function destroy(req, res) {
	const { reservation } = res.locals;
	await service.delete(reservation.reservation_id);
	res.sendStatus(204);
}

// validate that it's not finished
function statusNotFinished(req, res, next) {
	const { status } = res.locals.reservation;
	if (status !== "finished") return next();
	next({ status: 400, message: `A ${status} reservation cannot be changed!` });
}

// is a valid status request
function validStatusRequest(req, res, next) {
	const { status } = req.body.data;

	if (
		status === "booked" ||
		status === "seated" ||
		status === "finished" ||
		status === "cancelled"
	) {
		return next();
	}

	next({ status: 400, message: `The reservation ${status} is invalid.` });
}

module.exports = {
	list: [asyncErrorBoundary(list)],
	listByDate: [asyncErrorBoundary(listByDate)],
	create: [
		hasOnlyValidProperties,
		hasRequiredProperties,
		validReservation,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExists), read],
	update: [
		asyncErrorBoundary(reservationExists),
		hasOnlyValidProperties,
		hasRequiredProperties,
		validReservation,
		asyncErrorBoundary(update),
	],
	updateStatus: [
		asyncErrorBoundary(reservationExists),
		statusNotFinished,
		// validStatusRequest,
		asyncErrorBoundary(updateReservationToCancelled),
		asyncErrorBoundary(update),
	],
	delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};

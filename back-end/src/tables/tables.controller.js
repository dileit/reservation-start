const tablesService = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
	"table_id",
	"table_name",
	"capacity",
	"reservation_id",
];

/////////////////////
// Validation
/////////////////////

//Validation for the request properties
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

function hasValidInputs(req, res, next) {
	const { table_name, capacity } = req.body.data;
	let invalidInputs = "Invalid input(s):";

	if (table_name.length < 2) {
		invalidInputs = invalidInputs.concat(" table_name");
	}

	if (typeof capacity !== "number") {
		invalidInputs = invalidInputs.concat(" capacity");
	}

	if (invalidInputs !== "Invalid input(s):") {
		return next({
			status: 400,
			message: invalidInputs,
		});
	}

	next();
}

// Table Exists
async function tableExists(req, res, next) {
	const { table_id } = req.params;
	const table = await tablesService.read(table_id);
	if (table) {
		res.locals.table = table;
		return next();
	}
	next({
		status: 404,
		message: `Table ID ${table_id} does not exist.`,
	});
}

// Reservation Exists
async function reservationIdExists(req, res, next) {
	let reservation_id = null;
	if (req.body.data) {
		// checks reservation_id before status changes to "seated"
		reservation_id = req.body.data.reservation_id;
	} else if (res.locals.table) {
		// checks reservation_id before status changes to "finished"
		reservation_id = res.locals.table.reservation_id;
	}
	const reservation = await tablesService.readReservation(reservation_id);
	if (reservation) {
		res.locals.reservation = reservation;
		return next();
	}

	next({
		status: 404,
		message: `Reservation ID ${reservation_id} does not exist.`,
	});
}

////////////////////////////////////////////
// Table + Reservation Status Validations
////////////////////////////////////////////

// checks if the table capacity can seat the number of people on the reservation
function tableHasSufficientCapacity(req, res, next) {
	const { people } = res.locals.reservation;
	const { capacity } = res.locals.table;

	if (capacity >= people) return next();

	next({
		status: 400,
		message: `Table does not have sufficient capacity.`,
	});
}

function tableIsNotOccupied(req, res, next) {
	const { reservation_id } = res.locals.table;

	if (reservation_id) {
		return next({
			status: 400,
			message: `Table is occupied.`,
		});
	}
	next();
}

function tableIsOccupied(req, res, next) {
	const { reservation_id } = res.locals.table;

	if (reservation_id) return next();

	next({
		status: 400,
		message: `Table is not occupied.`,
	});
}

function reservationStatusIsNotSeated(req, res, next) {
	const { status } = res.locals.reservation;

	if (status === "seated") {
		return next({
			status: 400,
			message: `Reservation status is ${status}.`,
		});
	}

	next();
}

// creates a new 'table' with a reservation_id property
async function create(req, res) {
	const data = await tablesService.create(req.body.data);
	res.status(201).json({ data });
}

// reads a single table
async function read(req, res) {
	const data = res.locals.table;
	res.json({ data: data });
}

// lists tables
async function list(req, res, next) {
	const data = await tablesService.list();
	res.json({ data: data });
}

// updates a table
async function update(req, res) {
	const updatedTable = {
		...res.locals.table,
		reservation_id: res.locals.reservation.reservation_id,
	};
	const data = await tablesService.update(updatedTable);
	res.json({ data });
}

// update reservation status if seated
async function updateReservationStatusToSeated(req, res, next) {
	const updatedReservation = {
		...res.locals.reservation,
		status: "seated",
	};
	const data = await tablesService.updateReservationStatus(updatedReservation);
	next();
}

// update reservation status if finished
async function updateReservationStatusToFinished(req, res, next) {
	const updatedReservation = {
		...res.locals.reservation,
		status: "finished",
	};
	const data = await tablesService.updateReservationStatus(updatedReservation);
	next();
}

// removes reservation_id from the selected table
async function deleteReservationId(req, res) {
	const updatedTable = {
		...res.locals.table,
		reservation_id: null,
	};
	const data = await tablesService.update(updatedTable);
	res.json({ data });
}

module.exports = {
	create: [
		hasOnlyValidProperties,
		hasProperties("table_name", "capacity"),
		hasValidInputs,
		asyncErrorBoundary(create),
	],
	update: [
		asyncErrorBoundary(tableExists),
		hasOnlyValidProperties,
		hasProperties("reservation_id"),
		asyncErrorBoundary(reservationIdExists),
		tableHasSufficientCapacity,
		tableIsNotOccupied,
		reservationStatusIsNotSeated,
		asyncErrorBoundary(updateReservationStatusToSeated),
		asyncErrorBoundary(update),
	],
	list: [asyncErrorBoundary(list)],
	read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
	deleteReservationId: [
		asyncErrorBoundary(tableExists),
		tableIsOccupied,
		asyncErrorBoundary(reservationIdExists),
		asyncErrorBoundary(updateReservationStatusToFinished),
		asyncErrorBoundary(deleteReservationId),
	],
};

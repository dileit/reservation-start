// const service = require("./tables.service");
// const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const hasProperties = require("../errors/hasProperties");
// const { next } = require("../../../front-end/src/utils/date-time");

// const VALID_PROPERTIES = [
// 	"table_id",
// 	"table_name",
// 	"capacity",
// 	"reservation_id",
// ];

// // validation for table info

// function hasOnlyValidProperties(req, res, next) {
// 	const { data = {} } = req.body;

// 	const invalidFields = Object.keys(data).filter(
// 		(field) => !VALID_PROPERTIES.includes(field)
// 	);

// 	if (invalidFields.length) {
// 		return next({
// 			status: 400,
// 			message: `Invalid field(s): ${invalidFields.join(", ")}`,
// 		});
// 	}

// 	next();
// }

// function hasValidInputs(req, res, next) {
// 	const { table_name, capacity } = req.body.data;
// 	let invalidInputs = "Invalid input(s):";

// 	if (table_name.length < 2) {
// 		invalidInputs = invalidInputs.concat(" table_name");
// 	}

// 	if (typeof capacity !== "number") {
// 		invalidInputs = invalidInputs.concat(" capacity");
// 	}

// 	if (invalidInputs !== "Invalid input(s):") {
// 		return next({ status: 400, message: invalidInputs });
// 	}
// 	next();
// }

// // validation if table exists

// async function tableExists(req, res, next) {
// 	const { table_id } = req.params;
// 	const table = await service.read(table_id);
// 	if (table) {
// 		res.locals.table = table;
// 		return next();
// 	}
// 	next({ status: 404, message: `Table Id ${table_id} does not exist.` });
// }

// // list tables

// async function list(req, res, next) {
// 	const data = await service.list();
// 	res.json({ data: data });
// }

// // create table

// async function create(req, res, next) {
// 	const data = await service.create(req.body.data);
// 	// if(data instanceof Error) return next({message: data.message})
// 	res.status(201).json({ data: data });
// }

// // read table

// async function read(req, res, next) {
// 	res.json({ data: res.locals.table });
// }

// // delete table

// async function destroy(req, res) {
// 	const { table_id } = res.locals.table;
// 	await service.destroy(table_id);
// 	res.sendStatus(204);
// }

// // delete seat -- aka UNSEAT a reservation from table

// async function unseat(req, res, next) {
// 	const {
// 		table: { table_id: tableId, ...table },
// 	} = res.locals;
// 	const error = { stauts: 400, message: `Table not occupied.` };
// 	if (table.status !== "Occupied") return next(error);
// 	const updatedTable = { ...table, status: "Free" };
// 	let data = await service.update(tableId, updatedTable);
// 	data = await service.read(tableId);
// 	if (data instanceof Error) return next({ message: data.message });
// 	res.json({ data: data });
// }

// // seat -- occupy a table

// async function seat(req, res, next) {
// 	const {
// 		table: { table_id: tableId, ...table },
// 	} = res.locals;
// 	const error = { stauts: 400, message: `Table occupied.` };
// 	if (table.status === "Occupied") return next(error);
// 	const updatedTable = { ...table, status: "Occupied" };
// 	let data = await service.update(tableId, updatedTable);
// 	data = await service.read(tableId);
// 	if (data instanceof Error) return next({ message: data.message });
// 	res.json({ data: data });
// }

// // update

// async function update(req, res, next) {
// 	const {
// 		table: { table_id: tableId, ...table },
// 	} = res.locals;

// 	const updatedTable = { ...table, ...req.body };

// 	let data = await service.update(tableId, updatedTable);
// 	data = await service.read(tableId);
// 	if (data instanceof Error) return next({ message: newTable.message });
// 	res.json({ data: data });
// }

// module.exports = {
// 	list: [asyncErrorBoundary(list)],
// 	create: [
// 		hasOnlyValidProperties,
// 		hasProperties("table_name, capacity"),
// 		hasValidInputs,
// 		asyncErrorBoundary(create),
// 	],
// 	read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
// 	delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
// 	unseat: [asyncErrorBoundary(tableExists), asyncErrorBoundary(unseat)],
// 	update: [
// 		hasOnlyValidProperties,
// 		asyncErrorBoundary(tableExists),
// 		asyncErrorBoundary(update),
// 	],
// 	seat: [asyncErrorBoundary(tableExists), asyncErrorBoundary(seat)],
// };

const tablesService = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id", "status"];

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

// creates a new 'table' with a reservation_id property
async function create(req, res) {
	const data = await tablesService.create(req.body.data);
	res.status(201).json({ data });
}

async function list(req, res, next) {
	const data = await tablesService.list();
	res.json({ data: data });
}

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

function reservationStatusIsNotSeated(req, res, next) {
	const { status } = res.locals.reservation;

	if (status === "Seated") {
		return next({
			status: 400,
			message: `Reservation status is ${status}.`,
		});
	}

	next();
}

async function updateReservationStatusToSeated(req, res, next) {
	const updatedReservation = {
		...res.locals.reservation,
		status: "Seated",
	};
	const data = await tablesService.updateReservationStatus(updatedReservation);
	next();
}

async function seat(req, res, next) {
	if (res.locals.table.status === "Free") {
		res.locals.table.status = "Occupied";
		next();
	}
	next({});
}

async function update(req, res) {
	const updatedTable = {
		...res.locals.table,
		status: "Occupied",
		reservation_id: res.locals.reservation.reservation_id,
	};
	const data = await tablesService.update(updatedTable);
	res.json({ data: data });
}

async function read(req, res) {
	const data = res.locals.table;
	res.json({ data: data });
}

function tableIsOccupied(req, res, next) {
	const { reservation_id } = res.locals.table;

	if (reservation_id) return next();

	next({
		status: 400,
		message: `Table is not occupied.`,
	});
}

async function updateReservationStatusToFinished(req, res, next) {
	const updatedReservation = {
		...res.locals.reservation,
		status: "Finished",
	};
	const data = await tablesService.updateReservationStatus(updatedReservation);
	next();
}

async function deleteReservationId(req, res) {
	const updatedTable = {
		...res.locals.table,
		status: "Free",
		reservation_id: null,
	};
	const data = await tablesService.update(updatedTable);
	res.json({ data });
}

async function destroy(req, res) {
	const { table_id } = res.locals.table;
	await tablesService.delete(table_id);
	res.sendStatus(204);
}

module.exports = {
	create: [
		hasOnlyValidProperties,
		hasProperties("table_name", "capacity"),
		// hasValidInputs,
		asyncErrorBoundary(create),
	],
	seat: [
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
	unseat: [
		asyncErrorBoundary(tableExists),
		tableIsOccupied,
		asyncErrorBoundary(reservationIdExists),
		asyncErrorBoundary(updateReservationStatusToFinished),
		asyncErrorBoundary(deleteReservationId),
	],
	delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};

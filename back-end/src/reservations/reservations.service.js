const knex = require("../db/connection");

const list = () => {
	return knex("reservations").select("*").orderBy("reservation_date");
};

const listByDate = (date) => {
	return knex("reservations")
		.select("*")
		.where({ reservation_date: date })
		.whereNot({ status: "finished" })
		.whereNot({ status: "cancelled" })
		.orderBy("reservation_time", "asc");
};

function listByMobileNumber(mobile_number) {
	return knex("reservations")
		.select("*")
		.whereRaw(
			"translate(mobile_number, '() -', '') like ?",
			`%${mobile_number.replace(/\D/g, "")}%`
		)
		.orderBy("reservation_date");
}

// create
const create = (reservation) => {
	return knex("reservations")
		.insert(reservation)
		.returning("*")
		.then((createdRecords) => createdRecords[0]);
};

const read = (reservation_id) => {
	return knex("reservations").select("*").where({ reservation_id }).first();
};

const update = (updatedRes) => {
	return knex("reservations")
		.select("*")
		.where({ reservation_id: updatedRes.reservation_id })
		.update(updatedRes, "*")
		.then((updatedRecords) => updatedRecords[0]);
};

function updateReservationStatus(updatedReservation) {
	return knex("reservations")
		.select("*")
		.where({ reservation_id: updatedReservation.reservation_id })
		.update({ status: updatedReservation.status })
		.then((updatedRecords) => updatedRecords[0]);
}

function updateStatus(status, reservationId) {
	return knex("reservations")
		.where({ reservation_id: reservationId })
		.update("status", status)
		.returning("*")
		.then((records) => records[0]);
}

const destroy = (reservation_id) => {
	return knex("reservations").where({ reservation_id }).del();
};

module.exports = {
	list,
	listByDate,
	listByMobileNumber,
	create,
	read,
	update,
	updateStatus,
	updateReservationStatus,
	delete: [destroy],
};

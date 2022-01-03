// /**
//  * Defines the router for reservation resources.
//  *
//  * @type {Router}
//  * Routes available - / GET - List Reservations by Date / Mobile Number
//  * /new - POST - Create a new Reservation
//  * Date in format DDMMYYYY
//  * /:reservationId allows GET, PUT, DELETE
//  * /:reservationId/status updates a reservation - PUT
//  */

const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./reservations.controller");

router
	.route("/")
	.get(controller.list)
	.post(controller.create)
	.all(methodNotAllowed);

router
	.route("/:reservation_id")
	.get(controller.read)
	.put(controller.update)
	.delete(controller.delete);

router
	.route("/:reservation_id/status")
	.put(controller.updateStatus)
	.all(methodNotAllowed);

module.exports = router;

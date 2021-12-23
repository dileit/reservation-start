/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 * Routes available - / search Reservations
 * /new - Create a new Reservation
 * Date in format YYYY-MM-DD
 * /:reservationId allows GET, PUT, DELETE
 * /:reservationId/status updates a reservation
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
	.route("/")
	.get(controller.list)
	.post(controller.create)
	.all(methodNotAllowed);

router.route("/byDate").get(controller.listByDate).all(methodNotAllowed);

router.route("/new").post(controller.create).all(methodNotAllowed);

router
	.route("/:reservation_id")
	.get(controller.read)
	.put(controller.update)
	.delete(controller.delete)
	.all(methodNotAllowed);

router
	.route("/:reservation_id/status")
	.put(controller.updateStatus)
	.all(methodNotAllowed);

module.exports = router;

// router.route("/:restaurantId/seat").all(methodNotAllowed);

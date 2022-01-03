/**
 * Defines the router for table resources.
 *
 * @type {Router}
 *
 * Routes Available
 * "/" GET: list all tables - POST: add new table
 * "/:table_id" GET: read a single table
 * "/:table_id/seat" - PUT save table assignment - DELETE - unseats a table
 *
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
	.route("/")
	.get(controller.list)
	.post(controller.create)
	.all(methodNotAllowed);

router.route("/:table_id").get(controller.read).all(methodNotAllowed);

router
	.route("/:table_id/seat")
	.put(controller.update)
	.delete(controller.deleteReservationId)
	.all(methodNotAllowed);

module.exports = router;

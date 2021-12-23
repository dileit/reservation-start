/**
 * Defines the router for table resources.
 *
 * @type {Router}
 *
 * Routes Available
 * "/" GET: list all tables - post: add new table
 * "/:table_id" GET: read a single table, update a table, delete a table
 * "/:table_id/seat" - PUT save table assignment
 *
 * The body of the request must be `{ data: { reservation_id: x } }` where X is the reservation_id of the reservation being seated. Th
 * - DELETE request to remove table assignment 400 if not occupied
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
	.route("/")
	.get(controller.list)
	.post(controller.create)
	.all(methodNotAllowed);

router
	.route("/:table_id")
	.get(controller.read)
	.delete(controller.delete)
	.all(methodNotAllowed);

router
	.route("/:table_id/seat")
	.put(controller.seat)
	.delete(controller.unseat)
	.all(methodNotAllowed);

module.exports = router;

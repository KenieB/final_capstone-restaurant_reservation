/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/MethodNotAllowed");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:table_id([0-9]+)/seat")
  .put(controller.update)
  .all(methodNotAllowed);

module.exports = router;

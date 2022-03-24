const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getVacCenters,
} = require("../controller/hospitals");

//Re-route into other resource routers
const appointmentRouter = require("./appointments");
router.use("/:hospitalId/appointments", appointmentRouter);

router
  .route("/")
  .get(getHospitals)
  .post(protect, authorize("admin"), createHospital);

router.route("/vacCenters").get(getVacCenters);

router
  .route("/:id")
  .get(getHospital)
  .put(protect, authorize("admin"), updateHospital)
  .delete(protect, authorize("admin"), deleteHospital);

module.exports = router;

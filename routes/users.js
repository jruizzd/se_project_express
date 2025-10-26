const router = require("express").Router();

router.get("/", () => console.log("Get users"));
router.get("/:userId", () => console.log("Get users by Id"));
router.post("/", () => console.log("POST users"));

module.exports = router;

const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUpdateProfile } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateProfile, updateUser);

module.exports = router;

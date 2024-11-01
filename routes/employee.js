const express = require("express");
const router = express.Router();

const { findAllRoleByEmployeeId } = require("../services/employeeService")

router.get("/roles/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params;

    try {
        const roles = await findAllRoleByEmployeeId(employeeId);
        res.status(200).json(roles);
    } catch(e) {
        res.status(400).json(e);
    }
});


module.exports = router;
const express = require("express");
const router = express.Router();

const { findAllRoleByEmployeeId, findEmployeeByMailAndPassword } = require("../services/employeeService")

router.get("/roles/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params;

    try {
        const roles = await findAllRoleByEmployeeId(employeeId);
        res.status(200).json(roles);
    } catch(e) {
        res.status(400).json(e);
    }
});


router.post("/login", async (req, res, err) =>  {
    const { mail, password } = req.body;

    try {
        const employee = await findEmployeeByMailAndPassword(mail, password);

        if (employee) {
            res.status(200).json(employee);
        } else {
            res.sendStatus(404);
        }
        
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
});


module.exports = router;
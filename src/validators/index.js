import { body } from "express-validator";

const studentRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("mobile")
            .trim()
            .notEmpty()
            .withMessage("Mobile Number is required")
            .isLength({ min: 10, max: 10 })
            .withMessage("Mobile number should contains 10 digits"),
        body("name")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Name is required"),
    ];
};



export {
    studentRegisterValidator,
};

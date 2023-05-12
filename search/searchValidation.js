import Joi from "joi";

const querySchema = Joi.object({
  clinicName: Joi.string().optional(),
  stateName: Joi.string().optional(),
  availability: Joi.string()
    .regex(/^\["([01]\d|2[0-3]):[0-5]\d", "([01]\d|2[0-3]):[0-5]\d"\]$/)
    .optional(),
})
  .min(1)
  .max(3)
  .or("clinicName", "stateName", "availability")
  .unknown(false);

const validateRequest = (req, res, next) => {
  const { error } = querySchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

export default validateRequest;

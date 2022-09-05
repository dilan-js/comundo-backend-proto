const { ROLES } = require("../constants");
const { $t, KEYS } = require("../utils/locale");

/**
 * @description Check if user is Customer
 */
const isCustomer = (req, res, next) => {
  const { user } = req;

  if (!user || user.role !== ROLES.CUSTOMER) {
    return res.status(403).send($t(req.locale, KEYS.FORBIDDEN));
  }

  next();
};

/**
 * @description Check if user is Owner
 */
const isProvider = (req, res, next) => {
  const { user } = req;

  if (!user || (user.role !== ROLES.OWNER && user.role !== ROLES.STYLIST)) {
    return res.status(403).send($t(req.locale, KEYS.FORBIDDEN));
  }

  next();
};

const isOwner = (req, res, next) => {
  const { user } = req;

  if (!user || user.role !== ROLES.OWNER) {
    return res.status(403).send($t(req.locale, KEYS.FORBIDDEN));
  }

  next();
};

module.exports = {
  isCustomer,
  isProvider,
  isOwner,
};

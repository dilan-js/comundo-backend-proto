const ROLES = {
  OWNER: "OWNER",
  SALON: "SALON",
  CUSTOMER: "CUSTOMER",
  STYLIST: "STYLIST",
};

const ROLES_MAP = {
  owner: ROLES.OWNER,
  client: ROLES.CUSTOMER,
  provider: ROLES.SALON,
  stylist: ROLES.STYLIST,
};

const STYLISTROLE = {
  OWNER: "OWNER",
  MANAGER: "MANAGER",
  STYLIST: "STYLIST",
  OTHER: "OTHER",
};

const APPTSTATUS = {
  CANCEL: "cancel",
  CONFIRM: "confirm",
};

module.exports = {
  ROLES,
  ROLES_MAP,
  STYLISTROLE,
  APPTSTATUS,
};

const { Op } = require("sequelize");

const systemAuthorId = -1;

function userCanViewItem(userId, authorId) {
  userId = userId === undefined || userId === null ? -Infinity : userId;

  if (authorId === systemAuthorId) {
    return true;
  }

  return userId === authorId;
}

function inList(list) {
  return {
    [Op.in]: list,
  };
}

function byUserOrSystem(userId) {
  return {
    [Op.or]: [systemAuthorId, userId].filter(Boolean),
  };
}

module.exports = {
  inList,
  userCanViewItem,
  byUserOrSystem,
};

async function createAssociation(data) {
  data.userMd.hasOne(data.userInfoMd, {
    foreignKey: "user_id",
  });
  data.userInfoMd.belongsTo(data.userMd);

  return true;
}

module.exports = {
  createAssociation,
};

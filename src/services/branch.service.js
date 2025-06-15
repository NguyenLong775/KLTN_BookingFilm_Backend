const Branch = require("../models/branch.model");

const getBranchesService = async () => {
  try {
    return await Branch.find();
  } catch (error) {
    throw new Error(error.message);
  }
};

const createBranchService = async (branch) => {
  try {
    return await Branch.create(branch);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateBranchService = async (id, branch) => {
  try {
    return await Branch.findByIdAndUpdate(id, branch, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createBranchService,
  updateBranchService,
  getBranchesService,
};

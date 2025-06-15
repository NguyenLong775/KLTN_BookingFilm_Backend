const {
  createBranchService,
  getBranchesService,
  updateBranchService,
} = require("../services/branch.service");

const getBranches = async (req, res) => {
  try {
    const branches = await getBranchesService();
    res.status(200).json(branches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateBranch = async (req, res) => {
  try {
    const { branch_name, address, list_screen, is_active } = req.body;
    const newBranch = await createBranchService({
      branch_name,
      address,
      list_screen,
      is_active,
    });
    res.status(201).json(newBranch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putUpdateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBranch = await updateBranchService(id, req.body);
    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  postCreateBranch,
  getBranches,
  putUpdateBranch,
};

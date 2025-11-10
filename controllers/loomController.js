import Loom from "../models/Loom.js";

export const getLooms = async (req, res) => {
  const looms = await Loom.find().populate("currentProduct");
  res.json(looms);
};

export const updateLoom = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const loom = await Loom.findOneAndUpdate({ loomId: id }, { ...data, lastUpdated: new Date() }, { new: true, upsert: true });
  res.json(loom);
};

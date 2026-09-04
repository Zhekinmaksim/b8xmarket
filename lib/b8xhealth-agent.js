const { handleA2a, handleAgent, handleCard } = require("./b8x-agent");

module.exports = {
  handleA2a: (req, res) => handleA2a(req, res, "b8xhealth"),
  handleAgent: (req, res) => handleAgent(req, res, "b8xhealth"),
  handleCard: (req, res) => handleCard(req, res, "b8xhealth"),
};

const teamsRouter = require("express").Router();
const { getTeams } = require("../controllers/teams.controllers");

teamsRouter.get("/", getTeams);

module.exports = { teamsRouter };

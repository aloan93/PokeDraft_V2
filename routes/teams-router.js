const teamsRouter = require("express").Router();
const {
  getTeams,
  getTeamByTeamId,
} = require("../controllers/teams.controllers");

teamsRouter.get("/", getTeams);

teamsRouter.get("/:team_id", getTeamByTeamId);

module.exports = { teamsRouter };

const teamsRouter = require("express").Router();
const {
  getTeams,
  getTeamByTeamId,
  postTeam,
} = require("../controllers/teams.controllers");

teamsRouter.get("/", getTeams);

teamsRouter.get("/:team_id", getTeamByTeamId);

teamsRouter.post("/", postTeam);

module.exports = { teamsRouter };

const teamsRouter = require("express").Router();
const {
  getTeams,
  getTeamByTeamId,
  postTeam,
  patchTeamByTeamId,
} = require("../controllers/teams.controllers");

teamsRouter.get("/", getTeams);

teamsRouter.get("/:team_id", getTeamByTeamId);

teamsRouter.post("/", postTeam);

teamsRouter.patch("/:team_id", patchTeamByTeamId);

module.exports = { teamsRouter };

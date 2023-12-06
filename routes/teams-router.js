const teamsRouter = require("express").Router();
const {
  getTeams,
  getTeamByTeamId,
  postTeam,
  patchTeamByTeamId,
  deleteTeamByTeamId,
} = require("../controllers/teams.controllers");

teamsRouter.get("/", getTeams);

teamsRouter.get("/:team_id", getTeamByTeamId);

teamsRouter.post("/", postTeam);

teamsRouter.patch("/:team_id", patchTeamByTeamId);

teamsRouter.delete("/:team_id", deleteTeamByTeamId);

module.exports = { teamsRouter };

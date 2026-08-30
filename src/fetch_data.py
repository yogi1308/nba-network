import csv
from datetime import datetime
import time
from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import commonteamroster

data_file = open("data/data.csv", "a")

writer = csv.writer(data_file)

player_dict = players.get_players()

done = set()
with open("data/done.log", "r") as done_logs:
    for log in done_logs:
        done.add(log.strip())
skipped = set()
with open("data/skipped.log", "r") as skipped_logs:
    for log in skipped_logs:
        skipped.add(log.strip().split(",")[0])

with open("data/players.csv", "r+") as player_file:
    player_file_reader = csv.DictReader(player_file)

    for player in player_file_reader:
        if player["id"] in done or player["id"] in skipped:
            continue

        print(datetime.now(), ":", "fetching career of", player["full_name"])

        try:
            # gets the first table of career which includes the data we need
            career = playercareerstats.PlayerCareerStats(
                player_id=player["id"]
            ).get_data_frames()[0]
        except KeyError as e:
            with open("data/skipped.log", "a") as skipped_file:
                skipped_file.write(f"{player['id']},{player['full_name']},KeyError:resultSet\n")
                skipped_file.flush()
                skipped.add(str(player["id"]))
            print(f"{datetime.now()} : skipping {player['full_name']} ({player['id']}) — {e}")
            continue

        # drops redundant TOT entry which tracks no. of teams player played for in a season
        career = career[career["TEAM_ABBREVIATION"] != "TOT"]

        # extracts team and season ids
        career = career[["SEASON_ID", "TEAM_ID"]]

        teams_done = set()
        with open("data/done_team.log", "r") as team_done_logs:
            for log in team_done_logs:
                teams_done.add(tuple(log.strip().split(",")))

        for row in career.itertuples(index=False):
            print(datetime.now(), ":", "fetching", player["full_name"], row.SEASON_ID, row.TEAM_ID)
            if ( str(row.TEAM_ID), row.SEASON_ID ) in teams_done:
                continue
            roster = commonteamroster.CommonTeamRoster(
                team_id=row.TEAM_ID, season=row.SEASON_ID
            ).get_data_frames()[0]

            for teammate in roster.itertuples(index=False):
                if str( teammate.PLAYER_ID ) != player["id"]:
                    writer.writerow(
                        [
                            player["id"],
                            player["full_name"],
                            teammate.PLAYER_ID,
                            teammate.PLAYER,
                            row.TEAM_ID,
                            row.SEASON_ID,
                        ]
                    )

            data_file.flush()
            teams_done.add(( str( row.TEAM_ID ), row.SEASON_ID ))
            with open("data/done_team.log", "a") as log:
                log.write(f"{row.TEAM_ID},{row.SEASON_ID}\n")
                log.flush()
            time.sleep(1)

        done.add(player["id"])
        with open("data/done.log", "a") as log:
            log.write(f"{player['id']}\n")
            log.flush()
        open("data/done_team.log", "w").close()

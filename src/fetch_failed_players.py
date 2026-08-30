import csv
from datetime import datetime
import time
from nba_api.stats.endpoints import leaguegamefinder
from nba_api.stats.endpoints import commonteamroster


def season_id_to_season(season_id: str) -> str:
    year = int(season_id[1:])  # drop the leading type digit (1/2/3/4)
    return f"{year}-{str(year + 1)[-2:]}"


done = set()
with open("data/skipped_done.log", "r") as done_logs:
    for log in done_logs:
        done.add(log.strip())

data_file = open("data/skipped_data.csv", "a")
writer = csv.writer(data_file)

with open("data/skipped.log", "r") as skipped_file:
    skipped_player_file_reader = csv.DictReader(skipped_file)
    for player in skipped_player_file_reader:
        if player["id"] in done:
            continue
        print(datetime.now(), ":", "fetching career of", player["full_name"])
        games = leaguegamefinder.LeagueGameFinder(
            player_id_nullable=player["id"]
        ).get_data_frames()[0]
        games = games[(games["MIN"] != 0) & (~games["SEASON_ID"].str.startswith("1"))]
        career = games[["SEASON_ID", "TEAM_ID"]].drop_duplicates()
        career["TEAM_ID"] = career["TEAM_ID"].astype(int)
        for row in career.itertuples(index=False):
            season = season_id_to_season(row.SEASON_ID)
            print(
                f"fetching roster of {player['full_name']} {player['id']} for {row.SEASON_ID} {season}"
            )
            roster = commonteamroster.CommonTeamRoster(
                team_id=row.TEAM_ID, season=season
            ).get_data_frames()[0]
            for teammate in roster.itertuples(index=False):
                if str(teammate.PLAYER_ID) != player["id"]:
                    writer.writerow(
                        [
                            player["id"],
                            player["full_name"],
                            teammate.PLAYER_ID,
                            teammate.PLAYER,
                            row.TEAM_ID,
                            season
                        ]
                    )

            data_file.flush()
            time.sleep(1)
        done.add(player["id"])
        with open("data/skipped_done.log", "a") as log:
            log.write(f"{player['id']}\n")
            log.flush()

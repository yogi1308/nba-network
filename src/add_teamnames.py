import csv

from nba_api.stats.static import teams

CSV_PATH = "../data/final_data.csv"
OUT_PATH = "../data/team_names.csv"


def main():
    team_names = {str(t["id"]): t["full_name"] for t in teams.get_teams()}
    with open(CSV_PATH) as f:
        team_ids = {row["team_id"] for row in csv.DictReader(f)}
    with open(OUT_PATH, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["team_id", "team_name"])
        for team_id in sorted(team_ids):
            writer.writerow([team_id, team_names.get(team_id, team_id)])


if __name__ == "__main__":
    main()

import csv
from nba_api.stats.static import players
players_list = players.get_players()
with open("data/players.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["id","full_name","first_name","last_name","is_active"])
    writer.writeheader()        # once, outside loop
    writer.writerows(players_list) 

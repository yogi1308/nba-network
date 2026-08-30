import csv
import networkx as nx

G = nx.Graph()

def check_graph():
    print(G.number_of_nodes())
    print(G.number_of_edges())
    print(nx.is_connected(G))
    print(nx.number_connected_components(G))

    components = sorted(nx.connected_components(G), key=len, reverse=True)
    for i, comp in enumerate(components):
        print(f"component {i}: {len(comp)} nodes")
        if len(comp) <= 10:
            for node_id in comp:
                print("  ", G.nodes[node_id]["name"])


with (
    open("data/final_data.csv", "r") as data_file,
    open("data/players.csv", "r") as player_file,
):
    data_reader = csv.DictReader(data_file)
    player_reader = csv.DictReader(player_file)

    for player in player_reader:
        G.add_node(player["id"], name=player["full_name"])

    for link in data_reader:
        a, b = link["player_id"], link["teammate_id"]
        entry = (link["season"], link["team_id"])

        if not G.has_edge(a, b):
            G.add_edge(a, b, seasons={entry})
        elif entry not in G[a][b]["seasons"]:
            G[a][b]["seasons"].add(entry)

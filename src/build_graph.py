import csv
import json
import pickle
import math
import random

import networkx as nx
from fa2 import ForceAtlas2


def load_graph():
    G = nx.Graph()
    id_to_name = {}

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
            id_to_name[a] = link["fullname"]
            id_to_name[b] = link["teammate_fullname"]

            if not G.has_edge(a, b):
                G.add_edge(a, b, seasons={entry})
            elif entry not in G[a][b]["seasons"]:
                G[a][b]["seasons"].add(entry)

    return G, id_to_name


def check_graph(G):
    print("nodes:", G.number_of_nodes())
    print("edges:", G.number_of_edges())
    print("connected:", nx.is_connected(G))
    print("components:", nx.number_connected_components(G))

    components = sorted(nx.connected_components(G), key=len, reverse=True)
    for i, comp in enumerate(components):
        print(f"  component {i}: {len(comp)} nodes")
        if len(comp) <= 10:
            for node_id in comp:
                print("    ", G.nodes[node_id]["name"])


def annotate_size_and_weight(G):
    for n in G.nodes():
        G.nodes[n]["size"] = G.degree(n)

    for u, v, data in G.edges(data=True):
        data["weight"] = len(data["seasons"])

def annotate_max_depth(G):
    for n, ecc in nx.eccentricity(G).items():
        G.nodes[n]["maxDepth"] = ecc


def sunflower_layout(G, x_radius, y_radius, seed):
    rng = random.Random(seed)
    N = G.number_of_nodes()
    golden_angle = math.pi * (3 - math.sqrt(5))
    nodes = list(G.nodes())
    order = list(range(N))
    rng.shuffle(order)
    for rank, i in enumerate(order):
        n = nodes[i]
        r = math.sqrt((rank + 0.5) / N)
        theta = rank * golden_angle
        G.nodes[n]["pos"] = (
            r * math.cos(theta) * x_radius,
            r * math.sin(theta) * y_radius,
        )


def compute_layout(G):
    sunflower_layout(G, x_radius=2000, y_radius=1125, seed=42)
    forceatlas2 = ForceAtlas2(
        outboundAttractionDistribution=False,  # dissuade hub players from dominating the center
        edgeWeightInfluence=1.0,  # respect the "weight" edge attribute
        scalingRatio=2000.0,  # large — preserves the spread from the sunflower initial
        gravity=1.0,  # light — just enough to add cluster structure
        linLogMode=True,  # better attraction for hub-heavy networks
        barnesHutOptimize=True,  # required at this scale — O(n log n) not O(n²)
        adjustSizes=True,  # prevent nodes overlapping, using our size attr
        verbose=True,
        seed=42,  # reproducible layout across reruns
    )
    forceatlas2.forceatlas2_networkx_layout(
        G,
        pos=None,
        iterations=500,
        weight_attr="weight",
        size_attr="size",
        store_pos_as="pos",  # writes G.nodes[n]["pos"] = (x, y) directly
    )


def build_graph_json(G, id_to_name, x_stretch):
    return {
        "nodes": [
            {
                "key": n,
                "attributes": {
                    "label": G.nodes[n].get("name", id_to_name.get(n, "Unknown")),
                    "x": G.nodes[n]["pos"][0] * x_stretch,
                    "y": G.nodes[n]["pos"][1],
                    "size": max(2, G.nodes[n]["size"] ** 0.5),
                    "maxDepth": G.nodes[n]["maxDepth"],
                },
            }
            for n in G.nodes()
        ],
        "edges": [
            {"source": u, "target": v, "attributes": {"weight": data["weight"]}}
            for u, v, data in G.edges(data=True)
        ],
    }


def main():
    G, id_to_name = load_graph()
    check_graph(G)

    annotate_size_and_weight(G)
    annotate_max_depth(G)
    compute_layout(G)

    graph_json = build_graph_json(G, id_to_name, x_stretch=2.00)
    with open("data/network.json", "w") as f:
        json.dump(graph_json, f, indent=2)
    print("saved data/network.json")

    with open("site/public/data/network.json", "w") as f:
        json.dump(graph_json, f, indent=2)
    print("saved site/public/data/network.json")

    with open("data/network.pkl", "wb") as f:
        pickle.dump(G, f)
    print("saved data/network.pkl")


if __name__ == "__main__":
    main()

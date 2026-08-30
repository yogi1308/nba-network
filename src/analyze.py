import pickle
import networkx as nx

with open("data/network.pkl", "rb") as f:
    G = pickle.load(f)

print("nodes:", G.number_of_nodes())
print("edges:", G.number_of_edges())
print("average shortest path length:", nx.average_shortest_path_length(G))
print("diameter:", nx.diameter(G))

degrees = [d for _, d in G.degree()]
print("max degree:", max(degrees))
print("min degree:", min(degrees))
print("avg degree:", sum(degrees) / len(degrees))

top_connected = sorted(G.degree(), key=lambda x: x[1], reverse=True)[:10]
for node_id, degree in top_connected:
    print(G.nodes[node_id]["name"], degree)

betweenness = nx.betweenness_centrality(G, k=500)
closeness = nx.closeness_centrality(G) 

nx.degree_assortativity_coefficient(G)

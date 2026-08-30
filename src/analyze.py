import pickle
import time
import networkx as nx

with open("data/network.pkl", "rb") as f:
    G = pickle.load(f)

print("nodes:", G.number_of_nodes())
print("edges:", G.number_of_edges())

start = time.time()
print("average shortest path length:", nx.average_shortest_path_length(G))
print(f"  ({time.time() - start:.1f}s)")

start = time.time()
print("diameter:", nx.diameter(G))
print(f"  ({time.time() - start:.1f}s)")

degrees = [d for _, d in G.degree()]
print("max degree:", max(degrees))
print("min degree:", min(degrees))
print("avg degree:", sum(degrees) / len(degrees))

print("\ntop 10 most-connected players:")
top_connected = sorted(G.degree(), key=lambda x: x[1], reverse=True)[:10]
for node_id, degree in top_connected:
    print(" ", G.nodes[node_id]["name"], degree)

start = time.time()
betweenness = nx.betweenness_centrality(G, k=500)
print(f"betweenness computed ({time.time() - start:.1f}s)")
top_betweenness = sorted(betweenness.items(), key=lambda x: x[1], reverse=True)[:10]
print("\ntop 10 by betweenness centrality:")
for node_id, score in top_betweenness:
    print(" ", G.nodes[node_id]["name"], round(score, 4))

closeness = nx.closeness_centrality(G)
top_closeness = sorted(closeness.items(), key=lambda x: x[1], reverse=True)[:10]
print("\ntop 10 by closeness centrality:")
for node_id, score in top_closeness:
    print(" ", G.nodes[node_id]["name"], round(score, 4))

assortativity = nx.degree_assortativity_coefficient(G)
print("\ndegree assortativity coefficient:", assortativity)

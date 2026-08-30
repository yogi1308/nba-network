# NBA Teammate Network — Six Degrees of Separation

## Concept
Build an undirected graph where **every NBA player is a node** and **two players share an edge if they were teammates on the same NBA team in the same season**. Then analyze the graph to answer: how many degrees of separation exist across NBA history?

## Scope (v1)
- **Players:** Only players who appeared in at least 1 regular-season game
- **Graph:** Single undirected, unweighted graph (weight by shared seasons is a stretch goal)

## Data Source
**`nba_api`** — official NBA.com API. No API key needed.

### Pipeline
1. Get all NBA teams from static data (`teams.get_teams()`)
2. For each season, for each active team, fetch `CommonTeamRoster`
3. Each roster = list of player IDs on that team that season
4. For each roster, connect every pair of players (undirected edge)
5. Cache all raw roster data as CSV for reuse

## Project Structure
```
nba-network/
├── data/
│   └── rosters.csv          # cached player-team-season data
├── src/
│   ├── build_graph.py        # fetch rosters, build NetworkX graph, save to disk
│   ├── analyze.py            # compute all metrics, print stats
│   └── degrees.py            # CLI: find shortest path between two players
├── notebooks/
│   └── six_degrees_exploration.ipynb   # exploration + inline viz
├── viz/                      # (stretch) D3.js interactive viewer
├── pyproject.toml            # dependencies
└── PROJECT_PLAN.md           # this file
```

## Graph Metrics
| Metric | What it tells you |
|---|---|
| **Nodes & edges count** | Graph size |
| **Degree distribution** | Does it follow a power law? |
| **Average shortest path length** | The "six degrees" number |
| **Diameter** | Farthest-apart pair |
| **Highest-degree players** | Most teammates (long careers, many teams) |
| **Betweenness centrality** | Bridges between eras |
| **Closeness centrality** | The NBA's "Kevin Bacon" |
| **Connected components** | Any isolated groups? |
| **Assortativity** | Do stars cluster with stars? |

## Deliverables
1. `src/build_graph.py` — fetch rosters from nba_api, construct NetworkX graph, cache data
2. `src/analyze.py` — compute all graph metrics, display summary
3. `src/degrees.py "Player A" "Player B"` — CLI tool to find & print shortest path
4. `notebooks/six_degrees_exploration.ipynb` — exploration with static network viz
5. `data/rosters.csv` — cached raw roster data

## Stretch Goals
- Full history (1946–2026)
- D3.js interactive graph with path-finder widget
- Weight edges by number of shared seasons
- Color nodes by era/position/decade
- Directed version for assist networks (next project)

## Example Questions It Answers
- How many degrees between LeBron James and Bill Russell?
- Who is the single most central player in NBA history?
- Are 1950s players connected to today's players?
- Which player bridged the most distinct eras?

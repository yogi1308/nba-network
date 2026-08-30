import pandas as pd

df = pd.read_csv("data/final_data.csv")
df = df.drop_duplicates()
df.to_csv("data/final_data.csv", index=False)

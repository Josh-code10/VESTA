import requests
import sys

sys.stdout.reconfigure(encoding='utf-8')

questions = [
    "What is Gross Profit Margin?",
    "Explain ROAS",
    "How to calculate Return Rate?",
    "What is Pareto Analysis?",
    "Why did profit margin decline in the second half of the year despite revenue growth?",
    "Which products account for most of our return losses?",
    "Which stores are driving the company's profitability, not just revenue?"
]

for idx, q in enumerate(questions, 1):
    r = requests.post("http://127.0.0.1:8000/api/v1/investigate/query", json={"question": q})
    d = r.json()
    headline = d.get("node", {}).get("insight", {}).get("headline", "")
    concept = d.get("node", {}).get("insight", {}).get("knowledge_concept")
    print(f"{idx}. Query: {q[:45]}...")
    print(f"   Headline: {headline}")
    print(f"   Concept Definition Box: {concept}")
    print("-" * 70)

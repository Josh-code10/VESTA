import random
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

def generate_demo_dataset(num_rows: int = 5000) -> pd.DataFrame:
    random.seed(42)
    np.random.seed(42)

    regions = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan"]
    channels = ["In-Store Retail", "Web Direct", "Corporate B2B", "Mobile App"]
    
    stores = {
        "Lagos": ["Ikeja Mega-Store", "Victoria Island Flagship", "Lekki Mall Outlet", "Surulere Hub"],
        "Abuja": ["Central Business District Store", "Maitama Galleria", "Wuse 2 Retail"],
        "Port Harcourt": ["GRA Phase 2 Store", "Trans-Amadi Commercial"],
        "Kano": ["Nasarawa Road Branch", "Bompai Trade Centre"],
        "Ibadan": ["Ring Road Complex", "Bodija Outlet"]
    }

    categories = {
        "Consumer Electronics": [
            ("Galaxy S24 Ultra 512GB", 1250000, 950000),
            ("iPhone 15 Pro Max 256GB", 1450000, 1150000),
            ("MacBook Pro 14 M3", 1850000, 1480000),
            ("Sony WH-1000XM5 Headphones", 285000, 195000),
            ("Dell XPS 15 Laptop", 1650000, 1320000)
        ],
        "Home Appliances": [
            ("Inverter Split AC 1.5HP (AC-902)", 385000, 310000),
            ("Double Door Refrigerator 320L", 520000, 410000),
            ("Smart Inverter Washing Machine 8kg", 345000, 270000),
            ("Digital Microwave Oven 25L", 115000, 85000),
            ("Chest Freezer 200L", 245000, 195000)
        ],
        "Computing & Peripherals": [
            ("27-inch 4K Gaming Monitor", 310000, 235000),
            ("Wireless Mechanical Keyboard", 65000, 42000),
            ("Ergonomic Office Chair Pro", 185000, 130000),
            ("Logitech MX Master 3S Mouse", 75000, 52000),
            ("1TB NVMe Portable SSD", 95000, 68000)
        ]
    }

    start_date = datetime(2025, 5, 1)
    end_date = datetime(2025, 7, 31)
    total_days = (end_date - start_date).days

    rows = []
    for i in range(num_rows):
        order_id = f"NEX-{100000 + i}"
        days_offset = random.randint(0, total_days)
        order_date = start_date + timedelta(days=days_offset)
        
        region = random.choices(regions, weights=[0.45, 0.25, 0.15, 0.08, 0.07])[0]
        store = random.choice(stores[region])
        channel = random.choices(channels, weights=[0.50, 0.25, 0.15, 0.10])[0]
        
        cat = random.choice(list(categories.keys()))
        prod_name, base_price, base_cogs = random.choice(categories[cat])
        
        quantity = random.choices([1, 2, 3, 4, 5], weights=[0.70, 0.18, 0.07, 0.03, 0.02])[0]
        
        # Inject realistic scenario variances:
        # In July, Lagos Home Appliances had heavy uncoordinated discounts (30-40%) driving margin compression
        if order_date.month == 7 and region == "Lagos" and cat == "Home Appliances":
            discount_rate = random.uniform(0.28, 0.38)
        else:
            discount_rate = random.choices([0.0, 0.05, 0.10, 0.15, 0.20], weights=[0.45, 0.25, 0.15, 0.10, 0.05])[0]

        unit_sales_price = round(base_price * (1.0 - discount_rate), 2)
        total_sales = round(unit_sales_price * quantity, 2)
        total_cogs = round(base_cogs * quantity, 2)
        gross_profit = round(total_sales - total_cogs, 2)

        # Return flag probability
        if cat == "Home Appliances" and "AC-902" in prod_name:
            return_prob = 0.22  # elevated return surge on AC units
        else:
            return_prob = 0.04

        is_returned = 1 if random.random() < return_prob else 0
        
        delivery_status = random.choices(["Delivered On-Time", "Delayed Transit", "Fulfilled In-Store", "Returned"], weights=[0.60, 0.15, 0.20, 0.05])[0]
        if is_returned == 1:
            delivery_status = "Returned"

        rows.append({
            "order_id": order_id,
            "order_date": order_date.strftime("%Y-%m-%d"),
            "region": region,
            "store_name": store,
            "sales_channel": channel,
            "category": cat,
            "product_name": prod_name,
            "quantity": quantity,
            "unit_price": base_price,
            "discount_rate": round(discount_rate, 2),
            "revenue": total_sales,
            "cogs": total_cogs,
            "gross_profit": gross_profit,
            "return_flag": is_returned,
            "delivery_status": delivery_status
        })

    df = pd.DataFrame(rows)
    return df

if __name__ == "__main__":
    df = generate_demo_dataset(5000)
    df.to_csv("c:/Users/engre/Desktop/Joshua/Personal/Antigravity/Vison - CEO business intelligence analyst/backend/app/data/demo_fixture.csv", index=False)
    print(f"Generated demo_fixture.csv with {len(df)} rows and {len(df.columns)} columns.")

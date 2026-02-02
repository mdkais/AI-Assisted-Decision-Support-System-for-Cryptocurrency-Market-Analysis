import requests
import pandas as pd
from fastapi import APIRouter, HTTPException
from app.ml_services.predictor import prepare_features, train_basic_model, predict_movement
import time

router = APIRouter()

# Separate caches for market data and the global coin list
data_cache = {}
list_cache = {"timestamp": 0, "data": []}
CACHE_EXPIRY = 300 # 5 minutes

COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

@router.get("/list-coins")
def get_list_coins():
    """
    Fetches details for the top 100 coins in a single request.
    Uses caching to prevent 429 Rate Limit errors.
    """
    current_time = time.time()
    
    # Check if list cache is fresh
    if current_time - list_cache["timestamp"] < CACHE_EXPIRY and list_cache["data"]:
        print("--- Serving Coin List from Cache ---")
        return list_cache["data"]

    url = f"{COINGECKO_BASE_URL}/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 100,  # Fetches 100 coins
        "page": 1,
        "sparkline": False
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        coins_data = response.json()
        # Cache and return
        list_cache["timestamp"] = current_time
        list_cache["data"] = coins_data
        return coins_data
    
    # If rate limited but we have old data, serve it
    if response.status_code == 429 and list_cache["data"]:
        return list_cache["data"]
        
    raise HTTPException(status_code=response.status_code, detail="Failed to fetch coin list from CoinGecko")

@router.get("/market-data/{coin_id}")
def get_market_data(coin_id: str, days: int = 30):
    current_time = time.time()

    if coin_id in data_cache:
        cached_item = data_cache[coin_id]
        if current_time - cached_item["timestamp"] < CACHE_EXPIRY:
            return cached_item["data"]

    url = f"{COINGECKO_BASE_URL}/coins/{coin_id}/market_chart"
    params = {"vs_currency": "usd", "days": days, "interval": "daily"}
    
    response = requests.get(url, params=params)
    
    if response.status_code == 429:
        if coin_id in data_cache:
            return data_cache[coin_id]["data"]
        raise HTTPException(status_code=429, detail="API Rate Limit hit. Please wait a moment.")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Coin data not found")

    data = response.json()
    prices = data.get("prices", [])
    
    df = pd.DataFrame(prices, columns=["timestamp", "price"])
    result = {"prices": df.to_dict(orient="records")}

    data_cache[coin_id] = {
        "timestamp": current_time,
        "data": result
    }
    
    return result

@router.get("/analyze/{coin_id}")
def get_coin_analysis(coin_id: str):
    market_data = get_market_data(coin_id, days=90)
    df = pd.DataFrame(market_data["prices"])
    df_features = prepare_features(df)
    model = train_basic_model(df_features)
    
    latest_features = df_features[['returns', 'sma_ratio', 'volatility']].tail(1)
    prediction = predict_movement(latest_features)
    
    current_price = df['price'].iloc[-1]
    
    return {
        "coin": coin_id,
        "current_price": round(current_price, 2),
        "prediction": prediction,
        "confidence": "Based on 90-day Random Forest Analysis",
        "disclaimer": "Analytical insights for educational purposes only."
    }
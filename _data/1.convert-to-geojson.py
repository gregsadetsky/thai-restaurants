import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv
from geojson import Feature, FeatureCollection, Point
from tqdm import tqdm

load_dotenv()


with open("./0.thai-restaurants.json") as f:
    data = json.load(f)

all_features = []

for restaurant in tqdm(data["restaurants"]):
    point = None

    properties = {}

    if len(restaurant["restaurantTexts"]):
        properties["name"] = restaurant["restaurantTexts"][0]["name"]

    if restaurant["address"]:
        properties["address"] = restaurant["address"]

        country = restaurant.get("country", "")
        if country:
            properties["country"] = country

        r = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={
                "address": f'{restaurant["address"]}, {country}',
                "key": os.environ["GOOGLE_MAPS_API_KEY"],
            },
        )
        if len(r.json()["results"]):
            location = r.json()["results"][0]["geometry"]["location"]
            point = Point((location["lng"], location["lat"]))

    if restaurant["website"]:
        properties["website"] = restaurant["website"]
    if restaurant["tel"]:
        properties["tel"] = restaurant["tel"]

    feature = Feature(geometry=point, properties=properties)

    all_features.append(feature)

feature_collection = FeatureCollection(all_features)

with open("./2.thai-restaurants.geojson", "w") as f:
    f.write(json.dumps(feature_collection))

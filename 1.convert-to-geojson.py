import json
from pathlib import Path

from geojson import Feature, FeatureCollection, Point

with open("./0.thai-restaurants.json") as f:
    data = json.load(f)

all_features = []

for restaurant in data["restaurants"]:
    if restaurant["location"]["lat"] == 0:
        continue
    point = Point((restaurant["location"]["lng"], restaurant["location"]["lat"]))

    properties = {}
    if len(restaurant["restaurantTexts"]):
        properties["name"] = restaurant["restaurantTexts"][0]["name"]
    if restaurant["address"]:
        properties["address"] = restaurant["address"]
    if restaurant["website"]:
        properties["website"] = restaurant["website"]
    if restaurant["tel"]:
        properties["tel"] = restaurant["tel"]

    feature = Feature(geometry=point, properties=properties)

    all_features.append(feature)

feature_collection = FeatureCollection(all_features)

with open("./2.thai-restaurants.geojson", "w") as f:
    f.write(json.dumps(feature_collection))

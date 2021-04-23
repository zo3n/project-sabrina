import pathlib
import webbrowser
import json
import os

g_Files = []

# Extract Current Path
currentDir = pathlib.Path(__file__).parent.absolute()
indexPath = str(currentDir) + "/"

for x in os.listdir(indexPath + "/med/"):
    if os.path.isfile(indexPath + "/med/" + x):
        g_Files.append(x)

# Write to our JSON file
with open('media.json', 'w') as jsonFile:
    json.dump(g_Files, jsonFile)
    print("Stored client media files in media.json")

# Finally open the index.html file in browser
webbrowser.open('file://' + indexPath + "index.html")

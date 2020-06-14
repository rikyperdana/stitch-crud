# Atlas Stitch CRUD
This is a CRUD (Create, Read, Update, Delete) for Atlas Realm/Stitch connected MongoDB.

## Preparation
1. Create your Project, Cluster, Database, and Stitch App on MongoDB Atlas
2. Set rules for each of your collections to be connected, allow read and write
3. Confirm changes

## Start
```
git clone https://github.com/rikyperdana/stitch-crud myStitch
cd myStitch && python -m SimpleHTTPServer
```
Go to http://localhost:8000 OR head to [demo page](https://rikyperdana.github.io/stitch-crud/)

## How to Use
- Only for the first time, fill the form with your Stitch App ID and database name
- Click 'Get Collection' button and fill the database and collection name as target
- Use 'Refresh' button to reload the collection from source
- Use 'Add' to insert a new object into the collection
- Click a row to display the 'Update' and 'Delete' function
- Use Export button to get the csv of the loaded collection
- Use Import button to insert all the contents of the Exported csv

## Dependencies
- Atlas Stitch SDK
- Lodash
- Mithril
- Bulma CSS
- SiftJS
- Papa Parse

## Screenshots
![screenshot](https://user-images.githubusercontent.com/11875540/83006693-d0d01080-a03c-11ea-9f84-441a94d3e01c.png)


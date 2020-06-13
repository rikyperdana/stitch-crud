client = stitch.Stitch.initializeDefaultAppClient(localStorage.appId),
db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db(localStorage.dbName),
dbCall = (action, cb) =>
  client.auth.loginWithCredential(new stitch.AnonymousCredential())
  .then(() => action(db)).then(docs => cb(docs))

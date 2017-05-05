var db;
var databaseName = 'myDB';
var databaseVersion = 1;
var openRequest = window.indexedDB.open(databaseName, databaseVersion);
openRequest.onerror = function (event) {
    console.log(openRequest.errorCode);
};
openRequest.onsuccess = function (event) {
    // Database is open and initialized - we're good to proceed.
    db = openRequest.result;
    displayData();
};
openRequest.onupgradeneeded = function (event) {
    // This is either a newly created database, or a new version number
    // has been submitted to the open() call.
    var db = event.target.result;
    db.onerror = function () {
        console.log(db.errorCode);
    };

    // Create an object store and indexes. A key is a data value used to organize
    // and retrieve values in the object store. The keyPath option identifies where
    // the key is stored. If a key path is specified, the store can only contain
    // JavaScript objects, and each object stored must have a property with the
    // same name as the key path (unless the autoIncrement option is true).
    var store = db.createObjectStore('customers', { keyPath: 'customerId' });

    // Define the indexes we want to use. Objects we add to the store don't need
    // to contain these properties, but they will only appear in the specified
    // index of they do.
    //
    // syntax: store.createIndex(indexName, keyPath[, parameters]);
    //
    // All these values could have duplicates, so set unique to false
    store.createIndex('firstName', 'firstName', { unique: false });
    store.createIndex('lastName', 'lastName', { unique: false });
    store.createIndex('street', 'street', { unique: false });
    store.createIndex('city', 'city', { unique: false });
    store.createIndex('zipCode', 'zipCode', { unique: false });
    store.createIndex('country', 'country', { unique: false });

    // Once the store is created, populate it
    store.transaction.oncomplete = function (event) {
        // The transaction method takes an array of the names of object stores
        // and indexes that will be in the scope of the transaction (or a single
        // string to access a single object store). The transaction will be
        // read-only unless the optional 'readwrite' parameter is specified.
        // It returns a transaction object, which provides an objectStore method
        // to access one of the object stores that are in the scope of this
        //transaction.
        var customerStore = db.transaction('customers', 'readwrite').objectStore('customers');
        customers.forEach(function (customer) {
            customerStore.add(customer);
        });
    };
};

function displayData() {
}
const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore();

module.exports = function () {
    return new Promise(async (resolve, reject) => {
        try {
            var data = {};

            var docRef = firestore.collection('rank').doc('main');

            var doc = await docRef.get();

            if (doc.exists) {
                data = doc.data();   
            }
            
            resolve(data);
        } catch (err) {
            reject(err);
        }
    })
}

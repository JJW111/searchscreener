const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore();


module.exports = function () {
    return new Promise(async (resolve, reject) => {
        try {
            var category = null;

            var docRef = firestore.collection('category').doc('all');

            var doc = await docRef.get();

            if (doc.exists) {
                category = doc.data();   
            } else {
                category = {};
            }
            
            resolve(category);
        } catch (err) {
            reject(err);
        }
    })
}


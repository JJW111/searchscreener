const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore();


function update(docData, ticker) {
    return Promise((resolve, reject) => {
        try {

            firestore.collection('view').doc(ticker).set(, { merge: true });
            resolve();
        } catch (err) {
            reject(err);
        }
    })
}


module.exports = {
    update
}
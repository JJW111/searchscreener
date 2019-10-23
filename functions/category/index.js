'use strict'

const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore();

const company = require('./service/category-service');


exports.update = async (file, context, callback) => {
    const match = file.name.match(/^.*[\\\/]/);
    const path = match && match[0];
    const fileName = file.name.replace(/^.*[\\\/]/, '');

    var docData = {};

    switch (path) {
        case `category/`:
            /* category */
            try {
                docData[`${fileName}`] = await company.get(file.name);
                console.log(docData);
            } catch (err) {
                console.error(`Company 업데이트 실패! ${err}`);
            }

            break;
        default:
            break;
    }

    if (docData && docData[`${fileName}`] && docData[`${fileName}`].length > 0 ) {
        /* Firestore 에 쓰기 작업 */
        try {
            firestore.collection('category').doc(`all`).set(docData, { merge: true });
        } catch (err) {
            console.error(`category firestore 업데이트 에러! `, err);
        }
    }

    callback();
};

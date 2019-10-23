'use strict'

const { valueOrNull } = require('../lib/validate');

const storage = require('./util/storage');

function get(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            var docData = {};
            docData.financial = {};
            docData.balancesheet = {};
            docData.worth = {};
            docData.margins = {};
            docData.cashflow = {};
            docData.her = {};
            docData.growth = {};
            docData.trend = {};
            docData.fownership = {};
            docData.ownership = {};

            var data = await storage.file(fileName).download();
            var d = null;
            if (typeof data[0] !== 'string') {
                d = data[0].toString();
            } else {
                d = data;
            }

            var json = JSON.parse(d);

            if (json.defaultKeyStatistics) {
                docData.financial['forwardPE'] = valueOrNull(json.defaultKeyStatistics.forwardPE ? json.defaultKeyStatistics.forwardPE.raw : null);
                docData.financial['eps'] = valueOrNull(json.defaultKeyStatistics.trailingEps ? json.defaultKeyStatistics.trailingEps.raw : null);
                docData.financial['forwardEPS'] = valueOrNull(json.defaultKeyStatistics.forwardEps ? json.defaultKeyStatistics.forwardEps.raw : null);
                docData.financial['peg'] = valueOrNull(json.defaultKeyStatistics.pegRatio ? json.defaultKeyStatistics.pegRatio.raw : null);

                docData.worth['evr'] = valueOrNull(json.defaultKeyStatistics.enterpriseToRevenue ? json.defaultKeyStatistics.enterpriseToRevenue.raw : null);
                docData.worth['evebit'] = valueOrNull(json.defaultKeyStatistics.enterpriseToEbitda ? json.defaultKeyStatistics.enterpriseToEbitda.raw : null);
            }

            if (json.financialData) {
                docData.financial['rating'] = valueOrNull(json.financialData.recommendationKey);

                docData.balancesheet['grossP'] = valueOrNull(json.financialData.grossProfits ? json.financialData.grossProfits.raw : null);
                docData.balancesheet['ebitda'] = valueOrNull(json.financialData.ebitda ? json.financialData.ebitda.raw : null);
                docData.balancesheet['totalCash'] = valueOrNull(json.financialData.totalCash ? json.financialData.totalCash.raw : null);
                docData.balancesheet['totalDebt'] = valueOrNull(json.financialData.totalDebt ? json.financialData.totalDebt.raw : null);
                docData.balancesheet['totalRevenue'] = valueOrNull(json.financialData.totalRevenue ? json.financialData.totalRevenue.raw : null);

                docData.worth['roa'] = valueOrNull(json.financialData.returnOnAssets ? json.financialData.returnOnAssets.raw : null);
                if (docData.worth['roa']) {
                    docData.worth['roa'] = docData.worth['roa'] * 100;
                }
                
                docData.worth['roe'] = valueOrNull(json.financialData.returnOnEquity ? json.financialData.returnOnEquity.raw : null);
                if (docData.worth['roe']) {
                    docData.worth['roe'] = docData.worth['roe'] * 100;
                }

                docData.worth['dte'] = valueOrNull(json.financialData.debtToEquity ? json.financialData.debtToEquity.raw : null);
                docData.worth['rps'] = valueOrNull(json.financialData.revenuePerShare ? json.financialData.revenuePerShare.raw : null);
                docData.worth['totalCPS'] = valueOrNull(json.financialData.totalCashPerShare ? json.financialData.totalCashPerShare.raw : null);

                docData.margins['ebitdaM'] = valueOrNull(json.financialData.ebitdaMargins ? json.financialData.ebitdaMargins.raw * 100 : null);
                docData.margins['profitM'] = valueOrNull(json.financialData.profitMargins ? json.financialData.profitMargins.raw * 100 : null);
                docData.margins['grossM'] = valueOrNull(json.financialData.grossMargins ? json.financialData.grossMargins.raw * 100 : null);
                docData.margins['operatingM'] = valueOrNull(json.financialData.operatingMargins ? json.financialData.operatingMargins.raw * 100 : null);

                docData.cashflow['ocashflow'] = valueOrNull(json.financialData.operatingCashflow ? json.financialData.operatingCashflow.raw : null);
                docData.cashflow['fcashflow'] = valueOrNull(json.financialData.freeCashflow ? json.financialData.freeCashflow.raw : null);
            }

            if (json.summaryDetail) {
                docData.financial['payoutRatio'] = valueOrNull(json.summaryDetail.payoutRatio ? json.summaryDetail.payoutRatio.raw : null);
            }

            if (json.earnings && json.earnings.financialsChart) {
                var financialsChart = json.earnings.financialsChart;

                if (financialsChart.yearly) {
                    var yearly = financialsChart.yearly;

                    if (yearly[3]) {
                        docData.her['revenue_0y'] = valueOrNull(yearly[3].revenue ? yearly[3].revenue.raw : null);
                        docData.her['earnings_0y'] = valueOrNull(yearly[3].earnings ? yearly[3].earnings.raw : null);
                        docData.her['date_0y'] = valueOrNull(yearly[3].date || null);
                    }

                    if (yearly[2]) {
                        docData.her['revenue_1y'] = valueOrNull(yearly[2].revenue ? yearly[2].revenue.raw : null);
                        docData.her['earnings_1y'] = valueOrNull(yearly[2].earnings ? yearly[2].earnings.raw : null);
                        docData.her['date_1y'] = valueOrNull(yearly[2].date || null);
                    }

                    if (yearly[1]) {
                        docData.her['revenue_2y'] = valueOrNull(yearly[1].revenue ? yearly[1].revenue.raw : null);
                        docData.her['earnings_2y'] = valueOrNull(yearly[1].earnings ? yearly[1].earnings.raw : null);
                        docData.her['date_2y'] = valueOrNull(yearly[1].date || null);
                    }

                    if (yearly[0]) {
                        docData.her['revenue_3y'] = valueOrNull(yearly[0].revenue ? yearly[0].revenue.raw : null);
                        docData.her['earnings_3y'] = valueOrNull(yearly[0].earnings ? yearly[0].earnings.raw : null);
                        docData.her['date_3y'] = valueOrNull(yearly[0].date || null);
                    }
                }

                if (financialsChart.quarterly) {
                    var quarterly = financialsChart.quarterly;

                    if (quarterly[3]) {
                        docData.her['revenue_0q'] = valueOrNull(quarterly[3].revenue ? quarterly[3].revenue.raw : null);
                        docData.her['earnings_0q'] = valueOrNull(quarterly[3].earnings ? quarterly[3].earnings.raw : null);
                        docData.her['date_0q'] = valueOrNull(quarterly[3].date || null);
                    }

                    if (quarterly[2]) {
                        docData.her['revenue_1q'] = valueOrNull(quarterly[2].revenue ? quarterly[2].revenue.raw : null);
                        docData.her['earnings_1q'] = valueOrNull(quarterly[2].earnings ? quarterly[2].earnings.raw : null);
                        docData.her['date_1q'] = valueOrNull(quarterly[2].date || null);
                    }

                    if (quarterly[1]) {
                        docData.her['revenue_2q'] = valueOrNull(quarterly[1].revenue ? quarterly[1].revenue.raw : null);
                        docData.her['earnings_2q'] = valueOrNull(quarterly[1].earnings ? quarterly[1].earnings.raw : null);
                        docData.her['date_2q'] = valueOrNull(quarterly[1].date || null);
                    }

                    if (quarterly[0]) {
                        docData.her['revenue_3q'] = valueOrNull(quarterly[0].revenue ? quarterly[0].revenue.raw : null);
                        docData.her['earnings_3q'] = valueOrNull(quarterly[0].earnings ? quarterly[0].earnings.raw : null);
                        docData.her['date_3q'] = valueOrNull(quarterly[0].date || null);
                    }
                }
            }

            /* Earnings & Revenue Growth */
            if (docData.her['earnings_0y'] && docData.her['earnings_1y']) {
                docData.growth['eg_0y'] = ((docData.her['earnings_0y'] - docData.her['earnings_1y']) / docData.her['earnings_1y'] * 100).toFixed(2);
            }

            if (docData.her['earnings_1y'] && docData.her['earnings_2y']) {
                docData.growth['eg_1y'] = ((docData.her['earnings_1y'] - docData.her['earnings_2y']) / docData.her['earnings_2y'] * 100).toFixed(2);
            }

            if (docData.her['earnings_2y'] && docData.her['earnings_3y']) {
                docData.growth['eg_2y'] = ((docData.her['earnings_2y'] - docData.her['earnings_3y']) / docData.her['earnings_3y'] * 100).toFixed(2);
            }

            if (docData.her['earnings_0q'] && docData.her['earnings_1q']) {
                docData.growth['eg_0q'] = ((docData.her['earnings_0q'] - docData.her['earnings_1q']) / docData.her['earnings_1q'] * 100).toFixed(2);
            }

            if (docData.her['earnings_1q'] && docData.her['earnings_2q']) {
                docData.growth['eg_1q'] = ((docData.her['earnings_1q'] - docData.her['earnings_2q']) / docData.her['earnings_2q'] * 100).toFixed(2);
            }

            if (docData.her['earnings_2q'] && docData.her['earnings_3q']) {
                docData.growth['eg_2q'] = ((docData.her['earnings_2q'] - docData.her['earnings_3q']) / docData.her['earnings_3q'] * 100).toFixed(2);
            }

            if (docData.her['revenue_0y'] && docData.her['revenue_1y']) {
                docData.growth['rg_0y'] = ((docData.her['revenue_0y'] - docData.her['revenue_1y']) / docData.her['revenue_1y'] * 100).toFixed(2);
            }

            if (docData.her['revenue_1y'] && docData.her['revenue_2y']) {
                docData.growth['rg_1y'] = ((docData.her['revenue_1y'] - docData.her['revenue_2y']) / docData.her['revenue_2y'] * 100).toFixed(2);
            }

            if (docData.her['revenue_2y'] && docData.her['revenue_3y']) {
                docData.growth['rg_2y'] = ((docData.her['revenue_2y'] - docData.her['revenue_3y']) / docData.her['revenue_3y'] * 100).toFixed(2);
            }

            if (docData.her['revenue_0q'] && docData.her['revenue_1q']) {
                docData.growth['rg_0q'] = ((docData.her['revenue_0q'] - docData.her['revenue_1q']) / docData.her['revenue_1q'] * 100).toFixed(2);
            }

            if (docData.her['revenue_1q'] && docData.her['revenue_2q']) {
                docData.growth['rg_1q'] = ((docData.her['revenue_1q'] - docData.her['revenue_2q']) / docData.her['revenue_2q'] * 100).toFixed(2);
            }

            if (docData.her['revenue_2q'] && docData.her['revenue_3q']) {
                docData.growth['rg_2q'] = ((docData.her['revenue_2q'] - docData.her['revenue_3q']) / docData.her['revenue_3q'] * 100).toFixed(2);
            }

            if (json.fundOwnership) {
                var fownership = json.fundOwnership.ownershipList;

                if (fownership && fownership.length > 0) {

                    for (var i = 0; i < 10; i++) {
                        var v = fownership[i];
                        if (!v) break;
                        docData.fownership['forgan' + i] = valueOrNull(v.organization);
                        docData.fownership['fpctHeld' + i] = valueOrNull(v.pctHeld ? (+v.pctHeld.raw * 100).toFixed(2) : null);
                    }

                }
            }

            if (json.institutionOwnership) {

                var ownership = json.institutionOwnership.ownershipList;

                if (ownership && ownership.length > 0) {

                    for (var i = 0; i < 10; i++) {
                        var v = ownership[i];
                        if (!v) break;
                        docData.ownership['organ' + i] = valueOrNull(v.organization);
                        docData.ownership['pctHeld' + i] = valueOrNull(v.pctHeld ? (+v.pctHeld.raw * 100).toFixed(2) : null);
                    }

                }

            }

            resolve(docData);
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    get
}
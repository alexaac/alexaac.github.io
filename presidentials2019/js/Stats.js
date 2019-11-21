import * as Config from './Config.js'

export const groupvotesByCounties = (data) => {

    let resultByCounty = [];
    data.reduce( (res, data_row) => {
        const columns = ['c', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13', 'g14'];

        if (!res[data_row['Cod birou electoral']]) {
            res[data_row['Cod birou electoral']] = {
               'Cod birou electoral': data_row['Cod birou electoral'],
               'Județ': data_row['Județ']
            };
            columns.forEach( col => {
                res[data_row['Cod birou electoral']][col] = 0;               
            });
            res[data_row['Cod birou electoral']]

            resultByCounty.push(res[data_row['Cod birou electoral']]);
        };
        columns.forEach( col => {
            res[data_row['Cod birou electoral']][col] += Number(data_row[col]);
        });

        return res;
    }, {});

    return resultByCounty;
}

export const groupVotesByCandidates = (resultByCounty) => {

    const resultByCandidates = [];
    const columns = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13', 'g14'];
    columns.forEach( col => {
        const result = resultByCounty.reduce( (res, data_row) => {
            if (!res[data_row[col]]) {
                res[data_row['Județ']] = data_row[col];
            };

            return res;
        }, {});

        const keys = Object.keys(result);
        const votes = keys.map( v =>  result[v] );
        const total = votes.reduce((a, b) => a + b, 0);
        result.total = total;

        resultByCandidates[Config.CANDIDATES_2019[col]] = result;
    });

    let keys = Object.keys(resultByCandidates);

    let totCountry = 0;
    keys.forEach( k => totCountry += resultByCandidates[k].total );
    keys.forEach( k => {
        resultByCandidates[k].totalCountry = totCountry;
        resultByCandidates[k].rateCountry = ((resultByCandidates[k].total/totCountry) * 100).toFixed(3);
    });

    return resultByCandidates;
};

export const setVotesByCodeGroup = (data, an) => {
    let votesByCode = d3.map();
    data.forEach( d => {
        let fieldMap = Config.fieldMap(d);
        votesByCode.set(fieldMap['Cod birou electoral'][an], {
            'totValidVotes': fieldMap.totValidVotes[an],
            'vote1': fieldMap.vote1[an],
            'candidate1': fieldMap.candidate1[an],
            'vote2': fieldMap.vote2[an],
            'candidate2': fieldMap.candidate2[an],
            'electoralDistrict': fieldMap.electoralDistrict[an],
            'rate1': fieldMap.rate1[an],
            'rate1Color': fieldMap.rate1Color[an],
            'rate2': fieldMap.rate2[an],
            'rate2Color': fieldMap.rate2Color[an],
        });
    });

    return votesByCode;
}
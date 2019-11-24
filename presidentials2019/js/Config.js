import * as Utils from './Utils.js'

export const COL_LEGEND = {
    'a': 'Numărul total al alegătorilor prevăzut în lista electorală permanentă existentă în secția de votare',
    'b': 'Numărul total al alegătorilor care s-au prezentat la urne',
    'b1': 'Numărul total al alegătorilor care s-au prezentat la urne, înscriși în lista electorală permanentă',
    'b2': 'Numărul total al alegătorilor care s-au prezentat la urne și nu sunt cuprinși în lista electorală permanentă, înscriși în lista electorală suplimentară',
    'b3': 'Numărul total al alegătorilor care au votat utilizând urna specială, înscriși în extrasul din listele electorale',
    'c': 'Numărul total al voturilor valabil exprimate',
    'd': 'Numărul voturilor nule',
    'e': 'Numărul buletinelor de vot primite',
    'f': 'Numărul buletinelor de vot neîntrebuințate și anulate'
};

export const CANDIDATES_2019 = {
    'g1': 'KLAUS-WERNER IOHANNIS',
    'g2': 'THEODOR PALEOLOGU',
    'g3': 'ILIE-DAN BARNA',
    'g4': 'HUNOR KELEMEN',
    'g5': 'VASILICA-VIORICA DĂNCILĂ',
    'g6': 'CĂTĂLIN-SORIN IVAN',
    'g7': 'NINEL PEIA',
    'g8': 'SEBASTIAN-CONSTANTIN POPESCU',
    'g9': 'JOHN-ION BANU',
    'g10': 'MIRCEA DIACONU',
    'g11': 'BOGDAN-DRAGOS-AURELIU MARIAN-STANOEVICI',
    'g12': 'RAMONA-IOANA BRUYNSEELS',
    'g13': 'VIOREL CATARAMĂ',
    'g14': 'ALEXANDRU CUMPĂNAŞU' 
};

export const CANDIDATES_2014 = {};

export const LAYERLIST = [
    'counties_wgs84', 
    'counties_cart_wgs84', 
    'counties_cart_hex_10000_wgs84',
    'counties_cart_hex_10000d_wgs84'
];

export const width = 620,
    height = 660;

export const viewport_width = 680,
    viewport_height = 660;

export const colorScaleRed = d3.scaleThreshold()
    .domain( [0, 10, 20, 30, 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100 ] )
    .range(d3.schemeReds[9]);

export const colorScaleBlue = d3.scaleThreshold()
    .domain( [0, 10, 20, 30, 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100 ] )
    .range(d3.schemeBlues[9]);

export const projection = d3.geoAlbers()
    .center([24.7731, 45.7909])
    .rotate([-14, 3.3, -10])
    .parallels([37, 54])
    .scale(5000);

export const path = d3.geoPath()
    .projection(projection);

export const fieldMap = (d) => {

    return {
        code: {
            '2014': d['Cod Birou Electoral'],
            '2019-11-10': d['Cod birou electoral'],
            '2019-11-24': d['Cod birou electoral'],
        },
        totValidVotes: {
            '2014': d['Numărul total al voturilor valabil exprimate'],
            '2019-11-10': d['c'],
            '2019-11-24': d['c'],
        },
        vote1: {
            '2014': d['VICTOR-VIOREL PONTA'],
            '2019-11-10': d['g5'],
            '2019-11-24': d['g5'],
        },
        candidate1: {
            '2014': CANDIDATES_2014['g5'],
            '2019-11-10': CANDIDATES_2019['g5'],
            '2019-11-24': CANDIDATES_2019['g5'],
        },
        vote2: {
            '2014': d['KLAUS-WERNER IOHANNIS'],
            '2019-11-10': d['g1'],
            '2019-11-24': d['g1'],
        },
        candidate2: {
            '2014': CANDIDATES_2014['g1'],
            '2019-11-10': CANDIDATES_2019['g1'],
            '2019-11-24': CANDIDATES_2019['g1'],
        },
        electoralDistrict: {
            '2014': d['Nume Judet'],
            '2019-11-10': d['Județ'],
            '2019-11-24': d['Județ'],
        },
        rate1: {
            '2014': d['VICTOR-VIOREL PONTA'] / d['Numărul total al voturilor valabil exprimate'] * 100,
            '2019-11-10': d.g5 / d.c * 100,
            '2019-11-24': d.g5 / d.c * 100,
        },
        rate1Color: {
            '2014': Utils.roundToNearestMultipleOf(5)(d['VICTOR-VIOREL PONTA'] / d['Numărul total al voturilor valabil exprimate'] * 100),
            '2019-11-10': Utils.roundToNearestMultipleOf(5)(d.g5 / d.c * 100),
            '2019-11-24': Utils.roundToNearestMultipleOf(5)(d.g5 / d.c * 100),
        },
        rate2: {
            '2014': d['KLAUS-WERNER IOHANNIS'] / d['Numărul total al voturilor valabil exprimate'] * 100,
            '2019-11-10': d.g1 / d.c * 100,
            '2019-11-24': d.g1 / d.c * 100,
        },
        rate2Color: {
            '2014': Utils.roundToNearestMultipleOf(5)(d['KLAUS-WERNER IOHANNIS'] / d['Numărul total al voturilor valabil exprimate'] * 100),
            '2019-11-10': Utils.roundToNearestMultipleOf(5)(d.g1 / d.c * 100),
            '2019-11-24': Utils.roundToNearestMultipleOf(5)(d.g1 / d.c * 100),
        }
    }
}
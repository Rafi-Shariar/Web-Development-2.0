interface Developer <T,B=null> {
    name : string;
    salary : number;
    device : {
        brand : string;
        model : string;
        year : number;
    };
    smartwatch: T;
    Bike?: B;
}

interface cheapWatch {
    heartRate : string;
    stopWatch : boolean;
}
const poorDeveloper : Developer <cheapWatch> = {
    name: 'Mr.poor',
    salary : 20000,
    device : {
        brand : 'lenovo',
        model : 'A123',
        year : 2007
    },

    smartwatch : {
        heartRate : '160/23',
        stopWatch : true
    }
}

interface premiumWatch {
    heartRate : string;
    calling : boolean;
    AI_feature : boolean;
}
const richDeveloper : Developer <premiumWatch> = {
    name: 'Mr.Rich',
    salary : 200000,
    device : {
        brand : 'Mac',
        model : 'M5',
        year : 2025
    },

    smartwatch : {
        heartRate : '140/83',
        calling : true,
        AI_feature : true

    },

}
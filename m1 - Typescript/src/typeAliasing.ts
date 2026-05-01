type UserType = {               // type aliasing

    id : number,
    name : {
        firstName : string;
        lastName : string;
    },
    gender : 'male' | 'female';
    contactNo : string;
    address : {
        division : string;
        city: string;
    }

}
//--------------------
let user1 : UserType = {

    id : 12323,
    name : {
        firstName : 'Rafi',
        lastName : 'Shariar'
    },
    gender : 'male',
    contactNo : '012334534',
    address : {
        division : 'khulna',
        city : 'khulna'
    }

}

let user2 : UserType = {

    id : 122223,
    name : {
        firstName : 'Mashfia',
        lastName : 'Shariar'
    },
    gender : 'female',
    contactNo : '012334534',
    address : {
        division : 'khulna',
        city : 'khulna'
    }

}

// --- type aliasing for function
type AddFunction = (num1:number, num2:number) => number
const add : AddFunction = (num1, num2) => num1 + num2;
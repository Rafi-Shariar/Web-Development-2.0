//------- Array ----------
let bazarList : string[] = ['eggs', 'milk', 'apple']

let mixedArray : (string | number)[] = ['Rafi', 123]

//--------- tupple --------
let cordinates : [number, number] = [20,30]
let couple : [string, number] = ['Rafi', 1054]
let destination : [string, string, number] = ['Dhaka', 'Khulna', 3]


//--------- Object -----------------

const user : {
    organization: "Programming Hero"; // value will work as a type : its called Literal Type
    readonly ID : number, // can't mutate. works as literal type
    firstName: string;
    middleName? : string; // optional type : property ta thakteo pare, nao pare
    lastName : string
    age: number;
    married: boolean;
} = {
    organization : "Programming Hero",
    ID : 1231234,
    firstName : 'Rafi',
    lastName : 'Shariar',
    age : 12,
    married: true
}

//-------- Function -----------

function add ( num1:number, num2:number) : number {
    return num1 + num2;
}

const add2 = (num1:number, num2:number) : number => num1 = num2;

// function in object
const poorUser = {
    name: "mezba",
    balance : 0,
    addbalance( money : number) : number{
       const newBalance =  this.balance + money
       return newBalance
    }
}

// funtion in loop
const arr : number[] = [1,2,4];
const sqrArr = arr.map((elem : number) : number => elem * elem)
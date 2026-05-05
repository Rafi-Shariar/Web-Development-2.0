interface User { // interface
    name : string;
    age : number;
}

const user1 : User = {
    name: "Rafi Shariar",
    age: 12
}

type Role = { // type aliasing
    role : "admin" | "user";
};

// intersection of interface & role
interface UserWithRole extends Role, User {
    role: 'admin' | 'user';
}

const user2 : UserWithRole = {
    name : 'Zubai Halim',
    age : 43,
    role : "admin"   
}


// ------ For Array
interface IFriends {
    [index: number] : string
}
const friends : IFriends = ['Rafi', 'Shakib', 'Qub'];



//------------- for function
interface IAdd {
    (num1 : number, num2: number) : number
}
const add : IAdd = (num1 : number, num2: number) => {
    return num1 + num2;
}
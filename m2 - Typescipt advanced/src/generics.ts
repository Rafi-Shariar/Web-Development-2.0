
type GenericArray<T> = Array<T>

const friends : GenericArray<string> = ['Rafi', 'Shariar', 'Qunb'];

const rollNumbers : GenericArray<number> = [4,5,6];

const isEligibleList : GenericArray<boolean> = [true, false, false]

//------ Example 2 -------

type Cordinates<X,Y> = [X,Y];
const coordinate1 : Cordinates<number,number> = [1,4]
const cordinate2 : Cordinates<string,string> = ['3', '4']

// --- For Objects ------
type User = {
    name : string;
    age : number
}
const userList : GenericArray<User> = [
    { name: 'Rafi ', age: 12},
    { name : 'Shariar', age : 45}
]
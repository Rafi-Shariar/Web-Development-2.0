

const createArrayWithGeneric = <T>(value: T) => [value] // Generic Function

// const createArrayWithString = (value : string) => [value];
// const createArrayWithNumber = (value : number) => [value];
// const createArrayWithObject = (value : { id : number; name:string}) => [value];

const arrString = createArrayWithGeneric('Apple')
const arrObject = createArrayWithGeneric({id:123, name:'Rafi'});


//For tupple
const createArrayTuppleWithGeneric = <X,Y>(param1 : X, param2: Y) => [param1,param2];
const res1 = createArrayTuppleWithGeneric('Rafi', true);
// console.log(res1);


//Example
const addStudentToCourse =<T> (studentInfo : T) => {
    return {
        course : 'Next Level',
        ...studentInfo
    }
}
const student1 = {
    id: 123,
    name: 'Mezba',
    haspen : true
}

const student2 = {
    id: 432,
    name : 'Mahbub',
    hascar : true,
    married : true
}

const s1 = addStudentToCourse(student1)
const s2 = addStudentToCourse(student2)

console.log(s1,s2);

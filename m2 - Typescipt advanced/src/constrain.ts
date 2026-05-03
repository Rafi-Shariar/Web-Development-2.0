//contains => stricly rules dewa. mane ai info gula lagbei r baki ja thakar thakuk

type ConstrainInfo = {id:number, name:string}
const addStudentToCourse = < T extends ConstrainInfo > (studentInfo : T) => {   // constrain dewa j ID & Name thaktei hobe
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
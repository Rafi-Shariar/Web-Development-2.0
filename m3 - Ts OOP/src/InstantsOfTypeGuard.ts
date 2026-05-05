//instanceOf use er fole amra Class er upor depend kore property er access pai.

class Person {
    name : string;

    constructor(name: string){
        this.name = name;
    }

    getSleep(hours : number){
        console.log(`${this.name} sleeps for ${hours}`);
        
    }
}

class Student extends Person{
    constructor(name: string){
        super(name);
    }

    doStudy(hours : number){
        console.log(`${this.name} studies for ${hours}`);
        
    }
}

class Teacher extends Person{
    constructor(name: string){
        super(name);
    }

    takeClass(hours : number){
        console.log(`${this.name} takes class for ${hours}`);
        
    }
}

const student1 = new Student('Rafi')
const teacher1 = new Teacher('Shariar')

//Function gaurd
const isStudent = (user : Person) =>{
    return user instanceof Student; // return 1
}
const isTeacher = (user : Person) =>{
    return user instanceof Teacher; // return 1
}

const getUserInfo = (user : Person) =>{
    if(isStudent(user)){
        user.doStudy(5);
    }
    else if(isTeacher(user)){
        user.takeClass(6);
    }

}




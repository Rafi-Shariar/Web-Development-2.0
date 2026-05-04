class Parent {
    name: string;
    age: number;
    address: string;

    constructor(name:string, age:number, address:string){
        this.name = name;
        this.age = age;
        this.address = address;
    }

    getSleep(numOfHours : number){
        console.log(`${this.name} needs ${numOfHours} sleep`);
    }
}


class Student extends Parent { }


class Teacher extends Parent {
    
    designation : string;

    constructor(name:string, age:number, address:string, designation : string){
        super(name,age,address)
        this.designation = designation
    }

    takeClass(numOfHours : number){
        console.log(`${this.name} takes class for ${numOfHours} hours`);
        
    }

}

const student1 = new Student('Rafi', 12, 'mirpur-1, Dhaka')
student1.getSleep(6)

const teacher1 = new Teacher('Abidul', 34, 'khulna, Bangladesh', 'Lecturer')

const add = (num1:number | string, num2:number | string) =>{
    if(typeof(num1) === 'number' && typeof(num2) === 'number') return num1 + num2;
    else{
        return num1.toString() + num2.toString();
    }
}

//in gaurd
type NormalUser = {
    name : string;
}

type AdminUser = {
    name : string;
    role : 'admin';
}

const getUserInfo = (user: NormalUser | AdminUser) =>{

    if('role' in user){
            console.log(`Name : ${user.name} & Role is : ${user.role}`);
    }
    else{
         console.log(`Name : ${user.name}`);
    }
    
}
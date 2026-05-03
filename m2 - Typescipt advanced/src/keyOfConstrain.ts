// keyof : type operator

type RichPeoplesVehicle = {
    car : string;
    bike : string;
    CNG : string;
};

type myVehicle = 'bike' | 'car' | 'CNG';
type myVehicle2 = keyof RichPeoplesVehicle; // key of operator

const myVehicleIs : myVehicle2 = 'bike';


//---------- Key of Constrain ----------

type UserType = {
    id : number;
    name : string;
    address : {
        city : string;
    }
}
const user = {
    id : 222,
    name : 'Mezba',
    address : {
        city : 'khl'
    }
}

const getPropertyFromObject = (obj : UserType, key: keyof UserType) => { // keyof Constain
    return obj[key]
}

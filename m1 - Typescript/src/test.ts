type UserResponse = {
    info? : {
        address? : {
            zipcode?: string;
        }
    }
}

const getZipCode = ( res : UserResponse) : string => {
    const zipCode : string = res?.info?.address?.zipcode ?? '00000';
    return zipCode

}

const user : UserResponse = {
    info : {
        address : {
           
        }
    }
}

const ans = getZipCode(user)
console.log(ans);

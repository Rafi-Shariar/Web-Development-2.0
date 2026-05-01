let userName : string = "Rafi Shariar"; 
let userID : number = 123; 
let isAdmin : boolean = false;

let x; 


// ---- Nullable type ----
 const getUser = ( input:string | null) => {
    if(input) return `user is ${input}`
    else return 'no user'
 }

 getUser(null)


 // --- unknown ---
 const discountCalculator = (input : unknown) => {

    if(typeof(input) === 'number') return 'give discount'
    else if (typeof(input) === 'string'){
        const splittedInput = input.split(' ');
        const discountAmount = Number(splittedInput[0]);
    }
    else{
        return 'wrong input'
    }

 }

 discountCalculator(100);
 discountCalculator('100 tk');
 discountCalculator(null);

 // --- Never ---
 const throwError = (msg : string) : never => { // aita never, cause aita konodin konokisu return kore na
    throw new Error(msg);
 }
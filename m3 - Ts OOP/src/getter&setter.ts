// jodi extend er moddhe private property access kora lage thle protected use korbo
class BankAccount {
    readonly userID : number;
    userName : string;
    protected balance : number;

    constructor(userID : number, userName : string, balance : number){
        this.userID = userID;
        this.userName = userName;
        this.balance = balance;
    }
    
    //Getter
    get getBalance(){
        return this.balance;
    }

    //Setter
    set addBalance(newbalance : number){
        this.balance = this.balance + newbalance;
    }

}

class StudentAccount extends BankAccount{}


const user = new BankAccount(23423, 'Rafi', 100000);
user.addBalance = 99;

console.log(user);


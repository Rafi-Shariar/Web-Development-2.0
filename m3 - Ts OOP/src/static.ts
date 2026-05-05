class Counter {
    static count : number = 0;

    increment(){
        return Counter.count +=1
    }

    decrement(){
        return Counter.count -= 1;
    }
}

const insta = new Counter() // ekta memory
console.log(insta.increment()); //output: 1

const insta2 = new Counter() //
console.log( insta2.increment()); // output : 2
 
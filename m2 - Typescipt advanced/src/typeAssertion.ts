
const kgToGMConverter = (input : string | number) : string | number | undefined => {
    if( typeof input === "number" ) return input*1000;
    else if ( typeof input === 'string'){
        const [value] = input.split(' ');
        return `Converted output is : ${Number(value)*1000}`;
    }
}

const result1 = kgToGMConverter(2) as number; // type assertion
console.log(result1);
const result2 = kgToGMConverter("2 kg") as string; // type assertion
console.log(result2);

 
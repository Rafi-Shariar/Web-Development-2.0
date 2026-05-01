// ? : ternary Operator : decison making
// ?? : nullish coalescing Operator : only works with null/endifiend
// ?. : optional Chainig

const userAge = 21
const Eligibility = ( age:number) => {
    const result = age >= 21 ? 'eligible' : 'not eligible';     //tarnary
    console.log(result);
}


const userTheme = undefined;
const selectedTheme = userAge ?? 'Light Theme';     //nullish coalescing



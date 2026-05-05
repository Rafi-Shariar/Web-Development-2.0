const Colors = { Primary: 'RED', Secondary:'BLUE'} as const;

type ValidColor = typeof Colors[keyof typeof Colors];

const setColor = (input : ValidColor) : string =>{
    return `${input}`
}

console.log(setColor('BLUE'));

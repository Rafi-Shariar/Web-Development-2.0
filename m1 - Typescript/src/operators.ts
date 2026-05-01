//--------spread operator-------------------
const friends = ['Rafi', 'Shariar'];
const schoolFriends = ['Atif', 'Tamim'];
const collegeFriends = ['Mugdho', 'Pritom'];

const newFriends = [...friends, ...schoolFriends,...collegeFriends];

const user = {
    name : 'Rafi shariar',
    phoneNo : '0161723423'
}

const otherInfo = {
    hobby: 'outting',
    favouriteColor: 'Black'
}

const userINFO = {
    ...user,
    ...otherInfo,
}

// ----------- Rest Operator ( ekshathe kore array banay fela )----------------
const sendInvite = ( ...friends : string[] ) => {
  
    friends.forEach((friend : string) => {
        console.log(`invitation send to ${friend}`);
    })
}

//----------Destructuring----------------
const user2 = {
    id: 123,
    name : {
        firstName : 'Rafi',
        lastName : 'Shariar'
    },
    gender : 'male'
}

const {id} = user2;
const { lastName : myLastName } = user2.name;
const {gender, name : {firstName : myFristName}} = user2;
// console.log(id,myFristName,myLastName);


const friend4 = ['Karim', 'Rohim', 'Jamil'];
const [, ,bestFriend] = friend4;
// console.log(bestFriend);
 

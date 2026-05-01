// union
type UserRole = 'Admin' | 'User' | 'Guest';

const getDashboard = ( role : UserRole) => {

    if( role === 'Admin') return 'Admin Dashboard'
    else if( role === 'User') return 'User Dashboard'
    else if( role === 'Guest') return 'Guest Dashboard'

}

// intersaction
type Employee = { id : string; name : string };
type Manager = { designation : string, teamSize: number};
type EmployeeManager = Employee & Manager // intersection

const RafiShariar : EmployeeManager = {
    id : 'As134',
    name : 'Rafi shariar',
    designation : 'GM',
    teamSize : 12
}
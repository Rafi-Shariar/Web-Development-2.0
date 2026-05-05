// set of fixed string ek jagay rakhe
//senior devs dont like this, instead use 'as Constant'

enum UserRoles {
    Admin = 'Admin',
    Editor = 'Editor',
    Viewer = 'Viewer'
}

const canEdit = (role : UserRoles) => {
    if(role === UserRoles.Admin || role === UserRoles.Editor) return true

    return false;
}
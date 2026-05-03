
const UserRoles = {
    Admin : 'Admin',
    Editor : 'Editor',
    Viewer : 'Viewer'
} as const; // as constant

const canEdit = (role : (typeof UserRoles)[keyof typeof UserRoles]) => { 
    if(role === UserRoles.Admin || role === UserRoles.Editor) return true

    return false;
}
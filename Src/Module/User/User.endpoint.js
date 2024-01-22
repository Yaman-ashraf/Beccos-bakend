const roles = {
    Admin: 'Admin',
    User: 'User',
}
const endPoint = {
    getUsers: [roles.Admin],
    getUserData: [roles.Admin, roles.User],
    updateUser: [roles.Admin],
}

export default endPoint;
const roles = {
    Admin: 'Admin',
    User: 'User',
}
const endPoint = {
    getUsers: [roles.Admin],
    updateUser: [roles.Admin],
    getUserData: [roles.Admin, roles.User],
}

export default endPoint;
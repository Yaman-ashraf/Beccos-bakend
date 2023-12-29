const roles = {
    Admin: 'Admin',
    User: 'User',
}
const endPoint = {
    getUsers: [roles.Admin],
    updateUser: [roles.Admin],
}

export default endPoint;
const roles = {
    Admin: 'Admin',
    User: 'User',
}
const endPoint = {
    create: [roles.Admin],
    getAll: [roles.Admin],
    delete: [roles.Admin],
}

export default endPoint;
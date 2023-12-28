const roles = {
    Admin: 'Admin',
    User: 'User',
}
const endPoint = {
    create: [roles.User],
    getUserOrder: [roles.User],
    cancel: [roles.User],
    delete: [roles.User],
}

export default endPoint;
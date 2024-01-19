const roles = {
    Admin: 'Admin',
    User: 'User',
}
const endPoint = {
    create: [roles.User],
    getUserOrder: [roles.User],
    cancel: [roles.User],
    delete: [roles.User],
    changeStatus: [roles.Admin],
    allOrder: [roles.Admin],
    details: [roles.User, roles.Admin],
}

export default endPoint;
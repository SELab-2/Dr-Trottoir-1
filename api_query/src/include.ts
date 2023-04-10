export const includeUser = {
    select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        last_login: true,
        date_added: true,
        phone: true,
        address_id: true,
        student: true,
        super_student: true,
        admin: true,
        deleted: true,
        hash: false,
        salt: false,
    },
};

export const selectBuilding = {
    select: {
        id: true,
        name: true,
        ivago_id: true,
        deleted: true,
        hash: false,
        address: true,
    },
};

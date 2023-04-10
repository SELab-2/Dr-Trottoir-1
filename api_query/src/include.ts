function includeUser(includeAddress: boolean) {
    return {
        select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            last_login: true,
            date_added: true,
            phone: true,
            address_id: true,
            address: includeAddress,
            student: true,
            super_student: true,
            admin: true,
            deleted: true,
            hash: false,
            salt: false,
        },
    }
}

export const includeUserWithoutAddress = includeUser(false);

export const includeUserWithAddress = includeUser(true);

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

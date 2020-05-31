
let initialData = {
    loading: null,
    users: [],
    user: { type: "seller", gigs: [], orders: [] },
    token: localStorage.getItem('token'),
    appointments: [{
        appointID: "ASD",
        patient: {
            name: "ASSD"
        },
        doctor: {
            name: "khanG"
        }
    }],
    categories:[
        {
            categoryID:"232",
            name:"Sadasd"
        }
    ]
};

export default (state = initialData, action) => {

    state = JSON.parse(JSON.stringify(state));

    switch (action.type) {

        case 'CATEGORY_ADDED':
            state.categories.push(action.payload);
            break;

        case 'CATEGORY_REMOVED':
            state.categories = state.categories.filter((medicine) => {
                return medicine._id != action.payload;
            });
            break;

        case 'CATEGORY_LOADED':
            state.categories = action.payload;
            break;

        case 'APPOINTMENTS_LOADED':
            state.appointments = action.payload;
            break;

        case 'APPOINTMENT_UPDATED':
            let appointment = state.appointments.find((appointment) => {
                return appointment._id == action.payload._id;
            });
            if (appointment) {
                state.appointments[state.appointments.indexOf(appointment)] = action.payload;
            }
            break;


        case 'APPOINTMENT_REJECTED':
            let rejected_appointment = state.appointments.find((appointment) => {
                return appointment._id == action.payload._id;
            });
            if (rejected_appointment) {
                state.appointments.splice(state.appointments.indexOf(rejected_appointment), 1);
            }
            break;

        case 'USER_LOGOUT':
            state.loading = false;
            localStorage.removeItem('token');
            state.user = { gigs: [], orders: [] };
            state.token = null;

            break;

        case 'LOGIN_START':
            state.loading = true;
            break;

        case 'LOGIN_SUCCESSFUL':
            state.users = action.users || state.users;
            state.loading = false;
            state.user = action.payload;
            state.token = localStorage.getItem('token');
            break;

        // case 'LOGOUT':
        //     state.loading = false;
        //     break;

    }

    return state;
}
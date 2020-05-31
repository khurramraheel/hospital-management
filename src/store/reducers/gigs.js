
let initialData = {
    popular: [
        // {
        //     _id: 1,
        //     title: "I will do task 1",
        //     charges: "50",
        //     description: "asasd",
        //     img: "/images/nihari.jpg"
        // },
        // {
        //     _id: 2,
        //     title: "I will do task 2",
        //     charges: "50",
        //     description: "asasd",
        //     img: "/images/nihari.jpg"
        // },
        // {
        //     _id: 3,
        //     title: "I will do task 3",
        //     charges: "50",
        //     description: "asasd",
        //     img: "/images/nihari.jpg"
        // }
    ],
    searched: [],
    gigs: [],

    //Orders created by the custoemr
    userOrders: [],

    //Orders received by gigger
    sellerOrders: [],
    currentGig: {
        userID: {}
    },
    pending: [],
    active: [],
    currentCompletedOrder: { gig: {} }
};

export default (state = initialData, action) => {

    state = JSON.parse(JSON.stringify(state));

    switch (action.type) {

        case 'GIG_MADE_IN_PENDING':
            let gidDeactivated = state.active.find((gig) => {
                return gig._id == action.payload;
            });
            if (gidDeactivated) {

                state.active.splice(state.active.indexOf(gidDeactivated), 1);
                state.pending.push(gidDeactivated);

            }
            break;

        case 'SET_COMPLETED_ORDER':
            state.currentCompletedOrder = action.payload;
            break;

        case 'ORDER_MARKED_COMPLETED':
            state.userOrders.forEach((order) => {

                if (order._id == action.payload._id) {
                    order.confirmed = action.payload.confirmed;
                }

            });
            break;

        case 'ORDER_MARKED_COMPLETED_SELLER':
            state.sellerOrders.forEach((order) => {

                if (order._id == action.payload._id) {
                    order.confirmed = action.payload.status;
                }

            });
            break;



        case 'GIG_APPROVED':

            let gigActivated = state.pending.find((gig) => {
                return gig._id == action.payload;
            });

            if (gigActivated) {
                state.pending.splice(state.pending.indexOf(gigActivated), 1);
                state.active.push(gigActivated);
            }

            // state.pending = state.pending.filter((gig) => {
            //     return gig._id != action.payload;
            // })
            break;

        case 'USER_ORDERS_LOADED':
            state.pending = action.pending;
            state.active = action.active;
            state.userOrders = action.userOrders;
            state.sellerOrders = action.sellerOrders;
            break;

        case 'GIG_SELECTED':
            state.currentGig = action.payload;
            break;

        case 'USER_GIGS_LOADED':
            state.gigs = action.payload;
            break;

        case 'GIG_DELETED':
            state.gigs = state.gigs.filter((gig) => {
                return gig._id != action.payload._id;
            });
            state.popular = state.popular.filter((gig) => {
                return gig._id != action.payload._id;
            });
            break;

        case 'POPULAR_GIGS_LOADED':
            state.popular = action.payload.filter((gig) => {
                return gig.status != "pending";
            });
            break;

        case 'SEARCHED_GIGS_LOADED':
            state.searched = action.payload;
            break;

        // case 'LOGOUT':
        // state.loading = false;
        // break;

    }

    return state;
}
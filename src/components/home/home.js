
import React from 'react';
import {connect} from 'react-redux';
import M from 'materialize-css';

function Home(props) {

    return <div className="relative" style={{ marginTop: '85px' }}>
        { (!props.store.auth.user._id || props.store.auth.user.type == "patient")  && <button onClick={(evt) => {

            if (props.store.auth.user._id) {

                //Open appointment modal

            } else {

                M.Modal.init(document.getElementById("loginModel"), {}).open();

            }


        }} className="def-btn" id="schedule-btn">Schedule an appointment!</button> }
        <img src='/images/background.jpg' />
    </div>

}

export default connect((store)=>{
    return {store};
})(Home);
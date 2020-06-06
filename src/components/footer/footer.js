import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {

    return <section className="footer">
       
        <div className="text-center row">
            <div className="col m12 text">
                Copyright © 2019 - 2020. All Rights Are Reserved
            </div>
            {/* <img className="icon-def" src="/gamica.png" /> */}
        </div>
    </section>

}
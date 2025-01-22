import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard';

function Requests () {
    const [requestsList, setRequestsList] = useState([]);

    useEffect( () => {
        if (window.localStorage.getItem("requestsList")) {
            setRequestsList(JSON.parse(window.localStorage.getItem("requestsList")));
        }
        else {

        }
    }, []);

    return (
        <div>
            <center>
                <br></br>
                {requestsList.length < 1 && <h4 style = { { padding: "30px" } } >Your Requests Will Appear Here</h4>}
                <br></br>
                <table>
                    <tbody>
                        {requestsList.map((item, index) => (
                            <RequestCard key={index} data-index={index} userData = {item} />
                        ))}
                    </tbody>
                </table>
            </center>
        </div>
    );
}
export default Requests;
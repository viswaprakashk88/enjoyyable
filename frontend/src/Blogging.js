import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Blogging () {

    const navigate = useNavigate();
    const [count, setCount] = useState(10);

    const handleClick = () => {
        setCount(prev => (prev+10));
    }

    return (
        <>
            <center>
                {/* <button onClick = {handleClick} style = {{color: "#fff"}} >Google</button>
                <br />
                <b>count a is: {count}</b> */}
                <br/><br/><br/><br/>







                <a href = "https://www.google.com/" target = 'temp' style = {{color: "#fff"}} >Google</a>
                <br />
                <a href = "https://github.com/" target = 'temp' style = {{color: "#fff"}} >GitHub</a>













                {/* <br/>
                <a href = "https://www.google.com/" target = 'blank' style = {{color: "#fff"}} >Google</a> */}
                {/* <br />
                <a href = "https://www.meta.com/" target = 'blank' style = {{color: "#fff"}} >Meta</a> */}
            </center>
        </>
    );
}

export default Blogging;
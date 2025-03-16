import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import md5 from "md5";

function SignUp() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(true);

    useEffect (() => {
        if (window.localStorage.getItem("username") !== null) {
            navigate('/');
        }
    }, [navigate]);

    

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePasswords(e.target.value, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        validatePasswords(password, e.target.value);
    };

    const validatePasswords = (pass, confirmPass) => {
        if (pass === confirmPass) {
            setPasswordMessage('✅ Passwords are Matching');
            setMessageColor('green');
            setDisableSubmit(false);
        } else {
            setPasswordMessage('❌ Passwords Are Not Matching');
            setMessageColor('red');
            setDisableSubmit(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        var response = await fetch("https://localhost:3001/validateSignup", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                username : e.target.username.value.toLowerCase(),
                name : e.target.name.value.toLowerCase(),
                email : e.target.email.value.toLowerCase(),
                password : md5(e.target.password.value),
                mobile : e.target.mobile.value
            })
        });

        response = await response.json();
        if ( !response.ok) {
            setPasswordMessage("Something Went Wrong!");
        }
        else{
            if (response.isItemExists) {
                console.log("Item Already Exists");
                setPasswordMessage("User Already Exists!");
                setMessageColor('red');
            }
            else{
                window.localStorage.setItem('username', e.target.username.value);
                navigate('/');
            }
        }
        
    };

    return (
        <div>
            <br />
            <br />
            <center>
                <div className="signup-box">
                    <p style={{ fontSize: '34px', fontFamily: 'fantasy' }}>
                        Sign Up To Start Enjoying With Your Friends
                    </p>
                    <form onSubmit={handleSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className = "td">
                                        <input className = "loginbar" type = "text" id = "name" name = "name" placeholder = "Enter Your Name" pattern = "[A-Za-z ]{3,}" autoFocus spellcheck="false" required/>
                                    </td>
                                    <td className = "td">
                                        <input className = "loginbar" type = "text" id = "username" name = "username" placeholder = "Select a Username" spellcheck="false" required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className = "td">
                                        <input className = "loginbar" type = "email" id = "email" name = "email" placeholder = "Enter Email" spellcheck="false" required/>
                                    </td>
                                    <td className = "td">
                                        <input className = "loginbar" type = "tel" id = "mobile" name = "mobile" placeholder = "Enter Your Mobile Number" spellcheck="false" required />
                                    </td>
                                </tr>
                                <tr>
                                    <td className = "td">
                                        <input onChange={handlePasswordChange} className = "loginbar" type = "password" id = "password" name = "password" placeholder = "Enter A Password" required/>
                                    </td>
                                    <td className = "td">
                                        <input onChange={handleConfirmPasswordChange} className = "loginbar" type = "password" id = "cpassword" name = "cpassword" placeholder = "Enter the Password Again" required />
                                    </td>
                                </tr>
                                <tr>
                                    <td className = "td" colSpan = "2">
                                        <b id = "codered" style = {{ display: 'inline', color: messageColor }}> {passwordMessage} </b>
                                    </td>
                                </tr>
                                <tr>
                                    <td className = "td" colSpan = "2">
                                        <input type = "submit" className = "submitButton" value = "Sign Up" disabled = {disableSubmit}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td  className = "td" colSpan="2" style = {{fontSize : "22px"}}>
                                        Already Have An Account? Login <Link to="/LoginPage">Here</Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </center>
        </div>
    );
}

export default SignUp;

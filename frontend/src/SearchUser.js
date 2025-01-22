import React, { useEffect, useState} from 'react';
import UserCard from './UserCard';

function SearchUser () {

    const [currentSearch, setCurrentSearch] = useState("");
    const [searchedUserList, setSearchedUserList] = useState([]);
    const [load, setLoad] = useState("");
    var dict = {};
    useEffect ( () => {
        //Getting the already cached data into the page
        if (window.localStorage.getItem("searchedUser") && window.localStorage.getItem("searchedUser") !== "" )
        {
            document.getElementById("searchUser").value = window.localStorage.getItem("searchedUser");
            setSearchedUserList(window.localStorage.getItem("searchedUserList") !== "undefined" ? JSON.parse(window.localStorage.getItem("searchedUserList")) : []);
            // setCurrentSearch(window.localStorage.getItem("searchedUser"));
        }
        else {
            window.localStorage.removeItem("connections");
        }
    },[]);
    const searchUser = async (e) => {
        const searchUserValue = document.getElementById("searchUser").value;
        if (e.key === "Enter") {
            //Retrieving Users having "searchUserValue" in their Name or Username
            var users = await fetch("https://localhost:3001/searchUser", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    userHint : searchUserValue,
                    username: window.localStorage.getItem("username")
                })
            });
            users = await users.json();
            //Getting the connection requests sent by the current user 
            var requests = await fetch("https://localhost:3001/getRequests", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    userHint : searchUserValue,
                    username: window.localStorage.getItem("username")
                })
            });
            requests = await requests.json();
            console.log("Requests and Friends");
            console.log(requests);
            var tempRequests = requests["items"]["Items"];
            for(var i = 0; i < tempRequests.length; i++)
            {
                var tempUsername = tempRequests[i].username.split("#&#");
                tempUsername = (tempUsername[0] === window.localStorage.getItem("username")) ? tempUsername[1] : tempUsername[0];
                // if (tempUsername)
                dict[tempUsername] = tempRequests[i].friendshipStatus;
            }
            window.localStorage.setItem("connections", JSON.stringify(dict));
            const temp = currentSearch + "" ;
            // setCurrentSearch("");
            setCurrentSearch(searchUserValue);
            //Caching the retrieved users
            if(users.items){
                window.localStorage.setItem("searchedUser", searchUserValue);
                window.localStorage.setItem("searchedUserList", JSON.stringify(users.items));
                setSearchedUserList(users.items);
            }
        }
        else {
            setCurrentSearch("");
            window.localStorage.removeItem("searchedUser");
            window.localStorage.removeItem("searchedUserList");
        }
        if(window.localStorage.getItem("searchedUser") && window.localStorage.getItem("searchedUser") !== searchUserValue){
            window.localStorage.removeItem("searchedUser");
            window.localStorage.removeItem("searchedUserList");
            setSearchedUserList([]);
        }
    };

    return (
        <div>
            <center>
                <input type = "text" name = 'searchuser' id = 'searchUser' onKeyDown = {searchUser} className = "searchBar" placeholder='Hit Enter To Search Users' spellCheck = "false"/>
                <br />
                <h4 style = { {color: "#14f5cf", paddingBottom: "10px"} }>{load}{ currentSearch !== "" && "Showing Results For " + '"' + currentSearch + '"' }</h4>
                <table>
                    <tbody>
                        {searchedUserList.map((item, index) => (
                            (item.user !== window.localStorage.getItem("username"))?
                                <UserCard key={index} data-index={index} userData = {item} />
                            : null
                        ))}
                    </tbody>
                </table>
            </center>
        </div>
    );
}
export default SearchUser;
import React from "react";
import {auth, googleProvider} from "../config/firebase"
import { createUserWithEmailAndPassword , signInWithPopup, signOut } from "firebase/auth";
import { async } from "@firebase/util";

export default function Auth(){

    const [inputData, setInputData] = React.useState({
        email: "", 
        password: ""
    })

    function handelChange(event){
        const {name, value} = event.target;
        setInputData(prevData => ({...prevData, [name] : value}))
    }

    const signIn = async() => {
        try {await createUserWithEmailAndPassword(auth, inputData.email, inputData.password)}
        catch (error){
            console.error(error)
        }
    }

    const signInGoogle = async() => {
        try {await signInWithPopup(auth, googleProvider)}
        catch (error){
            console.error(error)
        }
    }

    const logOut = async() => {
        try{
            await signOut(auth);
        }
        catch(error){
            console.error(error)
        }
    }

    console.log(auth?.currentUser?.email);

    return(
        <div>
            <input 
                placeholder="Email..." 
                name = "email"  
                value = {inputData.email}
                onChange = {handelChange}
            />
            <input
                 placeholder="Password..."
                name = "password"
                type = "password"
                value = {inputData.password}
                onChange = {handelChange}
            />
            <button onClick={signIn}> Sign in</button>

            <button onClick = {signInGoogle}>Sign in with Google</button>
            <button onClick = {logOut}>Log Out</button>
        </div>
    )
}
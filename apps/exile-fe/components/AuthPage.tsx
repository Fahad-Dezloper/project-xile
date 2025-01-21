"use client"

import Link from "next/link"

export const AuthPage = ({isSignin}:{ isSignin: boolean}) => {
    return(
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="p-3 w-[35vw] bg-gray-200 flex flex-col gap-3 rounded-lg">
                <input type="email" placeholder="Email" className="p-2 border rounded-md outline-none text-black " />
                <input type="password" placeholder="Password" className="p-2 border rounded-md outline-none text-black" />

                <button onClick={() => {

                }} className="bg-black p-3 rounded-md font-medium">{isSignin ? "Sign in": "Sign up"}</button>
                <p className="text-black w-full text-center">{isSignin ? "Create new account" : "Alredy have an account"}
                <Link className="text-blue-600" href={isSignin ? "/signup" : "/signin"}>{isSignin ? " Signup" : " Signin"}</Link>
                </p>
            </div>
        </div>
    )
}
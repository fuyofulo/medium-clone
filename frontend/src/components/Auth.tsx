import { SignupInput } from "@fuyofulo/medium-clone-common";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";

const Auth = ({type}: {type: "signup" | "signin"}) => {

    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    });
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        Create an account
                    </div>
                    <div className="text-slate-400">
                          {type === "signup" ? "Already have an account?" : "Don't have an account?"}
                        <Link to={"/signin"} className="pl-2 underline">Login</Link>
                    </div>
                </div>
                <div className="pt-8">
                    <LabelledInput label="Name" placeholder="Zaid Khan..." onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }}></LabelledInput><br />
                    <LabelledInput label="Email" placeholder="zaidkhan@gmail.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }}></LabelledInput><br />
                    <LabelledInput label="Password" type={"password"} placeholder="********" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }}></LabelledInput><br />
                    <button type="button" className="text-white w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign Up" : "Sign In"}</button>

                </div>
            </div>
        </div>
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}
const LabelledInput = ({label, placeholder, onChange, type}:LabelledInputType) => {
    return <div>
        <div>
            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">{label}</label>
            <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
        
    </div>
}
export { LabelledInput, Auth };
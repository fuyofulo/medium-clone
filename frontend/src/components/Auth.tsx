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
                          Already have an account?
                        <Link to={"/signin"} className="pl-2 underline">Login</Link>
                    </div>
                </div>
                <div className="pt-8">
                    <LabelledInput label="Name" placeholder="Zaid Khan..." onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }}></LabelledInput>
                    <LabelledInput label="Email" placeholder="zaidkhan@gmail.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }}></LabelledInput>
                    <LabelledInput label="Password" type={"password"} placeholder="********" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }}></LabelledInput>
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
const LabelledInput = ({label, placeholder, onChange}:LabelledInputType) => {
    return <div>
        <div>
            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">{label}</label>
            <input onChange={onChange} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
        
    </div>
}
export { LabelledInput, Auth };
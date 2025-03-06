"use client"

import { register } from "@/actions/create-account-action"
import { useActionState, useEffect, useRef, useState } from "react"
import ErrorMessage from "../ui/ErrorMessage"
import SuccessMessage from "../ui/SuccessMessage"

const RegisterForm = () => {


const ref = useRef<HTMLFormElement>(null)
   const [state, dispatch] = useActionState(register, {
    errors: [],
    success: ""
   })

  
   useEffect(() => {
    if(state.success){
        ref.current?.reset();
        setFormData({  // Reinicia el estado de los inputs
            email: "",
            name: "",
            password: "",
            password_confirmation: "",
          });
    }
   }, [state])

    // Estado para los inputs
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 

  return (
    <form
    ref={ref}
    className="mt-14 space-y-5"
    noValidate
    action={dispatch}
>
    {state.errors.map(error => <ErrorMessage>{error}</ErrorMessage>)}

    {state.success && <SuccessMessage>{state.success}</SuccessMessage>}
    <div className="flex flex-col gap-2">
        <label
            className="font-bold text-2xl"
            htmlFor="email"
        >Email</label>
        <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
            value={formData.email}
            onChange={handleChange}
        />
    </div>

    <div className="flex flex-col gap-2">
        <label
            className="font-bold text-2xl"
        >Nombre</label>
        <input
            type="name"
            placeholder="Nombre de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="name"
            value={formData.name}
            onChange={handleChange}
        />
    </div>

    <div className="flex flex-col gap-2">
        <label
            className="font-bold text-2xl"
        >Password</label>
        <input
            type="password"
            placeholder="Password de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
            value={formData.password}
            onChange={handleChange}
        />
    </div>

    <div className="flex flex-col gap-2">
        <label
            className="font-bold text-2xl"
        >Repetir Password</label>
        <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
        />
    </div>

    <input
        type="submit"
        value='Registrarme'
        className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
    />
</form>
  )
}

export default RegisterForm

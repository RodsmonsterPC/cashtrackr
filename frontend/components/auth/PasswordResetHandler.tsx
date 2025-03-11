"use client"

import { useState } from "react"
import ValidateTokenForm from "./ValidateTokenForm"
import ResetPasswordForm from "./ResetPasswordForm"

const PasswordResetHandler = () => {

    const [isValidToken, setIsValidToken] = useState(false)
    
    const [token, setToken] = useState('')
  return (
    <>
    {!isValidToken ? <ValidateTokenForm 
    setIsValidToken={setIsValidToken} 
    token={token} setToken={setToken} 
    /> : 
    <ResetPasswordForm
    token={token}
    
    /> }
    
    </>
  )
}

export default PasswordResetHandler
"use client"

import { useState } from "react"
import ValidateTokenForm from "./ValidateTokenForm"
import ResetPasswordForm from "./ResetPasswordForm"

const PasswordResetHandler = () => {

    const [isValidToken, setIsValidToken] = useState(false)
  return (
    <>
    {!isValidToken ? <ValidateTokenForm/> : <ResetPasswordForm/> }
    
    </>
  )
}

export default PasswordResetHandler
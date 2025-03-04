import ForgotPasswordForm from "@/components/auth/ForgotForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CashTrackr - Olvidé mi Password",
  description: "CashTrackr - Olvidé mi Password",
  keywords: "Nextjs, Tailwindscss",
};

const ForgotPassword = () => {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">
        ¿Olvidaste tu Contraseña?
      </h1>
      <p className="text-3xl font-bold">
        aqui puedes<span className="text-amber-500"> restablecerla</span>{" "}
      </p>

      <ForgotPasswordForm></ForgotPasswordForm>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link href="/auth/login" className="text-center text-gray-500">
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
        <Link href="/auth/register" className="text-center text-gray-500">
          ¿No tienes cuenta? Crea una
        </Link>
      </nav>
    </>
  );
};

export default ForgotPassword;

"use server";

import { ErrorResponseSchema, TokenSchema } from "@/src/schemas";

type ActionsStateType = {
  errors: string[];
  success: string;
};

export async function ValidateToken(
  token: string,
  prevState: ActionsStateType
) {
  const resetPasswordToken = TokenSchema.safeParse(token);

  if (!resetPasswordToken.success) {
    return {
      errors: resetPasswordToken.error.issues.map((issue) => issue.message),
      success: "",
    };
  }

  const url = `${process.env.API_URL}/auth/validate-token`;
  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      token: resetPasswordToken.data,
    }),
  });

  const json = await req.json();

  if (!req.ok) {
    const { error } = ErrorResponseSchema.parse(json);
    return {
      errors: [error],
      success: "",
    };
  }

  return {
    errors: [],
    success: "",
  };
}

import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "El email es obligatorio" })
      .email({ message: "Email no valido" }),
    name: z.string().min(1, { message: "Tu nombre no puede ir vacio" }),
    password: z
      .string()
      .min(8, { message: "El password es muy corto, mínimo son 8 caracteres" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Los passwords no son iguales",
    path: ["password_confirmation"],
  });

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El Email es Obligatorio" })
    .email({ message: "Email no válido" }),
  password: z.string().min(1, { message: "El Password no puede ir vacio" }),
});

export const SuccessSchema = z.string();

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export const TokenSchema = z
  .string({ message: "Token no válido" })
  .length(6, { message: "Token no válido" })
  .max(6, { message: "Token no válido" });

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El Email es Obligatorio" })
    .email({ message: "Email no válido" }),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "El Password debe ser de al menos 8 caracteres" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Los Passwords no son iguales",
    path: ["password_confirmation"],
  });


  export const PasswordValidationSchema = z.string().min(1, {message: 'Password no válido'})

export const DraftBudgetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El Nombre del presupuesto es obligatorio" }),
  amount: z.coerce
    .number({ message: "Cantidad no válida" })
    .min(1, { message: "Cantidad no válida" }),
});


export const DraftExpenseSchema = z.object({
    name: z.string().min(1, {message: 'El nombre del gasto es obligatorio'}),
    amount: z.coerce.number().min(1, {message: 'Cantidad no válida'})
})

export const UpdatePasswordSchema = z.object({
  current_password: z.string().min(1, {message: 'El Password no puede ir vacio'}),
  password: z.string()
          .min(8, {message: 'El Nuevo Password debe ser de al menos 8 caracteres'}),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
message: "Los Passwords no son iguales",
path: ["password_confirmation"]
});

export const ProfileFormSchema = z.object({
  name: z.string()
          .min(1, {message: 'Tu Nombre no puede ir vacio'}),
  email: z.string()
          .min(1, {message: 'El Email es Obligatorio'})
          .email({message: 'Email no válido'}),
})

export const ExpenseAPIResponseSchema = z.object({
  id: z.number(),
  name:z.string(),
  amount: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  budgetId: z.number()
})

export const BudgetAPIResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.string(),
  userId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expenses:z.array(ExpenseAPIResponseSchema)
});

export const BudgetsAPIResponseSchema = z.array(BudgetAPIResponseSchema.omit({expenses: true}));

export type Budget = z.infer<typeof BudgetAPIResponseSchema>;
export type Expense = z.infer<typeof ExpenseAPIResponseSchema>
export type DraftExpense = z.infer<typeof DraftExpenseSchema>

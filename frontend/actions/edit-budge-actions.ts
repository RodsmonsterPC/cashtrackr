"use server";

import getToken from "@/src/auth/token";
import {
  Budget,
  DraftBudgetSchema,
  ErrorResponseSchema,
  SuccessSchema,
} from "@/src/schemas";
import { revalidatePath } from "next/cache";

type ActionStateType = {
  errors: string[];
  success: string;
};

const editBudget = async (
  budgetId: Budget["id"],
  prevState: ActionStateType,
  formData: FormData
) => {
  const budgetData = {
    name: formData.get("name"),
    amount: formData.get("amount"),
  };

  const budget = DraftBudgetSchema.safeParse(budgetData);

  if (!budget.success) {
    return {
      errors: budget.error.issues.map((issue) => issue.message),
      success: "",
    };
  }

  const token = await getToken();

  const url = `${process.env.API_URL}/budgets/${budgetId}`;

  const req = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: budget.data.name,
      amount: budget.data.amount,
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

  revalidatePath("/admin");

  const success = SuccessSchema.parse(json);

  return {
    errors: [],
    success,
  };
};

export default editBudget;

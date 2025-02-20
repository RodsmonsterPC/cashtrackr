import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import {
  hasAccess,
  validateBudgetExists,
  validateBudgetId,
  validateBudgetInput,
} from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseControllers";
import {
  validateExpenseExists,
  validateExpenseId,
  validateExpenseInput,
} from "../middleware/expense";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate) //req.user

router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExists); //req.dubget
router.param('budgetId', hasAccess)

router.param("expenseId", validateExpenseId);
router.param("expenseId", validateExpenseExists);

router.get("/", BudgetController.getAll);

router.post(
  "/",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.create
);

router.get(
  "/:budgetId",
  validateBudgetId,
  validateBudgetExists,
  BudgetController.getById
);

router.patch(
  "/:budgetId",
  validateBudgetId,
  validateBudgetExists,
  validateBudgetInput,
  handleInputErrors,
  BudgetController.updateById
);

router.delete(
  "/:budgetId",
  validateBudgetId,
  validateBudgetExists,
  BudgetController.deleteById
);

//Routes for Expenses

router.get("/:budgetId/expenses", ExpensesController.getAll);
router.post(
  "/:budgetId/expenses",
  validateExpenseInput,
  handleInputErrors,
  ExpensesController.create
);
router.get("/:budgetId/expenses/:expenseId", ExpensesController.getById);

router.patch(
  "/:budgetId/expenses/:expenseId",
  validateExpenseInput,
  handleInputErrors,
  ExpensesController.updateById
);
router.delete("/:budgetId/expenses/:expenseId", ExpensesController.deleteById);

export default router;

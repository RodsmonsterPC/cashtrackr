import type { Request, Response } from "express"
import Budget from "../models/budget"

export class BudgetController{
    static getAll = async (req : Request, res: Response) =>{
        try {
            const budgets = await Budget.findAll({})


            res.json(budgets)


        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    static create = async (req : Request, res: Response) =>{
        try {
            const budget = new Budget(req.body)

            await budget.save()
            res.status(201).json('Presupuesto Creado Correctamente')


        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    static getById = async (req : Request, res: Response) =>{
        console.log('Desde Get /api/budgets/id')
    }
    static updateById = async (req : Request, res: Response) =>{
        console.log('Desde Patch /api/budgets/id')
    }
    static deleteById = async (req : Request, res: Response) =>{
        console.log('Desde Delete /api/budgets/id')
    }
}
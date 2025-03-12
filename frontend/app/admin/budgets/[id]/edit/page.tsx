import EditBudgetForm from "@/components/budgets/EditBudgetForm"
import getToken from "@/src/auth/token"
import { BudgetAPIResponseSchema } from "@/src/schemas"
import Link from "next/link"
import { notFound } from "next/navigation"


const getBudgetById = async (budgetId: string) => {
    
    const token = await getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}`

    const req = await fetch(url, {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    })

    const json = await req.json()

    if(!req.ok){
        notFound()
    }

    const budget = BudgetAPIResponseSchema.parse(json)

    return budget
}

const EditBudgetPage = async ({params} : {params : Promise<{ id: string }>}) => {

    const resolvedParams = await params
    
    const {id} = resolvedParams

 const budget = await  getBudgetById(id)

  return (
    <>
    <div className='flex flex-col-reverse md:flex-row md:justify-between items-center'>
      <div className='w-full md:w-auto'>
        <h1 className='font-black text-4xl text-purple-950 my-5'>
          Editar Presupuesto: 
        </h1>
        <p className="text-xl font-bold">Llena el formulario y crea un nuevo {''}
          <span className="text-amber-500">presupuesto</span>
        </p>
      </div>
      <Link
        href={'/admin'}
        className='bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center'
      >
        Volver
      </Link>
    </div>
    <div className='p-10 mt-10  shadow-lg border '>
        <EditBudgetForm  budget={budget}/>
    </div>
  </>
  )
}

export default EditBudgetPage
import { formatCurrency } from '@/src/utils'
import React from 'react'

type AmountProps = {
    label: string
    amount: number
}

const AmountInfo = ({label, amount}: AmountProps) => {
  return (
   <p className='text-2xl font-bold'>
    {label}: {''}
    <span className='text-amber-500'>{formatCurrency(amount)}</span>
   </p>
  )
}

export default AmountInfo

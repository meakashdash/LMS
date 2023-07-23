//it should be get the data as {currency:'',amount:''}
export const currencyFormatter=(data)=>{
    return ((data.amount * 100)/100).toLocaleString(data.currency,{
        style:'currency',
        currency:data.currency
    })
}
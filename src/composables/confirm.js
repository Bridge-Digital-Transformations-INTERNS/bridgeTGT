export const confirmState = { open:false, title:'', message:'' }
let resolver = null


export function showConfirm(title, message){
return new Promise((resolve)=>{ confirmState.title=title; confirmState.message=message; confirmState.open=true; resolver=resolve })
}


export function resolveConfirm(result){ confirmState.open=false; if(resolver){ resolver(result); resolver=null } }
export function useConfirmState(){ return confirmState }

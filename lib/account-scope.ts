export function accountScope(user:{userId:string,email:string}|null){return user?.userId&&user.email?user.userId:null;}
export function scopedRecordId(scope:string,id:string){return 'user-record:'+encodeURIComponent(scope)+':'+encodeURIComponent(id);}

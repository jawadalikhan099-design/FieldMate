import {database,filter} from './database';
import {isAdmin,pakistanDay} from './admin';

export type SubscriptionAccess = {
  isAdmin: boolean;
  active: boolean;
  status: 'admin' | 'active' | 'expired' | 'pending' | 'unverified';
  starts: string | null;
  ends: string | null;
};

export async function subscriptionAccess(user: {userId:string,email:string}): Promise<SubscriptionAccess> {
  if (await isAdmin(user)) return {isAdmin:true,active:true,status:'admin',starts:null,ends:null};
  const today = pakistanDay();
  try {
    const rows = await database(
      'fm_subscriptions',
      'select=starts,ends&member_id=eq.'+filter(user.userId)+'&starts=lte.'+today+'&ends=gt.'+today+'&order=ends.desc&limit=1'
    );
    if (rows.length) return {isAdmin:false,active:true,status:'active',starts:rows[0].starts,ends:rows[0].ends};
    const future = await database(
      'fm_subscriptions',
      'select=starts,ends&member_id=eq.'+filter(user.userId)+'&starts=gt.'+today+'&order=starts.asc&limit=1'
    );
    if (future.length) return {isAdmin:false,active:false,status:'pending',starts:future[0].starts,ends:future[0].ends};
    return {isAdmin:false,active:false,status:'expired',starts:null,ends:null};
  } catch {
    return {isAdmin:false,active:false,status:'unverified',starts:null,ends:null};
  }
}

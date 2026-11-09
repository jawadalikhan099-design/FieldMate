import handler from 'vinext/server/fetch-handler';
export default {fetch(request:Request,env:unknown,ctx:ExecutionContext){const url=new URL(request.url);if(url.pathname.startsWith('/api/')&&!['GET','HEAD','OPTIONS'].includes(request.method)&&request.headers.get('Origin')!==url.origin)return Response.json({error:'Request origin rejected'},{status:403});return handler.fetch(request,env,ctx);}};

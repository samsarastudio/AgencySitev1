import {rename,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve,sep} from 'node:path';
// A private static review build, separate from the production Next.js server.
// API source is restored in finally; previews honestly use the email-draft fallback.
const staleDevTypes=resolve('.next/dev/types');
if(!staleDevTypes.startsWith(resolve('.next')+sep))throw new Error('Unexpected cache path');
await rm(staleDevTypes,{recursive:true,force:true});
await mkdir('.preview-api',{recursive:true});
await rename('app/api','.preview-api/api');
try {
 const result=spawnSync(process.execPath,['node_modules/next/dist/bin/next','build'],{stdio:'inherit',env:{...process.env,SITE_EXPORT:'1',NEXT_PUBLIC_PREVIEW:'1',NEXT_PUBLIC_FORMS_ENABLED:'false',NEXT_PUBLIC_NEWSLETTER_ENABLED:'false'}});
 if(result.status!==0)throw new Error('Preview build failed');
 const redirects=JSON.parse(await readFile('content/redirects.json','utf8'));
 await writeFile('out/_redirects',redirects.map(r=>`${r.source} ${r.destination} 301`).join('\n')+'\n');
 await writeFile('out/_headers','/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
}finally{await rename('.preview-api/api','app/api')}

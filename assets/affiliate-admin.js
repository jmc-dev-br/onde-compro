import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL='https://ynqtjkdoqmajxtfmpkbt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_JA9F1w3ntSuPtRALACWnlA_H1wjixNt';
const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=id=>document.getElementById(id);
const loginGate=$('affiliateLoginGate'), denied=$('affiliateDenied'), app=$('affiliateAdminApp');
const form=$('affiliateMappingForm'), save=$('affiliateSaveButton'), formStatus=$('affiliateFormStatus');
const list=$('affiliateMappingList'), listStatus=$('affiliateListStatus');
let currentUser=null, rows=[], saving=false;

function status(el,message='',isError=false){el.textContent=message;el.hidden=!message;el.classList.toggle('is-error',Boolean(isError))}
function safeText(value,fallback=''){const s=String(value??'').trim();return s||fallback}
function canonicalUrl(raw){
  const parsed=new URL(String(raw||'').trim());
  if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw new Error('Use um endereço HTTPS válido.');
  parsed.hash='';
  const tracking=/^(utm_.+|gclid|fbclid|msclkid|mc_cid|mc_eid|ref_|ref|tag|linkcode|camp|creative|creativeasin|ascsubtag|matt_.+|spm|scm)$/i;
  for(const key of Array.from(parsed.searchParams.keys()))if(tracking.test(key))parsed.searchParams.delete(key);
  parsed.searchParams.sort();
  parsed.pathname=parsed.pathname.replace(/\/+$/,'')||'/';
  return parsed.toString().replace(/\/$/,'').toLowerCase();
}
function domainOf(raw){return new URL(raw).hostname.replace(/^www\./,'').toLowerCase()}
function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=String(text);return node}
function emptyList(title,description){const box=el('div','affiliate-admin-empty');box.append(el('strong','',title),el('p','',description));return box}
function showState(state){
  loginGate.hidden=state!=='login';
  denied.hidden=state!=='denied';
  app.hidden=state!=='app';
}
async function determineAccess(user){
  currentUser=user||null;
  if(!currentUser){showState('login');return false}
  showState('denied');
  try{
    const {data,error}=await supabase.from('user_roles').select('role').eq('user_id',currentUser.id).eq('role','owner').maybeSingle();
    if(error||data?.role!=='owner')return false;
    showState('app');
    return true;
  }catch(_){showState('denied');return false}
}
async function loadRows(){
  status(listStatus,'Carregando links…');
  list.replaceChildren();
  const {data,error}=await supabase.from('affiliate_link_mappings')
    .select('id,source_url,affiliate_url,network,store_domain,notes,created_at')
    .order('created_at',{ascending:false})
    .limit(1000);
  if(error)throw error;
  rows=data||[];
  $('affiliateMappingCount').textContent=String(rows.length);
  renderRows();
  status(listStatus);
}
function renderRows(){
  const query=safeText($('affiliateMappingSearch').value).toLocaleLowerCase('pt-BR');
  const found=rows.filter(row=>[row.source_url,row.affiliate_url,row.network,row.store_domain,row.notes].join(' ').toLocaleLowerCase('pt-BR').includes(query));
  list.replaceChildren();
  if(!found.length){
    list.append(emptyList(query?'Nenhum link corresponde ao filtro':'Ainda não há links cadastrados','Você pode começar pelo gerador oficial de afiliados do Mercado Livre, Temu ou TikTok Shop e salvar aqui o link gerado para um produto específico.'));
    return;
  }
  found.forEach(row=>{
    const item=el('article','affiliate-mapping-row');
    const content=el('div','affiliate-mapping-content');
    const heading=el('div','affiliate-mapping-title');
    heading.append(el('strong','',safeText(row.store_domain,'Loja')),el('span','affiliate-mapping-network',safeText(row.network,'Afiliado')));
    content.append(heading);
    const source=el('div','affiliate-mapping-url');source.append(el('strong','','Produto: '),document.createTextNode(row.source_url));
    const target=el('div','affiliate-mapping-url');target.append(el('strong','','Link afiliado: '),document.createTextNode(row.affiliate_url));
    content.append(source,target);
    if(row.notes)content.append(el('div','affiliate-mapping-notes',row.notes));
    const remove=el('button','affiliate-mapping-remove','Excluir');
    remove.type='button';
    remove.addEventListener('click',()=>removeRow(row,remove));
    item.append(content,remove);
    list.append(item);
  });
}
async function removeRow(row,button){
  if(!confirm('Excluir o mapeamento de afiliado deste produto? O site voltará a mostrar o link normal se a busca encontrar o mesmo endereço.'))return;
  button.disabled=true;
  status(listStatus,'Excluindo mapeamento…');
  try{
    const {error}=await supabase.from('affiliate_link_mappings').delete().eq('id',row.id);
    if(error)throw error;
    rows=rows.filter(item=>item.id!==row.id);
    $('affiliateMappingCount').textContent=String(rows.length);
    renderRows();
    status(listStatus,'Mapeamento excluído.');
  }catch(error){status(listStatus,friendlyError(error,'Não foi possível excluir o mapeamento.'),true)}
  finally{button.disabled=false}
}
function friendlyError(error,fallback){
  const message=String(error?.message||'').toLowerCase();
  if(message.includes('duplicate key')||error?.code==='23505')return 'Já existe um mapeamento para este endereço de produto. Exclua o anterior ou atualize os links pelo próprio painel.';
  if(message.includes('row-level security')||message.includes('permission denied'))return 'A conta não tem permissão para essa ação. Verifique se entrou com a conta do proprietário.';
  if(message.includes('failed to fetch')||message.includes('network'))return 'Não foi possível conectar ao serviço. Confira a internet e tente novamente.';
  return error?.message||fallback;
}
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!currentUser||saving)return;
  let sourceUrl,targetUrl;
  try{
    sourceUrl=canonicalUrl($('affiliateSourceUrl').value);
    targetUrl=canonicalUrl($('affiliateTargetUrl').value);
  }catch(error){status(formStatus,error.message||'Confira os endereços informados.',true);return}
  if(sourceUrl===targetUrl){status(formStatus,'O link de afiliado precisa ser diferente do endereço original do produto.',true);return}
  const network=safeText($('affiliateNetwork').value);
  const notes=safeText($('affiliateNotes').value);
  if(notes.length>300){status(formStatus,'A nota pode ter no máximo 300 caracteres.',true);return}
  saving=true;save.disabled=true;save.textContent='Salvando…';status(formStatus);
  try{
    const storeDomain=domainOf(sourceUrl);
    const existing=rows.find(row=>canonicalUrl(row.source_url)===sourceUrl);
    if(existing){
      const {error}=await supabase.from('affiliate_link_mappings').update({
        affiliate_url:targetUrl,network,store_domain:storeDomain,notes,created_by:currentUser.id
      }).eq('id',existing.id);
      if(error)throw error;
      status(formStatus,'Mapeamento atualizado. A busca passará a usar o link comissionado quando encontrar este endereço de produto.');
    }else{
      const {error}=await supabase.from('affiliate_link_mappings').insert({
        source_url:sourceUrl,affiliate_url:targetUrl,network,store_domain:storeDomain,notes,created_by:currentUser.id
      });
      if(error)throw error;
      status(formStatus,'Link cadastrado! Ele será usado quando a pesquisa encontrar este endereço de produto.');
    }
    form.reset();
    $('affiliateNetwork').value=network;
    await loadRows();
  }catch(error){status(formStatus,friendlyError(error,'Não foi possível salvar o mapeamento.'),true)}
  finally{saving=false;save.disabled=false;save.textContent='Salvar mapeamento ↗'}
});
$('affiliateRefreshButton').addEventListener('click',()=>void loadRows().catch(error=>status(listStatus,friendlyError(error,'Não foi possível atualizar a lista.'),true)));
$('affiliateMappingSearch').addEventListener('input',renderRows);
async function start(){
  try{
    const {data,error}=await supabase.auth.getSession();
    if(error)throw error;
    currentUser=data.session?.user||null;
    const allowed=await determineAccess(currentUser);
    if(allowed)await loadRows();
    const params=new URLSearchParams(location.search);
    if(params.get('saved')==='1'&&allowed)status(formStatus,'A conta foi reconhecida. Você já pode cadastrar os links oficiais.');
  }catch(error){showState('denied');status(listStatus,friendlyError(error,'Não foi possível verificar o acesso.'),true)}
}
supabase.auth.onAuthStateChange((_event,session)=>{
  const next=session?.user||null;
  const prev=currentUser?.id;
  currentUser=next;
  if(!currentUser)showState('login');
  else if(prev!==currentUser.id){
    void determineAccess(currentUser).then(allowed=>allowed?loadRows().catch(error=>status(listStatus,friendlyError(error,'Falha ao carregar links.'),true)):undefined);
  }
});
void start();

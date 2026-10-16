import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase=createClient('https://ynqtjkdoqmajxtfmpkbt.supabase.co','sb_publishable_JA9F1w3ntSuPtRALACWnlA_H1wjixNt',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=id=>document.getElementById(id);
const subscribeBtn=$('clubSubscribeButton'), cancelBtn=$('clubCancelButton'), paymentStatus=$('clubPaymentStatus'), interestBtn=$('clubInterestButton'), interestStatus=$('clubInterestStatus'), panel=$('clubSubscriptionPanel'), accountLink=$('clubAccountLink');
let user=null, interest=false, subscription=null, busy=false, cancelling=false;

function msg(el,text='',error=false){if(!el)return;el.textContent=text;el.hidden=!text;el.classList.toggle('is-error',!!error)}
function activeWindow(s){return !!(s?.current_period_end && new Date(s.current_period_end).getTime()>Date.now())}
function dateText(value){if(!value)return '';const d=new Date(value);return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).format(d)}
function signInUrl(purpose){const ret=purpose==='interest'?'/clube.html?interesse=1':'/clube.html?assinar=1';return '/?conta=1&retorno='+encodeURIComponent(ret).replace(/%2F/gi,'%2F')}
function humanError(error,fallback){const m=String(error?.message||'').toLowerCase();if(m.includes('jwt')||m.includes('session'))return 'Sua sessão expirou. Entre novamente.';if(m.includes('failed to fetch')||m.includes('network'))return 'Sem conexão com o serviço. Confira sua internet e tente de novo.';return error?.message||fallback}
async function functionError(error,fallback){try{if(error?.context?.json){const b=await error.context.json();if(b?.error||b?.message)return b.error||b.message}}catch(_){}return humanError(error,fallback)}
function setPlanBadge(text){const b=$('clubPlanStatusBadge');if(b)b.textContent=text}
function statusLabel(s){if(s.status==='active')return 'Assinatura ativa';if(s.status==='pending')return 'Aguardando confirmação';if(s.status==='past_due')return 'Pagamento pendente';if(s.status==='cancelled'&&activeWindow(s))return 'Renovação cancelada';if(s.status==='cancelled')return 'Assinatura encerrada';if(s.status==='refunded')return 'Pagamento estornado';return 'Checkout expirado'}
function updateUI(){
  if(accountLink){accountLink.textContent=user?'Minha conta ↗':'Entrar na conta ↗';accountLink.href=user?'/?conta=1':signInUrl('subscribe')}
  const active=subscription?.status==='active'||(subscription?.status==='cancelled'&&activeWindow(subscription));
  const pending=subscription?.status==='pending';
  const overdue=subscription?.status==='past_due';
  if(subscribeBtn){
    subscribeBtn.disabled=busy||cancelling||active||overdue||subscription?.status==='refunded';
    subscribeBtn.classList.toggle('club-subscribe-active',active);
    if(subscription?.status==='active')subscribeBtn.innerHTML='Você já é membro <span>✓</span>';
    else if(subscription?.status==='cancelled'&&activeWindow(subscription))subscribeBtn.innerHTML='Acesso até '+dateText(subscription.current_period_end)+' <span>✓</span>';
    else if(busy)subscribeBtn.innerHTML='Preparando checkout… <span>…</span>';
    else if(pending)subscribeBtn.innerHTML='Continuar pagamento <span>↗</span>';
    else if(overdue)subscribeBtn.innerHTML='Pagamento pendente <span>!</span>';
    else if(subscription?.status==='refunded')subscribeBtn.innerHTML='Fale com o suporte <span>!</span>';
    else subscribeBtn.innerHTML='Assinar por R$ 6/mês <span>↗</span>';
  }
  if(panel)panel.hidden=!subscription;
  if(subscription){
    const state=$('clubSubscriptionState'), date=$('clubSubscriptionDate'), icon=panel?.querySelector('.club-subscription-status-icon');
    if(state)state.textContent=statusLabel(subscription);
    if(date){
      if(subscription.status==='active')date.textContent=subscription.current_period_end?'Próximo marco de cobrança: '+dateText(subscription.current_period_end):'Sua assinatura está ativa.';
      else if(subscription.status==='cancelled'&&activeWindow(subscription))date.textContent='Acesso até '+dateText(subscription.current_period_end)+'. Não haverá nova cobrança.';
      else if(subscription.status==='pending')date.textContent='O acesso será liberado depois da confirmação do provedor de pagamento.';
      else if(subscription.status==='past_due')date.textContent='Regularize o pagamento para manter seu acesso ao Clube.';
      else if(subscription.status==='cancelled')date.textContent='A assinatura foi encerrada. Você pode assinar novamente.';
      else date.textContent='';
    }
    if(icon){icon.textContent=active?'✓':subscription.status==='pending'?'…':'!';icon.classList.toggle('is-warning',!active)}
    if(cancelBtn){cancelBtn.hidden=!['active','past_due'].includes(subscription.status);cancelBtn.disabled=cancelling||busy||!subscription.can_cancel;cancelBtn.textContent=cancelling?'Cancelando…':'Cancelar renovação';cancelBtn.title=!subscription.can_cancel?'Aguardando confirmação da assinatura pelo provedor.':''}
  }
  if(interestBtn){interestBtn.disabled=busy||cancelling;interestBtn.innerHTML=interest?'Interesse registrado <span>✓</span>':'Quero acompanhar o lançamento <span>↗</span>';interestBtn.classList.toggle('is-saved',interest)}
  if(subscription?.status==='active')setPlanBadge('ASSINATURA ATIVA');
  else if(subscription?.status==='pending')setPlanBadge('AGUARDANDO PAGAMENTO');
  else if(subscription?.status==='past_due')setPlanBadge('PAGAMENTO PENDENTE');
  else setPlanBadge('R$ 6/MÊS');
}
async function loadInterest(){
 if(!user){interest=false;updateUI();return}
 const {data,error}=await supabase.from('club_launch_interest').select('user_id').eq('user_id',user.id).maybeSingle();
 if(error)throw error;interest=!!data;updateUI();
}
async function loadSubscription(){
 if(!user){subscription=null;updateUI();return}
 const {data,error}=await supabase.functions.invoke('club-status',{body:{}});
 if(error)throw new Error(await functionError(error,'Não foi possível consultar sua assinatura.'));
 subscription=data?.subscription||null;updateUI();
}
async function startCheckout(){
 if(busy||cancelling)return;
 if(!user){location.href=signInUrl('subscribe');return}
 if(subscription?.status==='active'||(subscription?.status==='cancelled'&&activeWindow(subscription))){msg(paymentStatus,'Sua assinatura ou período de acesso já está ativo.');return}
 busy=true;updateUI();msg(paymentStatus);
 try{
  const {data,error}=await supabase.functions.invoke('club-checkout',{body:{}});
  if(error)throw new Error(await functionError(error,'Não foi possível abrir o checkout.'));
  if(data?.alreadyActive){await loadSubscription();msg(paymentStatus,data.message||'Sua assinatura já está ativa.');return}
  if(!data?.checkoutUrl||!String(data.checkoutUrl).startsWith('https://'))throw new Error('O checkout não retornou um link seguro.');
  location.assign(data.checkoutUrl);
 }catch(e){msg(paymentStatus,humanError(e,'Não foi possível iniciar o pagamento.'),true)}
 finally{busy=false;updateUI()}
}
async function cancelSubscription(){
 if(!user||busy||cancelling)return;
 if(!confirm('Cancelar a renovação do Clube? O provedor interromperá as próximas cobranças. Isso não é um reembolso de valores já pagos.'))return;
 cancelling=true;updateUI();msg(paymentStatus);
 try{
  const {data,error}=await supabase.functions.invoke('club-cancel',{body:{}});
  if(error)throw new Error(await functionError(error,'Não foi possível cancelar a renovação.'));
  await loadSubscription();msg(paymentStatus,data?.message||'Renovação cancelada.');
 }catch(e){msg(paymentStatus,humanError(e,'Não foi possível cancelar a renovação.'),true)}
 finally{cancelling=false;updateUI()}
}
async function registerInterest(){
 if(!user){location.href=signInUrl('interest');return}
 if(busy||cancelling)return;
 busy=true;updateUI();msg(interestStatus);
 try{
  if(interest){const {error}=await supabase.from('club_launch_interest').delete().eq('user_id',user.id);if(error)throw error;interest=false;msg(interestStatus,'Seu interesse foi removido. Nenhuma cobrança foi criada.')}
  else{const {error}=await supabase.from('club_launch_interest').insert({user_id:user.id});if(error&&error.code!=='23505')throw error;interest=true;msg(interestStatus,'Interesse registrado. Isso não é uma assinatura e não há cobrança.')}
 }catch(e){msg(interestStatus,humanError(e,'Não foi possível salvar sua solicitação.'),true)}
 finally{busy=false;updateUI()}
}
subscribeBtn?.addEventListener('click',()=>void startCheckout());
cancelBtn?.addEventListener('click',()=>void cancelSubscription());
interestBtn?.addEventListener('click',()=>void registerInterest());

async function start(){
 try{
  const {data,error}=await supabase.auth.getSession();if(error)throw error;
  user=data.session?.user||null;updateUI();
  if(user)await Promise.all([loadInterest(),loadSubscription()]);
  const p=new URLSearchParams(location.search);
  if(p.get('checkout')==='success')msg(paymentStatus,subscription?.status==='active'?'Pagamento confirmado. Bem-vindo ao Clube Onde compro?':'Você voltou do checkout. Estamos aguardando confirmação segura do provedor; o acesso só será liberado após essa confirmação.');
  else if(p.get('checkout')==='cancelled')msg(paymentStatus,'O checkout foi cancelado. Nenhuma assinatura foi ativada.');
  else if(p.get('checkout')==='expired')msg(paymentStatus,'O checkout expirou. Você pode iniciar uma nova tentativa.');
  if(p.get('assinar')==='1'){if(!user)msg(paymentStatus,'Entre ou crie uma conta para assinar o Clube.');else if(subscription?.status!=='active'&&!(subscription?.status==='cancelled'&&activeWindow(subscription)))await startCheckout()}
  if(p.get('interesse')==='1'){if(user&&!interest)await registerInterest();else if(!user)msg(interestStatus,'Entre ou crie uma conta para registrar seu interesse.');else msg(interestStatus,'Seu interesse já está registrado. Obrigado por apoiar o Clube!')}
 }catch(e){msg(paymentStatus,humanError(e,'Não conseguimos carregar os dados do Clube.'),true)}
}
supabase.auth.onAuthStateChange((event,session)=>{user=session?.user||null;updateUI();if(user)void Promise.all([loadInterest(),loadSubscription()]).catch(e=>msg(paymentStatus,humanError(e,'Não foi possível sincronizar sua conta.'),true));else{interest=false;subscription=null;updateUI()}});
void start();

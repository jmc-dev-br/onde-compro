import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ynqtjkdoqmajxtfmpkbt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_JA9F1w3ntSuPtRALACWnlA_H1wjixNt';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
const $ = (id) => document.getElementById(id);
const button = $('clubInterestButton');
const statusBox = $('clubInterestStatus');
const accountLink = $('clubAccountLink');
let currentUser = null;
let hasInterest = false;
let working = false;

function setStatus(message = '', error = false) {
  statusBox.textContent = message;
  statusBox.hidden = !message;
  statusBox.classList.toggle('is-error', Boolean(error));
}
function updateUI() {
  if (currentUser) {
    accountLink.textContent = 'Minha conta ↗';
    accountLink.href = '/?conta=1';
  } else {
    accountLink.textContent = 'Entrar na conta ↗';
    accountLink.href = '/?conta=1&retorno=%2Fclube.html';
  }
  button.disabled = working;
  if (hasInterest) {
    button.innerHTML = 'Você está na lista <span>✓</span>';
    button.classList.add('club-interest-saved');
    button.setAttribute('aria-label', 'Retirar meu interesse do Clube Onde compro?');
  } else {
    button.innerHTML = 'Quero demonstrar interesse <span>↗</span>';
    button.classList.remove('club-interest-saved');
    button.setAttribute('aria-label', 'Demonstrar interesse no lançamento do clube');
  }
}
function returnForInterestUrl() {
  return '/?conta=1&retorno=%2Fclube.html%3Finteresse%3D1';
}
function humanError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('row-level security') || message.includes('permission denied')) return 'Não foi possível registrar o interesse. Confira se você está conectado e tente novamente.';
  if (message.includes('failed to fetch') || message.includes('network')) return 'Não conseguimos conectar ao serviço. Verifique sua internet e tente novamente.';
  return 'Não foi possível salvar sua solicitação. Tente novamente.';
}
async function loadInterest() {
  if (!currentUser) {
    hasInterest = false;
    updateUI();
    return;
  }
  const { data, error } = await supabase.from('club_launch_interest')
    .select('user_id')
    .eq('user_id', currentUser.id)
    .maybeSingle();
  if (error) throw error;
  hasInterest = Boolean(data);
  updateUI();
}
async function registerInterest() {
  if (!currentUser || working) return;
  working = true;
  updateUI();
  setStatus();
  try {
    if (hasInterest) {
      const { error } = await supabase.from('club_launch_interest').delete().eq('user_id', currentUser.id);
      if (error) throw error;
      hasInterest = false;
      setStatus('Seu interesse foi removido. Nenhuma assinatura ou cobrança foi criada.');
    } else {
      const { error } = await supabase.from('club_launch_interest').insert({ user_id: currentUser.id });
      if (error && error.code !== '23505') throw error;
      hasInterest = true;
      setStatus('Interesse registrado! Isso não é uma assinatura e não há cobrança. Avisos automáticos só serão adicionados quando o clube estiver pronto.');
      const url = new URL(window.location.href);
      url.searchParams.delete('interesse');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  } catch (error) {
    setStatus(humanError(error), true);
  } finally {
    working = false;
    updateUI();
  }
}
button.addEventListener('click', () => {
  if (!currentUser) {
    window.location.href = returnForInterestUrl();
    return;
  }
  void registerInterest();
});
async function start() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user || null;
    updateUI();
    await loadInterest();
    if (new URLSearchParams(window.location.search).get('interesse') === '1') {
      if (currentUser && !hasInterest) {
        await registerInterest();
      } else if (!currentUser) {
        setStatus('Entre ou crie uma conta para registrar seu interesse. Ainda não existe cobrança nesta fase.');
      } else {
        setStatus('Seu interesse já está registrado. Obrigado por apoiar a ideia do clube!');
      }
    }
  } catch (error) {
    updateUI();
    setStatus(humanError(error), true);
  }
}
supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  updateUI();
  if (currentUser) {
    void loadInterest().then(async () => {
      if (new URLSearchParams(window.location.search).get('interesse') === '1' && !hasInterest) {
        await registerInterest();
      }
    }).catch((error) => setStatus(humanError(error), true));
  } else {
    hasInterest = false;
    updateUI();
  }
});
void start();

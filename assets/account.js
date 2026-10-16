import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ynqtjkdoqmajxtfmpkbt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_JA9F1w3ntSuPtRALACWnlA_H1wjixNt';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const $ = (id) => document.getElementById(id);
const modal = $('accountModal');
const openButton = $('openAccountDialog');
const authView = $('accountAuthView');
const profileView = $('accountProfileView');
const resetView = $('accountResetView');
const newPasswordView = $('accountNewPasswordView');
const form = $('accountForm');
const resetForm = $('accountResetForm');
const newPasswordForm = $('accountNewPasswordForm');
const nameField = $('accountNameField');
const confirmField = $('accountConfirmField');
const forgotRow = $('accountForgotRow');
const title = $('accountDialogTitle');
const description = $('accountDialogDescription');
const submitButton = $('accountSubmit');
const statusBox = $('accountStatus');
const resetStatus = $('accountResetStatus');
const profileStatus = $('accountProfileStatus');
const newPasswordStatus = $('accountNewPasswordStatus');
let mode = 'signin';
let currentUser = null;

function clean(value) { return String(value || '').trim(); }
function setStatus(element, message = '', error = false) {
  if (!element) return;
  element.textContent = message;
  element.hidden = !message;
  element.classList.toggle('is-error', Boolean(error));
}
function showView(view) {
  authView.hidden = view !== 'auth';
  profileView.hidden = view !== 'profile';
  resetView.hidden = view !== 'reset';
  newPasswordView.hidden = view !== 'new-password';
  const dialog = modal?.querySelector('.account-dialog');
  const headings = { auth: 'accountDialogTitle', profile: 'accountDialogTitleProfile', reset: 'accountResetTitle', 'new-password': 'accountNewPasswordTitle' };
  const descriptions = { auth: 'accountDialogDescription', profile: 'accountProfileDescription', reset: 'accountResetDescription', 'new-password': 'accountNewPasswordDescription' };
  if (dialog && headings[view]) dialog.setAttribute('aria-labelledby', headings[view]);
  if (dialog && descriptions[view]) dialog.setAttribute('aria-describedby', descriptions[view]);
}
function openModal() {
  modal.hidden = false;
  document.body.classList.add('account-modal-open');
  if (currentUser) showProfile();
  else setMode('signin');
  $('accountClose').focus();
}
function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('account-modal-open');
  openButton?.focus();
}
function setMode(nextMode, message = '') {
  mode = nextMode;
  showView('auth');
  nameField.hidden = mode !== 'signup';
  confirmField.hidden = mode !== 'signup';
  forgotRow.hidden = mode !== 'signin';
  $('accountModeSignin').classList.toggle('active', mode === 'signin');
  $('accountModeSignup').classList.toggle('active', mode === 'signup');
  $('accountModeSignin').setAttribute('aria-pressed', String(mode === 'signin'));
  $('accountModeSignup').setAttribute('aria-pressed', String(mode === 'signup'));
  title.textContent = mode === 'signup' ? 'Crie sua conta' : 'Entre na sua conta';
  description.textContent = mode === 'signup'
    ? 'Cadastre-se para acompanhar sua experiência no Onde compro?.'
    : 'Entre para acessar seu perfil e manter sua conta.';
  submitButton.textContent = mode === 'signup' ? 'Criar conta' : 'Entrar';
  $('accountPassword').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
  setStatus(statusBox, message);
}
function friendlyAuthError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (message.includes('user already registered')) return 'Esse e-mail já possui uma conta. Entre ou recupere sua senha.';
  if (message.includes('password should be at least')) return 'Use uma senha com pelo menos 8 caracteres.';
  if (message.includes('email not confirmed')) return 'Confirme seu e-mail pelo link enviado antes de entrar.';
  if (message.includes('rate limit')) return 'Muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.';
  if (message.includes('redirect') || message.includes('url not allowed')) return 'O endereço de retorno ainda precisa ser autorizado nas configurações de autenticação do Supabase.';
  return error?.message || 'Não foi possível concluir a solicitação. Tente novamente.';
}
async function showProfile() {
  if (!currentUser) { setMode('signin'); return; }
  showView('profile');
  setStatus(statusBox);
  setStatus(profileStatus);
  $('accountEmail').textContent = currentUser.email || 'E-mail não disponível';
  $('accountProfileName').value = currentUser.user_metadata?.display_name || (currentUser.email || '').split('@')[0] || '';
  try {
    const { data, error } = await supabase.from('profiles')
      .select('display_name')
      .eq('id', currentUser.id)
      .single();
    if (!error && data?.display_name) $('accountProfileName').value = data.display_name;
  } catch (_) { /* Keep the metadata fallback visible. */ }
  $('accountDialogTitle').textContent = 'Minha conta';
  $('accountDialogDescription').textContent = 'Gerencie os dados básicos do seu perfil.';
}
function updateNav() {
  if (!openButton) return;
  openButton.textContent = currentUser ? 'Minha conta' : 'Entrar';
  openButton.setAttribute('aria-label', currentUser ? 'Abrir minha conta' : 'Entrar ou criar conta');
}
openButton?.addEventListener('click', openModal);
$('accountClose')?.addEventListener('click', closeModal);
modal?.querySelectorAll('[data-close-account]').forEach((el) => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && !modal.hidden) closeModal();
});
$('accountModeSignin')?.addEventListener('click', () => setMode('signin'));
$('accountModeSignup')?.addEventListener('click', () => setMode('signup'));
$('accountForgotPassword')?.addEventListener('click', () => {
  showView('reset');
  setStatus(resetStatus);
  $('accountResetEmail').value = $('accountEmailInput').value;
  $('accountResetEmail').focus();
});
$('accountBackToLogin')?.addEventListener('click', () => setMode('signin'));

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = clean($('accountEmailInput').value).toLowerCase();
  const password = $('accountPassword').value;
  submitButton.disabled = true;
  submitButton.textContent = mode === 'signup' ? 'Criando conta…' : 'Entrando…';
  setStatus(statusBox);
  try {
    if (mode === 'signup') {
      const displayName = clean($('accountName').value);
      if (!displayName) throw new Error('Digite seu nome.');
      if (password.length < 8) throw new Error('Use uma senha com pelo menos 8 caracteres.');
      if (password !== $('accountPasswordConfirm').value) throw new Error('As senhas não coincidem.');
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
      if (data.session && data.user) {
        currentUser = data.user;
        updateNav();
        await showProfile();
        setStatus(profileStatus, 'Conta criada com sucesso!');
      } else {
        setStatus(statusBox, 'Cadastro iniciado! Confira seu e-mail para confirmar a conta. Depois, entre aqui.');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      currentUser = data.user;
      updateNav();
      await showProfile();
      setStatus(profileStatus, 'Você entrou na sua conta.');
    }
  } catch (error) {
    setStatus(statusBox, friendlyAuthError(error), true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = mode === 'signup' ? 'Criar conta' : 'Entrar';
  }
});
resetForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = clean($('accountResetEmail').value).toLowerCase();
  const button = $('accountResetSubmit');
  button.disabled = true;
  button.textContent = 'Enviando…';
  setStatus(resetStatus);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname + '#redefinir-senha'
    });
    if (error) throw error;
    setStatus(resetStatus, 'Se esse e-mail estiver cadastrado, enviaremos as instruções de recuperação. Verifique também a caixa de spam.');
  } catch (error) {
    setStatus(resetStatus, friendlyAuthError(error), true);
  } finally {
    button.disabled = false;
    button.textContent = 'Enviar instruções';
  }
});
newPasswordForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const password = $('accountNewPassword').value;
  if (password.length < 8) { setStatus(newPasswordStatus, 'Use uma senha com pelo menos 8 caracteres.', true); return; }
  if (password !== $('accountNewPasswordConfirm').value) { setStatus(newPasswordStatus, 'As senhas não coincidem.', true); return; }
  const button = $('accountNewPasswordSubmit');
  button.disabled = true;
  button.textContent = 'Salvando…';
  setStatus(newPasswordStatus);
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    $('accountNewPassword').value = '';
    $('accountNewPasswordConfirm').value = '';
    setStatus(newPasswordStatus, 'Senha atualizada. Você já pode continuar usando sua conta.');
    setTimeout(() => { if (currentUser) showProfile(); else setMode('signin'); }, 1300);
  } catch (error) {
    setStatus(newPasswordStatus, friendlyAuthError(error), true);
  } finally {
    button.disabled = false;
    button.textContent = 'Salvar nova senha';
  }
});
$('accountProfileForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  const displayName = clean($('accountProfileName').value);
  if (!displayName) { setStatus(profileStatus, 'Digite seu nome.', true); return; }
  const button = $('accountProfileSave');
  button.disabled = true;
  button.textContent = 'Salvando…';
  setStatus(profileStatus);
  try {
    const { error } = await supabase.from('profiles')
      .update({ display_name: displayName })
      .eq('id', currentUser.id);
    if (error) throw error;
    const { error: authError } = await supabase.auth.updateUser({ data: { display_name: displayName } });
    if (authError) throw authError;
    currentUser = { ...currentUser, user_metadata: { ...currentUser.user_metadata, display_name: displayName } };
    setStatus(profileStatus, 'Perfil atualizado.');
  } catch (error) {
    setStatus(profileStatus, friendlyAuthError(error), true);
  } finally {
    button.disabled = false;
    button.textContent = 'Salvar alterações';
  }
});
$('accountSignout')?.addEventListener('click', async () => {
  const button = $('accountSignout');
  button.disabled = true;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    currentUser = null;
    updateNav();
    setMode('signin', 'Você saiu da sua conta.');
  } catch (error) {
    setStatus(profileStatus, friendlyAuthError(error), true);
  } finally {
    button.disabled = false;
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  updateNav();
  if (event === 'PASSWORD_RECOVERY') {
    modal.hidden = false;
    document.body.classList.add('account-modal-open');
    showView('new-password');
    setStatus(newPasswordStatus, 'Escolha uma nova senha para sua conta.');
  } else if (event === 'SIGNED_OUT') {
    if (modal && !modal.hidden) setMode('signin');
  } else if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && currentUser && modal && !modal.hidden) {
    showProfile();
  }
});
(async () => {
  const { data } = await supabase.auth.getSession();
  currentUser = data?.session?.user || null;
  updateNav();
  // O evento PASSWORD_RECOVERY abre a tela da nova senha ao validar o link de recuperação.
})();

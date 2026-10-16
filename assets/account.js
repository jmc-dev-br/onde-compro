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
let currentProfile = {};

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
function initialsForProfile(name) {
  const value = clean(name || currentUser?.email?.split('@')[0] || 'Você');
  return value.charAt(0).toLocaleUpperCase('pt-BR') || '♙';
}
function paintAvatar(url, name) {
  const preview = $('accountProfileAvatarPreview');
  const fallback = $('accountProfileAvatarFallback');
  const navImage = $('accountNavAvatar');
  const navFallback = $('accountNavAvatarIcon');
  const hasUrl = Boolean(url);
  if (preview) {
    preview.onerror = () => {
      preview.hidden = true;
      preview.removeAttribute('src');
      if (fallback) { fallback.hidden = false; fallback.textContent = initialsForProfile(name); }
    };
    if (hasUrl) { preview.src = url; preview.hidden = false; }
    else { preview.hidden = true; preview.removeAttribute('src'); }
  }
  if (fallback) { fallback.hidden = hasUrl; fallback.textContent = initialsForProfile(name); }
  if (navImage) {
    navImage.onerror = () => { navImage.hidden = true; navImage.removeAttribute('src'); if (navFallback) navFallback.hidden = false; };
    if (hasUrl) { navImage.src = url; navImage.hidden = false; }
    else { navImage.hidden = true; navImage.removeAttribute('src'); }
  }
  if (navFallback) { navFallback.hidden = hasUrl; navFallback.textContent = initialsForProfile(name); }
  const removeButton = $('accountAvatarRemove');
  if (removeButton) removeButton.hidden = !hasUrl;
}
function updateProfileCompletion() {
  const name = clean($('accountProfileName')?.value);
  const username = clean($('accountProfileUsername')?.value);
  const bio = clean($('accountProfileBio')?.value);
  const avatar = clean(currentProfile.avatar_url);
  const categories = [...document.querySelectorAll('input[name="favoriteCategory"]:checked')];
  const filled = [name.length > 0, username.length >= 3, bio.length > 0, Boolean(avatar), categories.length > 0].filter(Boolean).length;
  const percentage = Math.round((filled / 5) * 100);
  const progress = $('accountProfileProgress');
  if (progress) progress.setAttribute('aria-valuenow', String(percentage));
  if ($('accountProfileProgressBar')) $('accountProfileProgressBar').style.width = percentage + '%';
  if ($('accountProfileProgressText')) $('accountProfileProgressText').textContent = percentage + '% completo';
}
function publicAvatarUrl(path) {
  return supabase.storage.from('profile-avatars').getPublicUrl(path).data.publicUrl;
}
function storagePathFromAvatarUrl(url) {
  try {
    const parsed = new URL(url);
    const marker = '/storage/v1/object/public/profile-avatars/';
    const index = parsed.pathname.indexOf(marker);
    if (index < 0) return null;
    const path = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    return currentUser && path.startsWith(currentUser.id + '/') ? path : null;
  } catch (_) { return null; }
}
async function showProfile() {
  if (!currentUser) { setMode('signin'); return; }
  showView('profile');
  setStatus(statusBox);
  setStatus(profileStatus);
  $('accountEmail').textContent = currentUser.email || 'E-mail não disponível';
  $('accountProfileName').value = currentUser.user_metadata?.display_name || (currentUser.email || '').split('@')[0] || '';
  $('accountProfileUsername').value = '';
  $('accountProfileBio').value = '';
  $('accountProfileWebsite').value = '';
  document.querySelectorAll('input[name="favoriteCategory"]').forEach((input) => { input.checked = false; });
  currentProfile = {};
  try {
    const { data, error } = await supabase.from('profiles')
      .select('display_name, username, bio, avatar_url, favorite_categories, website')
      .eq('id', currentUser.id)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      currentProfile = data;
      $('accountProfileName').value = data.display_name || $('accountProfileName').value;
      $('accountProfileUsername').value = data.username || '';
      $('accountProfileBio').value = data.bio || '';
      $('accountProfileWebsite').value = data.website || '';
      const selected = Array.isArray(data.favorite_categories) ? data.favorite_categories : [];
      document.querySelectorAll('input[name="favoriteCategory"]').forEach((input) => { input.checked = selected.includes(input.value); });
    }
  } catch (error) {
    setStatus(profileStatus, 'Não conseguimos carregar seu perfil agora. ' + friendlyAuthError(error), true);
  }
  $('accountDialogTitleProfile').textContent = 'Seu cantinho';
  $('accountProfileDescription').textContent = 'Personalize seu perfil e deixe a experiência com a sua cara.';
  $('accountBioCount').textContent = String($('accountProfileBio').value.length);
  paintAvatar(currentProfile.avatar_url, $('accountProfileName').value);
  updateNav();
  updateProfileCompletion();
}
function updateNav() {
  if (!openButton) return;
  const label = $('accountNavLabel');
  if (label) label.textContent = currentUser ? 'Minha conta' : 'Entrar';
  openButton.setAttribute('aria-label', currentUser ? 'Abrir minha conta' : 'Entrar ou criar conta');
  paintAvatar(currentProfile.avatar_url, currentProfile.display_name || currentUser?.user_metadata?.display_name || currentUser?.email);
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
  const username = clean($('accountProfileUsername').value).replace(/^@+/, '').toLowerCase() || null;
  const bio = clean($('accountProfileBio').value);
  let website = clean($('accountProfileWebsite').value) || null;
  const favorite_categories = [...document.querySelectorAll('input[name="favoriteCategory"]:checked')].map((input) => input.value);
  if (!displayName) { setStatus(profileStatus, 'Digite seu nome.', true); return; }
  if (displayName.length > 60) { setStatus(profileStatus, 'O nome deve ter no máximo 60 caracteres.', true); return; }
  if (username && !/^[a-z0-9_]{3,20}$/.test(username)) { setStatus(profileStatus, 'O nome de usuário precisa ter de 3 a 20 caracteres: letras, números ou _.', true); return; }
  if (bio.length > 240) { setStatus(profileStatus, 'A descrição deve ter no máximo 240 caracteres.', true); return; }
  if (website) {
    try {
      const parsed = new URL(website);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('link inválido');
      website = parsed.href;
    } catch (_) { setStatus(profileStatus, 'Digite um link válido começando com https:// ou http://.', true); return; }
  }
  const button = $('accountProfileSave');
  button.disabled = true;
  button.textContent = 'Salvando…';
  setStatus(profileStatus);
  try {
    const { error } = await supabase.from('profiles')
      .update({ display_name: displayName, username, bio, website, favorite_categories })
      .eq('id', currentUser.id);
    if (error) {
      if (error.code === '23505') throw new Error('Esse nome de usuário já está em uso. Escolha outro.');
      if (error.code === '23514') throw new Error('Confira os limites e o formato dos campos do perfil.');
      throw error;
    }
    currentProfile = { ...currentProfile, display_name: displayName, username, bio, website, favorite_categories };
    const { error: authError } = await supabase.auth.updateUser({ data: { display_name: displayName } });
    currentUser = { ...currentUser, user_metadata: { ...currentUser.user_metadata, display_name: displayName } };
    paintAvatar(currentProfile.avatar_url, displayName);
    updateProfileCompletion();
    setStatus(profileStatus, authError ? 'Perfil salvo. O nome de exibição do login poderá atualizar na próxima sessão.' : 'Perfil salvo com sucesso! Suas informações foram atualizadas.');
  } catch (error) {
    setStatus(profileStatus, friendlyAuthError(error), true);
  } finally {
    button.disabled = false;
    button.textContent = 'Salvar meu perfil';
  }
});
$('accountProfileName')?.addEventListener('input', updateProfileCompletion);
$('accountProfileUsername')?.addEventListener('input', function() {
  const raw = this.value;
  const normalized = raw.replace(/^@+/, '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (normalized !== raw) this.value = normalized;
  updateProfileCompletion();
});
$('accountProfileBio')?.addEventListener('input', function() {
  $('accountBioCount').textContent = String(this.value.length);
  updateProfileCompletion();
});
document.querySelectorAll('input[name="favoriteCategory"]').forEach((input) => input.addEventListener('change', updateProfileCompletion));

async function optimizeAvatar(file) {
  if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Escolha uma imagem JPG, PNG ou WebP.');
  if (file.size > 8 * 1024 * 1024) throw new Error('A imagem precisa ter até 8 MB antes de ser otimizada.');
  let bitmap;
  try { bitmap = await createImageBitmap(file); }
  catch (_) { throw new Error('Não conseguimos abrir essa imagem. Tente outro arquivo.'); }
  try {
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não conseguimos preparar essa imagem.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Falha ao otimizar a imagem.')), 'image/webp', .86));
    if (blob.size > 2 * 1024 * 1024) throw new Error('A imagem otimizada ainda ficou muito grande. Tente uma foto menor.');
    return blob;
  } finally { bitmap.close?.(); }
}
$('accountAvatarFile')?.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file || !currentUser) return;
  const button = $('accountProfileSave');
  const uploadLabel = document.querySelector('label[for="accountAvatarFile"]');
  if (uploadLabel) uploadLabel.textContent = 'Preparando foto…';
  if (button) button.disabled = true;
  setStatus(profileStatus);
  let uploadedPath = null;
  try {
    const blob = await optimizeAvatar(file);
    uploadedPath = currentUser.id + '/avatar-' + Date.now() + '.webp';
    const { error: uploadError } = await supabase.storage.from('profile-avatars').upload(uploadedPath, blob, {
      contentType: 'image/webp', cacheControl: '3600', upsert: false
    });
    if (uploadError) throw uploadError;
    const newUrl = publicAvatarUrl(uploadedPath);
    const { error: profileError } = await supabase.from('profiles')
      .update({ avatar_url: newUrl })
      .eq('id', currentUser.id);
    if (profileError) throw profileError;
    const previousPath = storagePathFromAvatarUrl(currentProfile.avatar_url);
    currentProfile = { ...currentProfile, avatar_url: newUrl };
    paintAvatar(newUrl, $('accountProfileName').value);
    updateNav();
    updateProfileCompletion();
    if (previousPath && previousPath !== uploadedPath) {
      await supabase.storage.from('profile-avatars').remove([previousPath]);
    }
    setStatus(profileStatus, 'Foto de perfil atualizada!');
  } catch (error) {
    if (uploadedPath) await supabase.storage.from('profile-avatars').remove([uploadedPath]).catch(() => {});
    const message = error?.message?.toLowerCase().includes('row-level security')
      ? 'Não foi possível enviar a foto. Confira se você está conectado e tente novamente.'
      : friendlyAuthError(error);
    setStatus(profileStatus, message, true);
  } finally {
    if (uploadLabel) uploadLabel.textContent = 'Trocar foto';
    if (button) button.disabled = false;
  }
});
$('accountAvatarRemove')?.addEventListener('click', async () => {
  if (!currentUser || !currentProfile.avatar_url) return;
  const button = $('accountAvatarRemove');
  button.disabled = true;
  setStatus(profileStatus);
  const oldPath = storagePathFromAvatarUrl(currentProfile.avatar_url);
  try {
    const { error } = await supabase.from('profiles')
      .update({ avatar_url: null })
      .eq('id', currentUser.id);
    if (error) throw error;
    currentProfile = { ...currentProfile, avatar_url: null };
    paintAvatar(null, $('accountProfileName').value);
    updateNav();
    updateProfileCompletion();
    if (oldPath) await supabase.storage.from('profile-avatars').remove([oldPath]);
    setStatus(profileStatus, 'Foto removida. Você pode adicionar outra quando quiser.');
  } catch (error) {
    setStatus(profileStatus, friendlyAuthError(error), true);
  } finally { button.disabled = false; }
});
$('accountSignout')?.addEventListener('click', async () => {
  const button = $('accountSignout');
  button.disabled = true;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    currentUser = null;
    currentProfile = {};
    updateNav();
    setMode('signin', 'Você saiu da sua conta.');
  } catch (error) {
    setStatus(profileStatus, friendlyAuthError(error), true);
  } finally {
    button.disabled = false;
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  const previousUserId = currentUser?.id;
  currentUser = session?.user || null;
  if (!currentUser || previousUserId !== currentUser.id) currentProfile = {};
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

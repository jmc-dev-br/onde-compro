import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ynqtjkdoqmajxtfmpkbt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_JA9F1w3ntSuPtRALACWnlA_H1wjixNt';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
const $ = (id) => document.getElementById(id);
const gate = $('socialLoginGate');
const app = $('socialApp');
const globalStatus = $('socialGlobalStatus');
const peopleGrid = $('socialPeopleGrid');
const communitiesGrid = $('socialCommunitiesGrid');
const communityDetail = $('socialCommunityDetail');
const createForm = $('socialCreateCommunityForm');
const postDetail = $('socialCommunityDetailHeader');
const postDiscussion = $('socialCommunityDiscussion');
let currentUser = null;
let myProfile = null;
let people = [];
let follows = [];
let communities = [];
let memberships = [];
let selectedCommunityId = null;
let busy = false;

const clean = (v) => String(v ?? '').trim();
const safeText = (v, fallback = '') => clean(v) || fallback;
function status(el, message = '', error = false) {
  if (!el) return;
  el.textContent = message;
  el.hidden = !message;
  el.classList.toggle('is-error', Boolean(error));
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}
function initials(name) {
  const value = clean(name);
  return value ? value.slice(0, 1).toLocaleUpperCase('pt-BR') : '♙';
}
function profileName(profile) {
  return safeText(profile?.display_name, profile?.username ? '@' + profile.username : 'Pessoa do Onde compro?');
}
function profileHandle(profile) {
  return profile?.username ? '@' + profile.username : 'Membro do Onde compro?';
}
function safeImageUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' ? u.href : '';
  } catch (_) { return ''; }
}
function addAvatar(host, url, label, cls) {
  host.classList.add(cls);
  const src = safeImageUrl(url);
  if (src) {
    const img = element('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', () => {
      img.remove();
      host.textContent = initials(label);
    }, { once: true });
    host.append(img);
  } else host.textContent = initials(label);
}
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Agora';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined }).format(date);
}
function isFollowing(id) { return follows.some((row) => row.follower_id === currentUser.id && row.followed_id === id); }
function followsMe(id) { return follows.some((row) => row.follower_id === id && row.followed_id === currentUser.id); }
function isMember(id) { return memberships.some((row) => row.community_id === id && row.user_id === currentUser.id); }
function myMembership(id) { return memberships.find((row) => row.community_id === id && row.user_id === currentUser.id); }
function memberCount(id) { return memberships.filter((row) => row.community_id === id).length; }
function followingCount(id) { return follows.filter((row) => row.follower_id === id).length; }
function followerCount(id) { return follows.filter((row) => row.followed_id === id).length; }
function iconForCategory(category) {
  const icons = { Tecnologia: '⌘', Games: '🎮', Ofertas: '✳', Casa: '⌂', Moda: '✦', Livros: '▤', Beleza: '✧', Esportes: '⚽', Música: '♫', Finanças: '↗', Geral: '✳', Outros: '◇' };
  return icons[category] || '✳';
}
function setView(name) {
  const views = { people: $('socialPeopleView'), communities: $('socialCommunitiesView'), mine: $('socialMineView') };
  Object.entries(views).forEach(([key, view]) => { view.hidden = key !== name; });
  document.querySelectorAll('[data-social-view]').forEach((button) => {
    const active = button.dataset.socialView === name;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  if (name !== 'communities') {
    communityDetail.hidden = true;
    communitiesGrid.hidden = false;
    selectedCommunityId = null;
  }
  if (name === 'mine') renderMine();
}
function requireSession() {
  const hasSession = Boolean(currentUser);
  gate.hidden = hasSession;
  app.hidden = !hasSession;
  return hasSession;
}
async function loadData() {
  if (!currentUser) return;
  status(globalStatus, 'Atualizando seu círculo…');
  const results = await Promise.all([
    supabase.from('profiles').select('id, display_name, username, bio, avatar_url, favorite_categories, website, created_at').order('created_at', { ascending: false }).limit(300),
    supabase.from('user_follows').select('follower_id, followed_id, created_at').limit(5000),
    supabase.from('communities').select('id, name, slug, description, category, creator_id, created_at').order('created_at', { ascending: false }).limit(300),
    supabase.from('community_members').select('community_id, user_id, role, joined_at').limit(10000)
  ]);
  const errorItem = results.find((r) => r.error);
  if (errorItem) throw errorItem.error;
  const [profilesResult, followsResult, communitiesResult, membershipsResult] = results;
  people = profilesResult.data || [];
  follows = followsResult.data || [];
  communities = communitiesResult.data || [];
  memberships = membershipsResult.data || [];
  myProfile = people.find((profile) => profile.id === currentUser.id) || null;
  const display = safeText(myProfile?.display_name, currentUser.email?.split('@')[0] || 'Sua conta');
  $('socialSelfName').textContent = display;
  $('socialSelfHandle').textContent = myProfile?.username ? '@' + myProfile.username : 'Sua conta no Onde compro?';
  const selfAvatar = $('socialSelfAvatar');
  const selfInitial = $('socialSelfInitial');
  const avatar = safeImageUrl(myProfile?.avatar_url);
  if (avatar) {
    selfAvatar.src = avatar;
    selfAvatar.hidden = false;
    selfAvatar.onerror = () => { selfAvatar.hidden = true; selfInitial.hidden = false; selfInitial.textContent = initials(display); };
    selfInitial.hidden = true;
  } else {
    selfAvatar.hidden = true;
    selfInitial.hidden = false;
    selfInitial.textContent = initials(display);
  }
  $('socialPeopleTabCount').textContent = String(Math.max(0, people.filter((p) => p.id !== currentUser.id).length));
  $('socialCommunitiesTabCount').textContent = String(communities.length);
  renderPeople();
  renderCommunities();
  renderMine();
  status(globalStatus);
}
function renderPeople() {
  const query = clean($('socialPeopleSearch').value).toLocaleLowerCase('pt-BR').replace(/^@/, '');
  const list = people.filter((profile) => {
    if (profile.id === currentUser.id) return false;
    const haystack = [profile.display_name, profile.username, profile.bio, ...(profile.favorite_categories || [])].join(' ').toLocaleLowerCase('pt-BR');
    return !query || haystack.includes(query);
  });
  $('socialPeopleCount').textContent = list.length + (list.length === 1 ? ' pessoa' : ' pessoas');
  peopleGrid.replaceChildren();
  if (!list.length) {
    const empty = element('div', 'social-empty');
    empty.append(element('span', '', '♧'), element('strong', '', query ? 'Nenhuma pessoa encontrada' : 'Você pode ser a primeira conexão'), element('p', '', query ? 'Tente outro nome, usuário ou interesse.' : 'Quando mais pessoas criarem uma conta, você poderá encontrá-las aqui e começar a seguir.'));
    peopleGrid.append(empty);
    return;
  }
  list.forEach((profile) => {
    const card = element('article', 'social-person-card');
    const head = element('div', 'social-person-head');
    const avatar = element('div', 'social-person-avatar');
    addAvatar(avatar, profile.avatar_url, profileName(profile), 'social-person-avatar');
    const name = element('div', 'social-person-name');
    name.append(element('strong', '', profileName(profile)), element('small', '', profileHandle(profile)));
    head.append(avatar, name);
    const bio = element('p', 'social-person-bio', safeText(profile.bio, 'Ainda não escreveu uma descrição para o perfil.'));
    const tags = element('div', 'social-person-tags');
    (Array.isArray(profile.favorite_categories) ? profile.favorite_categories : []).slice(0, 3).forEach((cat) => tags.append(element('span', '', cat)));
    const footer = element('div', 'social-person-footer');
    const stats = element('div', 'social-person-stats');
    stats.append(element('strong', '', String(followerCount(profile.id))), document.createTextNode(' seguidores'));
    stats.append(document.createElement('br'));
    stats.append(element('strong', '', String(followingCount(profile.id))), document.createTextNode(' seguindo'));
    const followBtn = element('button', 'social-follow-button', isFollowing(profile.id) ? (followsMe(profile.id) ? '✓ Amigos' : '✓ Seguindo') : '+ Seguir');
    followBtn.type = 'button';
    if (isFollowing(profile.id)) followBtn.classList.add(followsMe(profile.id) ? 'is-mutual' : 'is-following');
    followBtn.addEventListener('click', () => toggleFollow(profile.id, followBtn));
    footer.append(stats, followBtn);
    card.append(head, bio, tags, footer);
    peopleGrid.append(card);
  });
}
async function toggleFollow(targetId, button) {
  if (!currentUser || targetId === currentUser.id || button.disabled) return;
  button.disabled = true;
  try {
    if (isFollowing(targetId)) {
      const { error } = await supabase.from('user_follows').delete().eq('follower_id', currentUser.id).eq('followed_id', targetId);
      if (error) throw error;
      follows = follows.filter((row) => !(row.follower_id === currentUser.id && row.followed_id === targetId));
    } else {
      const { error } = await supabase.from('user_follows').insert({ follower_id: currentUser.id, followed_id: targetId });
      if (error) throw error;
      follows.push({ follower_id: currentUser.id, followed_id: targetId, created_at: new Date().toISOString() });
    }
    renderPeople();
    renderMine();
    status(globalStatus, isFollowing(targetId) ? 'Agora você está seguindo esse perfil.' : 'Você deixou de seguir esse perfil.');
    window.setTimeout(() => status(globalStatus), 2400);
  } catch (error) {
    status(globalStatus, humanError(error, 'Não foi possível atualizar o seguimento.'), true);
  } finally {
    button.disabled = false;
  }
}
function renderCommunities() {
  const query = clean($('socialCommunitySearch').value).toLocaleLowerCase('pt-BR');
  const list = communities.filter((community) => {
    const haystack = [community.name, community.description, community.category, community.slug].join(' ').toLocaleLowerCase('pt-BR');
    return !query || haystack.includes(query);
  });
  communitiesGrid.replaceChildren();
  if (!list.length) {
    const empty = element('div', 'social-empty');
    empty.append(element('span', '', '✳'), element('strong', '', query ? 'Nenhuma comunidade encontrada' : 'Sua próxima comunidade começa aqui'), element('p', '', query ? 'Tente buscar por outro assunto.' : 'Crie um grupo em torno de um interesse ou volte mais tarde para descobrir novas comunidades.'));
    communitiesGrid.append(empty);
    return;
  }
  list.forEach((community) => {
    const card = element('article', 'social-community-card');
    const top = element('div', 'social-community-card-top');
    const icon = element('div', 'social-community-art', iconForCategory(community.category));
    const pill = element('span', 'social-community-pill', community.category);
    top.append(icon, pill);
    const title = element('h4', '', community.name);
    const slug = element('small', 'social-community-slug', '/' + community.slug);
    const desc = element('p', '', safeText(community.description, 'Uma comunidade para conversar e compartilhar descobertas.'));
    const meta = element('div', 'social-community-card-meta');
    const peopleText = element('span');
    peopleText.append(element('strong', '', String(memberCount(community.id))), document.createTextNode(memberCount(community.id) === 1 ? ' membro' : ' membros'));
    const creator = people.find((p) => p.id === community.creator_id);
    meta.append(peopleText, element('span', '', 'por ' + safeText(creator?.display_name, 'membro')));
    const footer = element('div', 'social-community-card-footer');
    const openBtn = element('button', 'social-secondary-button', 'Ver grupo');
    openBtn.type = 'button';
    openBtn.addEventListener('click', () => openCommunity(community.id));
    const joinBtn = element('button', 'social-follow-button ' + (isMember(community.id) ? 'is-following' : ''), isMember(community.id) ? (myMembership(community.id)?.role === 'owner' ? '✳ Criador' : '✓ Entrou') : '＋ Entrar');
    joinBtn.type = 'button';
    joinBtn.disabled = myMembership(community.id)?.role === 'owner';
    joinBtn.addEventListener('click', () => toggleMembership(community.id, joinBtn));
    footer.append(openBtn, joinBtn);
    card.append(top, title, slug, desc, meta, footer);
    communitiesGrid.append(card);
  });
}
function makeJoinButton(community, labelOverride = '') {
  const isIn = isMember(community.id);
  const role = myMembership(community.id)?.role;
  const btn = element('button', 'social-primary-button', labelOverride || (isIn ? (role === 'owner' ? '✳ Você criou esta comunidade' : '✓ Você participa') : '＋ Entrar na comunidade'));
  btn.type = 'button';
  btn.disabled = role === 'owner';
  if (!isIn) btn.addEventListener('click', () => toggleMembership(community.id, btn));
  else if (role !== 'owner') {
    btn.className = 'social-secondary-button';
    btn.textContent = 'Sair da comunidade';
    btn.addEventListener('click', () => toggleMembership(community.id, btn));
  }
  return btn;
}
async function toggleMembership(id, button) {
  if (!currentUser || button.disabled) return;
  const row = myMembership(id);
  button.disabled = true;
  try {
    if (row) {
      if (row.role === 'owner') {
        status(globalStatus, 'O criador não pode sair da própria comunidade. Exclua o grupo apenas se tiver certeza.', true);
        return;
      }
      const { error } = await supabase.from('community_members').delete().eq('community_id', id).eq('user_id', currentUser.id);
      if (error) throw error;
      memberships = memberships.filter((m) => !(m.community_id === id && m.user_id === currentUser.id));
    } else {
      const { error } = await supabase.from('community_members').insert({ community_id: id, user_id: currentUser.id });
      if (error) throw error;
      memberships.push({ community_id: id, user_id: currentUser.id, role: 'member', joined_at: new Date().toISOString() });
    }
    renderCommunities();
    renderMine();
    if (selectedCommunityId === id) await renderCommunityDetail(id);
    status(globalStatus, row ? 'Você saiu da comunidade.' : 'Você entrou na comunidade!');
    window.setTimeout(() => status(globalStatus), 2600);
  } catch (error) {
    status(globalStatus, humanError(error, 'Não foi possível atualizar sua participação.'), true);
  } finally {
    button.disabled = false;
  }
}
function humanError(error, fallback) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('duplicate key') || error?.code === '23505') return 'Esse item já existe.';
  if (message.includes('row-level security') || message.includes('permission denied')) return 'Sua conta não tem permissão para essa ação. Confira se você está conectado.';
  if (message.includes('duplicate') || message.includes('unique')) return 'Esse nome de usuário ou identificador já está em uso.';
  if (message.includes('failed to fetch') || message.includes('network')) return 'Não foi possível conectar ao serviço. Confira sua internet e tente novamente.';
  return error?.message || fallback;
}
function slugFor(name) {
  const base = clean(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'grupo';
  return base + '-' + Math.random().toString(36).slice(2, 8);
}
$('socialCreateCommunityOpen').addEventListener('click', () => {
  createForm.hidden = !createForm.hidden;
  if (!createForm.hidden) $('socialCommunityName').focus();
});
$('socialCreateCommunityClose').addEventListener('click', () => { createForm.hidden = true; status($('socialCreateCommunityStatus')); });
createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  const name = clean($('socialCommunityName').value);
  const category = $('socialCommunityCategory').value;
  const description = clean($('socialCommunityDescription').value);
  if (name.length < 3 || name.length > 60) { status($('socialCreateCommunityStatus'), 'Use um nome entre 3 e 60 caracteres.', true); return; }
  if (description.length > 500) { status($('socialCreateCommunityStatus'), 'A descrição pode ter até 500 caracteres.', true); return; }
  const button = $('socialCreateCommunitySubmit');
  button.disabled = true;
  button.textContent = 'Criando…';
  status($('socialCreateCommunityStatus'));
  try {
    const { data, error } = await supabase.from('communities').insert({
      name, slug: slugFor(name), description, category, creator_id: currentUser.id
    }).select('id, name, slug, description, category, creator_id, created_at').single();
    if (error) throw error;
    const { error: joinError } = await supabase.from('community_members').select('community_id').eq('community_id', data.id).eq('user_id', currentUser.id).maybeSingle();
    if (joinError) throw joinError;
    $('socialCommunityName').value = '';
    $('socialCommunityDescription').value = '';
    createForm.hidden = true;
    await loadData();
    setView('communities');
    await openCommunity(data.id);
    status(globalStatus, 'Comunidade criada! Você já é o criador e primeiro membro.');
    window.setTimeout(() => status(globalStatus), 3000);
  } catch (error) {
    status($('socialCreateCommunityStatus'), humanError(error, 'Não foi possível criar a comunidade.'), true);
  } finally {
    button.disabled = false;
    button.textContent = 'Criar comunidade ↗';
  }
});
async function openCommunity(id) {
  const community = communities.find((item) => item.id === id);
  if (!community) return;
  selectedCommunityId = id;
  communitiesGrid.hidden = true;
  createForm.hidden = true;
  communityDetail.hidden = false;
  $('socialCommunityDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
  await renderCommunityDetail(id);
}
$('socialCommunityBack').addEventListener('click', () => {
  selectedCommunityId = null;
  communityDetail.hidden = true;
  communitiesGrid.hidden = false;
  $('socialCommunitiesView').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
async function renderCommunityDetail(id) {
  const community = communities.find((item) => item.id === id);
  if (!community) return;
  postDetail.replaceChildren();
  postDiscussion.replaceChildren();
  const hero = element('div', 'social-detail-hero');
  const icon = element('div', 'social-detail-icon', iconForCategory(community.category));
  const copy = element('div', 'social-detail-copy');
  const pill = element('span', 'social-community-pill', community.category);
  const title = element('h3', '', community.name);
  const desc = element('p', '', safeText(community.description, 'Uma comunidade para conversar e compartilhar descobertas.'));
  const details = element('div', 'social-detail-meta');
  details.append(element('span', '', '♧ ' + memberCount(id) + (memberCount(id) === 1 ? ' membro' : ' membros')));
  details.append(element('span', '', 'Criada em ' + formatDate(community.created_at)));
  const creator = people.find((p) => p.id === community.creator_id);
  details.append(element('span', '', 'Por ' + safeText(creator?.display_name, 'membro')));
  copy.append(pill, title, desc, details);
  const actions = element('div', 'social-detail-actions');
  const memberAction = makeJoinButton(community);
  actions.append(memberAction);
  if (myMembership(id)?.role === 'owner') {
    const deleteBtn = element('button', 'social-secondary-button', 'Excluir grupo');
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', () => deleteCommunity(community));
    actions.append(deleteBtn);
  }
  hero.append(icon, copy, actions);
  postDetail.append(hero);
  const discussion = element('div', 'social-discussion-main');
  const side = element('aside', 'social-discussion-sidebar');
  side.append(element('h4', '', 'Quem está aqui'), element('p', '', 'Pessoas que fazem parte dessa comunidade.'));
  const bubbles = element('div', 'social-discussion-members');
  const communityMembers = memberships.filter((m) => m.community_id === id);
  communityMembers.slice(0, 12).forEach((member) => {
    const profile = people.find((p) => p.id === member.user_id);
    const bubble = element('div', 'social-member-bubble');
    addAvatar(bubble, profile?.avatar_url, profileName(profile), 'social-member-bubble');
    bubble.title = profileName(profile);
    bubbles.append(bubble);
  });
  side.append(bubbles, element('span', 'social-member-text', communityMembers.length + (communityMembers.length === 1 ? ' membro' : ' membros')));
  side.append(document.createElement('hr'));
  side.append(element('h4', '', 'Sobre o grupo'), element('p', '', safeText(community.description, 'Sem descrição por enquanto.')));
  if (isMember(id)) {
    discussion.append(element('h4', '', 'Conversa da comunidade'), element('p', '', 'Compartilhe uma dica, faça uma pergunta ou conte uma descoberta de compra.'));
    const form = element('form', 'social-post-form');
    const label = element('label');
    label.htmlFor = 'socialNewPostBody';
    label.textContent = 'Escreva uma mensagem';
    const textarea = element('textarea');
    textarea.id = 'socialNewPostBody';
    textarea.maxLength = 1200;
    textarea.required = true;
    textarea.placeholder = 'O que você quer compartilhar com o grupo?';
    const footer = element('div', 'social-post-form-footer');
    const hint = element('span', '', 'Até 1.200 caracteres. Seja gentil com a comunidade.');
    const submit = element('button', 'social-primary-button', 'Publicar ↗');
    submit.type = 'submit';
    footer.append(hint, submit);
    form.append(label, textarea, footer);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const body = clean(textarea.value);
      if (!body || body.length > 1200 || submit.disabled) return;
      submit.disabled = true;
      submit.textContent = 'Publicando…';
      try {
        const { error } = await supabase.from('community_posts').insert({ community_id: id, author_id: currentUser.id, body });
        if (error) throw error;
        await renderCommunityDetail(id);
        status(globalStatus, 'Mensagem publicada na comunidade.');
        window.setTimeout(() => status(globalStatus), 2200);
      } catch (error) {
        status(globalStatus, humanError(error, 'Não foi possível publicar a mensagem.'), true);
      } finally {
        submit.disabled = false;
        submit.textContent = 'Publicar ↗';
      }
    });
    discussion.append(form);
    const postsHost = element('div', 'social-posts');
    postsHost.append(element('p', '', 'Carregando mensagens…'));
    discussion.append(postsHost);
    postDiscussion.append(discussion, side);
    try {
      const { data, error } = await supabase.from('community_posts')
        .select('id, community_id, author_id, body, created_at')
        .eq('community_id', id).order('created_at', { ascending: false }).limit(80);
      if (error) throw error;
      postsHost.replaceChildren();
      if (!data?.length) {
        const empty = element('div', 'social-empty');
        empty.append(element('span', '', '✧'), element('strong', '', 'A primeira mensagem é sua'), element('p', '', 'Comece a conversa com uma pergunta, ideia ou dica útil.'));
        postsHost.append(empty);
      } else {
        data.forEach((post) => postsHost.append(renderPost(post)));
      }
    } catch (error) {
      postsHost.replaceChildren();
      postsHost.append(element('p', 'social-status is-error', humanError(error, 'Não foi possível carregar as mensagens.')));
    }
  } else {
    discussion.append(element('h4', '', 'Entre na conversa'), element('p', '', 'Faça parte dessa comunidade para ler as mensagens e compartilhar suas próprias descobertas.'));
    discussion.append(makeJoinButton(community, '＋ Entrar e participar'));
    postDiscussion.append(discussion, side);
  }
}
function renderPost(post) {
  const profile = people.find((p) => p.id === post.author_id);
  const article = element('article', 'social-post');
  const head = element('div', 'social-post-head');
  const avatar = element('div', 'social-post-avatar');
  addAvatar(avatar, profile?.avatar_url, profileName(profile), 'social-post-avatar');
  const author = element('div', 'social-post-author');
  author.append(element('strong', '', profileName(profile)), element('small', '', profileHandle(profile) + ' · ' + formatDate(post.created_at)));
  head.append(avatar, author);
  if (post.author_id === currentUser.id) {
    const remove = element('button', 'social-post-delete', 'Excluir');
    remove.type = 'button';
    remove.addEventListener('click', async () => {
      if (!window.confirm('Excluir esta mensagem?')) return;
      remove.disabled = true;
      try {
        const { error } = await supabase.from('community_posts').delete().eq('id', post.id);
        if (error) throw error;
        await renderCommunityDetail(post.community_id);
      } catch (error) {
        status(globalStatus, humanError(error, 'Não foi possível excluir a mensagem.'), true);
      } finally { remove.disabled = false; }
    });
    head.append(remove);
  }
  article.append(head, element('p', 'social-post-body', post.body));
  return article;
}
async function deleteCommunity(community) {
  if (myMembership(community.id)?.role !== 'owner') return;
  if (!window.confirm('Excluir a comunidade "' + community.name + '" e todas as mensagens dela? Essa ação não pode ser desfeita.')) return;
  try {
    const { error } = await supabase.from('communities').delete().eq('id', community.id);
    if (error) throw error;
    communities = communities.filter((item) => item.id !== community.id);
    memberships = memberships.filter((item) => item.community_id !== community.id);
    selectedCommunityId = null;
    communityDetail.hidden = true;
    communitiesGrid.hidden = false;
    renderCommunities();
    renderMine();
    status(globalStatus, 'Comunidade excluída.');
  } catch (error) {
    status(globalStatus, humanError(error, 'Não foi possível excluir a comunidade.'), true);
  }
}
function renderMine() {
  if (!currentUser) return;
  const following = follows.filter((row) => row.follower_id === currentUser.id).map((row) => people.find((p) => p.id === row.followed_id)).filter(Boolean);
  const followers = follows.filter((row) => row.followed_id === currentUser.id);
  const myComms = communities.filter((community) => isMember(community.id));
  $('socialFollowingCount').textContent = String(following.length);
  $('socialFollowersCount').textContent = String(followers.length);
  $('socialMyCommunitiesCount').textContent = String(myComms.length);
  $('socialMyCommunitiesCount').title = String(myComms.length) + ' comunidades';
  renderCompactProfiles($('socialFollowingList'), following, 'Você ainda não segue ninguém.', 'Encontre perfis com interesses parecidos e siga quem compartilha boas descobertas.');
  const myCommunityList = $('socialMyCommunityList');
  myCommunityList.replaceChildren();
  if (!myComms.length) {
    myCommunityList.append(makeSmallEmpty('✳', 'Você ainda não entrou em grupos.', 'Explore comunidades para começar.'));
  } else {
    myComms.slice(0, 6).forEach((community) => {
      const row = element('button', 'social-compact-item social-compact-button');
      row.type = 'button';
      row.append(element('span', 'social-community-art social-compact-community-icon', iconForCategory(community.category)));
      const info = element('span', 'social-compact-info');
      info.append(element('strong', '', community.name), element('small', '', memberCount(community.id) + ' membros · ' + community.category));
      row.append(info);
      row.addEventListener('click', () => { setView('communities'); openCommunity(community.id); });
      myCommunityList.append(row);
    });
  }
}
function renderCompactProfiles(host, profiles, title, description) {
  host.replaceChildren();
  if (!profiles.length) { host.append(makeSmallEmpty('♧', title, description)); return; }
  profiles.slice(0, 8).forEach((profile) => {
    const row = element('div', 'social-compact-item');
    const avatar = element('span', 'social-compact-avatar');
    addAvatar(avatar, profile.avatar_url, profileName(profile), 'social-compact-avatar');
    const info = element('span', 'social-compact-info');
    info.append(element('strong', '', profileName(profile)), element('small', '', profileHandle(profile)));
    row.append(avatar, info);
    host.append(row);
  });
}
function makeSmallEmpty(icon, title, description) {
  const box = element('div', 'social-empty');
  box.append(element('span', '', icon), element('strong', '', title), element('p', '', description));
  return box;
}
document.querySelectorAll('[data-social-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.socialView)));
document.querySelectorAll('[data-open-social-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.openSocialView)));
$('socialPeopleSearch').addEventListener('input', renderPeople);
$('socialCommunitySearch').addEventListener('input', () => {
  communitiesGrid.hidden = false;
  communityDetail.hidden = true;
  selectedCommunityId = null;
  renderCommunities();
});
$('socialAccountLink').addEventListener('click', (event) => {
  if (currentUser) {
    event.preventDefault();
    window.location.href = '/';
  }
});
function updateLoginLink() {
  const link = $('socialAccountLink');
  if (!link) return;
  link.href = currentUser ? '/?conta=1&retorno=%2Fcomunidade.html' : '/?conta=1&retorno=%2Fcomunidade.html';
  link.textContent = currentUser ? 'Minha conta ↗' : 'Entrar na conta ↗';
}
async function startApp() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user || null;
    updateLoginLink();
    if (!requireSession()) return;
    await loadData();
  } catch (error) {
    requireSession();
    status(globalStatus, humanError(error, 'Não foi possível iniciar a área social.'), true);
  }
}
supabase.auth.onAuthStateChange((event, session) => {
  const priorUser = currentUser?.id;
  currentUser = session?.user || null;
  updateLoginLink();
  if (!currentUser) {
    gate.hidden = false;
    app.hidden = true;
    return;
  }
  gate.hidden = true;
  app.hidden = false;
  if (priorUser !== currentUser.id || event === 'SIGNED_IN') {
    void loadData().catch((error) => status(globalStatus, humanError(error, 'Não foi possível carregar a área social.'), true));
  }
});
void startApp();

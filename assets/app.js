/* メンタレジ 共通スクリプト（ログイン・画面枠・検索） */

var LOGIN_KEY = 'mreji_login';

/* ── 認証 ───────────────────────────────── */
function login(loginId, password) {
  for (var i = 0; i < STORES.length; i++) {
    var st = STORES[i];
    if (st.loginId === loginId && st.password === password) {
      try {
        sessionStorage.setItem(LOGIN_KEY, JSON.stringify({
          code: st.code, loginId: st.loginId, at: new Date().getTime()
        }));
      } catch (e) { return null; }
      return st;
    }
  }
  return null;
}

function currentUser() {
  try {
    var v = sessionStorage.getItem(LOGIN_KEY);
    if (!v) return null;
    var o = JSON.parse(v);
    var st = findStore(o.code);
    if (!st) return null;
    return { store: st, loginId: o.loginId, at: o.at };
  } catch (e) { return null; }
}

function requireLogin() {
  var u = currentUser();
  if (!u) { location.replace('index.html'); return null; }
  return u;
}

function doLogout() {
  try { sessionStorage.removeItem(LOGIN_KEY); } catch (e) {}
  location.href = 'index.html';
}

function loginTimeText(at) {
  var d = at ? new Date(at) : new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1, 2) + '-' + pad(d.getDate(), 2) +
         ' ' + pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2);
}

/* ── 画面枠 ─────────────────────────────── */
function renderFrame(current, user) {
  var navs = [
    { href: 'home.html',   key: 'top',    label: 'トップ' },
    { href: 'sales.html',  key: 'sales',  label: '売上明細' },
    { href: 'daily.html',  key: 'daily',  label: '日別集計' },
    { href: 'items.html',  key: 'items',  label: '商品別売上' },
    { href: 'staff.html',  key: 'staff',  label: 'スタッフ別' },
    { href: '#',           key: 'master', label: 'マスタ管理' },
    { href: '#',           key: 'config', label: '各種設定' }
  ];
  var nav = '';
  for (var i = 0; i < navs.length; i++) {
    var n = navs[i];
    nav += '<a href="' + n.href + '"' + (n.key === current ? ' class="on"' : '') + '>' + n.label + '</a>';
  }
  var st = user.store;
  document.getElementById('header').innerHTML =
    '<h1>メンタレジ<span>売上管理システム Ver.2.1</span></h1>' +
    '<div class="userbox"><b>' + st.code + '　' + st.name + '</b>（' + st.area + '）／店長 ' + st.manager + '<br>' +
    'ログインID：' + user.loginId + '　ログイン日時 ' + loginTimeText(user.at) + '　' +
    '<a href="#" onclick="doLogout();return false;">ログアウト</a>　|　' +
    '<a href="#" onclick="alert(\'マニュアルPDFは本部へお問い合わせください。\');return false;">ヘルプ</a></div>' +
    '<div class="clear"></div>';
  document.getElementById('gnav').innerHTML = nav;
  document.getElementById('footer').innerHTML =
    'メンタレジ 売上管理システム Ver.2.1.7 (build 20190412)　|　推奨環境: Internet Explorer 11 / 画面解像度 1024x768 以上<br>' +
    '本システムはご自身の支店のデータのみ参照できます。他支店・全社合計の閲覧には各支店のIDでのログインが必要です。<br>' +
    'Copyright (C) 2009-2026 Menta Systems Inc. All Rights Reserved.';
}

/* ログイン中の支店バッジ（各画面の検索条件に出す固定表示） */
function storeBadge(st) {
  return '<b>' + st.code + '：' + st.name + '</b>' +
         '<span style="color:#888">　※ログイン中の支店のデータのみ表示されます</span>';
}

/* ── 検索 ───────────────────────────────── */
/* ログイン中の支店で必ず絞り込む */
function filterSales(cond, storeCode) {
  var out = [];
  for (var i = 0; i < SALES.length; i++) {
    var s = SALES[i];
    if (s.store !== storeCode) continue;
    if (cond.from && s.date < cond.from) continue;
    if (cond.to && s.date > cond.to) continue;
    if (cond.payment && s.payment !== cond.payment) continue;
    if (cond.keyword) {
      var hit = false;
      if (s.id.indexOf(cond.keyword) >= 0 || s.staff.indexOf(cond.keyword) >= 0) hit = true;
      for (var j = 0; j < s.lines.length; j++) {
        if (s.lines[j].name.indexOf(cond.keyword) >= 0) hit = true;
      }
      if (!hit) continue;
    }
    out.push(s);
  }
  return out;
}

function paymentOptions(sel) {
  var h = '<option value="">すべて</option>';
  for (var i = 0; i < PAYMENTS.length; i++) {
    h += '<option value="' + PAYMENTS[i] + '"' + (sel === PAYMENTS[i] ? ' selected' : '') + '>' + PAYMENTS[i] + '</option>';
  }
  return h;
}

function lineSummary(s) {
  var t = s.lines[0].name;
  if (s.lines[0].qty > 1) t += '×' + s.lines[0].qty;
  if (s.lines.length > 1) t += ' 他' + (s.lines.length - 1) + '件';
  return t;
}

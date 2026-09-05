/* メンタレジ 共通スクリプト */

function renderFrame(current) {
  var navs = [
    { href: 'index.html',  key: 'top',    label: 'トップ' },
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
  document.getElementById('header').innerHTML =
    '<h1>メンタレジ<span>売上管理システム Ver.2.1</span></h1>' +
    '<div class="userbox">株式会社メンタコーヒー／山田 太郎 様　最終ログイン 2026-09-05 08:41<br>' +
    '<a href="#" onclick="alert(\'ログアウトしました。（デモ）\');return false;">ログアウト</a>　|　' +
    '<a href="#" onclick="alert(\'マニュアルPDFは管理者にお問い合わせください。\');return false;">ヘルプ</a></div>' +
    '<div class="clear"></div>';
  document.getElementById('gnav').innerHTML = nav;
  document.getElementById('footer').innerHTML =
    'メンタレジ 売上管理システム Ver.2.1.7 (build 20190412)　|　推奨環境: Internet Explorer 11 / 画面解像度 1024x768 以上<br>' +
    'Copyright (C) 2009-2026 Menta Systems Inc. All Rights Reserved.';
}

/* 検索条件を SALES に適用 */
function filterSales(cond) {
  var out = [];
  for (var i = 0; i < SALES.length; i++) {
    var s = SALES[i];
    if (cond.from && s.date < cond.from) continue;
    if (cond.to && s.date > cond.to) continue;
    if (cond.store && s.store !== cond.store) continue;
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

function storeOptions(sel) {
  var h = '<option value="">すべての店舗</option>';
  for (var i = 0; i < STORES.length; i++) {
    h += '<option value="' + STORES[i].code + '"' + (sel === STORES[i].code ? ' selected' : '') + '>' +
         STORES[i].code + '：' + STORES[i].name + '</option>';
  }
  return h;
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

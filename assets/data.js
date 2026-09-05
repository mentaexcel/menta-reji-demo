/* メンタレジ 売上管理システム ダミーデータ
   ※練習用のダミーです。実在の企業・店舗・人物とは関係ありません。
   毎回同じデータが出るように固定シードで生成しています。 */

var SEED = 20260801;
function rnd() {
  SEED = (SEED * 1103515245 + 12345) % 2147483648;
  return SEED / 2147483648;
}
function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function rint(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }

/* ── 支店（ログインするとこの1店舗のデータだけが見えます）── */
var STORES = [
  { code: '101', name: '北海道支店', area: '札幌市中央区', scale: 32,
    loginId: 's101', password: 'hkd2026pos', manager: '佐々木 涼子',
    staffs: ['佐藤', '高橋', '中村', '小林'] },
  { code: '102', name: '東京支店',   area: '渋谷区',       scale: 58,
    loginId: 's102', password: 'tky2026pos', manager: '青木 健一',
    staffs: ['山田', '鈴木', '田中', '渡辺'] },
  { code: '103', name: '大阪支店',   area: '大阪市北区',   scale: 44,
    loginId: 's103', password: 'osk2026pos', manager: '西村 美和',
    staffs: ['井上', '松本', '木村', '森田'] },
  { code: '104', name: '神奈川支店', area: '横浜市西区',   scale: 38,
    loginId: 's104', password: 'kng2026pos', manager: '長谷川 亮',
    staffs: ['加藤', '吉田', '山口', '石川'] },
  { code: '105', name: '沖縄支店',   area: '那覇市おもろまち', scale: 26,
    loginId: 's105', password: 'okn2026pos', manager: '比嘉 直樹',
    staffs: ['玉城', '上原', '島袋', '仲村'] }
];

function findStore(code) {
  for (var i = 0; i < STORES.length; i++) if (STORES[i].code === code) return STORES[i];
  return null;
}

var PAYMENTS = ['現金', 'クレジット', 'QR決済', '電子マネー'];

var ITEMS = [
  { code: 'D001', name: 'ブレンドコーヒー',     cat: 'ドリンク', price: 480, w: 22 },
  { code: 'D002', name: 'カフェラテ',           cat: 'ドリンク', price: 550, w: 18 },
  { code: 'D003', name: 'アイスコーヒー',       cat: 'ドリンク', price: 480, w: 16 },
  { code: 'D004', name: '抹茶ラテ',             cat: 'ドリンク', price: 580, w: 10 },
  { code: 'D005', name: '紅茶（ダージリン）',   cat: 'ドリンク', price: 500, w: 8  },
  { code: 'F001', name: 'クロワッサン',         cat: 'フード',   price: 320, w: 12 },
  { code: 'F002', name: 'ミックスサンド',       cat: 'フード',   price: 780, w: 9  },
  { code: 'F003', name: 'ホットドッグ',         cat: 'フード',   price: 650, w: 7  },
  { code: 'S001', name: 'チーズケーキ',         cat: 'スイーツ', price: 620, w: 11 },
  { code: 'S002', name: 'ガトーショコラ',       cat: 'スイーツ', price: 640, w: 8  },
  { code: 'S003', name: 'スコーン',             cat: 'スイーツ', price: 380, w: 7  },
  { code: 'S004', name: '季節のフルーツタルト', cat: 'スイーツ', price: 780, w: 5  },
  { code: 'G001', name: 'ドリップバッグ10個入', cat: '物販',     price: 1200, w: 3 },
  { code: 'G002', name: 'オリジナルマグ',       cat: '物販',     price: 2400, w: 1 }
];

var ITEM_POOL = [];
for (var i = 0; i < ITEMS.length; i++) {
  for (var w = 0; w < ITEMS[i].w; w++) ITEM_POOL.push(ITEMS[i]);
}

function pad(n, len) {
  var s = '' + n;
  while (s.length < len) s = '0' + s;
  return s;
}

/* 2026年8月1日〜8月31日の伝票を生成（全支店分） */
var SALES = [];
(function build() {
  for (var d = 1; d <= 31; d++) {
    var date = '2026-08-' + pad(d, 2);
    var dow = new Date(2026, 7, d).getDay(); // 0=日
    for (var s = 0; s < STORES.length; s++) {
      var store = STORES[s];
      var base = store.scale;
      if (dow === 0 || dow === 6) base = Math.floor(base * 1.35);
      if (dow === 2) base = Math.floor(base * 0.82);
      var count = base + rint(-5, 5);
      for (var c = 0; c < count; c++) {
        var hour = rint(7, 19);
        var min = rint(0, 59);
        var lineCount = rnd() < 0.55 ? 1 : (rnd() < 0.75 ? 2 : rint(3, 4));
        var lines = [];
        var total = 0;
        for (var l = 0; l < lineCount; l++) {
          var it = pick(ITEM_POOL);
          var qty = rnd() < 0.85 ? 1 : rint(2, 3);
          lines.push({ code: it.code, name: it.name, cat: it.cat, price: it.price, qty: qty });
          total += it.price * qty;
        }
        var pay = rnd() < 0.38 ? '現金' : pick(PAYMENTS);
        SALES.push({
          id: store.code + '-' + date.replace(/-/g, '') + '-' + pad(c + 1, 4),
          date: date,
          time: pad(hour, 2) + ':' + pad(min, 2),
          store: store.code,
          storeName: store.name,
          register: 'レジ' + rint(1, 2),
          staff: pick(store.staffs),
          payment: pay,
          customers: rnd() < 0.7 ? 1 : rint(2, 4),
          lines: lines,
          total: total,
          tax: Math.floor(total / 11),
          status: rnd() < 0.012 ? '返品' : '通常'
        });
      }
    }
  }
})();

SALES.sort(function (a, b) {
  if (a.date === b.date) return a.time < b.time ? -1 : 1;
  return a.date < b.date ? -1 : 1;
});

function yen(n) {
  return '\u00A5' + ('' + n).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}
function num(n) {
  return ('' + n).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}
function getParam(key) {
  var m = new RegExp('[?&]' + key + '=([^&]*)').exec(location.search);
  return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
}

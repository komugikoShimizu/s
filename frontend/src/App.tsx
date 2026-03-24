import { useMemo, useState } from 'react';

type MenuKey = 'login' | 'ledger' | 'ledger-create';

type SummaryCard = {
  label: string;
  value: string;
  note: string;
};

type Transaction = {
  id: number;
  date: string;
  category: string;
  detail: string;
  amount: string;
  type: 'income' | 'expense';
};

type BudgetItem = {
  category: string;
  used: string;
  budget: string;
  progress: number;
};

type CategoryInsight = {
  category: string;
  consumptionStatus: string;
  usageRate: string;
  trend: string;
  trendNote: string;
  assetValue: string;
  assetDelta: string;
  highlight: string;
};

const summaryCards: SummaryCard[] = [
  { label: '今月の収入', value: '¥320,000', note: '給与と副収入の仮データ' },
  { label: '今月の支出', value: '¥186,400', note: '固定費と変動費の仮データ' },
  { label: '差引残高', value: '¥133,600', note: 'サーバー連携時に自動計算へ差し替え' },
];

const transactions: Transaction[] = [
  { id: 1, date: '2026-03-21', category: '食費', detail: 'スーパー', amount: '- ¥4,820', type: 'expense' },
  { id: 2, date: '2026-03-20', category: '給与', detail: '月次入金', amount: '+ ¥280,000', type: 'income' },
  { id: 3, date: '2026-03-19', category: '交通費', detail: '定期券チャージ', amount: '- ¥8,000', type: 'expense' },
  { id: 4, date: '2026-03-18', category: '趣味', detail: '書籍購入', amount: '- ¥2,200', type: 'expense' },
  { id: 5, date: '2026-03-17', category: '住居費', detail: '家賃引き落とし', amount: '- ¥78,000', type: 'expense' },
];

const monthlyBudgets: BudgetItem[] = [
  { category: '食費', used: '¥32,400', budget: '¥45,000', progress: 72 },
  { category: '住居費', used: '¥78,000', budget: '¥78,000', progress: 100 },
  { category: '娯楽', used: '¥12,000', budget: '¥20,000', progress: 60 },
  { category: '交通費', used: '¥8,000', budget: '¥15,000', progress: 53 },
  { category: '給与', used: '¥280,000', budget: '¥300,000', progress: 93 },
];

const categoryInsights: Record<string, CategoryInsight> = {
  食費: {
    category: '食費',
    consumptionStatus: '予算の 72% を消費中',
    usageRate: '残り予算は ¥12,600',
    trend: '先週比 +8%',
    trendNote: '外食回数が増えており、やや上振れ傾向です。',
    assetValue: '¥1,486,200',
    assetDelta: '- ¥32,400',
    highlight: '食費が資産を緩やかに圧迫しています。',
  },
  住居費: {
    category: '住居費',
    consumptionStatus: '予算をちょうど消化済み',
    usageRate: '固定費として確定済み',
    trend: '前月比 ±0%',
    trendNote: '住居費は毎月一定で、増減は発生していません。',
    assetValue: '¥1,440,600',
    assetDelta: '- ¥78,000',
    highlight: '大きな固定費として資産残高へ直接反映されています。',
  },
  娯楽: {
    category: '娯楽',
    consumptionStatus: '予算の 60% を消費中',
    usageRate: '余力は ¥8,000',
    trend: '先週比 -12%',
    trendNote: '今週は支出が落ち着いており、消費ペースは減少中です。',
    assetValue: '¥1,506,600',
    assetDelta: '- ¥12,000',
    highlight: '抑制できており、資産への影響は限定的です。',
  },
  交通費: {
    category: '交通費',
    consumptionStatus: '予算の 53% を消費中',
    usageRate: '残り予算は ¥7,000',
    trend: '前週比 +3%',
    trendNote: '移動回数の増加により、軽微に増加しています。',
    assetValue: '¥1,510,600',
    assetDelta: '- ¥8,000',
    highlight: '現時点では許容範囲で推移しています。',
  },
  給与: {
    category: '給与',
    consumptionStatus: '今月の入金予定の 93% を反映',
    usageRate: '未反映予定額は ¥20,000',
    trend: '前月比 +5%',
    trendNote: '副収入込みで前月より増加しています。',
    assetValue: '¥1,588,600',
    assetDelta: '+ ¥280,000',
    highlight: '資産総額を最も押し上げている主要項目です。',
  },
};

export default function App() {
  const [activeView, setActiveView] = useState<MenuKey>('login');

  return (
    <div className="layout-shell">
      <aside className="sidebar">
        <div>
          <p className="brand-kicker">Kakeibo Suite</p>
          <h1 className="brand-title">家計管理 UI モック</h1>
          <p className="brand-copy">
            Laravel 側の認証と家計簿 API を後から接続できるよう、画面の形だけ先に構築しています。
          </p>
        </div>
        <nav className="nav-list" aria-label="sections">
          <button
            className={activeView === 'login' ? 'nav-item active' : 'nav-item'}
            type="button"
            onClick={() => setActiveView('login')}
          >
            ログインページ
          </button>
          <button
            className={activeView === 'ledger' ? 'nav-item active' : 'nav-item'}
            type="button"
            onClick={() => setActiveView('ledger')}
          >
            家計簿一覧
          </button>
          <button
            className={activeView === 'ledger-create' ? 'nav-item active' : 'nav-item'}
            type="button"
            onClick={() => setActiveView('ledger-create')}
          >
            家計簿追加ページ
          </button>
        </nav>
        <div className="sidebar-note">
          <p>状態</p>
          <strong>UI のみ実装済み</strong>
          <span>認証、保存、集計は後続でサーバー連携予定です。</span>
        </div>
      </aside>

      <main className="content-area">
        {activeView === 'login' && <LoginMock />}
        {activeView === 'ledger' && <LedgerMock onNavigate={setActiveView} />}
        {activeView === 'ledger-create' && <LedgerCreateMock onNavigate={setActiveView} />}
      </main>
    </div>
  );
}

function LoginMock() {
  return (
    <section className="screen login-screen">
      <div className="login-hero card">
        <p className="section-kicker">Authentication</p>
        <h2>ログイン</h2>
        <p>
          ログイン必要情報はメールアドレスとパスワードの 2 項目です。認証処理は未接続で、後から Laravel の認証 API
          に差し替えます。
        </p>
        <ul className="feature-list">
          <li>メールアドレス</li>
          <li>パスワード</li>
        </ul>
      </div>

      <form className="login-form card">
        <label>
          メールアドレス
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          パスワード
          <input type="password" placeholder="パスワードを入力" />
        </label>
        <button className="primary-button" type="button">
          ログインする
        </button>
      </form>
    </section>
  );
}

function LedgerMock({ onNavigate }: { onNavigate: (view: MenuKey) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('食費');

  const selectedInsight = useMemo(
    () => categoryInsights[selectedCategory] ?? categoryInsights.食費,
    [selectedCategory],
  );

  return (
    <section className="screen ledger-screen">
      <header className="ledger-header card">
        <div>
          <p className="section-kicker">Household Ledger</p>
          <h2>家計簿ダッシュボード</h2>
          <p>各項目をクリックすると、消費状況、増減状況、現在の資産額を確認できます。</p>
        </div>
        <div className="header-actions">
          <button className="primary-button" type="button" onClick={() => onNavigate('ledger-create')}>
            家計簿状況を追加
          </button>
          <button className="secondary-button" type="button">
            CSV 出力
          </button>
        </div>
      </header>

      <section className="summary-grid">
        {summaryCards.map((card) => (
          <article className="summary-card card" key={card.label}>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <span>{card.note}</span>
          </article>
        ))}
      </section>

      <section className="category-selector card">
        <div className="card-header">
          <div>
            <p className="section-kicker">Interactive Items</p>
            <h3>項目を選択</h3>
          </div>
          <span className="badge">クリック可能</span>
        </div>
        <div className="selector-grid">
          {monthlyBudgets.map((item) => (
            <button
              key={item.category}
              className={selectedCategory === item.category ? 'selector-item active' : 'selector-item'}
              type="button"
              onClick={() => setSelectedCategory(item.category)}
            >
              <strong>{item.category}</strong>
              <span>
                {item.used} / {item.budget}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="asset-grid">
        <article className="card insight-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Consumption Insight</p>
              <h3>{selectedInsight.category} の状況</h3>
            </div>
            <span className="badge">選択中</span>
          </div>
          <div className="insight-list">
            <div>
              <p>消費状況</p>
              <strong>{selectedInsight.consumptionStatus}</strong>
              <span>{selectedInsight.usageRate}</span>
            </div>
            <div>
              <p>増減状況</p>
              <strong>{selectedInsight.trend}</strong>
              <span>{selectedInsight.trendNote}</span>
            </div>
            <div>
              <p>現在の資産額</p>
              <strong>{selectedInsight.assetValue}</strong>
              <span>{selectedInsight.assetDelta}</span>
            </div>
          </div>
          <p className="insight-highlight">{selectedInsight.highlight}</p>
        </article>

        <article className="card budget-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Monthly Budget</p>
              <h3>カテゴリ別予算</h3>
            </div>
            <span className="badge">仮集計</span>
          </div>
          <div className="budget-list">
            {monthlyBudgets.map((item) => (
              <button
                className={selectedCategory === item.category ? 'budget-item active' : 'budget-item'}
                key={item.category}
                type="button"
                onClick={() => setSelectedCategory(item.category)}
              >
                <div className="budget-meta">
                  <strong>{item.category}</strong>
                  <span>
                    {item.used} / {item.budget}
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${item.progress}%` }} />
                </div>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="ledger-grid">
        <article className="card entry-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Entry Form</p>
              <h3>家計簿状況の一覧</h3>
            </div>
            <button className="secondary-button compact-button" type="button" onClick={() => onNavigate('ledger-create')}>
              追加ページへ
            </button>
          </div>
          <div className="record-list">
            {transactions.map((item) => (
              <button
                className="record-card"
                key={item.id}
                type="button"
                onClick={() => setSelectedCategory(item.category)}
              >
                <div>
                  <strong>{item.category}</strong>
                  <p>{item.detail}</p>
                </div>
                <span>{item.date}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="card table-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Recent Transactions</p>
              <h3>最近の取引履歴</h3>
            </div>
            <button className="link-button" type="button" onClick={() => onNavigate('ledger-create')}>
              新規追加へ
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日付</th>
                  <th>カテゴリ</th>
                  <th>内容</th>
                  <th>金額</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.category}</td>
                    <td>{item.detail}</td>
                    <td className={item.type === 'income' ? 'amount income' : 'amount expense'}>
                      {item.amount}
                    </td>
                    <td>
                      <button className="table-action" type="button" onClick={() => setSelectedCategory(item.category)}>
                        詳細を見る
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );
}

function LedgerCreateMock({ onNavigate }: { onNavigate: (view: MenuKey) => void }) {
  return (
    <section className="screen create-screen">
      <header className="ledger-header card">
        <div>
          <p className="section-kicker">Ledger Create</p>
          <h2>家計簿状況の追加ページ</h2>
          <p>新しい家計簿データを追加するための専用ページです。現在は UI のみ実装しています。</p>
        </div>
        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={() => onNavigate('ledger')}>
            一覧へ戻る
          </button>
        </div>
      </header>

      <section className="create-grid">
        <article className="card entry-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">New Entry</p>
              <h3>家計簿状況を追加</h3>
            </div>
            <span className="badge">ダミー</span>
          </div>
          <div className="form-grid">
            <label>
              登録日
              <input type="date" defaultValue="2026-03-24" />
            </label>
            <label>
              種別
              <select defaultValue="expense">
                <option value="expense">支出</option>
                <option value="income">収入</option>
              </select>
            </label>
            <label>
              カテゴリ
              <select defaultValue="food">
                <option value="food">食費</option>
                <option value="housing">住居費</option>
                <option value="transport">交通費</option>
                <option value="salary">給与</option>
              </select>
            </label>
            <label>
              金額
              <input type="number" placeholder="1000" />
            </label>
            <label className="full-span">
              内容
              <input type="text" placeholder="例: スーパー、給与入金" />
            </label>
            <label className="full-span">
              備考
              <textarea rows={5} placeholder="家計簿状況に関するメモを入力" />
            </label>
          </div>
          <div className="header-actions">
            <button className="primary-button" type="button">
              追加する
            </button>
            <button className="secondary-button" type="button" onClick={() => onNavigate('ledger')}>
              一覧を確認
            </button>
          </div>
        </article>

        <article className="card guide-card">
          <div className="card-header">
            <div>
              <p className="section-kicker">Navigation</p>
              <h3>簡単に移動して閲覧</h3>
            </div>
          </div>
          <div className="guide-list">
            <div>
              <strong>サイドメニュー</strong>
              <p>常に「家計簿一覧」と「家計簿追加ページ」を切り替えできます。</p>
            </div>
            <div>
              <strong>一覧画面の追加導線</strong>
              <p>ダッシュボード上部、一覧カード、履歴テーブルから追加ページへ移動できます。</p>
            </div>
            <div>
              <strong>追加後の閲覧</strong>
              <p>追加ページ内の「一覧を確認」ボタンから、すぐに家計簿一覧へ戻れます。</p>
            </div>
          </div>
        </article>
      </section>
    </section>
  );
}

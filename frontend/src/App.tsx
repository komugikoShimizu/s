import { useMemo, useState } from 'react';
import { useUiSnapshot } from './useUiSnapshot';
import type { MenuKey } from './types';

const sourceLabels = {
  mock: 'Mock',
  local: 'Local',
  backend: 'Backend',
} as const;

export default function App() {
  const [activeView, setActiveView] = useState<MenuKey>('login');
  const { snapshot, source, lastUpdatedLabel, backendStatus, refreshFromBackend } = useUiSnapshot();

  return (
    <div className="layout-shell">
      <aside className="sidebar">
        <div>
          <p className="brand-kicker">Kakeibo Suite</p>
          <h1 className="brand-title">家計管理 UI モック</h1>
          <p className="brand-copy">
            FE 単体で視認できるようにしつつ、後から Laravel 側のレスポンスやイベントで上書きできる構成にしています。
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
        <div className="sidebar-stack">
          <section className="sidebar-note">
            <p>状態</p>
            <strong>{sourceLabels[source]} データで描画中</strong>
            <span>{backendStatus}</span>
          </section>
          <section className="data-status card">
            <div className="card-header">
              <div>
                <p className="section-kicker">Rendering Source</p>
                <h3>描画データの状態</h3>
              </div>
              <span className="badge">{sourceLabels[source]}</span>
            </div>
            <div className="meta-list">
              <div>
                <p>最終反映</p>
                <strong>{lastUpdatedLabel}</strong>
              </div>
              <div>
                <p>サマリー件数</p>
                <strong>{snapshot.ledger.summaryCards.length}</strong>
              </div>
              <div>
                <p>取引件数</p>
                <strong>{snapshot.ledger.transactions.length}</strong>
              </div>
              <div>
                <p>カテゴリ件数</p>
                <strong>{snapshot.ledger.monthlyBudgets.length}</strong>
              </div>
            </div>
            <button className="secondary-button full-button" type="button" onClick={() => void refreshFromBackend()}>
              バックエンド再取得を試す
            </button>
            <p className="data-hint">
              将来は <code>/api/ui-snapshot</code> の JSON か <code>window.dispatchEvent</code> によるイベントで上書きできます。
            </p>
          </section>
        </div>
      </aside>

      <main className="content-area">
        {activeView === 'login' && <LoginMock title={snapshot.login.title} description={snapshot.login.description} fields={snapshot.login.fields} />}
        {activeView === 'ledger' && <LedgerMock snapshot={snapshot} onNavigate={setActiveView} />}
        {activeView === 'ledger-create' && (
          <LedgerCreateMock snapshot={snapshot} onNavigate={setActiveView} />
        )}
      </main>
    </div>
  );
}

function LoginMock({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: string[];
}) {
  return (
    <section className="screen login-screen">
      <div className="login-hero card">
        <p className="section-kicker">Authentication</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <ul className="feature-list">
          {fields.map((field) => (
            <li key={field}>{field}</li>
          ))}
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

function LedgerMock({
  snapshot,
  onNavigate,
}: {
  snapshot: ReturnType<typeof useUiSnapshot>['snapshot'];
  onNavigate: (view: MenuKey) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(snapshot.ledger.monthlyBudgets[0]?.category ?? '食費');

  const selectedInsight = useMemo(() => {
    const fallbackCategory = snapshot.ledger.monthlyBudgets[0]?.category;

    if (selectedCategory in snapshot.ledger.categoryInsights) {
      return snapshot.ledger.categoryInsights[selectedCategory];
    }

    if (fallbackCategory && fallbackCategory in snapshot.ledger.categoryInsights) {
      return snapshot.ledger.categoryInsights[fallbackCategory];
    }

    return Object.values(snapshot.ledger.categoryInsights)[0];
  }, [selectedCategory, snapshot]);

  if (!selectedInsight) {
    return null;
  }

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
        {snapshot.ledger.summaryCards.map((card) => (
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
          {snapshot.ledger.monthlyBudgets.map((item) => (
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
            {snapshot.ledger.monthlyBudgets.map((item) => (
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
            {snapshot.ledger.transactions.map((item) => (
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
                {snapshot.ledger.transactions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.category}</td>
                    <td>{item.detail}</td>
                    <td className={item.type === 'income' ? 'amount income' : 'amount expense'}>{item.amount}</td>
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

function LedgerCreateMock({
  snapshot,
  onNavigate,
}: {
  snapshot: ReturnType<typeof useUiSnapshot>['snapshot'];
  onNavigate: (view: MenuKey) => void;
}) {
  return (
    <section className="screen create-screen">
      <header className="ledger-header card">
        <div>
          <p className="section-kicker">Ledger Create</p>
          <h2>{snapshot.ledgerCreate.title}</h2>
          <p>{snapshot.ledgerCreate.description}</p>
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
              <input type="date" defaultValue={snapshot.ledgerCreate.defaultDate} />
            </label>
            <label>
              種別
              <select defaultValue={snapshot.ledgerCreate.defaultType}>
                <option value="expense">支出</option>
                <option value="income">収入</option>
              </select>
            </label>
            <label>
              カテゴリ
              <select defaultValue={snapshot.ledgerCreate.defaultCategory}>
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

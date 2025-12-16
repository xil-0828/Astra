# データベース設計（Supabase）｜Astra

## 目的
- アプリで使用するデータ構造を明確にする
- 現在の実データベース構成を正とした設計書を残す
- MVP（レビュー機能）に必要な範囲のみを定義する
- 将来のチャット機能追加を阻害しない設計にする

---

## 設計前提
- 認証は Supabase Auth（Googleログイン）を使用する
- ユーザー情報は auth.users を正とし、独自 users テーブルは持たない
- アニメ情報は外部APIを利用し、DBでは anime_id のみを保持する
- MVPではレビュー投稿・閲覧に集中する

---

## reviews テーブル

アニメ作品ごとのレビューを管理するメインテーブル。

### テーブル定義（現行）

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK / default gen_random_uuid() | レビューID |
| anime_id | bigint | not null | アニメID（外部API由来） |
| user_id | uuid | not null / FK | auth.users.id |
| score | int | not null / check (1〜5) | 評価点 |
| comment | text | not null | レビュー本文 |
| created_at | timestamptz | default now() | 作成日時 |

---

## 外部キー制約
- reviews.user_id → auth.users(id)
- on delete cascade  
  ユーザー削除時、そのユーザーのレビューも自動削除される

---

## 制約（Constraints）

### スコア制約
- score は 1〜5 の整数のみを許可
- 不正な値は DB レベルで拒否される

### 一意制約
- 1ユーザーは同一アニメに1件のみレビュー可能とする

UNIQUE (anime_id, user_id)

※ 二重投稿防止のための最終防衛ライン  
※ 現在または今後追加予定

---

## インデックス設計

### reviews_anime_id_idx
- 対象: reviews(anime_id)
- 用途: アニメ詳細ページでのレビュー一覧取得

### reviews_user_id_idx
- 対象: reviews(user_id)
- 用途: マイページでの自分のレビュー一覧取得

---

## Row Level Security（RLS）設計方針

※ 本設計書では方針のみを記載し、SQL定義は別途行う

### reviews
- select: 全ユーザー可
- insert: 自分のレビューのみ（auth.uid() = user_id）
- update: 自分のレビューのみ
- delete: 消させない(後から自分のレビューのみ消せるようにするかも)

---

## MVPで使用するテーブル
- reviews

---

## 設計まとめ
- シンプルでMVPに集中した構成
- DB制約とインデックスにより安全性と性能を担保
- 将来機能を追加しても破綻しない構造

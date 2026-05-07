import { defineConfig } from 'vite';

export default defineConfig({
  // ルートディレクトリを指定 (index.htmlがある場所)
  root: '.',
  
  // 開発サーバー設定
  server: {
    port: 3000,
    open: true,        // 起動時にブラウザ自動で開く
    host: true,        // 同じネットワークの他デバイスからアクセス可能
  },
  
  // ビルド設定
  build: {
    outDir: 'dist',
  },
});
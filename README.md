# 複数コンテンツの特定章から感情分析する

## 使い方

- node_moduleインストール

```
$ yarn
```

- 対象ファイル、章の記述

分析対象のmarkdownファイルを列挙する

```markdown
# title
## hoge
### child-1

hogehoge

### child-2

hogehoge

## fuga
### child

fugafuga
```

例として上記のような文書だと次のような感じになる

| titlesの指定 | 解析対象の文字列 |
|:-|:-|
| hoge | hogehoge\nhogehoge |
| fuga | fugafuga |


- 実行

```
$ node app.js
```

result.csvに結果が出力される


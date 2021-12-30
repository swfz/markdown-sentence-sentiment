# 複数コンテンツの特定章から感情分析する

GoogleCloudPlatformのNLPを使っている

[感情分析  |  Cloud Natural Language API  |  Google Cloud](https://cloud.google.com/natural-language/docs/analyzing-sentiment)

前提としてNLPを使えるようにしておく必要がある(APIのenableなど)

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

- 結果のサンプル(一部抜粋)

```
2021-02,生活,-0.20000000298023224,0.5
2021-03,生活,0.4000000059604645,0.4000000059604645
```

const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const parse = require("@textlint/markdown-to-ast").parse;
const language = require('@google-cloud/language');

// 計測対象のファイルを列挙する
const files = [
  { month: '2021-01', file: '/home/user/docs/release_notes/2021_02.md' },
  { month: '2021-02', file: '/home/user/docs/release_notes/2021_03.md' },
];
// 計測対象の文言を記述する(`## `で始まる段落)
const titles = ['仕事', '生活'];

const extractText = (mdFile, targetTitle) => {
  console.log(mdFile);
  const markdown = fs.readFileSync(mdFile, 'utf8').toString();
  const AST = parse(markdown);

  const headerIndexes = AST.children.flatMap((item,i) => (item.type === 'Header' && item.raw.match(/#/g).length === 2) ? {i: i, raw: item.raw} : []);
  const tmpIndex = headerIndexes.findIndex(item => item.raw.match(targetTitle));
  const targetIndexes = headerIndexes.slice(tmpIndex, tmpIndex + 2).map(item => item.i);

  const targetTree = AST.children.slice(...targetIndexes);
  const targetText = targetTree.filter(item => item.type === 'Paragraph').map(item => item.raw).join("\n");

  return targetText;
}

async function analyze(file, targetTitle) {
  // Instantiates a client
  const client = new language.LanguageServiceClient();

  const text = extractText(file, targetTitle);

  const document = {
    content: text,
    language: 'ja',
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({document: document});
  const sentiment = result.documentSentiment;

  console.log(sentiment);
  console.log(`Text: ${text}`);
  console.log(`Sentiment score: ${sentiment.score}`);
  console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

  return sentiment;
}

async function main() {
  const data = [];

  for (title of titles) {
    for (line of files) {
      const result = await analyze(line.file, title);
      data.push({month: line.month, type: title, score: result.score, magnitude: result.magnitude});
    }
  }

  const csvWriter = createCsvWriter({path: 'result.csv', header: ['month', 'type', 'score', 'magnitude']});
  await csvWriter.writeRecords(data).then(() => {});
}

main()

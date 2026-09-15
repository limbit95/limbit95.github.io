import { readFile, writeFile } from "node:fs/promises";

async function replaceOnce(path, from, to) {
  const source = await readFile(path, "utf8");
  if (!source.includes(from)) throw new Error(`Expected text not found in ${path}`);
  await writeFile(path, source.replace(from, to), "utf8");
}

await replaceOnce(
  "js/pages/mypage.js",
  '      text: "종 알림에는 대상 알림이 계속 기록되며, 아래 알림 종류 설정은 계정 전체에 적용됩니다. 실제 푸시 수신 여부는 기기별로 설정할 수 있습니다.",',
  '      text: "종 알림에는 대상 알림이 계속 기록되며, 아래 알림 종류 설정은 계정 전체에 적용됩니다. 주최자 지정 알림은 아래 종류 설정과 관계없이 전달되며, 실제 푸시 수신 여부는 기기별로 설정할 수 있습니다.",',
);

await replaceOnce(
  "js/pages/mypage.js",
  '          ? "이 기기에서는 위에서 선택한 알림만 푸시로 받습니다."',
  '          ? "이 기기에서는 설정한 알림을 푸시로 받으며, 주최자 지정 알림은 알림 종류 설정과 관계없이 받습니다."',
);

const testPath = "tests/activity-organizer-history-detail-push.test.js";
let testSource = await readFile(testPath, "utf8");
if (!testSource.includes('const mypage = read("../js/pages/mypage.js");')) {
  testSource = testSource.replace(
    'const styles = read("../css/activity-detail.css");',
    'const styles = read("../css/activity-detail.css");\nconst mypage = read("../js/pages/mypage.js");',
  );
}
if (!testSource.includes("My Page explains mandatory organizer transfer push")) {
  testSource += `\n\ntest("My Page explains mandatory organizer transfer push", () => {\n  assert.match(mypage, /주최자 지정 알림은 아래 종류 설정과 관계없이 전달/);\n  assert.match(mypage, /주최자 지정 알림은 알림 종류 설정과 관계없이 받습니다/);\n});\n`;
}
await writeFile(testPath, testSource, "utf8");

const SETTING_HELP = Object.freeze({
  blockDensity: {
    title: "블록 무게",
    summary: "블록이 힘에 얼마나 쉽게 가속되고, 다른 블록을 얼마나 무겁게 누르는지 결정합니다.",
    high: "높이면 블록이 묵직해지고 작은 손동작에는 덜 움직입니다. 접촉면을 누르는 힘도 커져 마찰 영향이 함께 커지므로 특히 아래층이 더 버티는 느낌이 날 수 있습니다.",
    low: "낮추면 작은 힘에도 쉽게 움직여 조작은 편해지지만, 타워 전체가 가벼워져 흔들림과 충격 반응도 커질 수 있습니다.",
    pair: "전체 블록이 너무 가볍거나 무거울 때만 먼저 조정하세요. 특정 아래층만 안 빠지는 문제라면 이 값보다 돌파 보조 설정을 먼저 만지는 편이 좋습니다.",
  },
  blockFriction: {
    title: "블록 마찰",
    summary: "블록끼리 맞닿은 면이 서로 미끄러지는 것을 얼마나 강하게 버티는지 결정합니다.",
    high: "높이면 타워가 평소에는 안정적이지만 블록을 빼기 위해 더 큰 힘이 필요합니다. 너무 높으면 아래층 중앙 블록이 거의 고정된 것처럼 느껴질 수 있습니다.",
    low: "낮추면 블록이 부드럽게 미끄러져 빠지기 쉬워지지만, 작은 충격에도 층이 밀리거나 타워가 미끄러운 느낌이 날 수 있습니다.",
    pair: "‘블록은 움직이는데 잘 빠지지 않는다’면 조금 낮춰볼 수 있습니다. 다만 전체 타워가 미끄러워지므로 아래층 문제만 있다면 돌파 보조를 우선 사용하세요.",
  },
  linearDamping: {
    title: "이동 감쇠",
    summary: "블록이 이동하기 시작한 뒤 속도가 얼마나 빨리 줄어드는지 조절합니다.",
    high: "높이면 손을 놓았을 때 블록이 빨리 멈추고 안정적으로 느껴집니다. 너무 높으면 끈적하거나 물속에서 움직이는 것처럼 둔해질 수 있습니다.",
    low: "낮추면 블록이 관성을 오래 유지해 더 자연스럽게 미끄러지지만, 한번 움직인 뒤 오래 떠밀리거나 튀는 느낌이 날 수 있습니다.",
    pair: "블록이 손을 놓은 뒤 너무 멀리 미끄러지면 올리고, 반대로 모든 움직임이 답답하게 끊기면 낮추세요.",
  },
  angularDamping: {
    title: "회전 감쇠",
    summary: "블록이 기울거나 회전하기 시작한 뒤 회전 속도가 얼마나 빨리 줄어드는지 조절합니다.",
    high: "높이면 블록이 쉽게 빙글 돌지 않아 안정적입니다. 너무 높으면 모서리를 잡아도 회전이 잘 안 되는 인공적인 느낌이 날 수 있습니다.",
    low: "낮추면 클릭한 위치에 따라 기울기와 회전이 잘 살아나지만, 작은 비대칭 힘에도 블록이 과하게 돌아갈 수 있습니다.",
    pair: "‘잡으면 블록이 너무 돌아간다’면 조금 올리고, ‘끝을 잡아도 회전감이 없다’면 낮춰보세요.",
  },
  grabSpring: {
    title: "기본 그랩 반응",
    summary: "마우스가 가리키는 가상 손 위치와 실제 잡은 지점 사이의 거리 차이를 얼마나 강하게 따라잡을지 결정합니다.",
    high: "높이면 손에 딱 붙어 따라오는 느낌이 강하고 즉각적입니다. 너무 높으면 갑작스러운 힘이 타워에 전달되어 주변 블록까지 쉽게 흔들 수 있습니다.",
    low: "낮추면 블록이 손을 천천히 따라와 부드럽지만, 고무줄처럼 뒤늦게 끌려오는 느낌이 날 수 있습니다.",
    pair: "조작이 느슨하면 조금 올리고, 잡는 순간 타워가 튀거나 덜컹거리면 조금 낮추세요. 그랩 안정화와 함께 맞추는 값입니다.",
  },
  grabDamping: {
    title: "그랩 안정화",
    summary: "잡은 지점의 현재 움직임을 눌러서 그랩 중 떨림과 왕복 진동을 줄이는 값입니다.",
    high: "높이면 블록이 손을 따라갈 때 덜 출렁이고 안정적입니다. 너무 높으면 반응이 둔하고 묵직하게 끌리는 느낌이 강해집니다.",
    low: "낮추면 반응은 생생하지만, 강한 그랩 반응과 조합될 때 블록이 손 주변에서 흔들리거나 튕길 수 있습니다.",
    pair: "기본 그랩 반응을 올렸다면 안정화도 조금 같이 올리는 것이 좋습니다. ‘고무줄처럼 떨린다’면 이 값을 먼저 확인하세요.",
  },
  pointerVelocityGain: {
    title: "빠른 손동작 힘",
    summary: "마우스나 손가락을 빠르게 움직일수록 추가로 얼마나 큰 힘을 더할지 결정합니다.",
    high: "높이면 천천히 조작할 때는 섬세하지만 빠르게 확 당길 때 강한 힘이 나옵니다. 실제 손으로 힘을 더 주는 느낌을 만들기 좋습니다.",
    low: "낮추면 손의 속도에 따른 힘 차이가 작아져 조작이 일정해지지만, 빠르게 당겨도 답답하게 느껴질 수 있습니다.",
    pair: "‘세게 확 당기는 플레이’를 살리고 싶다면 올리세요. 너무 튀면 이 값과 빠른 동작 최대 힘을 함께 낮추면 됩니다.",
  },
  maxGrabForce: {
    title: "기본 최대 힘",
    summary: "보통 속도로 블록을 잡아 움직일 때 적용될 수 있는 힘의 상한선입니다.",
    high: "높이면 천천히 움직여도 무거운 블록을 밀거나 당길 수 있어 쉬워집니다. 너무 높으면 섬세한 조작에서도 타워를 강제로 밀어버릴 수 있습니다.",
    low: "낮추면 조심스럽고 현실적인 조작이 가능하지만, 마찰이 큰 블록은 일반적인 움직임으로 거의 빠지지 않을 수 있습니다.",
    pair: "평범한 드래그 자체가 약하다면 올리세요. 빠르게 당길 때만 힘을 더 주고 싶다면 이 값은 유지하고 빠른 동작/돌파 설정을 조절하세요.",
  },
  maxFastGrabForce: {
    title: "빠른 동작 최대 힘",
    summary: "손을 빠르게 움직였을 때 속도 부스트를 포함해 사용할 수 있는 최대 힘의 상한선입니다.",
    high: "높이면 빠른 당김으로 꽉 낀 블록을 빼기 쉬워지지만, 실수 한 번에 주변 블록을 크게 흔들거나 날릴 수도 있습니다.",
    low: "낮추면 급격한 입력도 제한되어 타워가 안정적이지만, 빠른 손동작의 의미가 약해집니다.",
    pair: "‘빠른 조작에서만 힘이 부족하다’면 올리세요. 전체 조작이 너무 강한 문제라면 기본 최대 힘부터 확인하는 편이 좋습니다.",
  },
  pointerSpeedForMaxBoost: {
    title: "속도 부스트 기준",
    summary: "얼마나 빠르게 손을 움직여야 빠른 동작 최대 힘에 가까워질지를 결정합니다.",
    high: "높이면 정말 빠르게 움직여야 강한 힘이 나오므로 숙련도 요구가 커집니다.",
    low: "낮추면 비교적 평범한 드래그에서도 빠른 힘이 쉽게 활성화되어 전체 난이도가 내려갑니다.",
    pair: "힘의 크기보다 ‘언제 강한 힘이 나오느냐’를 조절하는 값입니다. 최대 힘 수치는 괜찮은데 발동이 너무 쉽거나 어렵다면 이 값을 만지세요.",
  },
  lowerBreakawayMaxLevel: {
    title: "보조 적용 최고 층",
    summary: "아래층 특유의 큰 하중과 마찰을 보완하기 위한 돌파 보조가 몇 층까지 적용될지 정합니다.",
    high: "높이면 더 많은 중간층까지 빠른 당김 보조를 받을 수 있습니다. 너무 높이면 상단에서도 보조가 개입해 원래의 가벼운 물리 차이가 줄어듭니다.",
    low: "낮추면 아주 아래층만 보조를 받아 층별 무게 차이가 더 분명해집니다.",
    pair: "이 값은 보조의 범위만 정하고 힘의 세기는 바꾸지 않습니다. 최상단은 보조 대상에서 제외되도록 제한되어 있습니다.",
  },
  breakawaySpeedStart: {
    title: "보조 시작 속도",
    summary: "아래층 돌파 보조가 처음 켜지기 시작하는 손의 속도입니다.",
    high: "높이면 꽤 빠르게 당겨야 보조가 시작되어 신중한 조작과 강한 조작의 차이가 커집니다.",
    low: "낮추면 조금만 빠르게 움직여도 보조가 들어가 아래층 블록이 쉽게 빠집니다.",
    pair: "‘보조가 너무 자주 개입한다’면 올리고, ‘세게 당기는 것 같은데도 보조가 안 걸린다’면 낮추세요.",
  },
  breakawaySpeedFull: {
    title: "보조 최대 속도",
    summary: "이 속도에 도달했을 때 아래층 돌파 보조가 최대 강도로 적용됩니다.",
    high: "높이면 매우 빠른 움직임에서만 최대 보조가 나오므로 힘이 점진적으로 증가합니다.",
    low: "낮추면 보조가 빠르게 최대치에 도달해 강한 당김이 더 즉각적입니다.",
    pair: "보조 시작 속도와 간격을 두고 조절하세요. 두 값이 너무 가까우면 보조가 갑자기 켜지는 느낌이 강해질 수 있습니다.",
  },
  lowerBreakawayForceBonus: {
    title: "돌파 추가 최대 힘",
    summary: "아래층에서 빠른 당김 조건을 만족했을 때 기본 힘 상한에 추가되는 힘입니다.",
    high: "높이면 꽉 낀 아래층 블록도 확실히 빠질 수 있지만, 너무 높으면 순간적으로 블록이 튀거나 타워가 크게 흔들릴 수 있습니다.",
    low: "낮추면 보조가 자연스럽고 절제되지만, 가장 무거운 아래층 중앙 블록은 여전히 안 빠질 수 있습니다.",
    pair: "현재 문제처럼 ‘아래/중간층만 너무 안 빠진다’면 전역 마찰이나 무게보다 먼저 조절하기 좋은 값입니다.",
  },
  lowerBreakawayVelocityGain: {
    title: "돌파 속도 힘",
    summary: "돌파 보조 중 손의 이동 속도를 실제 힘에 얼마나 추가로 반영할지 정합니다.",
    high: "높이면 같은 최대 힘 범위 안에서도 빠르게 휘두른 방향으로 더 강하게 밀어주는 느낌이 납니다.",
    low: "낮추면 돌파 보조가 주로 위치 오차를 따라가는 힘에 의존해 더 차분합니다.",
    pair: "‘빠르게 당기는 동작 자체의 손맛’을 키우는 값입니다. 블록이 너무 튄다면 추가 최대 힘과 함께 낮춰보세요.",
  },
  centerBlockBreakawayMultiplier: {
    title: "가운데 블록 보정",
    summary: "돌파 보조가 적용되는 층에서 중앙 슬롯 블록에만 추가로 곱해지는 보정입니다.",
    high: "높이면 양옆 블록보다 눌림이 큰 가운데 블록을 빠르게 당겼을 때 더 강한 도움을 받습니다.",
    low: "1에 가까우면 가운데 블록도 양옆 블록과 같은 보조만 받아 실제 하중 차이가 더 그대로 드러납니다.",
    pair: "양옆은 괜찮은데 중앙만 유독 안 빠질 때 가장 먼저 조절할 값입니다. 전체 타워 물리를 바꾸지 않는다는 장점이 있습니다.",
  },
});

const GUIDE_SECTIONS = [
  {
    title: "먼저 기억할 원칙",
    body: `물리 튜닝은 하나의 정답을 찾는 작업보다 ‘원하는 손맛’을 만드는 작업에 가깝습니다. 한 번에 여러 값을 크게 바꾸면 어떤 값 때문에 좋아졌는지 알기 어려우므로, 보통 프리셋에서 시작해 한 계열씩 조절하는 것을 권장합니다.\n\n1) 블록 자체의 느낌 → 2) 손이 블록을 잡는 느낌 → 3) 빠른 동작의 힘 → 4) 아래층 돌파 보조 순서로 맞추면 원인을 찾기 쉽습니다.`,
  },
  {
    title: "1. 블록 자체의 느낌 만들기",
    body: `블록 무게와 마찰은 타워 전체의 기본 성격을 만듭니다. 무게가 높으면 관성이 커지고 접촉면을 누르는 힘도 커져 더 묵직합니다. 마찰이 높으면 서로 잘 버티지만 빼기가 어려워집니다.\n\n이동 감쇠는 ‘한 번 밀린 블록이 얼마나 오래 미끄러지는가’, 회전 감쇠는 ‘기울거나 돈 블록이 얼마나 오래 회전하는가’를 결정합니다. 현실적인 느낌을 원하면 무게/마찰을 먼저 극단적으로 건드리지 말고 감쇠로 움직임의 마무리를 다듬는 편이 좋습니다.`,
  },
  {
    title: "2. 손에 붙는 느낌 만들기",
    body: `기본 그랩 반응은 가상 손을 따라가려는 힘, 그랩 안정화는 그 과정의 떨림을 눌러주는 역할입니다. 그랩 반응만 높이고 안정화를 너무 낮게 두면 고무줄처럼 출렁이거나 잡는 순간 타워가 튈 수 있습니다.\n\n반대로 안정화가 너무 높으면 블록이 물속에서 끌리는 듯 둔해집니다. ‘즉각적이되 덜 떨리는’ 지점을 찾는 것이 목표입니다.`,
  },
  {
    title: "3. 천천히와 세게의 차이 만들기",
    body: `빠른 손동작 힘, 빠른 동작 최대 힘, 속도 부스트 기준은 함께 봐야 합니다. 빠른 손동작 힘은 손 속도를 힘으로 바꾸는 양이고, 빠른 동작 최대 힘은 그 힘의 천장, 속도 부스트 기준은 강한 힘에 도달하기 위해 필요한 손 속도입니다.\n\n‘천천히는 섬세하게, 확 당기면 강하게’ 만들고 싶다면 기본 최대 힘은 과도하게 올리지 말고 빠른 손동작 힘과 빠른 동작 최대 힘을 올린 뒤 부스트 기준을 조절하세요.`,
  },
  {
    title: "4. 아래층만 안 빠질 때",
    body: `아래층은 위 블록들의 무게를 받아 접촉 압력이 커지고, 같은 마찰 계수여도 실제로 빼는 데 필요한 힘이 커집니다. 그래서 아래층 문제를 해결하려고 전체 마찰을 낮추면 상단까지 지나치게 미끄러워질 수 있습니다.\n\n이럴 때는 ‘보조 적용 최고 층 → 보조 시작/최대 속도 → 돌파 추가 최대 힘 → 돌파 속도 힘 → 가운데 블록 보정’ 순으로 조절하세요. 이 계열은 빠르게 힘을 주었을 때만 아래층을 보완하기 때문에 상단의 기본 물리를 비교적 잘 보존합니다.`,
  },
];

const SYMPTOM_GUIDE = [
  { symptom: "아래층 중앙 블록만 거의 안 빠짐", tune: "가운데 블록 보정 ↑ → 부족하면 돌파 추가 최대 힘 ↑", note: "전체 마찰/무게는 최대한 유지하면 상단 손맛을 보존하기 쉽습니다." },
  { symptom: "모든 층이 너무 안 움직임", tune: "기본 최대 힘 ↑ 또는 블록 마찰 ↓ → 필요하면 그랩 반응 소폭 ↑", note: "먼저 전역 문제인지 특정 아래층 문제인지 구분하세요." },
  { symptom: "잡는 순간 타워가 확 흔들림", tune: "기본 그랩 반응 ↓ / 빠른 손동작 힘 ↓ / 그랩 안정화 ↑", note: "힘 상한보다 그랩 반응이 너무 공격적인 경우가 많습니다." },
  { symptom: "빠르게 당기면 블록이 날아감", tune: "빠른 동작 최대 힘 ↓ / 돌파 추가 최대 힘 ↓ / 돌파 속도 힘 ↓", note: "속도 부스트 기준을 올려 강한 힘의 발동을 어렵게 만드는 방법도 있습니다." },
  { symptom: "손을 놓은 뒤 블록이 너무 오래 미끄러짐", tune: "이동 감쇠 ↑ 또는 블록 마찰 소폭 ↑", note: "마찰은 타워 전체 난이도에도 영향을 주므로 감쇠부터 조금씩 올리는 것이 안전합니다." },
  { symptom: "블록이 너무 쉽게 빙글 돌거나 기울어짐", tune: "회전 감쇠 ↑ / 빠른 힘 계열 소폭 ↓", note: "모서리를 잡으면 어느 정도 회전하는 것은 정상적인 물리 반응입니다." },
  { symptom: "조작이 고무줄처럼 늦게 따라옴", tune: "기본 그랩 반응 ↑, 필요하면 그랩 안정화도 함께 소폭 ↑", note: "그랩 반응만 크게 올리면 진동이 생길 수 있어 두 값을 같이 확인하세요." },
  { symptom: "천천히 움직여도 너무 강한 힘이 나옴", tune: "기본 최대 힘 ↓ / 속도 부스트 기준 ↑", note: "빠른 힘은 살리고 평상시 섬세함만 되찾고 싶을 때 유용합니다." },
];

const RECIPE_GUIDE = [
  { name: "현실적인 기본형", description: "마찰과 무게는 중간값을 유지하고, 감쇠를 적당히 둔 뒤 기본 최대 힘은 절제합니다. 아래층은 돌파 보조로만 해결합니다.", result: "상단은 섬세하고 아래층은 세게 당겨야 빠지는 현재 목표에 가장 가까운 방향입니다." },
  { name: "캐주얼하고 잘 빠지는 느낌", description: "블록 무게·마찰을 약간 낮추고, 그랩 반응/빠른 손동작 힘/빠른 최대 힘을 올리며 부스트 기준은 낮춥니다.", result: "처음 하는 사람도 쉽게 움직일 수 있지만 타워가 조금 더 가볍고 활발하게 반응합니다." },
  { name: "묵직하고 어려운 느낌", description: "무게·마찰을 조금 올리고 기본/빠른 최대 힘을 낮춥니다. 부스트 기준과 보조 시작 속도를 높이고 돌파 보조는 줄입니다.", result: "힘 조절과 블록 선택이 중요해지고 실수 없이 빼기가 어려워집니다." },
  { name: "드라마틱한 흔들림", description: "회전 감쇠를 조금 낮추고 빠른 손동작 힘을 올리되, 최대 힘은 과하지 않게 제한합니다.", result: "블록을 거칠게 다루면 기울기와 회전이 잘 보이면서 타워가 생동감 있게 흔들립니다." },
];

let popover = null;
let popoverAnchor = null;
let popoverPinned = false;
let closeTimer = null;
let guideModal = null;
let guideTrigger = null;
let previousBodyOverflow = "";

function createInfoIcon(label, className = "physics-help-info") {
  const icon = document.createElement("span");
  icon.className = className;
  icon.textContent = "i";
  icon.tabIndex = 0;
  icon.setAttribute("role", "button");
  icon.setAttribute("aria-label", `${label} 설명 보기`);
  return icon;
}

function createPopover() {
  if (popover) return popover;
  popover = document.createElement("aside");
  popover.className = "physics-help-popover";
  popover.role = "tooltip";
  popover.hidden = true;
  popover.addEventListener("pointerenter", cancelPopoverClose);
  popover.addEventListener("pointerleave", () => {
    if (!popoverPinned) schedulePopoverClose();
  });
  document.body.append(popover);
  return popover;
}

function popoverMarkup(help) {
  return `<div class="physics-help-popover__title">${help.title}</div><p>${help.summary}</p><dl><div><dt>값을 높이면</dt><dd>${help.high}</dd></div><div><dt>값을 낮추면</dt><dd>${help.low}</dd></div><div><dt>튜닝 팁</dt><dd>${help.pair}</dd></div></dl>`;
}

function positionPopover() {
  if (!popover || popover.hidden || !popoverAnchor) return;
  const anchorRect = popoverAnchor.getBoundingClientRect();
  const width = Math.min(340, window.innerWidth - 24);
  popover.style.width = `${width}px`;
  const popoverRect = popover.getBoundingClientRect();
  let left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - popoverRect.width - 12));
  const belowTop = anchorRect.bottom + 8;
  const fitsBelow = belowTop + popoverRect.height <= window.innerHeight - 12;
  const top = fitsBelow ? belowTop : Math.max(12, anchorRect.top - popoverRect.height - 8);
  popover.style.left = `${Math.round(left)}px`;
  popover.style.top = `${Math.round(top)}px`;
}

function openPopover(anchor, help, { pinned = false } = {}) {
  cancelPopoverClose();
  const target = createPopover();
  popoverAnchor?.setAttribute("aria-expanded", "false");
  popoverAnchor = anchor;
  popoverPinned = pinned;
  target.innerHTML = popoverMarkup(help);
  target.hidden = false;
  anchor.setAttribute("aria-expanded", "true");
  requestAnimationFrame(positionPopover);
}

function closePopover() {
  cancelPopoverClose();
  if (popover) popover.hidden = true;
  popoverAnchor?.setAttribute("aria-expanded", "false");
  popoverAnchor = null;
  popoverPinned = false;
}

function schedulePopoverClose() {
  cancelPopoverClose();
  closeTimer = window.setTimeout(() => {
    if (!popoverPinned) closePopover();
  }, 110);
}

function cancelPopoverClose() {
  if (closeTimer) window.clearTimeout(closeTimer);
  closeTimer = null;
}

function bindSettingInfoIcon(icon, help) {
  icon.setAttribute("aria-expanded", "false");
  icon.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    openPopover(icon, help);
  });
  icon.addEventListener("pointerleave", () => {
    if (!popoverPinned) schedulePopoverClose();
  });
  icon.addEventListener("focus", () => openPopover(icon, help));
  icon.addEventListener("blur", () => {
    if (!popoverPinned) schedulePopoverClose();
  });
  icon.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  icon.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (popoverAnchor === icon && popoverPinned && !popover?.hidden) {
      closePopover();
      return;
    }
    openPopover(icon, help, { pinned: true });
  });
  icon.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    if (popoverAnchor === icon && popoverPinned && !popover?.hidden) closePopover();
    else openPopover(icon, help, { pinned: true });
  });
}

function renderGuideModal() {
  const sections = GUIDE_SECTIONS.map((section) => `<section class="physics-guide-section"><h3>${section.title}</h3>${section.body.split("\n\n").map((paragraph) => `<p>${paragraph}</p>`).join("")}</section>`).join("");
  const symptoms = SYMPTOM_GUIDE.map((item) => `<article class="physics-guide-symptom"><h4>${item.symptom}</h4><strong>${item.tune}</strong><p>${item.note}</p></article>`).join("");
  const recipes = RECIPE_GUIDE.map((item) => `<article class="physics-guide-recipe"><h4>${item.name}</h4><p>${item.description}</p><span>${item.result}</span></article>`).join("");
  return `<div class="physics-guide-modal__backdrop" data-guide-close></div><section class="physics-guide-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="physics-guide-title"><header class="physics-guide-modal__header"><div><span class="physics-admin-badge">ADMIN GUIDE</span><h2 id="physics-guide-title">블록 타워 물리 튜닝 가이드</h2><p>숫자의 정답보다 원하는 플레이 감각을 만드는 방법을 중심으로 정리했습니다.</p></div><button class="physics-guide-modal__close" type="button" data-guide-close aria-label="물리 튜닝 가이드 닫기">×</button></header><div class="physics-guide-modal__body"><div class="physics-guide-callout"><strong>추천 시작점</strong><p>보통 프리셋 → 5~10층 중앙 블록 테스트 → 최상단 확인 → 한 계열씩 조정 → 만족한 뒤 저장</p></div>${sections}<section class="physics-guide-section"><h3>증상으로 찾는 조절값</h3><div class="physics-guide-symptoms">${symptoms}</div></section><section class="physics-guide-section"><h3>원하는 연출별 조합</h3><div class="physics-guide-recipes">${recipes}</div></section><section class="physics-guide-section"><h3>실시간 상태 숫자 읽는 법</h3><div class="physics-guide-metric-grid"><div><strong>마우스 속도</strong><span>현재 손동작이 속도 부스트·돌파 보조 조건에 얼마나 가까운지 보는 값입니다.</span></div><div><strong>현재 힘</strong><span>지금 프레임에서 잡은 지점에 실제 적용되는 힘의 크기입니다. 최대 힘 설정에 닿는지 비교할 수 있습니다.</span></div><div><strong>돌파 보정</strong><span>×1.00이면 보조 없음, 값이 커질수록 아래층/가운데 보조가 더 강하게 개입하고 있다는 뜻입니다.</span></div><div><strong>선택 블록</strong><span>몇 층 몇 번째 슬롯을 테스트 중인지 확인해 층별 차이를 같은 조건으로 비교하는 데 사용하세요.</span></div></div></section><section class="physics-guide-section physics-guide-warning"><h3>튜닝할 때 피하면 좋은 것</h3><p>한 번에 4~5개 값을 크게 바꾸지 마세요. 특정 아래층 문제를 해결하려고 전체 무게와 마찰을 먼저 크게 낮추지 마세요. 빠른 힘을 키울 때 최대 힘 제한까지 동시에 지나치게 올리면 블록이 순간적으로 튀는 현상이 생길 수 있습니다.</p><p>저장 전에는 상단·중단·하단을 각각 다시 테스트해 한 구간을 고치면서 다른 구간의 손맛이 무너지지 않았는지 확인하는 것이 좋습니다.</p></section></div></section>`;
}

function createGuideModal() {
  if (guideModal) return guideModal;
  guideModal = document.createElement("div");
  guideModal.className = "physics-guide-modal";
  guideModal.hidden = true;
  guideModal.innerHTML = renderGuideModal();
  guideModal.querySelectorAll("[data-guide-close]").forEach((element) => element.addEventListener("click", closeGuideModal));
  document.body.append(guideModal);
  return guideModal;
}

function openGuideModal(trigger) {
  closePopover();
  const modal = createGuideModal();
  guideTrigger = trigger;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  modal.hidden = false;
  modal.querySelector(".physics-guide-modal__close")?.focus();
}

function closeGuideModal() {
  if (!guideModal || guideModal.hidden) return;
  guideModal.hidden = true;
  document.body.style.overflow = previousBodyOverflow;
  guideTrigger?.focus();
  guideTrigger = null;
}

function decoratePhysicsSettings() {
  const panel = document.querySelector("#physics-settings-panel");
  if (!panel) return;
  const heading = panel.querySelector("h2");
  if (heading && !heading.parentElement?.classList.contains("physics-settings-title-row")) {
    const titleRow = document.createElement("div");
    titleRow.className = "physics-settings-title-row";
    heading.before(titleRow);
    titleRow.append(heading);
    const guideInfo = createInfoIcon("전체 물리 튜닝 가이드", "physics-help-info physics-help-info--guide");
    guideInfo.addEventListener("click", (event) => {
      event.preventDefault();
      openGuideModal(guideInfo);
    });
    guideInfo.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      openGuideModal(guideInfo);
    });
    titleRow.append(guideInfo);
  }
  panel.querySelectorAll(".physics-setting-row").forEach((row) => {
    if (row.querySelector(".physics-help-info")) return;
    const input = row.querySelector("[data-physics-setting]");
    const header = row.querySelector(".physics-setting-row__header");
    const name = header?.firstElementChild;
    const help = SETTING_HELP[input?.dataset.physicsSetting];
    if (!input || !header || !name || !help) return;
    const labelWrap = document.createElement("span");
    labelWrap.className = "physics-setting-label";
    name.before(labelWrap);
    labelWrap.append(name);
    const icon = createInfoIcon(help.title);
    bindSettingInfoIcon(icon, help);
    labelWrap.append(icon);
  });
}

function handleGlobalPointerDown(event) {
  if (!popoverPinned || !popover || popover.hidden) return;
  if (popover.contains(event.target) || popoverAnchor?.contains(event.target)) return;
  closePopover();
}

function handleKeydown(event) {
  if (event.key !== "Escape") return;
  if (guideModal && !guideModal.hidden) closeGuideModal();
  else closePopover();
}

function initializePhysicsHelp() {
  decoratePhysicsSettings();
  document.addEventListener("pointerdown", handleGlobalPointerDown);
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", positionPopover);
  document.addEventListener("scroll", positionPopover, true);
}

if (document.readyState === "complete") initializePhysicsHelp();
else window.addEventListener("load", initializePhysicsHelp, { once: true });

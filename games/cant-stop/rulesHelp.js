export const CANT_STOP_RULES_GUIDE = Object.freeze({
  title: "Can’t Stop 게임 규칙",
  intro: "주사위 네 개를 두 쌍으로 나눠 합에 해당하는 산길을 오르고, 욕심을 더 낼지 지금 멈춰 진척을 저장할지 선택하는 push-your-luck 게임입니다. 세 개의 열을 먼저 완주하면 승리합니다.",
  sections: Object.freeze([
    Object.freeze({
      title: "1. 목표와 보드",
      visual: "board",
      paragraphs: Object.freeze([
        "보드는 2부터 12까지 총 11개의 열로 구성됩니다. 각 숫자는 주사위 두 개의 합을 뜻합니다.",
        "열마다 정상까지 필요한 칸 수가 다릅니다. 2·12는 3칸, 3·11은 5칸, 4·10은 7칸, 5·9는 9칸, 6·8은 11칸, 7은 13칸입니다.",
        "자기 색의 진행 말을 정상에 확정해 열을 차지합니다. 가장 먼저 서로 다른 세 개의 열을 차지한 플레이어가 승리합니다.",
      ]),
    }),
    Object.freeze({
      title: "2. 내 턴에 하는 일",
      visual: "turn",
      paragraphs: Object.freeze([
        "자기 턴에는 네 개의 주사위를 모두 굴립니다. 나온 네 주사위를 두 개씩 두 쌍으로 묶고, 각 쌍의 합 두 개를 선택합니다.",
        "선택한 합에 해당하는 열에서 이번 턴의 임시 등반 말(runner)을 전진시킵니다. 같은 합이 두 번 만들어지면 같은 열을 두 칸 전진할 수 있습니다.",
        "이동이 끝난 뒤에는 ‘한 번 더 굴리기’와 ‘여기서 멈추기’ 중 하나를 선택합니다.",
      ]),
    }),
    Object.freeze({
      title: "3. 주사위 조합 예시",
      visual: "pairing",
      paragraphs: Object.freeze([
        "예를 들어 1, 2, 3, 4가 나왔다면 3과 7(1+2 / 3+4), 4와 6(1+3 / 2+4), 5와 5(1+4 / 2+3)처럼 세 가지 방식으로 나눌 수 있습니다.",
        "화면에는 현재 보드 상태에서 실제로 사용할 수 있는 조합만 표시됩니다. 이동 가능한 조합이 여러 개라면 그중 하나를 직접 선택합니다.",
        "어떤 주사위 묶음을 선택할지는 자유지만, 선택한 묶음의 두 합을 모두 합법적으로 사용할 수 있다면 둘 다 이동해야 합니다. 둘을 동시에 사용할 수 없을 때만 가능한 한쪽 이동을 선택할 수 있습니다.",
      ]),
    }),
    Object.freeze({
      title: "4. runner는 최대 세 개",
      visual: "runners",
      paragraphs: Object.freeze([
        "한 턴 동안 동시에 등반할 수 있는 열은 최대 세 개입니다. 처음 선택한 열에는 runner가 생기고, 같은 열을 다시 선택하면 그 runner가 계속 올라갑니다.",
        "runner 세 개를 이미 사용 중이라면 새로운 네 번째 열에는 들어갈 수 없습니다. 이미 사용 중인 세 열 중에서 이동 가능한 조합을 골라야 합니다.",
        "이미 다른 플레이어가 완주해 차지한 열은 닫힌 열이므로 더 이상 누구도 올라갈 수 없습니다.",
      ]),
    }),
    Object.freeze({
      title: "5. 멈추면 진척 저장",
      visual: "stop",
      paragraphs: Object.freeze([
        "‘여기서 멈추기’를 선택하면 이번 턴 runner의 위치가 자기 색의 영구 진척으로 저장됩니다. 그 다음 플레이어에게 턴이 넘어갑니다.",
        "runner가 열의 정상에 도착한 것만으로는 아직 그 열을 차지한 것이 아닙니다. 정상에 도착한 상태에서 ‘멈추기’를 선택해야 열이 확정됩니다. 그 전에 다시 굴리다가 bust가 되면 이번 턴의 정상 도달도 잃습니다.",
        "열을 차지하면 그 열에 있던 다른 플레이어의 진척은 제거되고 그 열은 게임에서 닫힙니다.",
      ]),
    }),
    Object.freeze({
      title: "6. 무리하다가 이동할 수 없으면 bust",
      visual: "bust",
      paragraphs: Object.freeze([
        "한 번 더 굴렸는데 가능한 어떤 주사위 묶음으로도 현재 규칙에 맞게 runner를 전진시킬 수 없다면 bust입니다.",
        "bust가 되면 그 턴에 runner로 새로 올라간 모든 임시 진척을 잃고, 직전에 안전하게 저장했던 영구 진척 위치로 돌아갑니다. 턴도 즉시 다음 플레이어에게 넘어갑니다.",
        "그래서 많이 올라갔을수록 계속 굴릴 보상도 커지지만, 한 번의 bust로 이번 턴의 등반을 모두 잃을 위험도 커집니다.",
      ]),
    }),
    Object.freeze({
      title: "7. 승리와 게임 종료",
      visual: "win",
      paragraphs: Object.freeze([
        "멈추기를 선택해 세 번째 열까지 차지한 상태를 확정하면 게임이 종료되고 그 플레이어가 승리합니다. 한 번의 멈추기로 여러 열을 동시에 차지해 세 개를 넘겨도 그대로 승리합니다.",
        "진행 중 게임을 수동으로 끝내야 할 때는 방장이 ‘게임 종료’를 사용할 수 있습니다. 전체 방에 영향을 주므로 확인 후 서버에서 종료되며, 종료 뒤에는 재대결 또는 방 나가기를 선택할 수 있습니다.",
      ]),
    }),
    Object.freeze({
      title: "8. 이 웹 버전에서 알아둘 점",
      visual: "server",
      paragraphs: Object.freeze([
        "첫 플레이어와 주사위 결과, 가능한 조합, runner 이동, 열 차지와 승리 판정은 서버가 결정합니다.",
        "주사위 조합이 하나뿐이어도 자동으로 이동하지 않습니다. 현재 플레이어가 화면에 표시된 이동안을 직접 눌러 확정합니다.",
        "다른 플레이어의 행동은 최신 서버 상태를 다시 불러와 반영하므로, 화면이 잠시 어긋나 보이면 ‘상태 새로고침’을 사용할 수 있습니다.",
      ]),
    }),
  ]),
  sources: Object.freeze([
    Object.freeze({
      label: "Eagle-Gryphon Games · Can’t Stop",
      href: "https://www.eagle-gryphon.com/products/cant-stop-1",
    }),
    Object.freeze({
      label: "Board Game Arena · Can’t Stop 규칙 요약",
      href: "https://ko.boardgamearena.com/gamepanel?game=cantstop",
    }),
  ]),
});

import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player { // Player의 스테이터스 클래스
  constructor() {
    this.hp = 100;
  }

  attack() {
    // 플레이어의 공격력
    this.damage = 20; 
  }
}

class Monster { // Monster의 스테이터스 클래스
  constructor() {
    this.hp = 100; // 기본 몬스터 HP
  }

  attack() {
    // 몬스터의 공격력
    this.damage = 2.5; // 기본 몬스터 공격력
  }
}

//////////////////////////////////////////////////////////////////////

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| Player HP: ${player.hp}, Attack: ${player.damage} `,
    ) +
    chalk.redBright(
      `| Monster HP: ${monster.hp}, Attack: ${monster.damage}|`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

/////////////////////////////////////////////////////////////////////

const battle = async (stage, player, monster) => {
  let logs = [];

  // 스테이지에 따른 몬스터의 능력치 선설정
  player.attack(); // 플레이어 공격력 변수 생성
  monster.hp += 10 * (stage-1); // 스테이지에 따라 몬스터 HP 증가
  monster.attack(); // 몬스터 공격력 변수 생성
  monster.damage += 0.25 * (stage - 1); // 스테이지에 따라 몬스터 공격력 증가 

  let battle_end = false; // 전투 종료 변수 선언 및 초기화
  while(1) { // 조건문이 참인 한 ,계속 루프

    console.clear(); //상태메시지 출력을 위해 화면 초기화 X
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    if(battle_end === true) {break;} // 전투 종료 시 루프 탈출
    
    console.log(
      chalk.green(
        `\n1. 공격한다 2. 도망친다.`,
      ),
    );
    const choice = readlineSync.question(`> `); //당신의 선택은? 

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {
        case '1': // 공격(전투)
            //player.attack();
            monster.hp -= player.damage; 
            logs.push(chalk.green(`몬스터에게 ${player.damage}의 데미지를 입혔습니다.`));
               
            if (monster.hp <= 0) {
                battle_end = true;
                break; 
            }

            //monster.attack();
            player.hp -= monster.damage;
            logs.push(chalk.red(`몬스터가 ${monster.damage}의 데미지를 입혔습니다.`));

            if (player.hp <= 0) { 
              battle_end = true; 
            } 

            break; // switch 문에 대한 break
          

        case '2': // 도망
            battle_end = true;
            break; // switch 문에 대한 break

        default:  // 잘못된 입력 시
            logs.push(chalk.red('어이쿠! 넘어졌습니다. 약간의 데미지를 입습니다.'));
            player.hp -= 10;

            //break;     // default는 switch문 마지막에 실행되므로 break 필요 X
    }
  }

};

//////////////////////////////////////////////////////////////////

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if (player.hp <= 0) { // 게임종료 ; 플레이어 패배
      console.log(chalk.red('플레이어가 쓰러졌습니다.\nGame Over'));
      break;
    }
    else if (monster.hp <= 0) { // 스테이지 클리어 ; 몬스터 처치
      console.log(chalk.green(`몬스터를 처치했습니다!\n스테이지 ${stage} 클리어! `));
      if(stage !== 10) {

        console.log(chalk.green(`약간의 휴식으로 소량의 체력을 회복합니다.`));
        player.hp += 10; // 스테이지 클리어 시 체력 회복
        if(player.hp > 100) player.hp = 100; // 최대 체력은 100으로 제한

        console.log(chalk.green(`다음 스테이지로 이동합니다.`));
        const goNext = readlineSync.question(`Press Enter to go Next \n`);
        }
    }
    else { // 도망쳤을 경우
        console.log(chalk.yellow('도망쳤습니다.'));
        if(stage !== 1){
            console.log(chalk.yellow('이전 스테이지로 돌아갑니다.'));
            stage--;
        }
        else { 
            console.log(chalk.yellow('해당 스테이지에 다시 도전합니다.'));
        }

        continue;
    }

    stage++;
  }

  // 모든 스테이지를 클리어했을 경우
  if (stage > 10) {
  console.log(chalk.green('모든 스테이지를 클리어했습니다! 축하합니다!'));
  }
}
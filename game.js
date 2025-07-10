import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player { // Player의 스테이터스 클래스
  constructor() {
    this.hp = 100; // 플레이어의 초기 현재 hp
    this.maxhp = 100; // 플레이어의 초기 최대 hp
    this.damage = 20; // 플레이어의 초기 공격력

  }

  //attack() {
    // 플레이어의 공격력
    //this.damage = 20; 
  //}
}

class Monster { // Monster의 스테이터스 클래스
  constructor() {
    this.hp = 100; // 기본 몬스터 HP
    this.damage = 10; // 몬스터 기본 공격력(lv1 기준)
  }

  //attack() {
    // 몬스터의 공격력
    //this.damage = 2.5; // 기본 몬스터 공격력
  //}
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
  //player.attack(); // 플레이어 공격력 변수 생성

  // 스테이지에 따른 증가 척도 : 최소값의 2배수를 최댓값으로 하여 난수 곱에 따라 최솟값과 최대값 사이의 증가값을 더함
  monster.hp += Math.floor((1 + Math.random()) * (stage - 1) * 8); // 스테이지에 따라 몬스터 HP 증가 ; 최소증가값:8
  //monster.attack(); // 몬스터 공격력 변수 생성
  monster.damage += Math.floor((1 + Math.random()) * (stage - 1) * 5); // 스테이지에 따라 몬스터 공격력 증가 ; 최소증가값:10

  let battle_end = false; // 전투 종료 변수 선언 및 초기화
  while(1) { // 조건문이 참인 한 ,계속 루프

    console.clear(); //상태메시지 출력을 위해 화면 초기화 X
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    if(battle_end === true) {break;} // 전투 종료 시 루프 탈출
    
    console.log(
      chalk.green(
        `\n1. 공격 2. 연속 공격, 3. 방어, 4. 도망`,
      ),
    );
    const choice = readlineSync.question(`> `); //당신의 선택은? 

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {

        case '1': // 공격(전투)
            monster.hp -= player.damage; 
            logs.push(chalk.green(`몬스터에게 ${player.damage}의 데미지를 입혔습니다.`));
               
            if (monster.hp <= 0) {
                battle_end = true;
                break; 
            }

            player.hp -= monster.damage;
            logs.push(chalk.red(`몬스터가 ${monster.damage}의 데미지를 입혔습니다.`));

            if (player.hp <= 0) { 
              battle_end = true; 
            } 

            break; // switch 문에 대한 break


        case '2': // 연속 공격 ; 각 공격은 확률적으로 실패할 수 있음
          let double_success = 50; // 연속 공격 성공 확률 50%
          for(let i=0; i<2; i++){ // 연속 공격 2회
            let double_attack = Math.random() *100;
            if( double_attack >= double_success){
              monster.hp -= player.damage;
              logs.push(chalk.green(`몬스터에게 ${player.damage}의 데미지를 입혔습니다.`));

              if (monster.hp <= 0) {
                battle_end = true;
                break; 
              }

            }
            else{
              logs.push(chalk.red(`공격이 빗나갔습니다.`));
            }
          }

          player.hp -= monster.damage;
          logs.push(chalk.red(`몬스터가 ${monster.damage}의 데미지를 입혔습니다.`));

          if (player.hp <= 0) { 
              battle_end = true; 
          } 
          break;
        

        case '3': // 방어
            let defense_success = 30; // 방어 성공 커트라인 
            let defense_try = Math.random() * 100; // 방어 성공 여부 결정
            
            let reflect_success = 2*defense_success; // 반격 성공 커트라인
            const defence_damage = 0.6*player.damage; // 반격 데미지
            if(defense_try >= reflect_success) {
              monster.hp -= defence_damage ; // 방어 성공 시 몬스터에게 반격 데미지  
              logs.push(chalk.green(`방어에 성공했습니다!\n몬스터에게 ${defence_damage}의 반격 데미지를 입혔습니다.`));

              if (monster.hp <= 0) {
                battle_end = true;
                break; 
              }
            }
            else if(defense_try >= defense_success){
              logs.push(chalk.green(`방어에 성공했습니다!\n아무런 피해도 입지 않았습니다.`));
            }
            else{
              player.hp -= monster.damage; // 방어 실패 
              logs.push(chalk.red(`방어에 실패했습니다! \n몬스터가 ${monster.damage}의 데미지를 입혔습니다.`));

              if (player.hp <= 0) { 
              battle_end = true; 
              }
            }
            
            break; // switch 문에 대한 break


        case '4': // 도망 : 예제에서는 일정확률로 다음 스테이지로 넘어가도록 하지만 도망은 후퇴로 변경함
         
         let tryrun = Math.random() * 100;

          if(stage === 10){
            logs.push(chalk.yellow(`마지막 스테이지에서는 도망칠 수 없습니다.`));
            break; // switch 문에 대한 break
          }         
          
          if(tryrun >= 70){
            logs.push(chalk.yellow(`성공적으로 도망쳤습니다.`));
            battle_end = true; // 도망 성공 시 전투 종료
            if(stage !== 1){
              logs.push(chalk.yellow(`이전 스테이지로 돌아갑니다.`));
              stage--;
            }
            else { 
              logs.push(chalk.yellow(`해당 스테이지에 다시 도전합니다.`));
            }

            
          }
          else{
            logs.push(chalk.red(`도망에 실패했습니다!`));
            player.hp -= monster.damage; // 도망 실패 시 몬스터 공격
            logs.push(chalk.red(`몬스터가 ${monster.damage}의 데미지를 입혔습니다.`));

            if (player.hp <= 0) { 
              battle_end = true; 
              }
          }
          break; // switch 문에 대한 break


        default:  // 잘못된 입력 시
            logs.push(chalk.red('어이쿠! 넘어졌습니다. 약간의 데미지를 입습니다.'));
            player.hp -= 10;

            if (player.hp <= 0) { 
              battle_end = true; 
              }

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
    const monster = new Monster(stage); // stage에 따라 몬스터 생성
    await battle(stage, player, monster);


    // 스테이지 클리어 및 게임 종료 조건 과 처리
    if (player.hp <= 0) { // 게임종료 ; 플레이어 패배
      console.log(chalk.red('플레이어가 쓰러졌습니다.\nGame Over'));
      break;
    }

    else if (monster.hp <= 0) { // 스테이지 클리어 ; 몬스터 처치
      console.log(chalk.green(`몬스터를 처치했습니다!\n스테이지 ${stage} 클리어! `));
      if(stage !== 10) {
        let hp_up = 20 + Math.floor(30*Math.random());
        let damage_up =5 + Math.floor(15*Math.random()); 
        console.log(chalk.green(`스테이지 클리어로 능력치가 증가합니다.\n체력이 일부 회복됩니다.`));
        
        player.maxhp += hp_up; // 스테이지 클리어 시 최대 체력 증가
        player.hp += (Math.floor(0.1*player.maxhp) + hp_up); // 스테이지 클리어 시 현재 체력에 최대 체력 증가분과 최대 체력의 1할 의 합 만큼 증가
        
        if(player.hp >= player.maxhp) { // 현재 체력이 최대 체력보다 클 경우
          player.hp = player.maxhp; 
        }
        player.damage += damage_up; // 스테이지 클리어 시 공격력 증가
        console.log(chalk.magentaBright(`======================`) +
                    chalk.cyanBright(`\n플레이어 HP: ${player.maxhp} (`) + 
                    chalk.blueBright(`+${hp_up}`) +
                    chalk.cyanBright(`)\n공격력: ${player.damage} (`) +
                    chalk.blueBright(`+${damage_up}`) +
                    chalk.cyanBright(`)`) +
                    chalk.magentaBright(`\n======================`));

        console.log(chalk.green(`다음 스테이지로 이동합니다.`));

        readlineSync.question(`Press Enter to go Next \n`);
        }
    }
    else { // 대개, 도망쳤을 경우
      console.log(chalk.yellow(`약간의 휴식을 취하여 hp를 회복합니다.`));
      player.hp += Math.floor(0.1 * player.maxhp); 
      readlineSync.question(`Press Enter to continue \n`);
      continue;
    }

    stage++;
  }

  // 모든 스테이지를 클리어했을 경우
  if (stage > 10) {
  console.log(chalk.green('모든 스테이지를 클리어했습니다! 축하합니다!'));
  }
}
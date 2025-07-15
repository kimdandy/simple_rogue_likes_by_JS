import chalk from 'chalk'; // console.log 로 출력되는 글씨의 색을 바꿀 수 있음
import readlineSync from 'readline-sync'; // nodejs로 부터 입력 받기
import {startt} from "./server.js";

let stage = 1;
const final_stage = 20; // 최종 스테이지 수치 ; 전역변수 선언

let battle_end = false;

// 업적용 변수
let how_many_attack = 0; // 공격 횟수
let how_many_guard = 0; // 방어 횟수
let how_many_run = 0; // 도망 횟수

class Player { // Player의 스테이터스 클래스
  constructor(hp, damage) {
    this.hp = hp; // 플레이어의 초기 현재 hp
    this.maxhp = hp; // 플레이어의 초기 최대 hp
    this.damage = damage; // 플레이어의 초기 공격력
    //this.potions = 10; // 플레이어가 소유한 포션의 개수 초기값 ; 추후 추가 예정
  }
  // attack() {
  //   플레이어의 공격력
  //   this.damage = 20; 
  // }
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

function displayStatus(stage=0, player, monster=null, hp_up = 0, damage_up = 0) {
  
  if(stage === final_stage){
    console.log(chalk.redBright(`XXXXXXXXX Boss Stage XXXXXXXXX`));
  }
  else{
    console.log(chalk.magentaBright(`\n======= Current Status =======`));
  }

  if(monster !== null && stage !==0){ // 전투용 스테이터스창
    // 스테이지와 몬스터값이 정상적으로 존재한다면 반환
    // ex) displayStatus(stage, player, monster) : 뒤에 스탯 증가치는 넣지 않으면 default값 대입
    console.log(
      chalk.cyanBright(`| Stage: ${stage} |\n`) +
      chalk.blueBright(
        `| Player HP: ${player.hp}, Attack: ${player.damage}|\n`,
      ) +
      chalk.redBright(
        `| Monster HP: ${monster.hp}, Attack: ${monster.damage}|`,
      ),
    );
  }

  else if (hp_up === 0 && damage_up === 0) { // 현재 플레이어의 스탯창
    // player 스탯만 필요하고 전투 상태가 아니므로 스테이지값에 0 대입
    // ex) displayStatus(n, player) : 나머지는 직접 대입 않고 default값으로 자동대입
    console.log(
      //chalk.cyanBright(`| Stage: ${stage} |\n`) +
      chalk.cyanBright(`| Player HP: ${player.hp}/${player.maxhp} `) +
      chalk.cyanBright(` |\n| Attack: ${player.damage} `) ,
      chalk.cyanBright(` |`) 
    );
  }

  else { // 현재 플레이어의 스탯 증가 확인창
    // 전투상황이 아닌 전투 종료 후 나오는 창
    // ex) displayStatus(0, player, null, hp_up, damage_up)
    //   : 전투창이 출력 되지 않도록 맞는 값 대입 후 스탯 증가치 입력
    console.log(
      //chalk.cyanBright(`| Stage: ${stage} |\n`) +
      chalk.cyanBright(`| Player HP: ${player.hp}/${player.maxhp} (`) +
      chalk.blueBright(`+ ${hp_up} `) +
      chalk.cyanBright(`) |\n| Attack: ${player.damage} (`) ,
      chalk.blueBright(`+ ${damage_up} `) +
      chalk.cyanBright(`) |`) 
    );
  }

  if(stage === final_stage){
    console.log(chalk.redBright(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n`));
  }
  else{
    console.log(chalk.magentaBright(`==============================\n`));
  }
}

/////////////////////////////////////////////////////////////////////

function Status_Up(player, hp_up=null, damage_up=null) {

  if(hp_up === null && damage_up === null){
    hp_up = 20 + Math.floor(30*Math.random()); // 최소증가값:20 ~ 최대증가값:50
    damage_up =5 + Math.floor(15*Math.random()); // 최소증가값:5 ~ 최대증가값:20
  }

  player.maxhp += hp_up; // 최대 체력 증가
  player.hp += (Math.floor(0.05*player.maxhp) + hp_up); 
  // 현재 체력에 최대 체력 증가분과 최대 체력의 1할 의 합 만큼 증가
  if(player.hp >= player.maxhp) { // 현재 체력이 최대 체력보다 클 경우
    player.hp = player.maxhp; 
  }
  player.damage += damage_up; // 공격력 증가
  displayStatus(0, player, null, hp_up, damage_up);
}

/////////////////////////////////////////////////////////////////////

const battle = async (stage, player, monster) => {
  let logs = [];

  // 스테이지에 따른 몬스터의 능력치 선설정
  //player.attack(); // 플레이어 공격력 변수 생성

  if(stage === final_stage){ // 최종전:보스 몬스터
    monster.hp *= 10; // 기본의 10배
    monster.damage *= 20; // 기본의 20배
  }
  else{
    // 스테이지에 따른 증가 척도 : 최소값의 2배수를 최댓값으로 하여 난수 곱에 따라 최솟값과 최대값 사이의 증가값을 더함
    monster.hp += Math.floor((1 + Math.random()) * (stage - 1) * 8); // 스테이지에 따라 몬스터 HP 증가 ; 최소증가값:8
    //monster.attack(); // 몬스터 공격력 변수 생성
    monster.damage += Math.floor((1 + Math.random()) * (stage - 1) * 5); // 스테이지에 따라 몬스터 공격력 증가 ; 최소증가값:10
  }
  
  let battle_end = false; // 전투 종료 변수 선언 및 초기화
  while(1) { // 조건문이 참인 한 ,계속 루프

    console.clear(); 
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
            how_many_attack++;

            monster.hp -= player.damage; 
            logs.push(chalk.green(`몬스터에게 ${player.damage}의 데미지를 입혔습니다.`));
               
            if (monster.hp <= 0) {
                monster.hp = 0;
                battle_end = true;
                break; 
              }

            player.hp -= monster.damage;
            logs.push(chalk.red(`몬스터가 ${monster.damage}의 데미지를 입혔습니다.`));

            if (player.hp <= 0) { 
              player.hp = 0;
              battle_end = true; 
            } 

            break; // switch 문에 대한 break


        case '2': // 연속 공격 ; 각 공격은 확률적으로 실패할 수 있음
          how_many_attack += 2;

          let double_success = 40; // 연속 공격 성공 확률 60%
          for(let i=0; i<2; i++){ // 연속 공격 2회
            let double_attack = Math.random() *100;
            if( double_attack >= double_success){
              monster.hp -= player.damage;
              logs.push(chalk.green(`몬스터에게 ${player.damage}의 데미지를 입혔습니다.`));

            }
            else{
              logs.push(chalk.red(`공격이 빗나갔습니다.`));
            }
          }

          if (monster.hp <= 0) {
                monster.hp = 0;
                battle_end = true;
                break; 
              }

          player.hp -= monster.damage;
          logs.push(chalk.red(`몬스터가 ${monster.damage}의 데미지를 입혔습니다.`));

          if (player.hp <= 0) { 
            player.hp = 0;
            battle_end = true; 
          } 

          break;   

        case '3': // 방어
          how_many_guard++;
          
          let defense_success = 30; // 방어 성공 커트라인 
          let defense_try = Math.random() * 100; // 방어 성공 여부 결정
          
          let reflect_success = 2*defense_success; // 반격 성공 커트라인
          const defence_damage = 0.6*player.damage; // 반격 데미지
          if(defense_try >= reflect_success) {
            monster.hp -= defence_damage ; // 반격 성공 : 방어 성공 시 몬스터에게 반격 데미지  
            logs.push(chalk.green(`방어에 성공했습니다!\n몬스터에게 ${defence_damage}의 반격 데미지를 입혔습니다.`));

            if (monster.hp <= 0) {
              monster.hp = 0;
              battle_end = true;
              break; 
            }
          }
          else if(defense_try >= defense_success){ // 방어만 성공
            logs.push(chalk.green(`방어에 성공했습니다!\n아무런 피해도 입지 않았습니다.`));
          }
          else{
            player.hp -= monster.damage; // 방어 실패 
            logs.push(chalk.red(`방어에 실패했습니다! \n몬스터가 ${monster.damage}의 데미지를 입혔습니다.`));

            if (player.hp <= 0) {
              player.hp = 0; 
              battle_end = true; 
            }
          }
          
          break; // switch 문에 대한 break


        case '4': // 도망 : 예제에서는 일정확률로 다음 스테이지로 넘어가도록 하지만 도망은 후퇴로 변경함
         let tryrun = Math.random() * 100;

          if(stage === final_stage){
            logs.push(chalk.yellow(`마지막 스테이지에서는 도망칠 수 없습니다.`));
            break; // switch 문에 대한 break
          }         
          
          if(tryrun >= 80){ // 도망 성공 확률 20%
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
              player.hp = 0; 
              battle_end = true; 
              }
          }
          break; // switch 문에 대한 break


        default:  // 잘못된 입력 시
            logs.push(chalk.red('어이쿠! 넘어졌습니다. 약간의 데미지를 입습니다.'));
            player.hp -= 10;

            if (player.hp <= 0) {
              player.hp = 0; 
              battle_end = true; 
              }

            //break;     // default는 switch문 마지막에 실행되므로 break 필요 X
    }
  }

};

//////////////////////////////////////////////////////////////////

const event = async (stage, player, monster) => {
  let logs = [];

  console.clear();
  displayStatus(0, player);

  let what_event = Math.floor(Math.random() * 2); // 상황 결정 변수

  if(what_event === 0){ // 휴식 스테이지
    console.log(chalk.white(`안전해 보이는 공간이 나타났습니다.\n무엇을 할까요?\n`) +
                chalk.white(`1. 휴식  2. 수련  ex. 통과`)
                );

    const todo = readlineSync.question(`>`);

    console.clear();
    if(todo === '1') {
      console.log(chalk.green(`피곤했던 당신은 잠깐 눈을 붙입니다.\n휴식을 취하여 최대 체력의 70% 만큼 체력을 회복합니다.`));
      let rest_hp = Math.floor(0.7 * player.maxhp); // 최대 체력의 70% 만큼 회복
      player.hp += rest_hp; 
      if(player.hp > player.maxhp) { // 현재 체력이 최대 체력보다 클 경우
        player.hp = player.maxhp;
      }
      displayStatus(0, player);
    }

    else if(todo === '2') {
      console.log(chalk.green(`가만히 있기도 뭐한 당신은 수련을 시작합니다\n조금 강해졌습니다.`));

      Status_Up(player);
    }

    else{
      console.log(chalk.yellow(`이런 곳에서 머뭇거릴 시간이 없습니다.\n당신은 바로 다음 장소로 이동합니다.`));
    }
  }

  else{ // 보물상자 스테이지 : 랜덤 박스
    console.log(chalk.white(`당신은 상자를 발견했습니다.\n어떻게 할까요?\n1. 열어본다. 2. 지나친다`));
    let box_open=readlineSync.question(`>`);
    if(box_open === 'y' || box_open === 'Y' || box_open === '1'){
      let box_in = Math.floor(Math.random() * 4)
      if(box_in === 1){
        console.log(chalk.red(`상자가 갑자기 달려듭니다!\n최대체력의 절반의 데미지를 받습니다.`));
        player.hp -= Math.floor(0.5 * player.maxhp);
        if(player.hp <=0){ 
          return; 
        }
        console.log(chalk.red(`상자가 다시 공격 해옵니다.`));
        readlineSync.question(`Press Enter to continue \n`);

        await battle(stage, player, monster);

        if(player.hp <=0 || monster.hp<=0){ 
          return; 
        }
      }
      else if(box_in === 2){
        console.log(chalk.green(`상자 안에는 인챈트 주문서가 있었습니다.\n사용하여 장비를 강화합니다`));
        Status_Up(player, 50, 20);
        
      }
      else if(box_in === 3){
        console.log(chalk.green(`상자 안에는 엘릭서 가 들어 있었습니다.\n복용하여 체력을 모두 회복합니다.`));
        player.hp = player.maxhp;
        displayStatus(0, player);
      }
      else{
        console.log(chalk.white(`상자는 비어 있습니다.`));
      }
      
    }
    else{
      console.log(chalk.yellow(`상자를 무시하고 앞으로 나아갑니다.`));
    }  
  }
}

/////////////////////////////////////////////////////////////////

export async function startGame(init_hp, init_damage) {
  console.clear();
  const player = new Player(init_hp, init_damage);
  stage = 1;
  

  while (stage <= final_stage) {
    const monster = new Monster();

    let situation = Math.floor(Math.random() * 100 );
    if(situation > 70 && stage !== 1 && stage !== final_stage){ // 첫 스테이지와 최종 스테이지를 제외한 모든 스테이지에서 30%확률로 출몰
       await event(stage, player, monster);
    }
    else{ 
      await battle(stage, player, monster);
    }

    // 스테이지 클리어 및 게임 종료 조건 과 처리
    if(player.hp <= 0) { // 게임종료 ; 플레이어 패배
      console.log(chalk.red('플레이어가 쓰러졌습니다.'));
      
      readlineSync.question(chalk.red(`Game Over\n`));
      startt();
      break;
    }

    else if (monster.hp <= 0) { // 스테이지 클리어 ; 몬스터 처치
      console.log(chalk.green(`몬스터를 처치했습니다!\n스테이지 ${stage} 클리어! `));

      if(stage !== final_stage) { 
        console.log(chalk.green(`스테이지 클리어로 능력치가 증가합니다.\n체력이 일부 회복됩니다.`));
      
        Status_Up(player);

        console.log(chalk.green(`다음 스테이지로 이동합니다.`));

        readlineSync.question(`Press Enter to go Next! \n`);
      }

      else{
        console.log(chalk.green('모든 스테이지를 클리어했습니다! 축하합니다!'));
        readlineSync.question(`Press Enter to continue \n`)
        startt();
        break;
      }

    }

    else { // 도망쳤을 경우, 예외

      readlineSync.question(`Press Enter to go Next!\n`);
    }

    //readlineSync.question(`Press Enter to go Next\n`);

    stage++;
  }

}

/////////////////////////////////////////////////////////////////

export function collection(){
  console.log(`\n업적 모음\n`);
  
  let col_1 = false;
  if(how_many_attack>10 || col_1 === true){
    col_1 = true;
    console.log(chalk.green(` 1. 공격은 최고의 방어\n`));
  }
  else{
    console.log(chalk.gray(` 1. ??? ??? ??\n`));
  }

  let col_2 = false;
  if(how_many_attack===0 && how_many_guard !== 0 || col_2 === true){
    col_2 = true;
    console.log(chalk.green(` 2. 평화주의자\n`));
  }
  else{
    console.log(chalk.gray(` 2. ?????\n`));
  }

  let col_3 = false;
  if(how_many_run > 10 || col_2 === true){
    col_3 = true;
    console.log(chalk.green(` 3. 도주의 달인\n`));
  }
  else{
    console.log(chalk.gray(` 3. ??? ??\n`));
  }

  //console.log(chalk.gray(``))
  readlineSync.question(`\n`) ;
  startt();

}
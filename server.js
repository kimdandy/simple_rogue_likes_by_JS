import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import {startGame} from "./game.js";
import {achievements} from "./game.js";


// 로비 화면을 출력하는 함수
function displayLobby() {
    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('Text_Rogue_likes', { //RL- Javascript
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 이름
    console.log(chalk.yellowBright.bold('텍스트-로그라이크 게임에 오신것을 환영합니다!')); //CLI 

    // 설명 텍스트
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
    console.log(chalk.blue('2.') + chalk.white(' 업적 확인하기'));
    console.log(chalk.blue('3.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('1-3 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
    const choice = readlineSync.question('>> ');

    switch (choice) {
        case '1': // game.js로 넘겨서 새로운 게임을 시작
            console.log(chalk.green('게임을 시작합니다.'));
            startGame(100, 20);

            break;
        case '2': 
            achievements();
            break;
        case '3':
            console.log(chalk.red('게임을 종료합니다.'));
            process.exit(0); // 게임 ui 종료
        default: // 유효하지 않은 입력
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}

// 게임 ui 반환 함수
export function startt() {
    console.clear();
    displayLobby();
    handleUserInput();
}

// 게임 ui 실행
startt();

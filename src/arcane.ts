// import { Random, MersenneTwister19937 } from "random-js";

// type champion = "jinx" | "cait";
// type stage = "champ_select" | "how_to_play1" | "how_to_play2" | "game";
// let selected_champion: champion | undefined = undefined;
// let currentStage: stage | undefined = undefined;
// let currentRound = 1;
// let killedEnemies = 0;
// let roundTimerId = -1;

// const engine = MersenneTwister19937.autoSeed();
// const random = new Random(engine);

// //env variables
// let currentOpacity = 1;
// const handleOpacity = (node: any, onComplete: () => void) => {
//   const co = currentOpacity - 0.025;
//   node.style.opacity = currentOpacity = co;
//   currentOpacity = co;

//   if (co > 0) setTimeout(() => handleOpacity(node, onComplete), 75);
//   else {
//     stage_champ_select!.style.display = "none";
//     onComplete();
//   }
// };

// let currentAttackIteration = 1;
// const setBulletMark = (x: number, y: number) => {
//   const img = document.createElement("img");
//   img.style.position = "absolute";
//   img.style.zIndex = "30";
//   img.style.pointerEvents = "none";

//   if (selected_champion == "jinx") {
//     img.src = "/assets/arcane/jinx_mark.webp";
//     img.style.top = `${y - 0}px`;
//     img.style.left = `${x - 15}px`;
//     img.style.width = "60px";
//     img.style.height = "60px";

//     const img2 = document.createElement("img");
//     img2.style.position = "absolute";
//     img2.style.zIndex = "40";
//     img2.src = "/assets/arcane/jinx_mark_2.gif";
//     img2.style.top = `${y - 0}px`;
//     img2.style.left = `${x - 15}px`;
//     img2.style.width = "60px";
//     img2.style.height = "60px";
//     img2.style.pointerEvents = "none";

//     document.body.appendChild(img2);
//     setTimeout(() => {
//       document.body.removeChild(img2);
//     }, 2000);

//     const img3 = document.createElement("img");
//     img3.style.position = "absolute";
//     img3.style.zIndex = "45";
//     img3.src = "/assets/arcane/smoke.png";
//     img3.style.top = `${y - 40}px`;
//     img3.style.left = `${x - 40}px`;
//     img3.style.width = "120px";
//     img3.style.height = "120px";
//     img3.style.pointerEvents = "none";

//     document.body.appendChild(img3);

//     setTimeout(() => {
//       document.body.removeChild(img3);
//     }, 4000);
//   } else if (selected_champion == "cait") {
//     img.src = "/assets/arcane/effect5.gif";
//     img.style.top = `${y - 0}px`;
//     img.style.left = `${x - 15}px`;
//     img.style.width = "70px";
//     img.style.height = "40px";
//   }

//   document.body.appendChild(img);

//   setTimeout(() => {
//     document.body.removeChild(img);
//   }, 3000);
// };

// // let currentRoundCount = 6;
// let currentPreRoundTimerCount = 2;
// const handlePreRoundCounter = (onComplete: () => void) => {
//   const cr = currentPreRoundTimerCount - 1;
//   currentPreRoundTimerCount = cr;
//   if (cr > 0) {
//     stage_game_round_counter!.textContent = `${cr}`;
//     setTimeout(() => handlePreRoundCounter(onComplete), 1000);
//   } else {
//     stage_game_round_counter!.textContent = `START`;
//     setTimeout(onComplete, 1000);
//   }
// };

// let enemyHp: Record<number, number> = {};
// const handleEnemyOnClick = (enemy: any) => {
//   const currentHp = enemyHp[Number(enemy.id)];

//   if (currentHp == 2) {
//     enemy.classList.add("hue-rotate-90");
//     enemyHp[Number(enemy.id)] = 1;
//   } else if (currentHp == 1) {
//     enemy.classList.remove("hue-rotate-90");
//     enemy.classList.add("hue-rotate-180");
//     enemyHp[Number(enemy.id)] = 0;
//   } else {
//     stage_game_enemy_area?.removeChild(enemy);
//     killedEnemies++;
//     handleRoundEnemiesScoreboard();
//     if (spawnedEnemies < roundEnemies) spawn_enemy();
//     else if (killedEnemies == roundEnemies) setNextStage();
//   }
// };

// //------------------------
// //var set up
// const bg_audio = document.getElementById("bg_audio");
// const audio1 = document.getElementById("audio1");
// const audio2 = document.getElementById("audio2");
// (bg_audio as any).volume = 0.3;

// const cait_select = document.getElementById("cait_select");
// const jinx_select = document.getElementById("jinx_select");
// const cursor = document.getElementById("cursor");

// const stage_champ_select = document.getElementById("stage_champ_select");
// const stage_how_to_play = document.getElementById("stage_how_to_play");
// const stage_how_to_play_charinfo = document.getElementById(
//   "stage_how_to_play_charinfo"
// );

// const stage_how_to_play_firstscreen = document.getElementById(
//   "stage_how_to_play_firstscreen"
// );
// const stage_how_to_play_secondscreen = document.getElementById(
//   "stage_how_to_play_secondscreen"
// );
// const stage_how_to_play_infotext = document.getElementById(
//   "stage_how_to_play_infotext"
// );
// const stage_how_to_play_nextbutton = document.getElementById(
//   "stage_how_to_play_nextbutton"
// );

// const stage_game = document.getElementById("stage_game");
// const stage_game_round_counter = document.getElementById(
//   "stage_game_round_counter"
// );
// const stage_game_enemy_area = document.getElementById("stage_game_enemy_area");
// const stage_game_scoreboard_enemy_counter = document.getElementById(
//   "stage_game_scoreboard_enemy_counter"
// );
// const stage_game_scoreboard_round_timer = document.getElementById(
//   "stage_game_scoreboard_round_timer"
// );
// const stage_game_scoreboard_round = document.getElementById(
//   "stage_game_scoreboard_round"
// );
// const stage_game_end = document.getElementById("stage_game_end");
// const stage_game_cleared = document.getElementById("stage_game_cleared");
// //------------------------

// const handleChampSelect = (type: champion) => {
//   const cl = "scale-[120%]";
//   let audioprefix = "";

//   if (type == "jinx") {
//     jinx_select?.classList.add(cl);
//     audioprefix = "jinx";
//     selected_champion = "jinx";
//   } else if (type == "cait") {
//     cait_select?.classList.add(cl);
//     audioprefix = "cait";
//     selected_champion = "cait";
//   }

//   (audio1 as any).src = `/assets/arcane/${audioprefix}_selectogg.jpg`;
//   (audio1 as any).autoplay = true;
//   (audio1 as any).volume = 0.25;

//   (audio2 as any).src = "/assets/arcane/champ_selectogg.jpg";
//   (audio2 as any).autoplay = true;
//   (audio2 as any).volume = 0.25;
// };

// const onChampSelect = (type: champion) => {
//   handleChampSelect(type);
//   handleOpacity(stage_champ_select, () => setHowToPlayStage());
// };
// jinx_select?.addEventListener("click", () => onChampSelect("jinx"));
// cait_select?.addEventListener("click", () => onChampSelect("cait"));

// const setHowToPlayStage = () => {
//   let charbg = "";

//   if (selected_champion == "cait") {
//     charbg = "cait_bg.gif";
//     stage_how_to_play_charinfo!.textContent =
//       "You play as Caitlyn. Best marksman Piltover's ever seen. Born and raised in the Piltover's richest area, Caitlyn is very familiar with inner workings of Piltover. She's seen how corrupt and wrong this whole council system is, turned her back against her home and joined the Zaun forces.";
//   } else if (selected_champion == "jinx") charbg = "jinx_bg.gif";

//   stage_how_to_play!.style.display = "block";
//   (
//     stage_how_to_play_firstscreen!.firstElementChild as any
//   ).src = `assets/arcane/${charbg}`;

//   currentStage = "how_to_play1";
// };

// const setHowToPlayStage_2 = () => {
//   const objectiveText1 =
//     "Your objective is to kill certain number of enforcers before round time limit.";
//   const objectiveText2 =
//     "If the time limit is reached or you took certain amount of damage, the game will end.";
//   const objectiveText3 = "Good Luck!";
//   currentStage = "how_to_play2";
//   stage_how_to_play_firstscreen!.style.display = "none";
//   stage_how_to_play_secondscreen!.style.display = "flex";
//   stage_how_to_play_infotext!.innerHTML = `${objectiveText1}<br/>${objectiveText2}<br/>${objectiveText3}`;
// };

// stage_how_to_play_nextbutton?.addEventListener("click", () => {
//   (audio2 as any).src = "/assets/arcane/champ_selectogg.jpg";
//   (audio2 as any).autoplay = true;
//   (audio2 as any).volume = 0.2;

//   if (currentStage == "how_to_play1") setHowToPlayStage_2();
//   else if (currentStage == "how_to_play2") setGameStage_initial();
// });

// //game logic--------------------------------------------------------
// const getSecureRandomInt = (min: number, max: number) => {
//   return random.integer(min, max);
// };

// const setGameStage_initial = () => {
//   stage_how_to_play!.style.display = "none";
//   currentStage = "game";
//   stage_game!.style.display = "block";
//   document.body.style.cursor = "none";

//   document.body.addEventListener("mousemove", (e) => {
//     cursor!.style.top = `${e.clientY - 22}px`;
//     cursor!.style.left = `${e.clientX - 22}px`;
//   });

//   document.body.addEventListener("click", (e) => {
//     if (currentAttackIteration < 4) currentAttackIteration += 1;
//     else currentAttackIteration = 1;

//     (
//       audio1 as any
//     ).src = `/assets/arcane/${selected_champion}_attack_${currentAttackIteration}wav.jpg`;
//     (audio1 as any).autoplay = true;
//     (audio1 as any).volume = 0.12;

//     setBulletMark(e.clientX - 22, e.clientY - 22);
//   });

//   handlePreRoundCounter(() => {
//     stage_game_round_counter!.style.display = "none";
//     setRound(1);
//   });
// };

// const setNextStage = () => {
//   if (currentRound < 3) {
//     currentRound++;
//     stage_game_cleared!.style.display = "block";
//     stage_game_enemy_area!.style.display = "none";
//     clearTimeout(roundTimerId);

//     setTimeout(
//       () =>
//         handlePreRoundCounter(() => {
//           stage_game_round_counter!.style.display = "none";
//           stage_game_cleared!.style.display = "none";
//           stage_game_enemy_area!.style.display = "block";

//           setRound(currentRound);
//           handleRoundEnemiesScoreboard();
//         }),
//       2000
//     );
//   } else {
//     stage_game!.style.display = "none";
//     stage_game_end!.style.display = "block";
//   }
// };

// const setRound = (round: number) => {
//   killedEnemies = 0;
//   currentRound = round;
//   spawnedEnemies = 0;
//   roundEnemies = 5 * round;

//   if (round < 3) roundTotalSeconds = 40;
//   else roundTotalSeconds = 25;
//   let length = 2;

//   if (round == 3 || 4) length = 3;
//   else length = 4;

//   Array.from({ length }).forEach((_) => spawn_enemy());
//   roundTimerId = setInterval(handleRoundTimerScoreboard, 1000);
// };

// const handleRoundEnemiesScoreboard = () => {
//   stage_game_scoreboard_enemy_counter!.textContent = `[${killedEnemies}/${roundEnemies}]`;
//   stage_game_scoreboard_round!.textContent = `${currentRound}`;
// };

// let roundTotalSeconds = 70;
// const handleRoundTimerScoreboard = () => {
//   stage_game_scoreboard_round_timer!.textContent = `${roundTotalSeconds}`;
//   roundTotalSeconds -= 1;
// };

// let roundEnemies = 0;
// let spawnedEnemies = 0;
// const spawn_enemy = () => {
//   let x = getSecureRandomInt(20, 80);
//   let y = getSecureRandomInt(0, 55);
//   let z = getSecureRandomInt(45, 65);

//   const img = document.createElement("img");
//   img.src = "assets/arcane/enforcer.gif";
//   img.style.left = `${x}vw`;
//   img.style.top = `${y}vh`;
//   img.style.objectFit = "cover";
//   img.style.position = "absolute";
//   img.style.userSelect = "none";
//   img.style.scale = `${z}%`;
//   img.id = `${spawnedEnemies}`;

//   enemyHp[spawnedEnemies] = 2;
//   img.addEventListener("click", () => handleEnemyOnClick(img));
//   stage_game_enemy_area?.appendChild(img);

//   // setAnimation(img);
//   spawnedEnemies++;
//   return img;
// };

// //--------------------------------------------------------

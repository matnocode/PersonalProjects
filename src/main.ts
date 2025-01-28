// import Konva from "konva";

// let IS_TYPING = false;

// const stage = new Konva.Stage({
//   container: "konva-container",
//   width: 1200,
//   height: 650,
// });

// const layer = new Konva.Layer();
// stage.add(layer);

// // Load the player sprite
// const loadPlayer = () => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.src = "./assets/character.png";
//     img.onload = () => {
//       const sprite = new Konva.Image({
//         image: img,
//         x: stage.width() / 8,
//         y: stage.height() / 1.5,
//         width: img.width / 16,
//         height: img.height / 16,
//         offset: { x: img.width / 32, y: img.height / 32 },
//       });
//       resolve(sprite);
//     };
//   });
// };

// // Load the textbox
// // const loadTextBox = () => {
// //   return new Promise((resolve) => {
// //     const img = new Image();
// //     img.src = "./assets/textInput.png";
// //     img.onload = () => {
// //       const sprite = new Konva.Image({
// //         image: img,
// //         x: stage.width() / 2,
// //         y: stage.height() / 1.075,
// //         width: img.width / 1.5,
// //         height: img.height / 3,
// //         offset: { x: img.width / 3, y: img.height / 6 },
// //       });
// //       sprite.on("click", () => {
// //         IS_TYPING = true;
// //         addInput(stage.width() / 1.5, stage.height() / 0.95);
// //       });
// //       resolve(sprite);
// //     };
// //   });
// // };

// // const loadBanner = () => {
// //   const frames = ["./assets/gifs4/gif4_1.png", "./assets/gifs4/gif4_2.png"];
// //   let currentFrame = 0;

// //   return new Promise((resolve) => {
// //     const img = new Image();
// //     img.src = frames[currentFrame];
// //     img.onload = () => {
// //       const sprite = new Konva.Image({
// //         image: img,
// //         x: stage.width() / 2,
// //         y: stage.height() / 1.08,
// //         width: stage.width(),
// //         height: 120,
// //         offset: { x: stage.width() / 2, y: 60 },
// //       });

// //       // Animate by cycling through frames
// //       const animate = () => {
// //         currentFrame = (currentFrame + 1) % frames.length;
// //         img.src = frames[currentFrame];
// //         img.onload = () => {
// //           sprite.image(img);
// //           layer.batchDraw(); // Redraw the layer to reflect the change
// //         };
// //       };

// //       // Set up the animation loop
// //       setInterval(animate, 100); // 10 FPS
// //       resolve(sprite);
// //     };
// //   });
// // };

// // Load the background
// const loadBackground = () => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.src = "./assets/bgbg.jpg";
//     img.onload = () => {
//       const sprite = new Konva.Image({
//         image: img,
//         x: stage.width() / 2,
//         y: stage.height() / 2,
//         width: stage.width(),
//         height: stage.height(),
//         offset: { x: stage.width() / 2, y: stage.height() / 2 },
//       });
//       resolve(sprite);
//     };
//   });
// };

// // Add input box
// // const addInput = (x: any, y: any) => {
// //   const input = document.createElement("input");
// //   input.type = "text";
// //   input.style.position = "absolute";
// //   input.style.left = `${x}px`;
// //   input.style.top = `${y}px`;
// //   input.style.color = "black";
// //   input.style.padding = "3px";
// //   input.style.background = "none";
// //   input.style.border = "0px";
// //   input.style.outline = "none";
// //   input.style.width = "300px";
// //   input.style.fontSize = "20px";
// //   input.style.fontWeight = "700";
// //   input.style.zIndex = "1000";

// //   input.placeholder = "Type here...";

// //   input.onblur = () => {
// //     document.body.removeChild(input);
// //     IS_TYPING = false;
// //   };

// //   document.body.appendChild(input);
// //   input.focus();
// // };

// // Player input management
// const manageInput = (event: any, player: any) => {
//   if (IS_TYPING) return;

//   const moveAmount = 5;
//   if (event.key === "d") player.x(player.x() + moveAmount);
//   if (event.key === "a") player.x(player.x() - moveAmount);
//   if (event.key === "w") player.y(player.y() - moveAmount);
//   if (event.key === "s") player.y(player.y() + moveAmount);
//   layer.batchDraw();
// };

// (async () => {
//   const player = await loadPlayer();
//   // const textbox = await loadTextBox();
//   // const banner = await loadBanner();
//   const background = await loadBackground();

//   layer.add(background as any);
//   // layer.add(banner as any);
//   // layer.add(textbox as any);
//   layer.add(player as any);

//   layer.batchDraw();

//   window.addEventListener("keydown", (event) => manageInput(event, player));
// })();

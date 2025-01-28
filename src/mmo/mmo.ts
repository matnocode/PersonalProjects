import Konva from "konva";
import { CharacterType, KonvaCharacter } from "./character";
import { Vector2d } from "konva/lib/types";

interface LoginResponse {
  Name: string;
  Id: number;
  SessionId: number;
}

interface ResponsePlayer {
  CharacterType: CharacterType;
  PlayerName: string;
  PlayerId: number;
  Position: Vector2d;
}

interface Chat {
  PlayerId: number;
  text: string;
}

interface PollResponse {
  Players: ResponsePlayer[];
  Chat: Chat[];
}

export type GameState = "LoginScreen" | "InGame";

const container_width = window.innerWidth;
const container_height = window.innerHeight;
const server_addr = "http://localhost:8081";
const nameInputId = "name_input";
const inputcontainerId = "input_container";
let SessionId = 0;
let currentGameState: GameState = "LoginScreen";

const stage = new Konva.Stage({
  container: "konva-container",
  width: container_width,
  height: container_height,
});

const bg_layer = new Konva.Layer();
const platforms_layer = new Konva.Layer();
let currentPlayer: KonvaCharacter | undefined;
let sessionPlayers: KonvaCharacter[] = [];

export const characters_layer = new Konva.Layer();
stage.add(bg_layer);
stage.add(platforms_layer);
stage.add(characters_layer);

const firstPlatformStartY = container_height / 1.2;

const onLogin = async () => {
  const name = (document.getElementById(nameInputId) as HTMLInputElement)!
    .value;

  const req_body: any = { name, REQUEST: "LOGIN" };

  const response = await fetchWrapper(req_body);

  console.log("res", response);
  const res_body = (await response.json()) as LoginResponse;
  SessionId = res_body.SessionId;
  const dd = document.getElementById(inputcontainerId);
  document.body.removeChild(dd!);

  loadLevel(1, res_body);
};

const onMove = async (newPos: Vector2d) => {
  const req_body: any = {
    REQUEST: "MOVE",
    NewPos: newPos,
    PlayerId: currentPlayer!.getId(),
    SessionId,
  };

  await fetchWrapper(req_body);
};

const fetchWrapper = async (req_body: any) =>
  await fetch(`${server_addr}`, {
    body: JSON.stringify(req_body),
    method: "POST",
    cache: "no-cache",
    keepalive: true,
    mode: "cors",
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });

const loadLevel = (level: number, props?: any) => {
  if (level == 0) {
    loadBg(0);
    loadInput();
  } else if (level == 1) {
    currentGameState = "InGame";
    loadBg(1);
    loadTiles();
    currentPlayer = loadPlayer(props.Name, props.PlayerId);
  }
};

const loadBg = (level: number) => {
  const background_image = new Image();

  background_image.onload = () => {
    const bg = new Konva.Image({
      x: 0,
      y: 0,
      image: background_image,
      width: container_width,
      height: container_height,
    });

    // add the shape to the layer
    bg_layer.add(bg);
  };

  if (level == 0 || level == 1)
    background_image.src = "/assets/mmo/backgrounds/bg1.jpg";
};

const loadInput = () => {
  const inp = document.createElement("input");
  const container = document.createElement("div");
  container.id = inputcontainerId;

  container.style.position = "absolute";
  container.style.left = "45vw";
  container.style.top = "50vh";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "10px";
  container.style.zIndex = "999999";

  inp.style.width = "200px";
  inp.id = nameInputId;
  inp.style.padding = "10px";
  inp.style.border = "1px solid black";
  inp.style.borderRadius = "15px";
  inp.placeholder = "enter nickname";
  inp.style.color = "black";

  container.appendChild(inp);
  loadEnterButton(container);

  document.body.appendChild(container);
};

const loadEnterButton = (container: HTMLDivElement) => {
  const btn = document.createElement("button");
  btn.style.padding = "10px";
  btn.style.borderRadius = "10px";
  btn.style.backgroundColor = "black";

  btn.onclick = onLogin;

  const text = document.createElement("div");
  text.innerText = "JOIN";

  btn.appendChild(text);

  container.appendChild(btn);
};

const loadTiles = () => {
  const tile_upper_asset = new Image();
  const tile_middle_asset = new Image();

  tile_upper_asset.onload = () => {
    const size_tile_upper = 64;

    Array.from({ length: 30 }).forEach((_, i) => {
      const tile_upper_object = new Konva.Image({
        x: size_tile_upper * i,
        y: firstPlatformStartY,
        image: tile_upper_asset,
        width: size_tile_upper,
        height: size_tile_upper,
      });

      Array.from({ length: 3 }).forEach((_, ii) => {
        const tile_middle_object = new Konva.Image({
          x: size_tile_upper * i,
          y: firstPlatformStartY + (size_tile_upper + size_tile_upper * ii),
          image: tile_middle_asset,
          width: size_tile_upper,
          height: size_tile_upper,
        });
        platforms_layer.add(tile_middle_object);
      });

      platforms_layer.add(tile_upper_object);
    });
  };

  tile_upper_asset.src = "/assets/mmo/platforms/tile103.png";
  tile_middle_asset.src = "/assets/mmo/platforms/tile121.png";
};

const loadPlayer = (name: string, id: number) => {
  const animations = {
    idle: [5, 4, 55, 70],
    run: [
      5, 4, 55, 70, 77, 5, 55, 69, 151, 4, 53, 70, 221, 4, 55, 70, 8, 85, 60,
      70, 77, 85, 65, 70, 155, 85, 60, 70, 231, 85, 53, 70,
    ],
  };

  const player = new KonvaCharacter({
    characterType: "Slug",
    id: id,
    imageSrc: "/assets/mmo/character1/char1_spritesheet.png",
    name: name,
    type: "Sprite",
    spriteConfig: {
      animations: animations,
      animation: "run",
      image: undefined as any,
      frameRate: 10,
      frameIndex: 0,
      x: 800,
      y: firstPlatformStartY - 70,
      scaleX: -1,
    },
  });

  player.setPosition({ x: 800, y: firstPlatformStartY - 70 });

  return player;
};

loadLevel(0);

const manageInput = (event: any) => {
  if (!currentPlayer) return;

  const moveAmount = 5;
  const currentPos = currentPlayer.getPosition();
  const scaleX = currentPlayer.getScaleX();

  let newPos: Vector2d = currentPos;

  if (event.key === "d") {
    newPos = {
      y: currentPos.y,
      x: currentPos.x + moveAmount,
    };
    if (scaleX > 0) currentPlayer.setScaleX(-1);
  }
  if (event.key === "a") {
    newPos = {
      y: currentPos.y,
      x: currentPos.x - moveAmount,
    };

    if (scaleX < 0) currentPlayer.setScaleX(1);
  }

  onMove(newPos);
};

const pollUpdates = async () => {
  if (currentGameState == "LoginScreen") return;

  const req_body: any = { REQUEST: "POLL" };

  const response = await fetchWrapper(req_body);
  const res_body = (await response.json()) as PollResponse;

  res_body.Players.forEach((n) => {
    if (currentPlayer && currentPlayer.getId() == n.PlayerId) {
      currentPlayer.setPosition(n.Position);
    }

    let player = sessionPlayers.find((c) => c.getId() == n.PlayerId);
    if (!player) {
      player = loadPlayer(n.PlayerName, n.PlayerId);
    }
    player.setPosition(n.Position);
  });
};

const ev = new EventSource(`${server_addr}/subscribe`);
ev.onmessage = (v) => console.log("pp", v);

window.addEventListener("keydown", (event) => manageInput(event));

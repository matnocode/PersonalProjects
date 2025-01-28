import Konva from "konva";
import { ImageConfig } from "konva/lib/shapes/Image";
import { Sprite, SpriteConfig } from "konva/lib/shapes/Sprite";
import { characters_layer } from "./mmo";
import { Text } from "konva/lib/shapes/Text";
import { Rect } from "konva/lib/shapes/Rect";
import { Vector2d } from "konva/lib/types";

type AssetType = "Image" | "Sprite";
export type CharacterType = "Slug";

interface KonvaCharacterInterface {
  getId: () => number;
  getName: () => string;
  getType: () => string;
  setName: (v: string) => string;
  setPosition: (pos: Vector2d) => void;
  getPosition: () => Vector2d;
  setScaleX: (scaleX: number) => void;
  getScaleX: () => number;
}

interface KonvaCharacterConfig {
  id: number;
  name: string;
  imageSrc: string;
  type: AssetType;
  spriteConfig?: SpriteConfig;
  imageConfig?: ImageConfig;
  characterType: CharacterType;
}

export class KonvaCharacter implements KonvaCharacterInterface {
  private character_name = "Not Specified";
  private id = 0;
  private character = undefined as Sprite | Konva.Image | undefined;
  private characterType: CharacterType = "Slug";

  private character_text_object = undefined as Text | undefined;
  private character_text_box_object = undefined as Rect | undefined;

  private setNameBoxPos = () => {
    if (
      !this.character_text_object ||
      !this.character_text_box_object ||
      !this.character
    )
      return;

    this.character_text_object.setPosition({
      x: this.character.x() - (this.character.scaleX() < 0 ? 40 : 0),
      y: this.character.y() - 20,
    });

    this.character_text_box_object.setPosition({
      x: this.character_text_object.x() - 5,
      y: this.character_text_object.y() - 2.5,
    });

    characters_layer.batchDraw();
  };

  public getName = () => this.character_name;
  public getType = () => this.characterType;
  public setName = (v: string) => (this.character_name = v);
  public getPosition = () => this.character!.position();
  public setPosition = (pos: Vector2d) => {
    const currentPos = this.getPosition();
    const dir = currentPos.x - pos.x;

    if (dir > 0) this.setScaleX(-1);
    else this.setScaleX(1);

    this.character?.setPosition(pos);
    this.setNameBoxPos();
  };
  public setScaleX = (scaleX: number) => {
    this.character?.scaleX(scaleX);
    this.setNameBoxPos();
  };
  public getScaleX = () => this.character!.scaleX();
  public getId = () => this!.id;

  constructor(config: KonvaCharacterConfig) {
    this.character_name = config.name;
    this.id = config.id;
    this.characterType = config.characterType;

    const character_asset = new Image();
    character_asset.src = config.imageSrc;

    if (config.type == "Sprite" && config.spriteConfig) {
      this.character = new Konva.Sprite({
        ...config.spriteConfig,
        image: character_asset,
      });
      this.character.start();
    } else
      this.character = new Konva.Image({
        ...config.imageConfig,
        image: character_asset,
      });

    this.character_text_object = new Konva.Text({
      text: this.character_name,
      fill: "white",
      fontSize: 16,
    });

    this.character_text_box_object = new Konva.Rect({
      fill: "rgba(0, 0, 0, 0.5)",
      width: this.character_text_object.width() + 10,
      height: this.character_text_object.height() + 5,
    });

    characters_layer.add(this.character);
    characters_layer.add(this.character_text_box_object);
    characters_layer.add(this.character_text_object);

    this.setNameBoxPos();
  }
}

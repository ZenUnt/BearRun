enchant();

window.onload = function () {

  let game = new Core(640, 320);
  game.preload('chara1.png');
  game.preload('map2.png');
  game.rootScene.backgroundColor = 'gray';
  game.keybind(32, 'sp'); // スペースキーをspとして登録

  game.onload = function () {
    // 物理エンジン使用宣言
    let world = new PhysicsWorld(0, 9.8);
    game.rootScene.onenterframe = function () {
      world.step(game.fps);
    }

    // 床オブジェクト
    let Floor = Class.create(PhyBoxSprite, {
      initialize: function (x, y) {
        PhyBoxSprite.call(this, 16, 16, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false); // PhyBoxSprite(幅, 高さ, 動作モード, 密度, 摩擦力, 反発力, フラグ)
        this.image = game.assets['map2.png'];
        this.frame = 0;
        this.x = x;
        this.y = y;
        game.rootScene.addChild(this);
        
        this.on('enterframe', () => {
          this.x -= 5;

          if (this.x < 0) {
            this.x = 1280
          }
        });
      }
    });

    let floors = [];
    for (let i = 0; i < 20; ++i) {
      floors[i] = new Floor(i * 16, 200);
    }
    for (let i = 20; i < 24; ++i) {
      floors[i] = new Floor(i * 16 + 80, 200);
    }
    for (let i = 24; i < 28; ++i) {
      floors[i] = new Floor(i * 16 + 160, 200);
    }
    for (let i = 28; i < 32; ++i) {
      floors[i] = new Floor(i * 16 + 200, 200);
    }
    for (let i = 32; i < 38; ++i) {
      floors[i] = new Floor(i * 16 + 280, 240);
    }
    for (let i = 38; i < 44; ++i) {
      floors[i] = new Floor(i * 16 + 360, 240);
    }
    for (let i = 44; i < 48; ++i) {
      floors[i] = new Floor(i * 16 + 460, 240);
    }

    // くまオブジェクト
    let bear = new PhyBoxSprite(32, 32, enchant.box2d.DYNAMIC_SPRITE, 5.0, 0.5, 0, true);
    bear.image = game.assets['chara1.png'];
    bear.x = 30;
    bear.y = 160;
    bear.frame = 4;

    bear.on('enterframe', () => {
      labelTime.text = parseInt(labelTime.text) + 5;
      bear.x = 80;
      bear.angle = 0; // くまが回転しないように固定
      bear.onFloor = false;

      for (let i = 0; i < floors.length; ++i) {
        if (bear.within(floors[i], 25)) {
          bear.onFloor = true;
          break;
        }
      }
      // スペースキーでジャンプ
      if (game.input.sp && bear.onFloor) {
        bear.applyImpulse(new b2Vec2(0, -15));
      }

      // クリックでジャンプ
      game.rootScene.on('touchstart', function () {
        bear.applyImpulse(new b2Vec2(0, -0.2));
      });

      if (bear.y > 360) {
        game.pushScene(gameOverScene);
        game.stop();
      }

      // 敵との当たり判定(within)
      if (bear.intersect(floors[5])) {
        labelHit.text = "Hit!";
        game.pushScene(gameOverScene);
        game.stop();
      } else {
        labelHit.text = "remote";
      }
    });

    // ゲームオーバーシーン
    let gameOverScene = new Scene();
    gameOverScene.backgroundColor = 'black';

    // ゲームオーバーテキスト
    // let labelGameover = new Label();
    // labelGameover.x = 300;
    // labelGameover.y = 200;
    // labelGameover.font = "24px Arial"
    // labelGameover.text = "Game Over!¥nPush Space key!";
    // game.gameOverScene.addChild(labelGameover);

    // 経過時間を表示するラベル
    let labelTime = new Label();
    labelTime.x = 250;
    labelTime.y = 5;
    labelTime.color = 'green';
    labelTime.font = '14px Arial';
    labelTime.text = '0';
    labelTime.on('enterframe', () => {
      //labelTime.text = (game.frame / game.fps).toFixed(2);
    });

    // 当たり判定を表示するラベル
    let labelHit = new Label();
    labelHit.x = 250;
    labelHit.y = 250;
    labelHit.color = 'red';
    labelHit.font = '14px Arial';
    labelHit.text = 'hit';

    game.rootScene.addChild(bear);
    game.rootScene.addChild(labelTime);
    game.rootScene.addChild(labelHit);
  }
  game.start();
};

// 0~nまでのランダムな整数を生成
function rand(n) {
  return Math.floor(Math.random() * (n + 1));
}
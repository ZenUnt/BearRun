enchant();

window.onload = function () {

  let game = new Core(320, 320);
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

        PhyBoxSprite.call(this, 16, 16, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
        this.image = game.assets['map2.png'];
        this.frame = 0;
        this.x = x;
        this.y = y;
        game.rootScene.addChild(this);
      }
    });

    let floors = [];
    for (let i = 0; i < 20; ++i) {
      floors[i] = new Floor(i * 16, 200);
    }

    // くまオブジェクト
    let bear = new PhyBoxSprite(32, 32, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.3, true);
    bear.image = game.assets['chara1.png'];
    bear.x = 10;
    bear.y = 160;
    bear.frame = 4;

    bear.on('enterframe', () => {
      bear.x += 5;
      // 入力に応じた移動
      if (game.input.sp) {
        bear.applyImpulse(new b2Vec2(0, -1));
      }

      // スマホ用のタッチ操作
      game.rootScene.on('touchstart', function () {
        bear.applyImpulse(new b2Vec2(0, -1));
      });

      if (bear.x > 320) {
        bear.x = 0;
      }

      // 敵との当たり判定(within)
      // if (this.within(enemy, 20)) {
      //   labelHit.text = "Hit!";
      //   game.pushScene(gameOverScene);
      //   game.stop();
      // } else {
      //   labelHit.text = "remote";
      // }
    });

    // ゲームオーバーシーン
    let gameOverScene = new Scene();
    gameOverScene.backgroundColor = 'black';

    // 経過時間を表示するラベル
    let labelTime = new Label();
    labelTime.x = 250;
    labelTime.y = 5;
    labelTime.color = 'green';
    labelTime.font = '14px Arial';
    labelTime.text = 'remote';
    labelTime.on('enterframe', () => {
      labelTime.text = (game.frame / game.fps).toFixed(2);
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
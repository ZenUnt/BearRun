enchant();

window.onload = function () {

  let game = new Core(640, 320);
  game.preload('chara1.png');
  game.preload('map2.png');
  game.preload('avatarBg2.png');
  game.rootScene.backgroundColor = 'gray';
  game.keybind(32, 'sp'); // スペースキーをspとして登録
  game.fps = 30;

  game.onload = function () {
    // 物理エンジン使用宣言
    let world = new PhysicsWorld(0, 9.8);
    game.rootScene.onenterframe = function () {
      world.step(game.fps);
    }

    // ボムオブジェクト
    let Bomb = Class.create(Sprite, {
      initialize: function (x, y) {
        Sprite.call(this, 16, 16);
        this.image = game.assets['map2.png'];
        this.frame = 11;
        this.x = x;
        this.y = y;
        game.rootScene.addChild(this);
        
        this.on('enterframe', () => {
          this.x -= 5;

          if (this.x < -50) {
            this.x = 1280;
          }
        });
      }
    });

    // 天井オブジェクト
    let Roof = Class.create(PhyBoxSprite, {
      initialize: function(x, y) {
        PhyBoxSprite.call(this, 16, 16, enchant.box2d.STATIC_SPRITE, 0, 1.0, 0, false);
        this.image = game.assets['map2.png'];
        this.frame = 0;
        this.x = x;
        this.y = y;
        game.rootScene.addChild(this);
      }
    });

    // くまオブジェクト
    let bear = new PhyBoxSprite(32, 32, enchant.box2d.DYNAMIC_SPRITE, 5.0, 0.5, 0, true); // PhyBoxSprite(幅, 高さ, 動作モード, 密度, 摩擦力, 反発力, フラグ)
    bear.image = game.assets['chara1.png'];
    bear.x = 30;
    bear.y = 160;
    bear.frame = 15;
    
    bear.on('enterframe', () => {
      labelTime.text = parseInt(labelTime.text) + 5;
      bear.x = 80;
      bear.angle = 0; // くまが回転しないように固定
      bear.frame = bear.age % 3 + 15;

      // ボムと衝突でゲームオーバー
      for (let i = 0; i < bombs.length; ++i) {
        if (bear.within(bombs[i], 30)) {
          game.pushScene(gameOverScene);
          game.stop();
          }
      }
      // スペースキーでジャンプ
      if (game.input.sp) {
        bear.applyImpulse(new b2Vec2(0, -15));
      }
      
      // クリックでジャンプ
      game.rootScene.on('touchstart', function () {
        bear.applyImpulse(new b2Vec2(0, -1));
      });
      
      if (bear.y > 360) {
        game.pushScene(gameOverScene);
        game.stop();
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
    
    // 背景
    let back1 = new Sprite(320, 50);
    back1.image = game.assets['avatarBg2.png'];
    back1.x = 880;
    back1.y = 135;
    back1.scaleX = 32 / 5;
    back1.scaleY = 32 / 5;
    back1.frame = 3;
    back1.on('enterframe', () => {
      back1.x -= 5;
      if (back1.x < -800) {
        back1.x = 2400;
      }
    });
    let back2 = new Sprite(320, 50);
    back2.image = game.assets['avatarBg2.png'];
    back2.x = 2400;
    back2.y = 135;
    back2.scaleX = 32 / 5;
    back2.scaleY = 32 / 5;
    back2.frame = 3;
    back2.on('enterframe', () => {
      back2.x -= 5;
      if (back2.x < -800) {
        back2.x = 2400;
      }
    });
    
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
    
    game.rootScene.addChild(back1);
    game.rootScene.addChild(back2);
    game.rootScene.addChild(bear);
    game.rootScene.addChild(labelTime);
    game.rootScene.addChild(labelHit);
    let bombs = [];
    for (let i = 0; i < 20; ++i) {
      bombs[i] = new Bomb(rand(1280) + 250, rand(320));
    }
    // 天井
    let roofs = [];
    for (let i = 0; i < 10; ++i) {
      roofs[i] = new Roof(i * 16, -16);
    }

  }
  game.start();
};

// 0~nまでのランダムな整数を生成
function rand(n) {
  return Math.floor(Math.random() * (n + 1));
}
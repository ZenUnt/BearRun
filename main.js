enchant();

window.onload = function() {

  let core = new Core(320, 320);
  core.preload('chara1.png');
  core.fps = 15;
  core.rootScene.backgroundColor = 'gray';
  core.keybind(32, 'sp'); // スペースキーをspとして登録

  core.onload = function() {

    // くまオブジェクト
    let bear = new Sprite(32,32);
    bear.image = core.assets['chara1.png'];
    bear.x = 10;
    bear.y = 150;
    bear.frame = 4;

    bear.on('enterframe', () => {
      bear.x += 5;
      // 入力に応じた移動
      if (core.input.sp) {
        bear.y -= 5;
      }

      // スマホ用のタッチ操作
      core.rootScene.on('touchstart', function() {
        bear.y -= 1;
      });

      if (bear.x > 320) {
        bear.x = 0;
      }
      if (bear.y < 0) {
        bear.y = 320;
      }

      // 敵との当たり判定(within)
      // if (this.within(enemy, 20)) {
      //   labelHit.text = "Hit!";
      //   core.pushScene(gameOverScene);
      //   core.stop();
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
      labelTime.text = (core.frame / core.fps).toFixed(2) ;
    });

    // 当たり判定を表示するラベル
    let labelHit = new Label();
    labelHit.x = 250;
    labelHit.y = 250;
    labelHit.color = 'red';
    labelHit.font = '14px Arial';
    labelHit.text = 'hit';

    core.rootScene.addChild(bear);
    core.rootScene.addChild(labelTime);
    core.rootScene.addChild(labelHit);
  }
  core.start();
};

// 0~nまでのランダムな整数を生成
function rand(n) {
  return Math.floor(Math.random() * (n + 1));
}
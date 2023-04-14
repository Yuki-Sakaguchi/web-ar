# スマホのマルチタップ

* SPでのマルチタップでの拡大、縮小、移動  
* シングルタップだと移動のみ  
* PCはマルチタップ できないのでシングルタップのみ（拡大と縮小は左下のUIから）
* URLに `?mode=test` をつけると操作のヘルパーUIが表示されます


## 実装メモ
* 結局ライブラリ入れられなかったので自作しました。
* 三角関数とかベクトルとかいろいろ調べて頑張った。
* ソースが超汚いのでリファクタリングは必須。

## 参考URL
* pixi.jsのマルチタップ
  * https://techlog.wgc-cosmo.com/multi-touch-position/
* pixi.jsで線を引く
  * https://qiita.com/PianoScoreJP/items/4f4456fc75198c2ca6bb
* pixi.jsで図形（円を書く）
  * https://pixijs.io/examples/#/graphics/simple.js
* 角度から座標を求める
  * https://shanabrian.com/web/javascript/convert-position-from-radius-radian.php
* ２点の座標の距離を求める
  * https://lab.syncer.jp/Web/JavaScript/Snippet/34/
* ２点の座標の角度を求める
  * https://lab.syncer.jp/Web/JavaScript/Snippet/37/
* ラジアンを度に変換
  * https://lab.syncer.jp/Web/JavaScript/Snippet/52/
* 度をラジアンに変換
  * https://lab.syncer.jp/Web/JavaScript/Snippet/51/
* getUserMedia のカメラ切り替え
  * https://blog.katsubemakito.net/html5/camera-toggle
  * https://www.digitalocean.com/community/tutorials/front-and-rear-camera-access-with-javascripts-getusermedia-ja

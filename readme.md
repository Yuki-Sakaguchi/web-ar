# WebAR
![image-tracking](https://user-images.githubusercontent.com/16290220/99190334-568d7700-27a9-11eb-8c30-eef8e6933bef.gif)

# DEMO
- [green box](https://yuki-sakaguchi.github.io/web-ar/public/random_object/index.html)
  - ただの箱
- [surper mario hatena box](https://yuki-sakaguchi.github.io/web-ar/public/super_mario/index.html)
  - マリオの音楽再生とはてなボックス
- [multi object map](https://yuki-sakaguchi.github.io/web-ar/public/multi_object_map/index.html)
  - オブジェクトを生成してその位置のマップを表示
- [object shooter](https://yuki-sakaguchi.github.io/web-ar/public/shooter/index.html)
  - オブジェクトをシューティング
- [picture](https://yuki-sakaguchi.github.io/web-ar/public/picture/index.html)
  - カメラで写真を撮る
- [character-picture](https://yuki-sakaguchi.github.io/web-ar/public/character-picture/image.html)
  - キャラクターと一緒に写真を撮る
- [image-tracking](https://yuki-sakaguchi.github.io/web-ar/public/image-tracking/image.html)
  - AR.jsのイメージトラッキング
    - [NFT Marker Creator（画像の登録）](https://carnaux.github.io/NFT-Marker-Creator/)
    - [AR.js](https://github.com/AR-js-org/AR.js)
- [image-tracking-redirect](https://yuki-sakaguchi.github.io/web-ar/public/image-tracking-redirect/image.html)
  - AR.jsのイメージトラッキングで画像を認識したらリダイレクトさせる
  - [画像トラッキングのイベント](https://ar-js-org.github.io/AR.js-Docs/ui-events/#custom-events)はここを参考にした
- [color-dropper](https://yuki-sakaguchi.github.io/web-ar/public/color-dropper/index.html)
  - カメラで色を取得する

# 開発
```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

```
http-server -S -C cert.pem
```
 

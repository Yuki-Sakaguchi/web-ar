# WebAR

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

# 開発
```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

```
http-server -S -C cert.pem
```
 
# WebAR
色々な WebAR を実験しています。  

基本的にはスマホ前提となります。  
中には今は動かないものもあるかもしれません。  

## [green box](https://yuki-sakaguchi.github.io/web-ar/public/random_object/index.html)
緑の箱が回ってるだけ
  
## [super mario hatena box](https://yuki-sakaguchi.github.io/web-ar/public/super_mario/index.html)
<details>
  <summary>🎥 動画を見る</summary>
  <div>
    <video src="https://user-images.githubusercontent.com/16290220/232305597-576c54ca-e5fa-481e-8840-7344015838e9.mov" />
  </div>
</details>

※ 音が結構うるさいので注意です  
マリオの音楽再生とはてなボックス

## [multi object map](https://yuki-sakaguchi.github.io/web-ar/public/multi_object_map/index.html)
<details>
  <summary>🎥 動画を見る</summary>
  <div>
    <video src="https://user-images.githubusercontent.com/16290220/232305609-6af6a2a1-0976-44d5-b44d-ac33cf603261.mov" />
  </div>
</details>

オブジェクトを生成してその位置のマップを表示する  

## [object shooter](https://yuki-sakaguchi.github.io/web-ar/public/shooter/index.html)
<details>
  <summary>🎥 動画を見る</summary>
  <div>
    <video src="https://user-images.githubusercontent.com/16290220/232305618-f99d8094-c0af-4c97-99c2-9530a840cae6.mov" />
  </div>
</details>

体の周りを回るオブジェクトをタップで撃ち落とす  


## [picture](https://yuki-sakaguchi.github.io/web-ar/public/picture/index.html)
カメラで写真を撮る

## [character-picture](https://yuki-sakaguchi.github.io/web-ar/public/character-picture/image.html)
<details>
  <summary>🎥 動画を見る</summary>
  <div>
    <p>写真を撮った時に音が出ます（結構うるさいので注意です）</p>
    <video src="https://user-images.githubusercontent.com/16290220/232305633-33f1b019-62cf-4e57-921f-64f8abb6988d.mov" />
  </div>
</details>

※ 音が結構うるさいので注意です  
キャラクターと一緒に写真を撮る

## [image-tracking](https://yuki-sakaguchi.github.io/web-ar/public/image-tracking/image.html)
<details>
  <summary>🎥 動画を見る</summary>
  <div>
    <img src="https://user-images.githubusercontent.com/16290220/99190334-568d7700-27a9-11eb-8c30-eef8e6933bef.gif" />
  </div>
</details>

※ AR.jsが使っていた Heroku の CORS 対策サイトが動かなくなった影響で動かなくなってます。
AR.jsのイメージトラッキング
- [NFT Marker Creator（画像の登録）](https://carnaux.github.io/NFT-Marker-Creator/)
- [AR.js](https://github.com/AR-js-org/AR.js)

## [image-tracking-redirect](https://yuki-sakaguchi.github.io/web-ar/public/image-tracking-redirect/image.html)
※ AR.jsが使っていた Heroku の CORS 対策サイトが動かなくなった影響で動かなくなってます。

AR.jsのイメージトラッキングで画像を認識したらリダイレクトさせる
[画像トラッキングのイベント](https://ar-js-org.github.io/AR.js-Docs/ui-events/#custom-events)はここを参考にした

## [image-tracking-movie](https://yuki-sakaguchi.github.io/web-ar/public/image-tracking-movie/image.html)
※ AR.jsが使っていた Heroku の CORS 対策サイトが動かなくなった影響で動かなくなってます。

AR.jsのイメージトラッキングで画像を認識したら動画を表示させる
Youtubeは指定できないみたいなので、動画をmp4とかにしてサーバーにおく必要がある

## [color-dropper](https://yuki-sakaguchi.github.io/web-ar/public/color-dropper/index.html)
<details>
  <summary>🎥 動画を見る</summary>
  <div>
    <video src="https://user-images.githubusercontent.com/16290220/232305666-f65c6b55-473d-49a4-923e-10721e1ffdb8.mov" />
  </div>
</details>

カメラで色を取得する  
カメラの真ん中にある１ドットの色を取って画面に表示しています。  
カラーコードや色味の評価をテキストで出しています（色味の評価はライティングとかで結構ブレるので見直しが必要）

## [multi-tap](https://yuki-sakaguchi.github.io/web-ar/public/multi-tap/index.html?mode=test)
<details>
  <summary>🎥 動画を見る</summary>
  <div>
    <video src="https://user-images.githubusercontent.com/16290220/232305722-a26dcfee-857b-48d7-be0b-782494269045.mov" />
  </div>
</details>

スマホでシングルタップだとオブジェクトを移動させる。  
マルチタップだと縮小、拡大、回転、移動ができるUI  
URLに `mode=test` があればヘルパーが表示されます

# 開発メモ
```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

```
http-server -S -C cert.pem
```
 

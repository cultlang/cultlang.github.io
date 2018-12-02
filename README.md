# cultlang.github.io
Cultlang website


## Dev
Dev on the /dev branch. MAster  is for the real deploy
```
yarn install
```

## Using the blog
* Use the script it generates an index please
```
npm run new -- "Blog Title In Quotes Please"
```

## Deployment
* Clone the master branch seperately
* Build for dev
```
npm run build
npm run export
```
* Copy the contents out `/out` to the master branch.
* Commit to master
module.exports = {
   "env": {
       "commonjs": true,
       "es2021": true,
       "node": true
   },
   "extends": "eslint:recommended",
   "overrides": [
       {
          "env": {
              "node": true
          },
          "files": [
              ".eslinttrc.{js,cjs}"
          ],
          "parserOptions": {
              "sourceType": "script"
          }
       }
   ],
   "parserOptions": {
       "sourceType": "module",
       "ecmaVersion": "latest"
   },
   "rules": {
   }
}
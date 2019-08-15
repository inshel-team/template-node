# InShel template: node

## Start

You must have an invite to start.  

*It's important to be open to new ideas. We're always interested in collaboration and developement.  
Contact us if you need InShel Platform for your purposes or have any other questions.
[contact@inshel.com](mailto:contact@inshel.com)*

```bash
git clone git@github.com:inshel-team/template-node.git
cd template-node
npm i
npm run pre-dev {invite}
rm -rf ./.git
npm i
```

## Development

### Lambda

Add new file in directory src/contract  
Subdirectorys name is lambdas prefix (model.method)

### Tests

Add tests in directory ./tests/jest/contract

## Scripts

- build  
Build target directory

- test  
Start tests

- pre-dev  
Create environment

- new-contract  
Create new contract

- key:info  
Get key info

- invite  
Create new invite

- lint:fix  
Fix code style
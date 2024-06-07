# BirthGet API

### Run tests with docker

```
docker build -t "testbuild" . && docker run -e POSTGRES_USER=test -e POSTGRES_DB=birthgetTest -e POSTGRES_PASSWORD=testing --name database -d postgres:15.4-alpine3.18 && docker run --name=test --link=database:database --env-file .env.test testbuild npm run builded-test-mocha; docker rm test; docker rm -f database;
```

### How to start
1. At the root project directory, run `docker-compose up -d` to start up the rabbitmq contrainer.
2. open new terminal, `cd sender && npm start` start sender webserver
3. open new terminal, `cd receiver && npm start` start receiver webserver
4. open new terminal, `cd receiver2 && npm start` start second receiver webserver
5. go to http://localhost:15672 which is the rabbitmq admin console. To create a queue named `user-messages`
6. go to http://localhost:3000/api (sender webserver swagger page)

### APIS
1. [POST] /produce send the message with EventPattern.
2. [POST] /sum to sum any number and get the result with MessagePattern.
# docker-node-rabbitmq

[![Join the chat at https://gitter.im/imrefazekas/docker-node-rabbitmq](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/imrefazekas/docker-node-rabbitmq?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
A docker image to be used as microservice in a cluster

This docker image encloses a node 0.12.3 and a rabbitmq 3.5.2 running as service to serve as a microservice solution in a clustered enterprise application.

The Node is running a simple demo app using connect v3.

Rabbitmq is configured via its config/rabbitmq.config file declaring "newadmin" as an administrator to it.

The image exposes ports 15672 and 8080.

[Docker hub](https://registry.hub.docker.com/u/imrefazekas/docker-node-rabbitmq/)

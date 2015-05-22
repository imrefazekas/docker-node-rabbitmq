# Use phusion/baseimage as base image. To make your builds
# reproducible, make sure you lock down to a specific version, not
# to `latest`! See
# https://github.com/phusion/baseimage-docker/blob/master/Changelog.md
# for a list of version numbers.
FROM ubuntu:14.04

RUN rm /bin/sh && ln -s /bin/bash /bin/sh


ADD rabbitmq-signing-key-public.asc /tmp/rabbitmq-signing-key-public.asc
RUN apt-key add /tmp/rabbitmq-signing-key-public.asc
RUN apt-get -qq update > /dev/null
RUN apt-get install build-essential libssl-dev curl git -y
RUN apt-get install --no-install-recommends -y -q curl python build-essential git ca-certificates




# Add files.
ADD bin/rabbitmq-start /usr/local/bin/

# RabbitMQ install
RUN apt-get install rabbitmq-server -y

ADD config/rabbitmq.config /etc/rabbitmq/
RUN chmod +x /usr/local/bin/rabbitmq-start

RUN rabbitmq-plugins enable rabbitmq_management rabbitmq_management_agent

RUN mkdir /data
RUN mkdir /data/rabbit
RUN mkdir /data/node


# Define mount points.
VOLUME ["/data/rabbit/log", "/data/rabbit/mnesia"]


# Define environment variables.
ENV RABBITMQ_HOME /data/rabbit
ENV RABBITMQ_LOG_BASE $RABBITMQ_HOME/log
ENV RABBITMQ_MNESIA_BASE $RABBITMQ_HOME/mnesia

ENV NODE_HOME /data/node
ENV NODE_APP_HOME /data/node/app
ENV NVM_DIR $NODE_HOME/.nvm


# NodeJS install
WORKDIR $NODE_HOME
RUN mkdir /nodejs && curl http://nodejs.org/dist/v0.12.3/node-v0.12.3-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1

ENV PATH $PATH:/nodejs/bin

RUN node --version
RUN npm --version

RUN npm install -g pm2

WORKDIR $NODE_APP_HOME
ADD app /data/node/app
ADD bin/server-start ./
RUN chmod 755 server-start
RUN npm install



EXPOSE 8080
EXPOSE 15672


# Define default command.
CMD ./server-start

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

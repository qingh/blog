#!/bin/bash

Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White
NC='\033[0m'              # Text Reset

function cloneRepository {
  #获取远程仓库代码
  git init -b main
  git remote add origin git@github.com:qingh/blog.git
  git pull origin main
  git branch --set-upstream-to=origin/main

  cd server
  yarn
  cd ../admin
  yarn
  cd ../client
  yarn
  cd ..
}


if [ -d "./.git" ];then
  echo -e "${Yellow}ready to update...${NC}"
  git pull
else
  echo -e "${Yellow}ready to clone...${NC}"
  cloneRepository
fi

echo -e "${Yellow}project has been updated${NC}"

read -p "Run the project now? [y/n]:" input
case ${input} in
  [yY])
    read -p "Which environment do you want to run ? [dev/prd]:" env
    
    scripts='dev'
    envmsg='development'
    if [ $env = 'prd' ];then
      scripts='deploy'
      envmsg='production'
      pm2 stop blog client > /dev/null 2>&1
      pm2 delete blog client > /dev/null 2>&1
    fi

    echo $scripts
    echo -e "${Yellow}The ${envmsg} environment begins to deploy${NC}"

    cd server
    pwd
    nohup npm run ${scripts} &
    cd ../admin
    pwd
    nohup npm run ${scripts} &
    cd ../client
    pwd
    nohup npm run ${scripts} &
    cd ..
    ;;
  [nN])
    ;;
  *)
    echo "Just enter y or n"
    ;;
esac
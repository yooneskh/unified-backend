deno compile --target x86_64-unknown-linux-gnu --unstable-kv --unstable-ffi -A ./bootstrap.ts && \
  scp ./bootstrap $zxc:/home/yooneskh/project-backend/bootstrap-tmp && \
  ssh $zxc pm2 stop project-backend && \
  ssh $zxc mv /home/yooneskh/project-backend/bootstrap-tmp /home/yooneskh/project-backend/bootstrap && \
  ssh $zxc pm2 restart project-backend && \
  rm -f ./bootstrap
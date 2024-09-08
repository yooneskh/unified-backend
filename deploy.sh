rsync -rh --info=progress2 --delete --exclude .git --exclude db.kv --exclude db.kv-shm --exclude db.kv-wal ./ $zxc:/home/yooneskh/project/backend && \
  ssh $zxc pm2 restart project-backend
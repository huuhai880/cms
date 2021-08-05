# docker build . -t scc_portal:latest && 
# docker rm --force scc_portal && 
# docker run -p 4000:9000 --name scc_portal  -d  scc_portal

git config --global user.email "binhhv@blackwind.vn"
git config --global user.name "binhhv"

npm install 
npm run build:204

tar -cf build.tar.gz build
rm -f /home/scc/portal/build.tar.gz
cp -f build.tar.gz /home/scc/portal

cd /home/scc/portal
git pull origin dev_build_portal
git add -A
git commit -m "build"
git push origin dev_build_portal
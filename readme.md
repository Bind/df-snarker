## to install df-snarker on a fresh ubuntu 20.04 server target:

Create a group called docker

`sudo groupadd docker`

Add the first login user to the docker group

``sudo usermod -aG docker `id -un -- 1000`  ``

REBOOT to apply the group changes (don't skip this!)

Download the docker installer

`curl -fsSL https://get.docker.com -o get-docker.sh`

install docker

`sudo sh get-docker.sh`

Install the first set of dependencies

`sudo apt install -y git curl gcc g++ make build-essential`

Add the repository for node

`curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -`

Install more dependencies

`sudo apt install -y nodejs`

Install yarn with npm

`sudo npm install --global yarn`

Clone the df-snarker repository

`git clone https://github.com/Bind/df-snarker`

Enter the df-snarker repo

`cd df-snarker`

install with npm

`npm install`

build

`npm run build`

start the snarker

`yarn run start`



## to start an existing installtion:

`cd df-snarker`

`yarn run start`

/move accepts the arguments snarkHelper.getMoveArgs

POST
```json
{
    "x1":"26202",
    "y1":"40576",
    "x2":"26274",
    "y2":"40450",
    "r":"129351",
    "distMax":"146"
}
```

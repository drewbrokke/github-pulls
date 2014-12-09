##Github Pulls - Linux Instructions

###To Install:
```
curl --remote-name https://raw.githubusercontent.com/drewbrokke/github-pulls/test-branch/build/linux/install
less install
sudo bash install 2>&1 | tee ~/github-pulls.log
```

###Running:
After executing the install script, you can run from the command line with `github-pulls`.
You can also double-click the icon found in `/usr/share/applications`.

###To Uninstall
- Execute the included *uninstall.sh* script with: `sudo ./uninstall.sh`
